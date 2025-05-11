import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("⚠️ ERROR: La variable DATABASE_URL no está configurada.")


class DatabaseSingleton:
    _engine = None
    _SessionLocal = None

    @classmethod
    def get_engine(cls):
        if cls._engine is None:
            cls._engine = create_engine(DATABASE_URL)
        return cls._engine

    @classmethod
    def get_sessionmaker(cls):
        if cls._SessionLocal is None:
            cls._SessionLocal = sessionmaker(
                autocommit=False,
                autoflush=False,
                bind=cls.get_engine()
            )
        return cls._SessionLocal

Base = declarative_base()