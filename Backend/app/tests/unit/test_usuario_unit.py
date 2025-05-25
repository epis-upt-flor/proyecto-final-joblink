import pytest
from fastapi import HTTPException
from unittest.mock import MagicMock
from app.services.usuario_service import UserService
from app.models.usuario import Usuario


@pytest.fixture
def user_service():
    return UserService()


@pytest.fixture
def mock_db():
    return MagicMock()


@pytest.fixture
def usuario_mock():
    return Usuario(id=1, username="admin", email="admin@example.com", rol="admin", password="hashed")


def test_obtener_usuario_actual_exitoso(mocker, user_service, mock_db, usuario_mock):
    mocker.patch("app.services.usuario_service.TokenService.verificar_token",
                 return_value={"sub": "admin"})
    mock_db.query.return_value.filter.return_value.first.return_value = usuario_mock

    result = user_service.obtener_usuario_actual("valid-token", mock_db)

    assert result.username == "admin"


def test_obtener_usuario_token_invalido(mocker, user_service, mock_db):
    mocker.patch("app.services.usuario_service.TokenService.verificar_token", return_value={})

    with pytest.raises(HTTPException) as exc_info:
        user_service.obtener_usuario_actual("invalid-token", mock_db)

    assert exc_info.value.status_code == 401
    assert exc_info.value.detail == "Token inválido"


def test_obtener_usuario_no_encontrado(mocker, user_service, mock_db):
    mocker.patch("app.services.usuario_service.TokenService.verificar_token",
                 return_value={"sub": "ghost"})
    mock_db.query.return_value.filter.return_value.first.return_value = None

    with pytest.raises(HTTPException) as exc_info:
        user_service.obtener_usuario_actual("valid-token", mock_db)

    assert exc_info.value.status_code == 404
    assert exc_info.value.detail == "Usuario no encontrado"


def test_listar_usuarios(user_service, mock_db, usuario_mock):
    mock_db.query.return_value.all.return_value = [usuario_mock]

    result = user_service.listar_usuarios(mock_db)

    assert len(result) == 1
    assert result[0].username == "admin"
