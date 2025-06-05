import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, clear_mappers
from app.infrastructure.database.base import Base
from app.infrastructure.orm_models.usuario_orm import UsuarioORM
from app.infrastructure.orm_models.rol_orm import RolORM
from app.infrastructure.repositories.usuario_repository_sql import UsuarioRepositorySQL
from app.domain.models.usuario import Usuario as UsuarioDomain


@pytest.fixture(scope="module")
def session():
    engine = create_engine("sqlite:///:memory:", echo=False)
    TestingSessionLocal = sessionmaker(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    yield db
    db.close()
    clear_mappers()


@pytest.fixture
def repo(session):
    return UsuarioRepositorySQL(session)


def test_guardar_usuario(repo, session):
    nuevo_usuario = UsuarioORM(username="usuario1", email="u1@correo.com", password="123", idRol=1)
    resultado = repo.guardar(nuevo_usuario)
    assert resultado.username == "usuario1"
    assert resultado.email == "u1@correo.com"
    assert resultado.idRol == 1


def test_obtener_por_username(repo, session):
    usuario = repo.obtener_por_username("usuario1")
    assert usuario is not None
    assert usuario.username == "usuario1"


def test_obtener_por_email(repo, session):
    usuario = repo.obtener_por_email("u1@correo.com")
    assert usuario is not None
    assert usuario.email == "u1@correo.com"


def test_obtener_por_id(repo, session):
    usuario = repo.obtener_por_username("usuario1")
    resultado = repo.obtener_por_id(usuario.id)
    assert resultado is not None
    assert resultado.username == "usuario1"


def test_actualizar_usuario(repo, session):
    usuario = repo.obtener_por_username("usuario1")
    usuario_actualizado = UsuarioDomain(
        id=usuario.id,
        username="nuevo_user",
        email="nuevo@correo.com",
        password="nuevo_pass",
        idRol=1
    )
    actualizado = repo.actualizar(usuario_actualizado)
    assert actualizado.username == "nuevo_user"
    assert actualizado.email == "nuevo@correo.com"


def test_obtener_nombre_rol_por_id(repo, session):
    session.add(RolORM(id=1, nombre="ADMIN"))
    session.commit()
    nombre_rol = repo.obtener_nombre_rol_por_id(1)
    assert nombre_rol == "ADMIN"
