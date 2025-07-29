import pytest
from unittest.mock import MagicMock, patch
from app.domain.models.egresado import Egresado
from app.domain.models.oferta import Oferta
from app.infrastructure.repositories.vector_db_repository_upstash import VectorDBRepositoryUpstash

@patch("app.infrastructure.repositories.vector_db_repository_upstash.VectorDBProvider.get_index")
def test_agregar_egresado(mock_get_index):
    mock_vector_db = MagicMock()
    mock_get_index.return_value = mock_vector_db

    repo = VectorDBRepositoryUpstash()

    egresado = Egresado(
        id=1,
        nombres="Jesús",
        apellidos="Ágreda",
        tipoDoc="DNI",
        numDoc="12345678",
        email="jesus@example.com",
        telefono="999999999",
        direccion="Calle Falsa 123",
        nacionalidad="Peruana",
        fechaNacimiento="1998-01-01",
        habilidades=["Python", "FastAPI"],
        logrosAcademicos=["Top 10"],
        certificados=["Certificado A"],
        experienciaLaboral=["Internship"],
        idiomas=["Español"],
        linkedin=None,
        github=None,
        cv=None,
        disponibilidad=True
    )
    vector = [0.1, 0.2, 0.3]

    repo.agregar_egresado(egresado, vector)
    mock_vector_db.upsert.assert_called_once()
    args = mock_vector_db.upsert.call_args[0][0]
    assert args[0].id == "1"
    assert args[0].vector == vector
    assert args[0].metadata["habilidades"] == ["Python", "FastAPI"]

@patch("app.infrastructure.repositories.vector_db_repository_upstash.VectorDBProvider.get_index")
def test_agregar_oferta(mock_get_index):
    mock_vector_db = MagicMock()
    mock_get_index.return_value = mock_vector_db

    repo = VectorDBRepositoryUpstash()

    oferta = Oferta(
        id=1,
        titulo="Backend Developer",
        tipo="Empleo",
        fechaCierre="2025-12-31",
        area="TI",
        modalidad="Remoto",
        horario="Full-time",
        vacantes=1,
        experiencia="1 año",
        locacion="Tacna",
        salario=3000.0,
        funciones=["API development"],
        requisitos=["Python", "FastAPI"],
        estado="ACTIVO",
        motivo=None,
        beneficios=[],
        fechaInicio="2025-01-01",
        tiempo=6,
        fechaPubli="2025-01-01",
        estadoPubli="PUBLICADA",
        idEmpresa=1
    )

    vector = [0.4, 0.5, 0.6]

    repo.agregar_oferta(oferta, vector)
    mock_vector_db.upsert.assert_called_once()
    args = mock_vector_db.upsert.call_args[0][0]
    assert args[0].id == "oferta-1"
    assert args[0].vector == vector
    assert args[0].metadata["area"] == "TI"

@patch("app.infrastructure.repositories.vector_db_repository_upstash.VectorDBProvider.get_index")
def test_buscar_similares(mock_get_index):
    mock_vector_db = MagicMock()
    mock_vector_db.query.return_value = {"matches": []}
    mock_get_index.return_value = mock_vector_db

    repo = VectorDBRepositoryUpstash()
    vector = [0.1, 0.2, 0.3]
    result = repo.buscar_similares(vector, top_k=5)

    mock_vector_db.query.assert_called_once_with(
        vector=vector,
        top_k=5,
        include_metadata=True
    )
    assert result == {"matches": []}
