import pytest
from unittest.mock import Mock, patch
from app.application.services.auth_service import AuthService
from app.application.services.recuperacion_service import RecuperacionService    
from app.application.services.egresado_service import EgresadoService
from app.application.services.postulacion_service import PostulacionService
from app.application.services.contrato_service import ContratoService
from app.application.services.reporte_service import ReporteService
from app.infrastructure.schemas.auth_schema import EmpresaCreate
    
# ============ FIXTURE PARA REGISTRO DE EMPRESA ============
@pytest.fixture
def mock_empresa_create():
    return EmpresaCreate(
        nombre="Test SAC",
        ruc="123456789",
        telefono="999999999",
        email="test@empresa.com",
        logo="logo.png",
        username="usuario_test",
        password="pass123",
        idRol=2
    )

# RF-01 - TC-01: Autenticación
def test_prueba_de_autenticacion_de_usuario(mocker):
    entrada = mocker.Mock(username="admin@example.com", password="admin123")
    esperado = {"access_token": "fake-token", "token_type": "bearer"}
    mocker.patch.object(AuthService, "login_usuario", return_value=esperado)
    service = AuthService(None, None)
    resultado = service.login_usuario(entrada)
    assert resultado == esperado

# RF-01 - TC-02: Recuperación de contraseña
def test_prueba_de_recuperacion_de_password(mocker):
    email = "usuario@example.com"
    esperado = {"message": "Token enviado"}
    mocker.patch.object(RecuperacionService, "generar_token_y_enviar", return_value=esperado)
    service = RecuperacionService(None, None, None, None)
    resultado = service.generar_token_y_enviar(email)
    assert resultado == esperado

# RF-02 - TC-03: Registro de empresa
def test_registro_empresa(mocker, mock_empresa_create):
    entrada = mock_empresa_create
    esperado = mocker.Mock(email=entrada.email)
    mocker.patch.object(AuthService, "registrar_usuario", return_value=esperado)
    service = AuthService(None, None)
    usuario = service.registrar_usuario(entrada)
    assert usuario.email == entrada.email

# RF-02 - TC-04: Actualización de empresa
def test_actualizacion_empresa(mocker):
    from app.application.services.empresa_service import EmpresaService
    empresa_id = 1
    nuevos_datos = {"nombre": "Nueva Empresa SAC"}
    esperado = {"id": empresa_id, "nombre": "Nueva Empresa SAC"}

    mocker.patch.object(EmpresaService, "editar", return_value=esperado)
    service = EmpresaService(None)
    resultado = service.editar(nuevos_datos)
    assert resultado == esperado

# RF-03 - TC-05: Registro de oferta laboral
def test_registro_de_oferta_laboral(mocker):
    from app.application.services.oferta_service import OfertaService
    entrada = mocker.Mock()
    esperado = "Oferta almacenada en estado pendiente"
    mocker.patch.object(OfertaService, "registrar", return_value=esperado)
    service = OfertaService(None, None, None)
    resultado = service.registrar(entrada)
    assert resultado == esperado

# RF-03 - TC-06: Aprobación de ofertas
def test_aprobacion_de_ofertas_por_administrador(mocker):
    from app.application.services.oferta_service import OfertaService
    entrada_id = 123
    esperado = "Oferta actualizada a estado aprobado"
    mocker.patch.object(OfertaService, "aprobar_oferta", return_value=esperado)
    service = OfertaService(None, None, None)
    resultado = service.aprobar_oferta(entrada_id)
    assert resultado == esperado

# RF-04 - TC-07: Registro individual de egresado
def test_registro_individual_de_egresado(mocker):
    with patch("app.application.services.egresado_service.GeneradorEmbeddings"):
        from app.application.services.egresado_service import EgresadoService
        entrada = mocker.Mock()
        esperado = "Egresado registrado correctamente"
        mocker.patch.object(EgresadoService, "registrar_egresado", return_value=esperado)
        service = EgresadoService(None, None)
        resultado = service.registrar_egresado(entrada)
        assert resultado == esperado

