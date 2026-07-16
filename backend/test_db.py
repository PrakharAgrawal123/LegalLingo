import os
import sys
from pymongo import MongoClient
from dotenv import load_dotenv

# Load env file
load_dotenv()

mongo_uri = os.getenv("MONGO_URI")
print(f"Testing MongoDB connection using URI: {mongo_uri[:35]}...")

try:
    # 5-second timeout for quick testing
    client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000, tlsAllowInvalidCertificates=True)
    # Trigger a connection check
    db_names = client.list_database_names()
    print("✅ Success! Connected to MongoDB Atlas. Database list:")
    print(db_names)
except Exception as e:
    print("❌ Connection Failed!")
    print(f"Error Details: {e}")
    sys.exit(1)
