from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
import models
import seed
from database import SessionLocal, engine, Base

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Caffeineer API")

# Setup CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development
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

@app.get("/machines", response_model=List[CoffeeMachineOut])
def get_machines(db: Session = Depends(get_db)):
    """Get all coffee machines"""
    return db.query(models.CoffeeMachine).all()

@app.get("/machines/{machine_id}", response_model=CoffeeMachineOut)
def get_machine(machine_id: int, db: Session = Depends(get_db)):
    """Get a specific coffee machine by ID"""
    machine = db.query(models.CoffeeMachine).filter(models.CoffeeMachine.id == machine_id).first()
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")
    return machine

@app.post("/machines", response_model=CoffeeMachineOut)
def create_machine(machine: CoffeeMachineCreate, db: Session = Depends(get_db)):
    """Create a new coffee machine"""
    db_machine = models.CoffeeMachine(**machine.dict())
    db.add(db_machine)
    db.commit()
    db.refresh(db_machine)
    return db_machine

@app.put("/machines/{machine_id}", response_model=CoffeeMachineOut)
def update_machine(machine_id: int, machine_update: CoffeeMachineUpdate, db: Session = Depends(get_db)):
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
def delete_machine(machine_id: int, db: Session = Depends(get_db)):
    """Delete a coffee machine"""
    db_machine = db.query(models.CoffeeMachine).filter(models.CoffeeMachine.id == machine_id).first()
    if not db_machine:
        raise HTTPException(status_code=404, detail="Machine not found")
    
    db.delete(db_machine)
    db.commit()
    return {"message": "Machine deleted successfully"}