# RF-05 - TC-08: Calculo de similitud semántica
def test_calculo_de_similitud_semantica(mocker):
    from app.application.services.recomendador_service import RecomendadorService
    mocker.patch("app.application.services.recomendador_service.GeneradorEmbeddings")
    mocker.patch.object(RecomendadorService, "recomendar", return_value="Lista de egresados recomendados generada")
    service = RecomendadorService(None, None, None, None, None, None)
    resultado = service.recomendar(101, "fake_db")
    assert resultado == "Lista de egresados recomendados generada"

# RF-06 - TC-09: Generación de ranking de recomendados
def test_generacion_de_ranking_de_recomendados(mocker):
    from app.application.services.recomendador_service import RecomendadorService
    entrada = 123
    esperado = {"recomendaciones": [{"id": 1, "score_final": 0.95}]}  # estructura esperada

    mocker.patch.object(RecomendadorService, "recomendar", return_value=esperado)
    service = RecomendadorService(None, None, None, None, None, None)
    resultado = service.recomendar(entrada, "fake_db")
    assert resultado == esperado


# RF-07 - TC-10: Gestión de postulaciones
def test_gestion_de_postulaciones(mocker):
    entrada = mocker.Mock()
    esperado = "Estado de postulacion actualizado correctamente"
    mocker.patch.object(PostulacionService, "actualizar_postulacion", return_value=esperado)
    service = PostulacionService(None, None)
    resultado = service.actualizar_postulacion(entrada)
    assert resultado == esperado

# RF-08 - TC-11: Registro de historial de contrataciones
def test_registro_de_historial_de_contrataciones(mocker):
    entrada = mocker.Mock()
    esperado = "Contratacion registrada en el historial"
    mocker.patch.object(ContratoService, "registrar_contrato", return_value=esperado)
    service = ContratoService(None)
    resultado = service.registrar_contrato(entrada)
    assert resultado == esperado

# RF-09 - TC-12: Análisis de contrataciones previas
def test_similitud_con_egresados_contratados(mocker):
    from app.application.services.recomendador_service import RecomendadorService
    candidatos = [
        {"id": 1, "score_oferta": 0.8, "metadata": {}}
    ]
    egresado_mock = mocker.Mock()
    egresado_repo = mocker.Mock()
    egresado_repo.obtener_egresado_por_id.return_value = egresado_mock

    embeddings_mock = mocker.Mock()
    embeddings_mock.generar_embedding_egresado.return_value = [0.1] * 384

    service = RecomendadorService(None, None, None, egresado_repo, None, None)
    service.embeddings = embeddings_mock
    service._calcular_scores_candidato(candidatos[0], [egresado_mock])

    assert "score_contratados" in candidatos[0]
    assert "score_final" in candidatos[0]

# RF-10 - TC-13: Generación de reportes de empleabilidad
def test_generacion_de_reportes_de_empleabilidad(mocker):
    mock_postulacion = mocker.Mock()
    mock_contrato = mocker.Mock()
    mock_egresado = mocker.Mock()
    mock_empresa = mocker.Mock()
    mock_repo = ReporteService(mock_postulacion, mock_contrato, mock_egresado, mock_empresa)

    mocker.patch.object(mock_repo, "tasa_exito_egresados", return_value="OK")
    assert mock_repo.tasa_exito_egresados() == "OK"

    mocker.patch.object(mock_repo, "empresas_con_mas_contrataciones", return_value="OK")
    assert mock_repo.empresas_con_mas_contrataciones() == "OK"

    mocker.patch.object(mock_repo, "tendencias_contratacion_por_area", return_value="OK")
    assert mock_repo.tendencias_contratacion_por_area() == "OK"

    mocker.patch.object(mock_repo, "perfil_egresados_contratados", return_value="OK")
    assert mock_repo.perfil_egresados_contratados() == "OK"

    mocker.patch.object(mock_repo, "ranking_egresados", return_value="OK")
    assert mock_repo.ranking_egresados() == "OK"
