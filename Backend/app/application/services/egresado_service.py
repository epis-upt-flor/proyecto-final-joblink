from app.domain.interfaces.external.egresado_repository import EgresadoRepository
from app.domain.interfaces.internal.egresado_usecase import EgresadoUseCase
from app.domain.models.egresado import Egresado
from fastapi import HTTPException
from typing import List


class EgresadoService(EgresadoUseCase):
    def __init__(self, egresado_repository: EgresadoRepository):
        self.egresado_repository = egresado_repository

    def registrar_egresado(self, egresado: Egresado) -> Egresado:
        return self.egresado_repository.registrar_egresado(egresado)

    def obtener_egresados(self) -> List[Egresado]:
        return self.egresado_repository.obtener_egresados()

    def obtener_egresado_por_id(self, id: int) -> Egresado | None:
        return self.egresado_repository.obtener_egresado_por_id(id)

    def actualizar_egresado(self, id: int, nuevos_datos: dict) -> Egresado:
        egresado = self.egresado_repository.obtener_egresado_por_id(id)
        if not egresado:
            raise HTTPException(
                status_code=404, detail="Egresado no encontrado")

        for key, value in nuevos_datos.items():
            if value is not None:
                setattr(egresado, key, value)

        return self.egresado_repository.actualizar_egresado(egresado)

    def eliminar_egresado(self, id: int) -> bool:
        return self.egresado_repository.eliminar_egresado(id)
