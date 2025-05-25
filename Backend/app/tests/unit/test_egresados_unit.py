import pytest
from fastapi import HTTPException
from datetime import date
from app.services.egresado_service import EgresadoService
from app.models.egresado import Egresado
from app.models.enum import TipoDocumento
from unittest.mock import MagicMock

@pytest.fixture
def egresado_service():
    return EgresadoService()

@pytest.fixture
def mock_db():
    return MagicMock()


@pytest.fixture
def egresado_mock():
    return Egresado(
        id=1,
        nombres="Juan",
        apellidos="Pérez",
        tipoDoc=TipoDocumento.dni,
        numDoc="12345678",
        email="juan@example.com",
        telefono="987654321",
        direccion="Av. Siempre Viva",
        nacionalidad="Peruana",
        fechaNacimiento=date(1995, 5, 20),
        habilidades="Python, SQL",
        logrosAcademicos="Bachiller",
        certificados="AWS",
        experienciaLaboral="2 años",
        idiomas="Inglés",
        linkedin="linkedin.com/juan",
        github="github.com/juan",
        cv="cv.pdf",
        disponibilidad=True
    )


def test_registrar_egresado_exitoso(mocker, egresado_service, mock_db, egresado_mock):
    data = {
        "nombres": "Juan",
        "apellidos": "Pérez",
        "tipoDoc": "DNI",
        "numDoc": "12345678",
        "email": "juan@example.com",
        "telefono": "987654321",
        "fechaNacimiento": "1995-05-20"
    }

    mock_db.query.return_value.filter.return_value.first.side_effect = [None, None]
    mock_db.refresh = lambda x: None

    result = egresado_service.registrar_egresado(mock_db, data)
    assert result.nombres == "Juan"


def test_registrar_egresado_faltan_campos(egresado_service, mock_db):
    data = {
        "nombres": "Juan",
        "apellidos": "Pérez"
    }
    with pytest.raises(HTTPException) as exc_info:
        egresado_service.registrar_egresado(mock_db, data)
    assert "Faltan campos requeridos" in str(exc_info.value.detail)


def test_registrar_egresado_documento_duplicado(egresado_service, mock_db, egresado_mock):
    mock_db.query.return_value.filter.return_value.first.side_effect = [egresado_mock]

    data = {
        "nombres": "Juan",
        "apellidos": "Pérez",
        "tipoDoc": "DNI",
        "numDoc": "12345678",
        "email": "juan@example.com",
        "telefono": "987654321",
        "fechaNacimiento": "1995-05-20"
    }

    with pytest.raises(HTTPException) as exc_info:
        egresado_service.registrar_egresado(mock_db, data)
    assert "documento ya registrado" in str(exc_info.value.detail)


def test_obtener_egresados(egresado_service, mock_db, egresado_mock):
    mock_db.query.return_value.all.return_value = [egresado_mock]
    result = egresado_service.obtener_egresados(mock_db)

    assert isinstance(result, list)
    assert result[0]["nombres"] == "Juan"


def test_obtener_egresado_por_id_encontrado(egresado_service, mock_db, egresado_mock):
    mock_db.query.return_value.filter.return_value.first.return_value = egresado_mock
    result = egresado_service.obtener_egresado_por_id(mock_db, 1)

    assert result["id"] == 1
    assert result["email"] == "juan@example.com"


def test_obtener_egresado_por_id_no_encontrado(egresado_service, mock_db):
    mock_db.query.return_value.filter.return_value.first.return_value = None
    result = egresado_service.obtener_egresado_por_id(mock_db, 999)

    assert result is None


def test_actualizar_egresado_exitoso(egresado_service, mock_db, egresado_mock):
    mock_db.query.return_value.filter.return_value.first.return_value = egresado_mock

    data = {"telefono": "111222333", "tipoDoc": "DNI"}

    result = egresado_service.actualizar_egresado(mock_db, 1, data)

    assert result.telefono == "111222333"


def test_actualizar_egresado_no_existe(egresado_service, mock_db):
    mock_db.query.return_value.filter.return_value.first.return_value = None

    result = egresado_service.actualizar_egresado(mock_db, 999, {"telefono": "999999999"})

    assert result is None


def test_eliminar_egresado_exitoso(egresado_service, mock_db, egresado_mock):
    mock_db.query.return_value.filter.return_value.first.return_value = egresado_mock

    result = egresado_service.eliminar_egresado(mock_db, 1)

    assert result is True
    mock_db.delete.assert_called_once()


def test_eliminar_egresado_no_existe(egresado_service, mock_db):
    mock_db.query.return_value.filter.return_value.first.return_value = None

    result = egresado_service.eliminar_egresado(mock_db, 999)

    assert result is False
