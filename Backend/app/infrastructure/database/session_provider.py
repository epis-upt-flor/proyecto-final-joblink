from infrastructure.database.singleton import DatabaseSingleton


class DBSessionProvider:
    def __init__(self):
        self._SessionLocal = DatabaseSingleton.get_sessionmaker()

    def get_session(self):
        return self._SessionLocal()
