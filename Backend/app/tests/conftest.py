import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.infrastructure.schemas.auth_schema import EmpresaCreate
from app.infrastructure.database.base import Base
from app.infrastructure.orm_models import *

@pytest.fixture(scope="function")
def db_session():
    engine = create_engine("sqlite:///:memory:")
    TestingSessionLocal = sessionmaker(bind=engine)

    Base.metadata.create_all(bind=engine)

    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

# Mock solo para la prueba unitaria del servicio
@pytest.fixture
def mock_empresa_create():
    return EmpresaCreate(
        username="empresa123",
        nombre="Empresa Prueba",
        ruc="10404040401",
        telefono="123456789",
        logo="https://ejemplo.com/logo.png",
        email="admin@example.com",
        password="admin123",
        idRol=2
    )
