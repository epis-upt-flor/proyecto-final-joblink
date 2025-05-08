from app.observers.usuario_observer import UsuarioObserver
from app.factory.email_factory import EmailFactory
from app.models.usuario import Usuario


class BienvenidaObserver(UsuarioObserver):
    def notificar(self, usuario: Usuario, password: str):
        sender = EmailFactory.get("bienvenida")
        sender.send(
            to=usuario.email,
            password=password,
            nombre_empresa=getattr(
                usuario, "nombre", usuario.username)
        )
