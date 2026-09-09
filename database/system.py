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
    CREATE TABLE USERS (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    FIRSTNAME VARCHAR(16),
    LASTNAME VARCHAR(16),
    INVENTORYNAME VARCHAR(16),
    USERNAME VARCHAR(16) UNIQUE,
    PASSWORD VARCHAR(32))
    """)
    connect.commit()
    connect.close()

@app.get("/register")
def main(firstName:str, lastName:str, inventoryName:str, username:str, password:str):
    connect = sqlite3.connect("data/data.db")
    cursor = connect.cursor()
    try:
        cursor.execute("""
        INSERT INTO USERS (FIRSTNAME, LASTNAME, INVENTORYNAME, USERNAME, PASSWORD) VALUES (?, ?, ?, ?, ?)
        """, (firstName, lastName, inventoryName, username, password))
        connect.commit()
        cursor.execute("SELECT FIRSTNAME, LASTNAME, INVENTORYNAME, USERNAME, PASSWORD FROM USERS WHERE USERNAME=? AND PASSWORD=?", (username, password))
        result = cursor.fetchone()
        first, last, inventoryName, username, password = result
        return {"status": True, "firstName": first, "lastName": last, "inventoryName": inventoryName, "username": username}
    except Exception as e:
        return {"status": False, "detail": str(e)}
    finally:
        connect.close()

@app.get("/login")
def main(username:str, password:str):
    connect = sqlite3.connect("data/data.db")
    cursor = connect.cursor()
    cursor.execute("SELECT FIRSTNAME, LASTNAME, INVENTORYNAME, USERNAME, PASSWORD FROM USERS WHERE USERNAME=? AND PASSWORD=?", (username, password))

    result = cursor.fetchone()
    if result:
        first, last, inventoryName, username, password = result
        return {"status": True, "firstName": first, "lastName": last, "inventoryName": inventoryName, "username": username}
    else:
        return {"status": False, "detail": "password not found or account not aviable"}

@app.get("/GetData")
def main(username:str):
    connect = sqlite3.connect("data/data.db")
    cursor = connect.cursor()
    cursor.execute("SELECT FIRSTNAME, LASTNAME, INVENTORYNAME, USERNAME, PASSWORD FROM USERS WHERE USERNAME=?", (username,))
    result = cursor.fetchone()
    if result:
        first, last, inventoryName, username, password = result
        return {"firstName": first, "lastName": last, "inventoryName": inventoryName, "username": username}
        