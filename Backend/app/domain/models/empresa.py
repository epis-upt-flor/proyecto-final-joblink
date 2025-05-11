from .usuario import Usuario


class Empresa(Usuario):
    def __init__(
        self,
        id: int,
        username: str,
        password: str,
        email: str,
        rol: str,
        nombre: str,
        ruc: str,
        telefono: str,
        logo: str,
        estado: bool
    ):
        super().__init__(id, username, password, email, rol)
        self.nombre = nombre
        self.ruc = ruc
        self.telefono = telefono
        self.logo = logo
        self.estado = estado

    def __repr__(self):
        return f"<Empresa(id={self.id}, nombre={self.nombre}, ruc={self.ruc})>"
