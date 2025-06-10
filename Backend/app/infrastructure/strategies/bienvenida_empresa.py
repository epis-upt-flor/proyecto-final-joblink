from app.domain.strategies.email_sender import IEmailSender
from email.message import EmailMessage
import smtplib
import os

class BienvenidaEmpresaEmail(IEmailSender):
    def send(self, to: str, password: str, nombre_empresa: str):
        msg = EmailMessage()
        msg["Subject"] = "Bienvenido a LinkJob - Credenciales de acceso"
        msg["From"] = os.getenv("SMTP_EMAIL")
        msg["To"] = to

        msg.set_content(f"""
            Hola {nombre_empresa},

            Tu cuenta ha sido registrada exitosamente en LinkJob.

            Aquí están tus credenciales de acceso:

            📧 Usuario: {to}
            🔒 Contraseña: {password}

            Te recomendamos cambiar la contraseña después de iniciar sesión por primera vez.

            ¡Bienvenido a LinkJob!

            --  
            Este es un mensaje automático, no respondas a este correo.
        """)

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(os.getenv("SMTP_EMAIL"), os.getenv("SMTP_PASS"))
            smtp.send_message(msg)
