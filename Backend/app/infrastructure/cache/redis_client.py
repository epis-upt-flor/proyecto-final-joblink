import redis
from app.config.config import REDIS_URL
from app.domain.interfaces.external.cache import ICache


class RedisClient(ICache):
    _client = None

    @classmethod
    def get_connection(cls):
        if cls._client is None:
            cls._client = redis.from_url(REDIS_URL, decode_responses=True)
        return cls._client

    def set(self, key: str, value: str, ex: int):
        self.get_connection().set(key, value, ex)

    def get(self, key: str) -> str | None:
        return self.get_connection().get(key)

    def delete(self, key: str):
        self.get_connection().delete(key)
