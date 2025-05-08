from sentence_transformers import SentenceTransformer

class GeneradorEmbeddings:
    def __init__(self, modelo: str = "sentence-transformers/paraphrase-MiniLM-L6-v2"):
        self.model = SentenceTransformer(modelo)

    def generar_embedding_egresado(self, egresado):
        if isinstance(egresado, dict):
            texto = f"{egresado.get('nombre', '')} {egresado.get('habilidades', '')} {egresado.get('experiencia_laboral', '')} {egresado.get('certificados', '')} {egresado.get('idiomas', '')} {egresado.get('proyectos', '')}"
        else:
            texto = f"{egresado.nombres} {egresado.habilidades or ''} {egresado.experienciaLaboral or ''} {egresado.certificados or ''} {egresado.idiomas or ''} {egresado.logrosAcademicos or ''}"
        return self.model.encode(texto).tolist()

    def generar_embedding_oferta(self, oferta):
        texto = f"{oferta.titulo} {oferta.funciones or ''} {oferta.requisitos or ''} {oferta.area or ''} {oferta.experiencia or ''}"
        return self.model.encode(texto).tolist()
