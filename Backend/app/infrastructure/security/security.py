from passlib.context import CryptContext
from jose import JWTError, jwt
from typing import Optional
from app.domain.interfaces.external.security import ISecurity
from app.config.config import SECRET_KEY, ACCESS_TOKEN_EXPIRE_MINUTES, ALGORITHM
from datetime import datetime, timedelta, timezone


class Security(ISecurity):
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def verificar_password(self, plain_password: str, hashed_password: str) -> bool:
        return self.pwd_context.verify(plain_password, hashed_password)

    def generar_hash(self, password: str) -> str:
        return self.pwd_context.hash(password)

    def crear_token(self, data: dict, expires_delta: Optional[timedelta] = None) -> str:
        to_encode = data.copy()
        expire = datetime.now(
            timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    def verificar_token(self, token: str) -> Optional[dict]:
        try:
            return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        except JWTError:
            return None
