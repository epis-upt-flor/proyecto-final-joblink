import pytest
import datetime
from app.domain.models.egresado import Egresado
from app.infrastructure.repositories.egresado_repository_sql import EgresadoRepositorySQL

@pytest.fixture
def mock_egresado():
    return Egresado(
        id=None,
        nombres="Juan",
        apellidos="Pérez",
        tipoDoc="DNI",
        numDoc="12345678",
        email="juan@example.com",
        telefono="987654321",
        direccion="Av. Siempre Viva 123",
        nacionalidad="Peruana",
        fechaNacimiento=datetime.date(2000, 1, 1),
        habilidades="Python, SQL",
        logrosAcademicos="Graduado con honores",
        certificados="Certificado AWS",
        experienciaLaboral="Empresa X - 1 año",
        idiomas="Inglés, Español",
        linkedin="https://linkedin.com/in/juanperez",
        github="https://github.com/juanperez",
        cv="https://cv.com/juan",
        disponibilidad=True
    )

def test_registrar_egresado(db_session, mock_egresado):
    repo = EgresadoRepositorySQL(db_session)
    egresado = repo.registrar_egresado(mock_egresado)
    assert egresado.id is not None
    assert egresado.email == "juan@example.com"

def test_obtener_egresados(db_session, mock_egresado):
    repo = EgresadoRepositorySQL(db_session)
    repo.registrar_egresado(mock_egresado)
    result = repo.obtener_egresados()
    assert len(result) == 1

def test_obtener_egresado_por_id(db_session, mock_egresado):
    repo = EgresadoRepositorySQL(db_session)
    egresado = repo.registrar_egresado(mock_egresado)
    result = repo.obtener_egresado_por_id(egresado.id)
    assert result is not None
    assert result.id == egresado.id

def test_actualizar_egresado(db_session, mock_egresado):
    repo = EgresadoRepositorySQL(db_session)
    egresado = repo.registrar_egresado(mock_egresado)
    egresado.telefono = "111222333"
    actualizado = repo.actualizar_egresado(egresado)
    assert actualizado.telefono == "111222333"

def test_eliminar_egresado(db_session, mock_egresado):
    repo = EgresadoRepositorySQL(db_session)
    egresado = repo.registrar_egresado(mock_egresado)
    eliminado = repo.eliminar_egresado(egresado.id)
    assert eliminado is True
    assert repo.obtener_egresado_por_id(egresado.id) is None

def test_existe_por_email(db_session, mock_egresado):
    repo = EgresadoRepositorySQL(db_session)
    repo.registrar_egresado(mock_egresado)
    assert repo.existe_por_email("juan@example.com") is True
    assert repo.existe_por_email("otro@example.com") is False

def test_existe_por_num_doc(db_session, mock_egresado):
    repo = EgresadoRepositorySQL(db_session)
    repo.registrar_egresado(mock_egresado)
    assert repo.existe_por_num_doc("12345678") is True
    assert repo.existe_por_num_doc("00000000") is False
