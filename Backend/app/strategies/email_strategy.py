from abc import ABC, abstractmethod

class EmailStrategy(ABC):
    @abstractmethod
    def send(self, to: str, **kwargs):
        pass
