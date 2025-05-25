import pytest
from unittest.mock import MagicMock
from app.services.recomendador_service import RecomendadorService
from app.models.oferta import Oferta
from app.models.egresado import Egresado


@pytest.fixture
def recomendador():
    return RecomendadorService()


@pytest.fixture
def egresado_mock():
    return Egresado(
        id=1,
        nombres="María",
        habilidades="Python, SQL",
        experienciaLaboral="2 años",
        certificados="AWS",
        idiomas="Inglés",
        logrosAcademicos="Bachiller en Sistemas"
    )


@pytest.fixture
def oferta_mock():
    return Oferta(
        id=1,
        titulo="Backend",
        funciones="Desarrollar APIs",
        requisitos="Python",
        area="TI",
        experiencia="1 año"
    )


def test_agregar_egresado_a_vector_db(mocker, recomendador, egresado_mock):
    mock_vector_db = MagicMock()
    mocker.patch("app.services.recomendador_service.RecomendadorService._get_vector_db", return_value=mock_vector_db)
    mocker.patch("app.services.recomendador_service.GeneradorEmbeddings.generar_embedding_egresado", return_value=[0.1] * 10)

    recomendador.agregar_egresado_a_vector_db(egresado_mock)

    mock_vector_db.upsert.assert_called_once()


def test_agregar_oferta_a_vector_db(mocker, recomendador, oferta_mock):
    mock_vector_db = MagicMock()
    mocker.patch("app.services.recomendador_service.RecomendadorService._get_vector_db", return_value=mock_vector_db)
    mocker.patch("app.services.recomendador_service.GeneradorEmbeddings.generar_embedding_oferta", return_value=[0.2] * 10)

    recomendador.agregar_oferta_a_vector_db(oferta_mock)

    mock_vector_db.upsert.assert_called_once()


def test_recomendar_oferta_existente(mocker, recomendador, oferta_mock):
    mock_vector_db = MagicMock()
    mocker.patch("app.services.recomendador_service.RecomendadorService._get_vector_db", return_value=mock_vector_db)
    mocker.patch("app.services.recomendador_service.GeneradorEmbeddings.generar_embedding_oferta", return_value=[0.2] * 10)

    mock_vector_db.query.return_value = [
        MagicMock(id="1", score=0.92, metadata={
            "nombres": "María",
            "habilidades": "Python",
            "experienciaLaboral": "2 años",
            "certificados": "AWS",
            "idiomas": "Inglés",
            "logrosAcademicos": "Bachiller"
        }),
        MagicMock(id="oferta-2", score=0.85)
    ]

    db = MagicMock()
    db.query.return_value.filter.return_value.first.return_value = oferta_mock

    result = recomendador.recomendar(1, db)

    assert "recomendaciones" in result
    assert len(result["recomendaciones"]) == 1
    assert result["recomendaciones"][0]["nombres"] == "María"


def test_recomendar_oferta_no_existente(mocker, recomendador):
    db = MagicMock()
    db.query.return_value.filter.return_value.first.return_value = None

    result = recomendador.recomendar(99, db)

    assert result == {"error": "Oferta no encontrada"}
