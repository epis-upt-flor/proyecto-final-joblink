import redis
import os
from dotenv import load_dotenv

load_dotenv()

class RedisClient:
    _client = None

    @classmethod
    def get_connection(cls):
        if cls._client is None:
            url = os.getenv("UPSTASH_REDIS_URL")
            if not url:
                raise ValueError("⚠️ ERROR: UPSTASH_REDIS_URL no está configurada.")
            cls._client = redis.from_url(url, decode_responses=True)
        return cls._client
