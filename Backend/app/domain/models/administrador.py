from .usuario import Usuario


class Administrador(Usuario):
    def __init__(
        self,
        id: int,
        username: str,
        password: str,
        email: str,
        rol: str,
        nombres: str,
        apellidos: str,
        telefono: str,
        tipo_doc: str,
        num_doc: str
    ):
        super().__init__(id, username, password, email, rol)
        self.nombres = nombres
        self.apellidos = apellidos
        self.telefono = telefono
        self.tipo_doc = tipo_doc
        self.num_doc = num_doc

    def __repr__(self):
        return (
            f"<Administrador(id={self.id}, username={self.username}, "
            f"nombres={self.nombres}, apellidos={self.apellidos})>"
        )
