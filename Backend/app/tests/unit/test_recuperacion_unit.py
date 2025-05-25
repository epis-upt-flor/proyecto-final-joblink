import pytest
from unittest.mock import MagicMock
from app.services.recuperacion_service import RecuperacionService
from app.models.usuario import Usuario


@pytest.fixture
def service():
    return RecuperacionService()


@pytest.fixture
def mock_db():
    return MagicMock()


@pytest.fixture
def usuario_mock():
    return Usuario(id=1, email="user@example.com", username="user1", password="hashed")


def test_generar_token_y_enviar_exitoso(mocker, service, mock_db, usuario_mock):
    mock_db.query.return_value.filter_by.return_value.first.return_value = usuario_mock

    mock_redis = mocker.patch("app.services.recuperacion_service.redis_conn")
    mock_email_sender = mocker.Mock()
    mocker.patch("app.services.recuperacion_service.EmailFactory.get", return_value=mock_email_sender)

    result = service.generar_token_y_enviar("user@example.com", mock_db)

    assert result == {"message": "Token enviado"}
    mock_redis.set.assert_called_once()
    mock_email_sender.send.assert_called_once()


def test_generar_token_usuario_no_encontrado(service, mock_db):
    mock_db.query.return_value.filter_by.return_value.first.return_value = None

    with pytest.raises(Exception) as exc_info:
        service.generar_token_y_enviar("invalido@example.com", mock_db)

    assert str(exc_info.value) == "Usuario no encontrado"


def test_cambiar_contrasena_con_token_exitoso(mocker, service, mock_db, usuario_mock):
    mock_redis = mocker.patch("app.services.recuperacion_service.redis_conn")
    mock_redis.get.return_value = usuario_mock.id

    mock_db.query.return_value.filter_by.return_value.first.return_value = usuario_mock

    mocker.patch("app.services.recuperacion_service.Security.generar_hash", return_value="hashed-new")

    result = service.cambiar_contrasena_con_token("abc123", "newpass", mock_db)

    assert result == {"message": "Contraseña actualizada correctamente"}
    assert usuario_mock.password == "hashed-new"
    mock_redis.delete.assert_called_once()


def test_cambiar_contrasena_token_invalido(mocker, service, mock_db):
    mock_redis = mocker.patch("app.services.recuperacion_service.redis_conn")
    mock_redis.get.return_value = None

    with pytest.raises(Exception) as exc_info:
        service.cambiar_contrasena_con_token("token_invalido", "pass", mock_db)

    assert str(exc_info.value) == "Token inválido o expirado"


def test_cambiar_contrasena_usuario_no_encontrado(mocker, service, mock_db):
    mocker.patch("app.services.recuperacion_service.redis_conn.get", return_value=1)
    mock_db.query.return_value.filter_by.return_value.first.return_value = None

    with pytest.raises(Exception) as exc_info:
        service.cambiar_contrasena_con_token("token123", "pass", mock_db)

    assert str(exc_info.value) == "Usuario no encontrado"
