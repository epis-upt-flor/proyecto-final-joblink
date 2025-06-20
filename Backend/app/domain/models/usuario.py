class Usuario:
    def __init__(
        self,
        id: int | None,
        username: str,
        email: str,
        password: str,
        idRol: int
    ):
        self.id = id
        self.username = username
        self.email = email
        self.password = password
        self.idRol = idRol
