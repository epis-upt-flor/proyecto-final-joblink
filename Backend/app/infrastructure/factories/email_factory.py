from app.infrastructure.strategies.recuperacion_email import RecuperacionEmail
from app.infrastructure.strategies.email_strategy import EmailStrategy
from app.infrastructure.strategies.bienvenida_empresa import BienvenidaEmpresaEmail

class EmailFactory:
    @staticmethod
    def get(tipo: str) -> EmailStrategy:
        if tipo == "recuperacion":
            return RecuperacionEmail()
        elif tipo == "bienvenida":
            return BienvenidaEmpresaEmail()
        raise ValueError(f"Tipo de email no soportado: {tipo}")
