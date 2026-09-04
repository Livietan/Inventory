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

def fetch():
    connect = sqlite3.connect("data/data.db")
    cursor = connect.cursor()
    cursor.execute("SELECT * FROM user")
    for i in cursor:
        print(i)
    connect.close()
    connect.close()

@app.get("/register")
def main(username:str, password:str, role:str):
    connect = sqlite3.connect("data/data.db")
    cursor = connect.cursor()
    try:
        cursor.execute("""
        INSERT INTO user (username, password, role) VALUES (?, ?, ?)
        """, (username, password, role))
        connect.commit()
        return {"status": True, "detail": "valid"}
    except:
        return {"status": False, "detail": "username is not aviable"}
    finally:
        connect.close()

@app.get("/login")
def main():
    pass
