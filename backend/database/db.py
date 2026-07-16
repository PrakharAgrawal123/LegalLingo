from pymongo import MongoClient, ASCENDING
from config.config import Config

# Initialize PyMongo Client
client = MongoClient(Config.MONGO_URI, tlsAllowInvalidCertificates=True)
db = client.get_default_database()

# Collections
users_collection = db["users"]
analyses_collection = db["analyses"]

def init_db():
    try:
        # Create a unique index on user emails to guarantee database-level uniqueness
        users_collection.create_index([("email", ASCENDING)], unique=True)
        print("[Database] MongoDB client initialized. Unique index created on 'email'.")
    except Exception as e:
        print(f"[Database] Error creating database indexes: {e}")
