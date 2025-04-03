import redis
import os
from dotenv import load_dotenv

load_dotenv()

UPSTASH_URL = os.getenv("UPSTASH_REDIS_URL", "rediss://default:your-password@charmed-bird-56476.upstash.io:6379")

redis_conn = redis.from_url(UPSTASH_URL, decode_responses=True)
