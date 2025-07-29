from datetime import date
from app.infrastructure.orm_models import (
    RolORM, EmpresaORM, OfertaORM, EgresadoORM,
    PostulacionORM, ContratoORM
)
from app.domain.models.enum import (
    EstadoContrato, EstadoOferta, EstadoPostulacion, EstadoPubli, TipoDocumento
)

def poblar_datos(db):
    # Poblar rol de empresa
    rol_empresa = RolORM(id=2, nombre="empresa")
    db.add(rol_empresa)

    # Poblar empresa
    empresa = EmpresaORM(
        id=1,
        nombre="Empresa Prueba",
        ruc="12345678901",
        telefono="987654321",
        email="empresa@example.com",
        username="empresa123",
        password="hashedpassword",
        logo="logo.png",
        idRol=rol_empresa.id
    )
    db.add(empresa)

    # Poblar oferta
    oferta = OfertaORM(
        id=1,
        titulo="Backend Developer",
        tipo="Empleo",
        fechaCierre=date(2025, 12, 31),
        area="TI",
        modalidad="Remoto",
        horario="Lunes a viernes",
        vacantes=1,
        experiencia="1 año",
        locacion="Tacna",
        salario=3000.00,
        funciones=["Desarrollo de APIs"],
        requisitos=["Python", "FastAPI"],
        estado=EstadoOferta.ACTIVA.value,
        motivo=None,
        beneficios=["Trabajo remoto", "Bonos"],
        fechaInicio=date.today(),
        tiempo=6,
        fechaPubli=date.today(),
        estadoPubli=EstadoPubli.PUBLICADA.value,
        idEmpresa=empresa.id
    )
    db.add(oferta)

    # Poblar egresado
    egresado = EgresadoORM(
        id=1,
        nombres="Jesús",
        apellidos="Agreda",
        tipoDoc=TipoDocumento.DNI.value,
        numDoc="12345678",
        telefono="999888777",
        fechaNacimiento=date(1998, 1, 1),
        nacionalidad="Peruana",
        email="jesus@example.com",
        direccion="Calle Falsa 123",
        linkedin="https://linkedin.com/in/jesus",
        github="https://github.com/jesus",
        habilidades=["Python", "FastAPI"],
        experienciaLaboral=["Internship"],
        certificados=["Certificado A"],
        idiomas=["Español"],
        disponibilidad=True
    )
    db.add(egresado)

    # Poblar postulación
    postulacion = PostulacionORM(
        id=1,
        idOferta=oferta.id,
        idEgresado=egresado.id,
        fechaRecomendacion=date.today(),
        posicionRanking=1,
        estado=EstadoPostulacion.RECOMENDADO.value
    )
    db.add(postulacion)

    # Poblar contrato
    contrato = ContratoORM(
        id=1,
        idOfertaEgresado=postulacion.id,
        fechaFin=date(2025, 12, 31),
        estado=EstadoContrato.VIGENTE.value
    )
    db.add(contrato)

    db.commit()
