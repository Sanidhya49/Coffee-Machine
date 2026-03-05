import sqlite3
import os

db_url = os.getenv("DATABASE_URL")
if not db_url or db_url.startswith("sqlite"):
    print("Migrating Local SQLite DB...")
    try:
        conn = sqlite3.connect("coffee_machines.db")
        cursor = conn.cursor()
        cursor.execute("ALTER TABLE users ADD COLUMN email VARCHAR;")
        conn.commit()
        conn.close()
        print("Migration complete!")
    except Exception as e:
        print("Migration error:", e)
else:
    print("Using PostgreSQL... Running manual migration.")
    import psycopg2
    try:
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()
        cursor.execute("ALTER TABLE users ADD COLUMN email VARCHAR;")
        cursor.execute("CREATE UNIQUE INDEX ix_users_email ON users (email);")
        conn.commit()
        conn.close()
        print("Postgres Migration complete!")
    except Exception as e:
        print("Postgres Migration error:", e)
