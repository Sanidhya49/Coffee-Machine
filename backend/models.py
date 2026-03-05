from sqlalchemy import Column, Integer, String, Float, Text
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=True) # Nullable for existing seeded users
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False)

class CoffeeMachine(Base):
    __tablename__ = "coffee_machines"

    id = Column(Integer, primary_key=True, index=True)
    machine_name = Column(String, index=True)
    brand_name = Column(String, index=True)
    machine_type = Column(String)
    price = Column(Float)
    color = Column(String)
    description = Column(Text)
    image_url = Column(String)
    status = Column(String, default="New")
