import random

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Random Number API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://randomnumbergenerator-six.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Random Number API is running. Try GET /api/{minimum}/{maximum}"}


@app.get("/api/{minimum}/{maximum}")
def get_random_number(minimum: int, maximum: int):
    number = random.randint(minimum, maximum)
    return {"number": number}


@app.get("/api/choice")
def get_random_choice(options: str):
    items = [item.strip() for item in options.split(",") if item.strip()]
    if not items:
        return {"error": "No valid options provided"}, 400
    choice = random.choice(items)
    return {"choice": choice}