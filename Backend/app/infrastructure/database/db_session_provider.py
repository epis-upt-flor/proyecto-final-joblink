from typing import Generator
from app.infrastructure.database.sqlalchemy_provider import DatabaseSingleton
from sqlalchemy.orm import Session

class DBSessionProvider:
    def __init__(self):
        self._SessionLocal = DatabaseSingleton.get_sessionmaker()

    def get_session(self)-> Session:
        """Obtiene una sesión nueva (no generador)."""
        return self._SessionLocal()

    def get_db(self) -> Generator[Session, None, None]:
        """Generador compatible con dependencias de FastAPI (yield)."""
        db = self._SessionLocal()
        try:
            yield db
        finally:
            db.close()
