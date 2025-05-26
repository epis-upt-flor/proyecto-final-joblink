from sentence_transformers import SentenceTransformer

class GeneradorEmbeddings:
    def __init__(self, modelo: str = "sentence-transformers/paraphrase-MiniLM-L6-v2"):
        self.model = SentenceTransformer(modelo)

    def generar_embedding_egresado(self, egresado):
        try:
            if isinstance(egresado, dict):
                texto = " ".join([
                    egresado.get('nombre', ''),
                    egresado.get('habilidades', ''),
                    egresado.get('experiencia_laboral', ''),
                    egresado.get('certificados', ''),
                    egresado.get('idiomas', ''),
                    egresado.get('proyectos', '')
                ])
            else:
                texto = " ".join([
                    str(egresado.nombres or ''),
                    str(egresado.habilidades or ''),
                    str(egresado.experienciaLaboral or ''),
                    str(egresado.certificados or ''),
                    str(egresado.idiomas or ''),
                    str(egresado.logrosAcademicos or '')
                ])

            texto = texto.strip()
            if not texto:
                print("⚠️ Texto vacío al generar embedding de egresado.")
                return None

            return self.model.encode(texto).tolist()

        except Exception as e:
            print(f"❌ Error al generar embedding de egresado: {e}")
            return None

    def generar_embedding_oferta(self, oferta):
        try:
            texto = " ".join([
                oferta.titulo or '',
                str(oferta.funciones or ''),
                str(oferta.requisitos or ''),
                oferta.area or '',
                oferta.experiencia or ''
            ]).strip()

            if not texto:
                print("⚠️ Texto vacío al generar embedding de oferta.")
                return None

            return self.model.encode(texto).tolist()

        except Exception as e:
            print(f"❌ Error al generar embedding de oferta: {e}")
            return None

    def generar_embedding_texto(self, texto: str):
        try:
            texto = str(texto or "").strip()
            if not texto:
                print("⚠️ Texto vacío al generar embedding.")
                return None

            return self.model.encode(texto).tolist()

        except Exception as e:
            print(f"❌ Error al generar embedding desde texto: {e}")
            return None
