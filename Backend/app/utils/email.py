import smtplib
from email.message import EmailMessage
import os

def enviar_email_token(recipient_email: str, token: str):

    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    recovery_link = f"{frontend_url}/recuperar?token={token}"

    msg = EmailMessage()
    msg["Subject"] = "Recuperación de contraseña - LinkJob"
    msg["From"] = os.getenv("SMTP_EMAIL")
    msg["To"] = recipient_email

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
