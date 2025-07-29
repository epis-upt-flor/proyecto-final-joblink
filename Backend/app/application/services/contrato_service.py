from typing import List, Optional
from fastapi import HTTPException
from app.domain.models.contrato import Contrato
from app.domain.interfaces.external.contrato_repository import ContratoRepository
from app.domain.interfaces.internal.contrato_usecase import ContratoUseCase


class ContratoService(ContratoUseCase):
    CONTRATO_NOT_FOUND = "Contrato no encontrado"
    def __init__(self, repository: ContratoRepository):
        self.repository = repository

    def registrar_contrato(self, contrato: Contrato) -> Contrato:
        return self.repository.registrar_contrato(contrato)

    def obtener_todos(self) -> List[dict]:
        return self.repository.obtener_contratos()

    def obtener_por_id(self, id: int) -> Optional[Contrato]:
        contrato = self.repository.obtener_contrato_por_id(id)
        if not contrato:
            raise HTTPException(
                status_code=404, detail=self.CONTRATO_NOT_FOUND)
        return contrato

    def actualizar_contrato(self, contrato: Contrato) -> Optional[Contrato]:
        actualizado = self.repository.actualizar_contrato(contrato)
        if not actualizado:
            raise HTTPException(
                status_code=404, detail=self.CONTRATO_NOT_FOUND)
        return actualizado

    def eliminar_contrato(self, id: int) -> bool:
        if not self.repository.eliminar_contrato(id):
            raise HTTPException(
                status_code=404, detail=self.CONTRATO_NOT_FOUND)
        return True
