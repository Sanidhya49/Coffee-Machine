import random
from sqlalchemy.orm import Session
from models import CoffeeMachine
from database import SessionLocal, engine, Base

BRANDS = ["DeLonghi", "Nespresso", "Breville", "Keurig", "Philips", "Jura", "Smeg", "Gaggia"]
TYPES = ["Pour Over", "Espresso", "Drip", "Pod", "French Press", "AeroPress"]
COLORS = ["Black", "Silver", "Red", "White", "Cream", "Stainless Steel", "Matte Black"]
STATUSES = ["New", "Pending Level 2", "Approved", "Rejected"]

def generate_mock_data():
    machines = []
    
    # Using Unsplash source with coffee keywords to get realistic coffee machine/coffee images
    # We add a random index to the URL so that the image is slightly different or at least browser cache is busted.
    base_image_url = "https://images.unsplash.com/photo-1498622205843-cb206085a5bc?w=500&q=80"
    
    # a list of specific good coffee related images from unsplash
    images = [
        "https://images.unsplash.com/photo-1517701198463-6c8cae554dcb?w=500&q=80",
        "https://images.unsplash.com/photo-1606756623661-36aa52292f70?w=500&q=80",
        "https://images.unsplash.com/photo-1587080413959-06b859fb107d?w=500&q=80",
        "https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=500&q=80",
        "https://images.unsplash.com/photo-1498622205843-cb206085a5bc?w=500&q=80",
        "https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=500&q=80",
        "https://images.unsplash.com/photo-1515286588517-57788448ce79?w=500&q=80",
        "https://images.unsplash.com/photo-1508215885820-4585e5610d28?w=500&q=80"
    ]

    for i in range(1, 31):
        brand = random.choice(BRANDS)
        machine_type = random.choice(TYPES)
        # Weight statuses so there are more New and Pending
        status = random.choices(STATUSES, weights=[40, 30, 20, 10])[0]
        
        machine = CoffeeMachine(
            machine_name=f"{brand} {machine_type} Pro {random.randint(100, 999)}",
            brand_name=brand,
            machine_type=machine_type,
            price=round(random.uniform(99.99, 1499.99), 2),
            color=random.choice(COLORS),
            description=f"A fantastic {machine_type.lower()} machine from {brand}. Perfect for home or office use. Features advanced temperature control and a sleek {random.choice(COLORS).lower()} finish.",
            image_url=random.choice(images),
            status=status
        )
        machines.append(machine)
    return machines

def seed_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Check if we already have data
    existing = db.query(CoffeeMachine).first()
    if not existing:
        print("Seeding database with 30 mock coffee machines...")
        mock_machines = generate_mock_data()
        db.add_all(mock_machines)
        db.commit()
        print("Seeding complete!")
    else:
        print("Database already contains records. Skipping seed.")
        
    db.close()

if __name__ == "__main__":
    seed_db()
