from Backend.app.models import contrato, oferta
from app.models.database import Base, engine
from app.models import egresado, empresa, usuario, administrador, postulacion

def init_db():
    """📌 Crea las tablas en la base de datos si no existen."""
    print("📌 Inicializando la base de datos...")
    Base.metadata.create_all(bind=engine)
    print("✅ ¡Base de datos creada exitosamente!")

if __name__ == "__main__":
    init_db()
