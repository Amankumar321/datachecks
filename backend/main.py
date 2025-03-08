from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from routes import users, posts
from database import engine, Base
from fastapi.middleware.cors import CORSMiddleware

# Initialize Database
Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/images", StaticFiles(directory="images"), name="images")

app.include_router(users.router)
app.include_router(posts.router)