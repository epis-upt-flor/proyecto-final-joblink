from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
REDIS_URL = os.getenv("UPSTASH_REDIS_URL")
SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL no está configurada.")

if not REDIS_URL:
    raise ValueError("UPSTASH_REDIS_URL no está configurada.")
