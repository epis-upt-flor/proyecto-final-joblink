from app.domain.strategies.email_sender import IEmailSender
from email.message import EmailMessage
import smtplib
import os
from datetime import datetime


class BienvenidaEmpresaEmail(IEmailSender):
    def send(self, to: str, password: str, nombre_empresa: str):
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
        login_link = f"{frontend_url}/auth/login"
        
        msg = EmailMessage()
        msg["Subject"] = "LinkJob - Credenciales de acceso"
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
    <title>Bienvenido a LinkJob</title>
    <style>
        body {{ font-family: 'Arial', sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto; }}
        .header {{ background-color: #0078D4; padding: 20px; text-align: center; color: white; }}
        .content {{ padding: 25px; background-color: #ffffff; }}
        .credentials {{ background-color: #F5F9FF; border-left: 4px solid #0078D4; padding: 15px; margin: 20px 0; }}
        .button {{ background-color: #005a9e; color: white !important; padding: 12px 25px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold; }}
        .footer {{ background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666666; border-top: 1px solid #e0e0e0; }}
        .credential-item {{ margin-bottom: 8px; }}
    </style>
</head>
<body>
    <div class="header">
        <h1>¡Bienvenido a LinkJob!</h1>
    </div>
    
    <div class="content">
        <p>Hola,</p>
        
        <p>Tu cuenta ha sido registrada exitosamente en LinkJob. Aquí están tus credenciales de acceso:</p>
        
        <div class="credentials">
            <div class="credential-item"><strong>📧 Usuario:</strong> {nombre_empresa}</div>
            <div class="credential-item"><strong>🔒 Contraseña:</strong> {password}</div>
        </div>
        
        <p style="text-align: center; margin: 25px 0;">
            <a href="{login_link}" class="button">Iniciar Sesión</a>
        </p>
        
        <p>¡Estamos emocionados de tenerte con nosotros!</p>
        
        <p>El equipo de <strong>LinkJob</strong>.</p>
    </div>
    
    <div class="footer">
        <p>© {current_year} LinkJob. Todos los derechos reservados.</p>
        <p>
            <a href="https://linkjob.com/privacidad" style="color: #0078D4; text-decoration: none; margin: 0 8px;">Política de Privacidad</a>
            <a href="https://linkjob.com/terminos" style="color: #0078D4; text-decoration: none; margin: 0 8px;">Términos de Servicio</a>
            <a href="https://linkjob.com/ayuda" style="color: #0078D4; text-decoration: none; margin: 0 8px;">Ayuda</a>
        </p>
        <p>¿Preguntas? Contáctanos en <a href="mailto:soporte@linkjob.com" style="color: #0078D4; text-decoration: none;">soporte@linkjob.com</a></p>
        <p style="font-size: 11px; color: #999999; margin-top: 15px;">Este es un mensaje automático, no respondas a este correo.</p>
    </div>
</body>
</html>
        """

        msg.set_content(html_content, subtype='html')
        
        # Versión de texto plano como fallback
        text_content = f"""
Hola,

Tu cuenta ha sido registrada exitosamente en LinkJob.

Aquí están tus credenciales de acceso:

📧 Usuario: {nombre_empresa}
🔒 Contraseña: {password}

Puedes iniciar sesión aquí: {login_link}

¡Bienvenido a LinkJob!

--
Este es un mensaje automático, no respondas a este correo.
© {current_year} LinkJob. Todos los derechos reservados.
        """
        
        msg.add_alternative(text_content, subtype='text')

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(os.getenv("SMTP_EMAIL"), os.getenv("SMTP_PASS"))
            smtp.send_message(msg)