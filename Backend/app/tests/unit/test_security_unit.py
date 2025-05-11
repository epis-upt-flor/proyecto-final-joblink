import pytest
from datetime import datetime, timedelta
from jose import JWTError, jwt
from Backend.infrastructure.security.security import Security


class TestSecurity:

    def test_verify_password_returns_true_when_matching(self, mocker):
        plain_password = "test_password"
        hashed_password = "hashed_password"
        mocker.patch.object(Security.pwd_context, 'verify', return_value=True)

        result = Security.verificar_password(plain_password, hashed_password)

        assert result is True
        Security.pwd_context.verify.assert_called_once_with(
            plain_password, hashed_password)

    def test_verify_password_returns_false_when_not_matching(self, mocker):
        plain_password = "test_password"
        hashed_password = "hashed_password"
        mocker.patch.object(Security.pwd_context, 'verify', return_value=False)

        result = Security.verificar_password(plain_password, hashed_password)

        assert result is False
        Security.pwd_context.verify.assert_called_once_with(
            plain_password, hashed_password)

    def test_generar_hash_returns_hashed_string(self, mocker):
        password = "my_password"
        mocked_hash = "$2b$12$1234567890abcdef"
        mocker.patch.object(Security.pwd_context, 'hash',
                            return_value=mocked_hash)

        result = Security.generar_hash(password)

        assert result == mocked_hash
        Security.pwd_context.hash.assert_called_once_with(password)

    def test_crear_token_generates_valid_token(self, mocker):
        mock_encode = mocker.patch(
            "app.utils.security.jwt.encode", return_value="fake.jwt.token")
        data = {"sub": "user1"}

        result = Security.crear_token(data)

        assert result == "fake.jwt.token"
        assert mock_encode.called
        args, kwargs = mock_encode.call_args
        assert "exp" in args[0]

    def test_verificar_token_returns_payload_on_valid_token(self, mocker):
        token = "valid.jwt.token"
        mock_payload = {"sub": "user1"}
        mocker.patch("app.utils.security.jwt.decode",
                     return_value=mock_payload)

        result = Security.verificar_token(token)

        assert result == mock_payload
        jwt.decode.assert_called_once_with(
            token, Security.SECRET_KEY, algorithms=[Security.ALGORITHM])

    def test_verificar_token_returns_none_on_invalid_token(self, mocker):
        token = "invalid.token"
        mocker.patch("app.utils.security.jwt.decode",
                     side_effect=JWTError("Token inválido"))

        result = Security.verificar_token(token)

        assert result is None
