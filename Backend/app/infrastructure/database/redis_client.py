import redis
import os
from dotenv import load_dotenv

load_dotenv()

UPSTASH_URL = os.getenv("UPSTASH_REDIS_URL")

redis_conn = redis.from_url(UPSTASH_URL, decode_responses=True)
