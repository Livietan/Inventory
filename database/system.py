import sqlite3
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/register")
def main(username:str, password:str, role:str):
    connect = sqlite3.connect("data/data.db")
    cursor = connect.cursor()
    cursor.execute("""
    INSERT INTO user (username, password, role) VALUES (?, ?, ?)
    """, (username, password, role))
    connect.commit()
    connect.close()

@app.get("/login")
def main():
    pass
