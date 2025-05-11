from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from app.infrastructure.routes import usuario, auth, empresa, contrato, recuperacion, egresado, oferta, recomendacion

app = FastAPI()

origins = [
    "*"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/favicon.ico", include_in_schema=False)
async def ignore_favicon():
    return Response(status_code=204)

app.include_router(usuario.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(empresa.router, prefix="/api")
app.include_router(egresado.router, prefix="/api")
app.include_router(oferta.router, prefix="/api")
app.include_router(recomendacion.router, prefix="/api")
app.include_router(contrato.router, prefix="/api")
app.include_router(recuperacion.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Sistema de Recomendación en Ejecución."}
