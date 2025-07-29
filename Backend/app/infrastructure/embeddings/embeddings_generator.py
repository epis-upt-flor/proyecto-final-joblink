from sentence_transformers import SentenceTransformer
import torch


class GeneradorEmbeddings:
    _instance = None

    def __new__(cls, modelo: str = "sentence-transformers/paraphrase-MiniLM-L6-v2"):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._init_model(modelo)
        return cls._instance

    def _init_model(self, modelo):
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = SentenceTransformer(modelo)
        try:
            self.model = self.model.to(device)
        except NotImplementedError:
            print("[WARNING] Modelo contiene tensores meta. No se pudo mover a dispositivo. Usando configuración por defecto.")

    def generar_embedding_egresado(self, egresado):
        if isinstance(egresado, dict):
            texto = f"{egresado.get('nombre', '')} {egresado.get('habilidades', '')} {egresado.get('experiencia_laboral', '')} {egresado.get('certificados', '')} {egresado.get('idiomas', '')} {egresado.get('proyectos', '')}"
        else:
            texto = f"{egresado.nombres} {egresado.habilidades or ''} {egresado.experienciaLaboral or ''} {egresado.certificados or ''} {egresado.idiomas or ''} {egresado.logrosAcademicos or ''}"
        return self.model.encode(texto).tolist()

    def generar_embedding_oferta(self, oferta):
        texto = f"{oferta.titulo} {oferta.funciones or ''} {oferta.requisitos or ''} {oferta.area or ''} {oferta.experiencia or ''}"
        return self.model.encode(texto).tolist()