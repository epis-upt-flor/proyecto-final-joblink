import pytest
from datetime import date
from fastapi import HTTPException
from unittest.mock import MagicMock
from app.services.oferta_service import OfertaService
from app.models.enum import EstadoOferta, EstadoPubli
from app.models.oferta import Oferta


@pytest.fixture
def oferta_service():
    return OfertaService()


@pytest.fixture
def mock_db():
    return MagicMock()


@pytest.fixture
def oferta_mock():
    return Oferta(
        id=1,
        titulo="Practicante de Backend",
        tipo="Prácticas",
        fechaCierre=None,
        area="TI",
        modalidad="Remoto",
        horario="Tiempo completo",
        vacantes=2,
        experiencia="1 año",
        locacion="Tacna",
        salario=1500,
        funciones="Desarrollar APIs",
        requisitos="Python, SQL",
        estado=EstadoOferta.pendiente,
        motivo=None,
        beneficios="Capacitación, bono",
        fechaInicio=date.today(),
        tiempo="3 meses",
        fechaPubli=date.today(),
        estadoPubli=EstadoPubli.en_revision,
        idEmpresa=99
    )


def test_registrar_oferta_exito(oferta_service, mock_db):
    data = {
        "titulo": "Desarrollador",
        "tipo": "Full-time",
        "area": "TI",
        "modalidad": "Remoto",
        "horario": "Tiempo completo",
        "vacantes": 1,
        "experiencia": "2 años",
        "locacion": "Lima",
        "funciones": "Desarrollar y mantener sistemas",
        "requisitos": "Python, SQL",
        "beneficios": "Seguro médico",
        "fechaInicio": "2025-06-01",
        "tiempo": "6 meses",
        "idEmpresa": 10
    }

    mock_db.refresh = lambda x: None
    oferta = oferta_service.registrar_oferta(mock_db, data)

    assert oferta.titulo == "Desarrollador"
    assert oferta.estado == EstadoOferta.pendiente


def test_registrar_oferta_faltan_campos(oferta_service, mock_db):
    data = {"titulo": "Dev"}  # faltan campos obligatorios

    with pytest.raises(HTTPException) as exc_info:
        oferta_service.registrar_oferta(mock_db, data)

    assert "Faltan campos requeridos" in str(exc_info.value.detail)


def test_listar_ofertas(oferta_service, mock_db, oferta_mock):
    mock_db.query.return_value.all.return_value = [oferta_mock]

    result = oferta_service.listar_ofertas(mock_db)

    assert isinstance(result, list)
    assert result[0]["titulo"] == "Practicante de Backend"


def test_obtener_oferta_por_id_encontrada(oferta_service, mock_db, oferta_mock):
    mock_db.query.return_value.filter.return_value.first.return_value = oferta_mock

    result = oferta_service.obtener_oferta_por_id(mock_db, 1)

    assert result["id"] == 1
    assert result["estadoPubli"] == "en_revision"


def test_obtener_oferta_por_id_no_encontrada(oferta_service, mock_db):
    mock_db.query.return_value.filter.return_value.first.return_value = None

    result = oferta_service.obtener_oferta_por_id(mock_db, 123)

    assert result is None


def test_actualizar_oferta_exito(oferta_service, mock_db, oferta_mock):
    mock_db.query.return_value.filter.return_value.first.return_value = oferta_mock

    data = {
        "titulo": "Backend Senior",
        "estado": "abierta",
        "estadoPubli": "aceptada"
    }

    updated = oferta_service.actualizar_oferta(mock_db, 1, data)

    assert updated.titulo == "Backend Senior"
    assert updated.estado == EstadoOferta.abierta
    assert updated.estadoPubli == EstadoPubli.aceptada


def test_actualizar_oferta_no_existente(oferta_service, mock_db):
    mock_db.query.return_value.filter.return_value.first.return_value = None

    result = oferta_service.actualizar_oferta(mock_db, 999, {"titulo": "X"})

    assert result is None


def test_eliminar_oferta_exito(oferta_service, mock_db, oferta_mock):
    mock_db.query.return_value.filter.return_value.first.return_value = oferta_mock

    result = oferta_service.eliminar_oferta(mock_db, 1)

    assert result is True
    mock_db.delete.assert_called_once()


def test_eliminar_oferta_no_existente(oferta_service, mock_db):
    mock_db.query.return_value.filter.return_value.first.return_value = None

    result = oferta_service.eliminar_oferta(mock_db, 999)

    assert result is False
