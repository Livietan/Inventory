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
    cursor.execute("""
    DELETE FROM USER
    """)
    connect.commit()
    connect.close()

@app.get("/register")
def main(firstName:str, lastName:str, username:str, password:str):
    connect = sqlite3.connect("data/data.db")
    cursor = connect.cursor()
    try:
        cursor.execute("""
        INSERT INTO USER (FIRSTNAME, LASTNAME, USERNAME, PASSWORD) VALUES (?, ?, ?, ?)
        """, (firstName, lastName, username, password))
        connect.commit()
        cursor.execute("SELECT FIRSTNAME, LASTNAME, USERNAME, PASSWORD FROM USER WHERE USERNAME=? AND PASSWORD=?", (username, password))
        result = cursor.fetchone()
        first, last, username, password = result
        return {"status": True, "firstName": first, "lastName": last}
    except:
        return {"status": False, "detail": "username is not aviable"}
    finally:
        connect.close()

@app.get("/login")
def main(username:str, password:str):
    connect = sqlite3.connect("data/data.db")
    cursor = connect.cursor()
    cursor.execute("SELECT FIRSTNAME, LASTNAME, USERNAME, PASSWORD FROM USER WHERE USERNAME=? AND PASSWORD=?", (username, password))

    result = cursor.fetchone()
    if result:
        first, last, username, password = result
        return {"status": True, "firstName": first, "lastName": last}
    else:
        return {"status": False, "detail": "password wrong or account not aviable"}
