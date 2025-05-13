from app.infrastructure.database.base import Base
from app.infrastructure.database.sqlalchemy_provider import DatabaseSingleton
from app.infrastructure.orm_models.usuario_orm import UsuarioORM
from app.infrastructure.orm_models.empresa_orm import EmpresaORM
from app.infrastructure.orm_models.administrador_orm import AdministradorORM
from app.infrastructure.orm_models.rol_orm import RolORM
from app.infrastructure.orm_models.egresado_orm import EgresadoORM
from app.infrastructure.orm_models.postulacion_orm import PostulacionORM
from app.infrastructure.orm_models.oferta_orm import OfertaORM
from app.infrastructure.orm_models.contrato_orm import ContratoORM

def init_db():
    """📌 Crea las tablas en la base de datos si no existen."""
    print("📌 Inicializando la base de datos...")
    engine = DatabaseSingleton.get_engine()
    Base.metadata.create_all(bind=engine)
    print("✅ ¡Base de datos creada exitosamente!")

if __name__ == "__main__":
    init_db()
