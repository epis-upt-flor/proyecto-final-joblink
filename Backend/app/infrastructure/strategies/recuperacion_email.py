from app.domain.strategies.email_sender import IEmailSender
from email.message import EmailMessage
import smtplib
import os
from datetime import datetime


class RecuperacionEmail(IEmailSender):
    def send(self, to: str, token: str):
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
        recovery_link = f"{frontend_url}/auth/recuperar?token={token}"
        
        msg = EmailMessage()
        msg["Subject"] = "LinkJob - Recuperar contraseña"
        msg["From"] = os.getenv("SMTP_EMAIL")
        msg["To"] = to
        msg.add_header('Content-Type', 'text/html')

        current_year = datetime.now().year
        html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperación de contraseña</title>
    <style>
        body {{ font-family: 'Arial', sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto; }}
        .header {{ background-color: #0078D4; padding: 20px; text-align: center; color: white; }}
        .content {{ padding: 25px; background-color: #ffffff; }}
        .button {{ background-color: #005a9e; color: white !important; padding: 12px 25px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold; }}
        .footer {{ background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666666; border-top: 1px solid #e0e0e0; }}
        .warning {{ color: #d9534f; font-weight: bold; }}
    </style>
</head>
<body>
    <div class="header">
        <h1>Recuperación de contraseña</h1>
    </div>
    
    <div class="content">
        <p>Hola,</p>
        
        <p>Has solicitado restablecer tu contraseña en LinkJob.</p>
        
        <p style="text-align: center; margin: 25px 0;">
            <a href="{recovery_link}" class="button">Restablecer contraseña</a>
        </p>
        
        <p class="warning">Este enlace expirará en 10 minutos.</p>
        
        <p>Si no solicitaste esto, puedes ignorar este mensaje.</p>
    </div>
    
    <div class="footer">
        <p>© {current_year} LinkJob. Todos los derechos reservados.</p>
        <p>
            <a href="https://linkjob.com/privacidad" style="color: #0078D4; text-decoration: none; margin: 0 8px;">Política de Privacidad</a>
            <a href="https://linkjob.com/terminos" style="color: #0078D4; text-decoration: none; margin: 0 8px;">Términos de Servicio</a>
        </p>
        <p style="font-size: 11px; color: #999999; margin-top: 15px;">Este es un mensaje automático, no respondas a este correo.</p>
    </div>
</body>
</html>
        """

        msg.set_content(html_content, subtype='html')
        
        # Versión de texto plano como fallback
        text_content = f"""
Hola,

Has solicitado restablecer tu contraseña en LinkJob.

Haz clic en el siguiente enlace para establecer una nueva contraseña:
{recovery_link}

Este enlace expirará en 10 minutos.

Si no solicitaste esto, puedes ignorar este mensaje.

--
Este es un mensaje automático, no respondas a este correo.
© {current_year} LinkJob. Todos los derechos reservados.
        """
        
        msg.add_alternative(text_content, subtype='text')

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(os.getenv("SMTP_EMAIL"), os.getenv("SMTP_PASS"))
            smtp.send_message(msg)