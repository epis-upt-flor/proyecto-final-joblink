import torch
from abc import ABC, abstractmethod


class IEmbeddings(ABC):
    from sentence_transformers import SentenceTransformer

    @abstractmethod
    def generar_embedding_egresado(self, egresado): ...

    @abstractmethod
    def generar_embedding_oferta(self, oferta): ...
