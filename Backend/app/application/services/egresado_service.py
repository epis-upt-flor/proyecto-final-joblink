# app/application/services/egresado_service.py
from typing import List, Optional
from app.domain.models.egresado import Egresado
from app.domain.interfaces.external.egresado_repository import EgresadoRepository
from app.domain.interfaces.internal.egresado_usecase import EgresadoUseCase
from fastapi import HTTPException


class EgresadoService(EgresadoUseCase):
    def __init__(self, repository: EgresadoRepository):
        self.repository = repository

    def registrar_egresado(self, egresado: Egresado) -> Egresado:
        if self.repository.existe_por_email(egresado.email):
            raise HTTPException(
                status_code=400, detail="El correo ya está registrado")
        if self.repository.existe_por_num_doc(egresado.numDoc):
            raise HTTPException(
                status_code=400, detail="El número de documento ya está registrado")
        return self.repository.registrar_egresado(egresado)

    def obtener_todos(self) -> List[Egresado]:
        return self.repository.obtener_egresados()

    def obtener_por_id(self, id: int) -> Optional[Egresado]:
        egresado = self.repository.obtener_egresado_por_id(id)
        if not egresado:
            raise HTTPException(
                status_code=404, detail="Egresado no encontrado")
        return egresado

    def actualizar_egresado(self, egresado: Egresado) -> Optional[Egresado]:
        actualizado = self.repository.actualizar_egresado(egresado)
        if not actualizado:
            raise HTTPException(
                status_code=404, detail="Egresado no encontrado")
        return actualizado

    def eliminar_egresado(self, id: int) -> bool:
        if not self.repository.eliminar_egresado(id):
            raise HTTPException(
                status_code=404, detail="Egresado no encontrado")
        return True
