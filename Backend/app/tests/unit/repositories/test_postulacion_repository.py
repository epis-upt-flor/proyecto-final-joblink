import pytest
from datetime import date
from app.domain.models.postulacion import Postulacion
from app.domain.models.enum import EstadoPostulacion
from app.infrastructure.repositories.postulacion_repository_sql import PostulacionRepositorySQL
from app.tests.unit.repositories.helpers import poblar_datos


def test_registrar_postulacion(db_session):
    poblar_datos(db_session)
    repo = PostulacionRepositorySQL(db_session)
    postulacion = Postulacion(
        id=None,
        idOferta=1,
        idEgresado=1,
        fechaRecomendacion=date.today(),
        posicionRanking=1,
        estado=EstadoPostulacion.RECOMENDADO
    )
    creada = repo.registrar_postulacion(postulacion)
    assert creada.id is not None
    assert creada.estado == EstadoPostulacion.RECOMENDADO


def test_obtener_postulaciones(db_session):
    poblar_datos(db_session)
    repo = PostulacionRepositorySQL(db_session)
    postulaciones = repo.obtener_postulaciones()
    assert isinstance(postulaciones, list)
    assert len(postulaciones) > 0


def test_obtener_postulacion_por_id(db_session):
    poblar_datos(db_session)
    repo = PostulacionRepositorySQL(db_session)
    encontrada = repo.obtener_postulacion_por_id(1)
    assert encontrada is not None
    assert encontrada.id == 1


def test_actualizar_postulacion(db_session):
    poblar_datos(db_session)
    repo = PostulacionRepositorySQL(db_session)
    postulacion = repo.obtener_postulacion_por_id(1)
    postulacion.estado = EstadoPostulacion.APROBADA
    actualizada = repo.actualizar_postulacion(postulacion)
    assert actualizada.estado == EstadoPostulacion.APROBADA


def test_eliminar_postulacion(db_session):
    poblar_datos(db_session)

    # Eliminar el contrato primero para evitar errores de integridad
    from app.infrastructure.orm_models.contrato_orm import ContratoORM
    contrato = db_session.query(ContratoORM).filter(ContratoORM.id == 1).first()
    if contrato:
        db_session.delete(contrato)
        db_session.commit()

    from app.infrastructure.repositories.postulacion_repository_sql import PostulacionRepositorySQL
    repo = PostulacionRepositorySQL(db_session)
    eliminado = repo.eliminar_postulacion(1)
    assert eliminado is True


def test_obtener_egresados_con_contrato(db_session):
    poblar_datos(db_session)
    repo = PostulacionRepositorySQL(db_session)
    ids = repo.obtener_egresados_con_contrato()
    assert isinstance(ids, list)
    assert 1 in ids


def test_obtener_ranking_promedio_egresados(db_session):
    poblar_datos(db_session)
    repo = PostulacionRepositorySQL(db_session)
    ranking = repo.obtener_ranking_promedio_egresados()
    assert isinstance(ranking, list)
    assert ranking[0]["egresado_id"] == 1


def test_obtener_postulaciones_por_oferta(db_session):
    poblar_datos(db_session)
    repo = PostulacionRepositorySQL(db_session)
    resultados = repo.obtener_postulaciones_por_oferta(1)
    assert isinstance(resultados, list)
    assert resultados[0]["idOferta"] == 1


def test_obtener_postulaciones_por_empresa(db_session):
    poblar_datos(db_session)
    repo = PostulacionRepositorySQL(db_session)
    resultados = repo.obtener_postulaciones_por_empresa(1)
    assert isinstance(resultados, list)
    assert resultados[0].oferta.idEmpresa == 1


def test_obtener_postulaciones_por_egresado(db_session):
    poblar_datos(db_session)
    repo = PostulacionRepositorySQL(db_session)
    resultados = repo.obtener_postulaciones_por_egresado()
    assert isinstance(resultados, list)
    assert resultados[0]["egresado_id"] == 1
