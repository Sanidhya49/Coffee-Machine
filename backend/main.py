import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
import models
import seed
import auth
from database import SessionLocal, engine, Base

import dotenv
dotenv.load_dotenv()

try:
    from google import genai
    gemini_client = genai.Client()
except Exception as e:
    gemini_client = None
    print(f"Warning: Gemini Client could not be initialized. API Key missing? Error: {e}")

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Caffeineer API")

# Setup CORS for the React frontend or production
origins_env = os.getenv("ALLOWED_ORIGINS", "*")
origins = origins_env.split(",") if origins_env != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic schemas for requests/responses
class CoffeeMachineBase(BaseModel):
    machine_name: str
    brand_name: str
    machine_type: str
    price: float
    color: str
    description: str
    image_url: str
    status: str = "New"

class CoffeeMachineCreate(CoffeeMachineBase):
    pass

class CoffeeMachineUpdate(BaseModel):
    status: str
    # Other fields can be optional, but for now we mainly update status from UI
    machine_name: str | None = None
    brand_name: str | None = None
    machine_type: str | None = None
    price: float | None = None
    color: str | None = None
    description: str | None = None
    image_url: str | None = None

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    role: str

class MachineDetails(BaseModel):
    machine_name: str
    brand_name: str
    machine_type: str
    price: str

class CoffeeMachineOut(CoffeeMachineBase):
    id: int

    class Config:
        orm_mode = True

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Startup event to seed DB
@app.on_event("startup")
def on_startup():
    seed.seed_db()

@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(
        data={"sub": user.username, "role": user.role}
    )
    return {"access_token": access_token, "token_type": "bearer", "role": user.role, "username": user.username}

@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    # Check if username or email exists
    db_user = db.query(models.User).filter(
        (models.User.username == user.username) | 
        (models.User.email == user.email)
    ).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")
    
    # Hash password and create user
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"message": "User registered successfully"}

@app.get("/machines", response_model=List[CoffeeMachineOut])
def get_machines(db: Session = Depends(get_db)):
    """Get all coffee machines"""
    return db.query(models.CoffeeMachine).all()

@app.post("/generate-description")
def generate_description(details: MachineDetails, db: Session = Depends(get_db)):
    """Generate an AI description using Gemini"""
    if not gemini_client:
        raise HTTPException(status_code=500, detail="Gemini client is not configured on the server.")
        
    prompt = (
        f"Write a short, engaging, and professional product description (max 3 sentences) for a coffee machine. "
        f"Details: Name is '{details.machine_name}', Brand is '{details.brand_name}', "
        f"Type is {details.machine_type}, and the price is ₹{details.price} (Rupees). Do not use markdown."
    )
    
    try:
        response = gemini_client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        return {"description": response.text.strip()}
    except Exception as e:
        print(f"Gemini API Error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate description: {str(e)}")

@app.get("/machines/{machine_id}", response_model=CoffeeMachineOut)
def get_machine(machine_id: int, db: Session = Depends(get_db)):
    """Get a specific coffee machine by ID"""
    machine = db.query(models.CoffeeMachine).filter(models.CoffeeMachine.id == machine_id).first()
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")
    return machine

@app.post("/machines", response_model=CoffeeMachineOut)
def create_machine(machine: CoffeeMachineCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    """Create a new coffee machine"""
    db_machine = models.CoffeeMachine(**machine.dict())
    db.add(db_machine)
    db.commit()
    db.refresh(db_machine)
    return db_machine

@app.put("/machines/{machine_id}", response_model=CoffeeMachineOut)
def update_machine(machine_id: int, machine_update: CoffeeMachineUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    """Update a coffee machine, specifically for status updates handled by reviewers"""
    db_machine = db.query(models.CoffeeMachine).filter(models.CoffeeMachine.id == machine_id).first()
    if not db_machine:
        raise HTTPException(status_code=404, detail="Machine not found")
    
    old_status = db_machine.status
    update_data = machine_update.dict(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(db_machine, key, value)
    
    db.commit()
    db.refresh(db_machine)
    
    # Mock sending email notification
    if old_status != db_machine.status and db_machine.status in ["Pending Level 2", "Approved"]:
        print("\n" + "="*50)
        print(f"📧 MOCK EMAIL NOTIFICATION")
        print(f"To: reviewers@antigravity.com")
        print(f"Subject: Status Update for {db_machine.machine_name}")
        print(f"The status for Machine ID {db_machine.id} has been updated to: {db_machine.status}.")
        print("="*50 + "\n")
        
    return db_machine

@app.delete("/machines/{machine_id}")
def delete_machine(machine_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    """Delete a coffee machine"""
    db_machine = db.query(models.CoffeeMachine).filter(models.CoffeeMachine.id == machine_id).first()
    if not db_machine:
        raise HTTPException(status_code=404, detail="Machine not found")
    
    db.delete(db_machine)
    db.commit()
    return {"message": "Machine deleted successfully"}
