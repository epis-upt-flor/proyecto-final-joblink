from infrastructure.database.singleton import DatabaseSingleton

def get_db():
    SessionLocal = DatabaseSingleton.get_sessionmaker()
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
