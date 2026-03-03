from fastapi import APIRouter, HTTPException
from app.models.user_model import UserSignup, UserLogin, UserResponse
from app.database import users_collection
import hashlib
import uuid
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["Authentication"])


def hash_password(password: str) -> str:
    """Hash password using SHA-256 with a salt."""
    salt = uuid.uuid4().hex
    hashed = hashlib.sha256((salt + password).encode()).hexdigest()
    return f"{salt}${hashed}"


def verify_password(stored_password: str, provided_password: str) -> bool:
    """Verify a password against its hash."""
    salt, hashed = stored_password.split("$")
    return hashlib.sha256((salt + provided_password).encode()).hexdigest() == hashed


@router.post("/signup")
async def signup(user: UserSignup):
    """Register a new user."""
    # Check if user already exists
    existing_user = users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash the password
    hashed_password = hash_password(user.password)

    # Create user document
    user_doc = {
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
        "created_at": datetime.utcnow().isoformat(),
    }

    # Insert into MongoDB
    result = users_collection.insert_one(user_doc)

    return {
        "message": "User registered successfully",
        "user": {
            "id": str(result.inserted_id),
            "name": user.name,
            "email": user.email,
        },
    }


@router.post("/login")
async def login(user: UserLogin):
    """Login an existing user."""
    # Find user by email
    db_user = users_collection.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Verify password
    if not verify_password(db_user["password"], user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "message": "Login successful",
        "user": {
            "id": str(db_user["_id"]),
            "name": db_user["name"],
            "email": db_user["email"],
        },
    }
