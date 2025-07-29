import pytest
from datetime import date
from app.domain.models.contrato import Contrato
from app.domain.models.enum import EstadoContrato
from app.infrastructure.repositories.contrato_repository_sql import ContratoRepositorySQL
from app.tests.unit.repositories.helpers import poblar_datos


def test_registrar_contrato(db_session):
    poblar_datos(db_session)
    repo = ContratoRepositorySQL(db_session)
    contrato = Contrato(
        id=None,
        idOfertaEgresado=1,
        fechaFin=date.today(),
        estado=EstadoContrato.VIGENTE
    )
    resultado = repo.registrar_contrato(contrato)
    assert resultado.id is not None
    assert resultado.estado == EstadoContrato.VIGENTE


def test_obtener_contrato_por_id(db_session):
    poblar_datos(db_session)
    repo = ContratoRepositorySQL(db_session)
    contrato = Contrato(id=None, idOfertaEgresado=1, fechaFin=date.today(), estado=EstadoContrato.VIGENTE)
    creado = repo.registrar_contrato(contrato)
    encontrado = repo.obtener_contrato_por_id(creado.id)
    assert encontrado is not None
    assert encontrado.id == creado.id


def test_actualizar_contrato(db_session):
    poblar_datos(db_session)
    repo = ContratoRepositorySQL(db_session)
    contrato = Contrato(id=None, idOfertaEgresado=1, fechaFin=date.today(), estado=EstadoContrato.VIGENTE)
    creado = repo.registrar_contrato(contrato)
    creado.estado = EstadoContrato.TERMINADO
    actualizado = repo.actualizar_contrato(creado)
    assert actualizado.estado == EstadoContrato.TERMINADO


def test_eliminar_contrato(db_session):
    poblar_datos(db_session)
    repo = ContratoRepositorySQL(db_session)
    contrato = Contrato(id=None, idOfertaEgresado=1, fechaFin=date.today(), estado=EstadoContrato.VIGENTE)
    creado = repo.registrar_contrato(contrato)
    eliminado = repo.eliminar_contrato(creado.id)
    assert eliminado is True


def test_obtener_contratos_por_egresado(db_session):
    poblar_datos(db_session)
    repo = ContratoRepositorySQL(db_session)
    contrato = Contrato(id=None, idOfertaEgresado=1, fechaFin=date.today(), estado=EstadoContrato.VIGENTE)
    repo.registrar_contrato(contrato)
    resultados = repo.obtener_contratos_por_egresado()
    assert isinstance(resultados, list)
    assert resultados[0]["egresado_id"] == 1


def test_obtener_contratos_por_area(db_session):
    poblar_datos(db_session)
    repo = ContratoRepositorySQL(db_session)
    contrato = Contrato(id=None, idOfertaEgresado=1, fechaFin=date.today(), estado=EstadoContrato.VIGENTE)
    repo.registrar_contrato(contrato)
    resultados = repo.obtener_contratos_por_area()
    assert isinstance(resultados, list)
    assert resultados[0]["area"] == "TI"


def test_obtener_contratos_por_area_y_fecha(db_session):
    poblar_datos(db_session)
    repo = ContratoRepositorySQL(db_session)

    contrato = Contrato(id=None, idOfertaEgresado=1, fechaFin=date.today(), estado=EstadoContrato.VIGENTE)
    repo.registrar_contrato(contrato)

    try:
        resultados = repo.obtener_contratos_por_area_y_fecha()
        assert isinstance(resultados, list)
        assert resultados[0]["area"] == "TI"
    except Exception as e:
        import sqlalchemy.exc
        if isinstance(e, sqlalchemy.exc.OperationalError) and "no such function: date_trunc" in str(e):
            pytest.skip("La función 'date_trunc' no está disponible en SQLite, solo en PostgreSQL.")
        else:
            raise


def test_obtener_egresados_con_contrato(db_session):
    poblar_datos(db_session)
    repo = ContratoRepositorySQL(db_session)
    contrato = Contrato(id=None, idOfertaEgresado=1, fechaFin=date.today(), estado=EstadoContrato.VIGENTE)
    repo.registrar_contrato(contrato)
    resultados = repo.obtener_egresados_con_contrato()
    assert isinstance(resultados, list)
    assert "habilidades" in resultados[0]
