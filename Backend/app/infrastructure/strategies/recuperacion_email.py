from app.domain.strategies.email_sender import IEmailSender
from email.message import EmailMessage
import smtplib
import os


class RecuperacionEmail(IEmailSender):
    def send(self, to: str, token: str):
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
        recovery_link = f"{frontend_url}/auth/recuperar?token={token}"

        msg = EmailMessage()
        msg["Subject"] = "Recuperación de contraseña - LinkJob"
        msg["From"] = os.getenv("SMTP_EMAIL")
        msg["To"] = to

        msg.set_content(f"""
            Hola,

            Has solicitado restablecer tu contraseña.

            Haz clic en el siguiente enlace para establecer una nueva contraseña:

            {recovery_link}

            Este enlace expirará en 10 minutos.

            Si no solicitaste esto, puedes ignorar este mensaje.
        """)

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(os.getenv("SMTP_EMAIL"), os.getenv("SMTP_PASS"))
            smtp.send_message(msg)
