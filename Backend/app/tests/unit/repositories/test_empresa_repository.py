import pytest
from app.domain.models.empresa import Empresa
from app.infrastructure.repositories.empresa_repository_sql import EmpresaRepositorySQL
from app.tests.unit.repositories.helpers import poblar_datos


def test_obtener_todas(db_session):
    poblar_datos(db_session)
    repo = EmpresaRepositorySQL(db_session)
    empresas = repo.obtener_todas()
    assert isinstance(empresas, list)
    assert len(empresas) > 0
    assert empresas[0].nombre == "Empresa Prueba"


def test_obtener_por_id(db_session):
    poblar_datos(db_session)
    repo = EmpresaRepositorySQL(db_session)
    empresa = repo.obtener_por_id(1)
    assert empresa is not None
    assert empresa.id == 1
    assert empresa.nombre == "Empresa Prueba"


def test_editar_empresa(db_session):
    poblar_datos(db_session)
    repo = EmpresaRepositorySQL(db_session)
    empresa = repo.obtener_por_id(1)

    empresa.nombre = "Empresa Editada"
    empresa.ruc = "11111111111"
    empresa.telefono = "123456789"
    empresa.logo = "nuevo_logo.png"
    empresa.estado = True

    actualizada = repo.editar(empresa)
    assert actualizada is not None
    assert actualizada.nombre == "Empresa Editada"
    assert actualizada.ruc == "11111111111"
    assert actualizada.logo == "nuevo_logo.png"


def test_editar_empresa_ruc_duplicado(db_session):
    poblar_datos(db_session)

    # Segunda empresa con mismo RUC para forzar conflicto
    from app.infrastructure.orm_models.empresa_orm import EmpresaORM
    empresa2 = EmpresaORM(
        id=2,
        nombre="Empresa 2",
        ruc="88888888888",
        telefono="888888888",
        email="otra@example.com",
        username="otra123",
        password="pass",
        logo="logo2.png",
        idRol=2,
        estado=True
    )
    db_session.add(empresa2)
    db_session.commit()

    repo = EmpresaRepositorySQL(db_session)
    empresa = repo.obtener_por_id(1)
    empresa.ruc = "88888888888"  # Mismo que empresa2

    with pytest.raises(ValueError, match="ya está registrado"):
        repo.editar(empresa)


def test_obtener_nombres_por_ids(db_session):
    poblar_datos(db_session)
    repo = EmpresaRepositorySQL(db_session)
    nombres = repo.obtener_nombres_por_ids([1])
    assert isinstance(nombres, list)
    assert nombres[0]["nombre"] == "Empresa Prueba"
