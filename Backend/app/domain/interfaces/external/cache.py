from abc import ABC, abstractmethod


class ICache(ABC):
    @abstractmethod
    def set(self, key: str, value: str, ex: int): ...

    @abstractmethod
    def get(self, key: str) -> str | None: ...

    @abstractmethod
    def delete(self, key: str): ...
