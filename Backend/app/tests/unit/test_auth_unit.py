import pytest
from fastapi import HTTPException
from unittest.mock import MagicMock
from app.services.auth_service import AuthService
from app.models.usuario import Usuario


@pytest.fixture
def auth_service():
    return AuthService()


@pytest.fixture
def mock_db():
    return MagicMock()


@pytest.fixture
def usuario_mock():
    return Usuario(id=1, username="testuser", email="test@example.com", rol="admin", password="hashed")


def test_registrar_usuario_exitoso(mocker, auth_service, mock_db, usuario_mock):
    data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "123456",
        "rol": "admin"
    }

    mock_db.query.return_value.filter.return_value.first.side_effect = [
        None, None]

    mocker.patch("app.services.auth_service.Security.generar_hash",
                 return_value="hashed")

    creador_mock = mocker.Mock()
    creador_mock.crear_usuario.return_value = usuario_mock
    factory_mock = mocker.patch("app.services.auth_service.UsuarioFactory")
    factory_mock.return_value.get_creador.return_value = creador_mock

    result = auth_service.registrar_usuario(data, mock_db)

    assert result.username == "testuser"
    mock_db.add.assert_called_once()
    mock_db.commit.assert_called_once()


def test_registrar_usuario_faltan_campos(auth_service, mock_db):
    with pytest.raises(HTTPException) as exc_info:
        auth_service.registrar_usuario({"username": "user"}, mock_db)
    assert exc_info.value.status_code == 400


def test_registrar_usuario_existente(auth_service, mock_db, usuario_mock):
    mock_db.query.return_value.filter.return_value.first.side_effect = [
        usuario_mock]

    with pytest.raises(HTTPException) as exc_info:
        auth_service.registrar_usuario({
            "username": "testuser",
            "email": "test@example.com",
            "password": "123456",
            "rol": "admin"
        }, mock_db)

    assert exc_info.value.detail == "El usuario ya existe"


def test_login_usuario_exitoso(mocker, auth_service, mock_db, usuario_mock):
    data = {"username": "testuser", "password": "123456"}
    mock_db.query.return_value.filter.return_value.first.return_value = usuario_mock

    mocker.patch(
        "app.services.auth_service.Security.verificar_password", return_value=True)
    mocker.patch("app.services.auth_service.TokenService.crear_token",
                 return_value="token123")

    result = auth_service.login_usuario(data, mock_db)

    assert result["access_token"] == "token123"
    assert result["token_type"] == "bearer"


def test_login_usuario_faltan_credenciales(auth_service, mock_db):
    with pytest.raises(HTTPException) as exc_info:
        auth_service.login_usuario({"username": "testuser"}, mock_db)
    assert exc_info.value.status_code == 400


def test_login_usuario_credenciales_invalidas(mocker, auth_service, mock_db, usuario_mock):
    data = {"username": "testuser", "password": "wrongpass"}
    mock_db.query.return_value.filter.return_value.first.return_value = usuario_mock

    mocker.patch(
        "app.services.auth_service.Security.verificar_password", return_value=False)

    with pytest.raises(HTTPException) as exc_info:
        auth_service.login_usuario(data, mock_db)

    assert exc_info.value.status_code == 401
