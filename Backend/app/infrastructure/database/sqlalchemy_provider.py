from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.engine import Engine
from app.config.config import DATABASE_URL


class DatabaseSingleton:
    _engine = None
    _SessionLocal = None

    @classmethod
    def get_engine(cls) -> Engine:
        if cls._engine is None:
            cls._engine = create_engine(
                DATABASE_URL,
                pool_pre_ping=True,
                pool_size=5,
                max_overflow=10,
                future=True
            )
        return cls._engine

    @classmethod
    def get_sessionmaker(cls) -> sessionmaker:
        if cls._SessionLocal is None:
            cls._SessionLocal = sessionmaker(
                autocommit=False,
                autoflush=False,
                bind=cls.get_engine()
            )
        return cls._SessionLocal
