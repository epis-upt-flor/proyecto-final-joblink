import pytest
from app.infrastructure.orm_models.empresa_orm import EmpresaORM
from app.infrastructure.orm_models.usuario_orm import UsuarioORM
from app.infrastructure.orm_models.rol_orm import RolORM
from app.infrastructure.repositories.empresa_repository_sql import EmpresaRepositorySQL
import datetime


@pytest.fixture
def mock_empresa_orm(db_session):
    # Crear rol de empresa
    rol = RolORM(nombre="empresa")
    db_session.add(rol)
    db_session.flush()

    # Crear empresa directamente (ya hereda de UsuarioORM)
    empresa = EmpresaORM(
        username="empresauser",
        password="hashed_password",
        email="empresa@example.com",
        tipo="empresa",
        idRol=rol.id,
        nombre="Empresa X",
        ruc="10404040401",
        telefono="123456789",
        logo="https://logo.com/logo.png",
        estado=True
    )
    db_session.add(empresa)
    db_session.commit()
    return empresa

def test_obtener_todas(db_session, mock_empresa_orm):
    repo = EmpresaRepositorySQL(db_session)
    empresas = repo.obtener_todas()
    assert len(empresas) == 1
    assert empresas[0].nombre == "Empresa X"


def test_obtener_por_id(db_session, mock_empresa_orm):
    repo = EmpresaRepositorySQL(db_session)
    empresa = repo.obtener_por_id(mock_empresa_orm.id)
    assert empresa is not None
    assert empresa.nombre == "Empresa X"


def test_obtener_por_id_no_existente(db_session):
    repo = EmpresaRepositorySQL(db_session)
    empresa = repo.obtener_por_id(id=999)
    assert empresa is None
