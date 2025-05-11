from app.infrastructure.database.singleton import DatabaseSingleton

class DBSessionProvider:
    def __init__(self):
        self._SessionLocal = DatabaseSingleton.get_sessionmaker()

    def get_session(self):
        """Obtiene una sesión nueva (no generador)."""
        return self._SessionLocal()

    def get_db(self):
        """Generador compatible con dependencias de FastAPI (yield)."""
        db = self._SessionLocal()
        try:
            yield db
        finally:
            db.close()
