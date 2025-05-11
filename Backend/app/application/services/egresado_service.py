from app.domain.interfaces.OUT.egresado_repository import EgresadoRepository
from app.domain.interfaces.IN.egresado_usecase import EgresadoUseCase
from app.domain.models.egresado import Egresado
from fastapi import HTTPException

class EgresadoService(EgresadoUseCase):
    def __init__(self, egresado_repository: EgresadoRepository):
        self.egresado_repository = egresado_repository

    def registrar_egresado(self, data: dict) -> Egresado:
        egresado = Egresado(
            nombres=data["nombres"],
            apellidos=data["apellidos"],
            tipoDoc=data["tipoDoc"],
            numDoc=data["numDoc"],
            email=data["email"],
            telefono=data["telefono"],
            fechaNacimiento=data["fechaNacimiento"],
            direccion=data.get("direccion"),
            nacionalidad=data.get("nacionalidad"),
            habilidades=data.get("habilidades"),
            logrosAcademicos=data.get("logrosAcademicos"),
            certificados=data.get("certificados"),
            experienciaLaboral=data.get("experienciaLaboral"),
            idiomas=data.get("idiomas"),
            linkedin=data.get("linkedin"),
            github=data.get("github"),
            cv=data.get("cv"),
            disponibilidad=data.get("disponibilidad", True),
        )
        return self.egresado_repository.registrar_egresado(egresado)

    def obtener_egresados(self) -> list:
        return self.egresado_repository.obtener_egresados()

    def obtener_egresado_por_id(self, id: int) -> Egresado | None:
        return self.egresado_repository.obtener_egresado_por_id(id)

    def actualizar_egresado(self, id: int, data: dict) -> Egresado | None:
        egresado = self.egresado_repository.obtener_egresado_por_id(id)
        if not egresado:
            raise HTTPException(status_code=404, detail="Egresado no encontrado")

        update_data = {key: value for key, value in data.items() if value is not None}

        for key, value in update_data.items():
            setattr(egresado, key, value)

        return self.egresado_repository.actualizar_egresado(egresado)

    def eliminar_egresado(self, id: int) -> bool:
        return self.egresado_repository.eliminar_egresado(id)
