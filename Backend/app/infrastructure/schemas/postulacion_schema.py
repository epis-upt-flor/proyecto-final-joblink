from pydantic import BaseModel
from datetime import date
from typing import Optional, List
from decimal import Decimal
from app.domain.models.enum import EstadoPostulacion
from app.domain.models.postulacion import Postulacion


class EgresadoMini(BaseModel):
    nombres: str
    apellidos: str


class PostulacionBase(BaseModel):
    idOferta: int
    idEgresado: int
    fechaRecomendacion: date
    posicionRanking: int
    estado: EstadoPostulacion


class PostulacionCreate(PostulacionBase):
    def to_domain(self) -> Postulacion:
        return Postulacion(id=None, **self.model_dump())


class PostulacionUpdate(BaseModel):
    fechaRecomendacion: Optional[date] = None
    posicionRanking: Optional[int] = None
    estado: Optional[EstadoPostulacion] = None

    def to_update_dict(self) -> dict:
        return self.model_dump(exclude_unset=True)


class PostulacionOut(PostulacionBase):
    id: int

    @classmethod
    def from_domain(cls, postulacion: Postulacion):
        return cls(**postulacion.__dict__)

    class Config:
        from_attributes = True


class PostulacionConEgresadoOut(PostulacionOut):
    egresado: Optional[EgresadoMini]


class EmpresaOut(BaseModel):
    id: int
    nombre: str
    logo: Optional[str] = None


class OfertaOut(BaseModel):
    id: int
    titulo: str
    area: str
    fechaCierre: Optional[date]
    estado: str
    locacion: str
    modalidad: str
    salario: Optional[Decimal]
    empresa: EmpresaOut


class EgresadoOut(BaseModel):
    id: int
    nombres: str
    apellidos: str
    email: str
    telefono: Optional[str]
    habilidades: List[str]
    cv: Optional[str] = None


class PostulacionPorEmpresaOut(BaseModel):
    id: int
    fechaRecomendacion: date
    posicionRanking: Optional[int]
    estado: str
    oferta: OfertaOut
    egresado: EgresadoOut

    @classmethod
    def from_orm_model(cls, p):
        return cls(
            id=p.id,
            fechaRecomendacion=p.fechaRecomendacion,
            posicionRanking=p.posicionRanking,
            estado=p.estado,
            oferta=OfertaOut(
                id=p.oferta.id,
                titulo=p.oferta.titulo,
                area=p.oferta.area,
                fechaCierre=p.oferta.fechaCierre,
                estado=p.oferta.estado,
                locacion=p.oferta.locacion,
                modalidad=p.oferta.modalidad,
                salario=p.oferta.salario,
                empresa=EmpresaOut(
                    id=p.oferta.empresa.id,
                    nombre=p.oferta.empresa.nombre,
                    logo=getattr(p.oferta.empresa, "logo", None)
                )
            ),
            egresado=EgresadoOut(
                id=p.egresado.id,
                nombres=p.egresado.nombres,
                apellidos=p.egresado.apellidos,
                email=p.egresado.email,
                telefono=p.egresado.telefono,
                habilidades=p.egresado.habilidades or [],
            )
        )
