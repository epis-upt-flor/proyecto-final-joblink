from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.domain.models.empresa import Empresa
from app.domain.models.usuario import Usuario


class EmpresaService:
    def listar_empresas(self, db: Session) -> list:
        try:
            return db.query(Empresa).all()
        except Exception as e:
            print(f"Error al listar empresas: {e}")
            return []

    def eliminar_empresa(self, db: Session, empresa_id: int) -> dict:
        empresa = db.query(Empresa).filter(Empresa.id == empresa_id).first()

        if not empresa:
            raise HTTPException(status_code=404, detail="Empresa no encontrada")

        db.delete(empresa)
        db.commit()

        usuario = db.query(Usuario).filter(Usuario.id == empresa_id).first()
        if usuario:
            db.delete(usuario)
            db.commit()

        return {
            "message": "Empresa y usuario asociados eliminados correctamente",
            "empresa_id": empresa_id
        }

    def editar_empresa(self, db: Session, empresa_id: int, nombre: str, ruc: str, telefono: str, logo: str) -> Empresa:
        empresa = db.query(Empresa).filter(Empresa.id == empresa_id).first()

        if not empresa:
            raise HTTPException(status_code=404, detail="Empresa no encontrada")

        empresa.nombre = nombre
        empresa.ruc = ruc
        empresa.telefono = telefono
        empresa.logo = logo

        db.commit()
        db.refresh(empresa)

        return empresa
