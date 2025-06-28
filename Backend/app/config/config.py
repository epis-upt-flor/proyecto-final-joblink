from dotenv import load_dotenv
import os

os.environ.pop("DATABASE_URL", None)
os.environ.pop("UPSTASH_REDIS_URL", None)
os.environ.pop("REDIS_URL", None)
os.environ.pop("UPSTASH_URL", None)
os.environ.pop("UPSTASH_TOKEN", None)

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
REDIS_URL = os.getenv("UPSTASH_REDIS_URL")
SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

UPSTASH_VECTOR_URL = os.getenv("UPSTASH_VECTOR_REST_URL")
UPSTASH_VECTOR_TOKEN = os.getenv("UPSTASH_VECTOR_REST_TOKEN")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL no está configurada.")

if not REDIS_URL:
    raise ValueError("UPSTASH_REDIS_URL no está configurada.")

if not UPSTASH_VECTOR_URL or not UPSTASH_VECTOR_TOKEN:
    raise ValueError("UPSTASH_VECTOR_REST_URL o TOKEN no están configuradas.")
