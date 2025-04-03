from app.models import *
from app.models.database import Base, DatabaseSingleton

def init_db():
    """📌 Crea las tablas en la base de datos si no existen."""
    print("📌 Inicializando la base de datos...")

    engine = DatabaseSingleton.get_engine()
    Base.metadata.create_all(bind=engine)

    print("✅ ¡Base de datos creada exitosamente!")

if __name__ == "__main__":
    init_db()
