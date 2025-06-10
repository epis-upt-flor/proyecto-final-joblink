from abc import ABC, abstractmethod

class IEmailSender(ABC):
    @abstractmethod
    def send(self, to: str, **kwargs): ...
