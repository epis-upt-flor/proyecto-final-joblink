from abc import ABC, abstractmethod
from sqlalchemy.orm import Session

class RecomendadorUseCase(ABC):
    @abstractmethod
    def recomendar(self, oferta_id: int, db: Session) -> dict: ...
