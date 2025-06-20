import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, clear_mappers
from datetime import date
from app.infrastructure.orm_models.oferta_orm import OfertaORM, Base
from app.infrastructure.repositories.oferta_repository_sql import OfertaRepositorySQL
from app.domain.models.oferta import Oferta as OfertaDomain

engine = create_engine("sqlite:///:memory:", echo=False)
TestingSessionLocal = sessionmaker(bind=engine)

def setup_module(module):
    Base.metadata.create_all(bind=engine)

def teardown_module(module):
    clear_mappers()
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def db_session():
    session = TestingSessionLocal()
    yield session
    session.close()

@pytest.fixture
def repo(db_session):
    return OfertaRepositorySQL(db_session)

@pytest.fixture
def sample_oferta():
    return OfertaDomain(
        id=None,
        titulo="Analista de Datos",
        tipo="Tiempo completo",
        fechaCierre=date(2025, 7, 1),
        area="Tecnología",
        modalidad="Remoto",
        horario="L-V",
        vacantes=2,
        experiencia="1 año",
        locacion="Lima",
        salario=3500.0,
        funciones="Análisis de datos",
        requisitos="SQL, Python",
        estado="PENDIENTE",
        motivo=None,
        beneficios="EPS, Home Office",
        fechaInicio=date(2025, 7, 10),
        tiempo="3 meses",
        fechaPubli=date(2025, 6, 1),
        estadoPubli="NO_PUBLICADA",
        idEmpresa=1,
        empresa=None
    )

def test_guardar_y_obtener_por_id(repo, sample_oferta):
    nueva = repo.guardar(sample_oferta)
    assert nueva.id is not None
    resultado = repo.obtener_por_id(nueva.id)
    assert resultado.titulo == sample_oferta.titulo

def test_obtener_todos(repo, sample_oferta):
    repo.guardar(sample_oferta)
    lista = repo.obtener_todos()
    assert isinstance(lista, list)
    assert len(lista) >= 1

def test_actualizar_oferta(repo, sample_oferta):
    nueva = repo.guardar(sample_oferta)
    datos_actualizados = {"titulo": "Data Analyst Senior", "vacantes": 3}
    actualizada = repo.actualizar(nueva.id, datos_actualizados)
    assert actualizada.titulo == "Data Analyst Senior"
    assert actualizada.vacantes == 3

def test_eliminar_oferta(repo, sample_oferta):
    nueva = repo.guardar(sample_oferta)
    resultado = repo.eliminar(nueva.id)
    assert resultado is True
    assert repo.obtener_por_id(nueva.id) is None
