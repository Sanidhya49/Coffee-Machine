from sqlalchemy import Column, Integer, String, Float, Text
from database import Base

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
