from upstash_vector import Index
from app.config.config import UPSTASH_VECTOR_URL, UPSTASH_VECTOR_TOKEN


class VectorDBProvider:
    _vector_db = None

    @classmethod
    def get_index(cls) -> Index:
        if cls._vector_db is None:
            if not UPSTASH_VECTOR_URL or not UPSTASH_VECTOR_TOKEN:
                raise ValueError(
                    "Faltan UPSTASH_VECTOR_URL o TOKEN desde config.py")

            print("🌐 Vector URL:", UPSTASH_VECTOR_URL)
            print("🔑 Vector Token:", UPSTASH_VECTOR_TOKEN[:6], "...")

            cls._vector_db = Index(
                url=UPSTASH_VECTOR_URL,
                token=UPSTASH_VECTOR_TOKEN
            )

        return cls._vector_db
