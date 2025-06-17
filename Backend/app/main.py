from app.infrastructure.routes import auth_routes, egresado_routes, empresa_routes, oferta_routes, recuperacion_routes, postulacion_routes, contrato_routes, recomendador_routes
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware

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

# app.include_router(usuario_routes.router, prefix="/api")
app.include_router(auth_routes.router, prefix="/api")
app.include_router(empresa_routes.router, prefix="/api")
app.include_router(egresado_routes.router, prefix="/api")
app.include_router(oferta_routes.router, prefix="/api")
app.include_router(contrato_routes.router, prefix="/api")
app.include_router(postulacion_routes.router, prefix="/api")
app.include_router(recomendador_routes.router, prefix="/api")
app.include_router(recuperacion_routes.router, prefix="/api")


@app.get("/")
def read_root():
    return {"message": "Sistema de Recomendación en Ejecución."}
