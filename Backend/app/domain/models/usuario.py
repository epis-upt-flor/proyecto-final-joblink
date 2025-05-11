class Usuario:
    def __init__(
        self,
        id: int,
        username: str,
        password: str,
        email: str,
        rol: str
    ):
        self.id = id
        self.username = username
        self.password = password
        self.email = email
        self.rol = rol

    def __repr__(self):
        return f"<Usuario(id={self.id}, username={self.username}, rol={self.rol})>"
