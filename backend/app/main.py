from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from . import models  # noqa: F401
from .routers import events, skills, teams, users


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Starter-only schema creation.
    # Replace with Alembic migrations before production.
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="Zimbabwe Cyber Community API",
    version="0.1.0",
    description="Starter backend for a CTF, team-matching and bug-bounty community platform.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this when the frontend is deployed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(skills.router)
app.include_router(events.router)
app.include_router(teams.router)


@app.get("/")
def root():
    return {
        "name": "Zimbabwe Cyber Community API",
        "version": "0.1.0",
        "docs": "/docs",
        "status": "ok",
    }


@app.get("/health")
def health():
    return {"status": "healthy"}
