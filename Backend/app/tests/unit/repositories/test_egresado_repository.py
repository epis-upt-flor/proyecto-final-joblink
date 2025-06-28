import pytest
from datetime import date
from app.domain.models.egresado import Egresado
from app.infrastructure.repositories.egresado_repository_sql import EgresadoRepositorySQL
from app.tests.unit.repositories.helpers import poblar_datos


def crear_egresado():
    return Egresado(
        id=None,
        nombres="Luis",
        apellidos="Ramirez",
        tipoDoc="DNI",
        numDoc="12345678",
        email="luis@example.com",
        telefono="999999999",
        direccion="Av. Siempre Viva 123",
        nacionalidad="Peruana",
        fechaNacimiento=date(1995, 5, 20),
        habilidades=["Python", "SQL"],
        logrosAcademicos=["1er puesto 2020"],
        certificados=["Certificado de Scrum"],
        experienciaLaboral=["Desarrollador en Tech S.A.", "Analista Junior"],
        idiomas=["Español", "Inglés"],
        linkedin="https://linkedin.com/luis",
        github="https://github.com/luis",
        cv="https://cv.com/luis.pdf",
        disponibilidad=True
    )


def test_registrar_egresado(db_session):
    repo = EgresadoRepositorySQL(db_session)
    egresado = crear_egresado()
    resultado = repo.registrar_egresado(egresado)
    assert resultado.id is not None
    assert resultado.email == "luis@example.com"


def test_obtener_egresados(db_session):
    repo = EgresadoRepositorySQL(db_session)
    egresado = crear_egresado()
    repo.registrar_egresado(egresado)
    resultados = repo.obtener_egresados()
    assert isinstance(resultados, list)
    assert len(resultados) > 0


def test_obtener_egresado_por_id(db_session):
    repo = EgresadoRepositorySQL(db_session)
    egresado = crear_egresado()
    creado = repo.registrar_egresado(egresado)
    encontrado = repo.obtener_egresado_por_id(creado.id)
    assert encontrado is not None
    assert encontrado.id == creado.id


def test_obtener_nombres_por_ids(db_session):
    repo = EgresadoRepositorySQL(db_session)
    egresado = crear_egresado()
    creado = repo.registrar_egresado(egresado)
    resultados = repo.obtener_nombres_por_ids([creado.id])
    assert isinstance(resultados, list)
    assert resultados[0]["nombres"] == "Luis"


def test_actualizar_egresado(db_session):
    repo = EgresadoRepositorySQL(db_session)
    egresado = crear_egresado()
    creado = repo.registrar_egresado(egresado)
    creado.telefono = "987654321"
    actualizado = repo.actualizar_egresado(creado)
    assert actualizado.telefono == "987654321"


def test_eliminar_egresado(db_session):
    repo = EgresadoRepositorySQL(db_session)
    egresado = crear_egresado()
    creado = repo.registrar_egresado(egresado)
    eliminado = repo.eliminar_egresado(creado.id)
    assert eliminado is True
    assert repo.obtener_egresado_por_id(creado.id) is None


def test_existe_por_email(db_session):
    repo = EgresadoRepositorySQL(db_session)
    egresado = crear_egresado()
    repo.registrar_egresado(egresado)
    assert repo.existe_por_email("luis@example.com") is True
    assert repo.existe_por_email("otro@example.com") is False


def test_existe_por_num_doc(db_session):
    repo = EgresadoRepositorySQL(db_session)
    egresado = crear_egresado()
    repo.registrar_egresado(egresado)
    assert repo.existe_por_num_doc("12345678") is True
    assert repo.existe_por_num_doc("00000000") is False
