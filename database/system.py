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
    CREATE TABLE ITEMS (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    OWNER VARCHAR(16),
    NAMEITEM VARCHAR(16),
    TYPEITEM VARCHAR(16),
    CATEGORY VARCHAR(16),
    AMOUNT INTEGER,
    PRICE INTEGER)
    """)
    connect.commit()
    connect.close()

@app.post("/register")
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

@app.post("/login")
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

@app.post("/GetData")
def main(username:str):
    connect = sqlite3.connect("data/data.db")
    cursor = connect.cursor()
    cursor.execute("SELECT FIRSTNAME, LASTNAME, INVENTORYNAME, USERNAME, PASSWORD FROM USERS WHERE USERNAME=?", (username,))
    result = cursor.fetchone()
    if result:
        first, last, inventoryName, username, password = result
        return {"firstName": first, "lastName": last, "inventoryName": inventoryName, "username": username}

@app.post("/GetItems")
def main(username:str):
    connect = sqlite3.connect("data/data.db")
    cursor = connect.cursor()
    cursor.execute("SELECT OWNER, NAMEITEM, TYPEITEM, CATEGORY, AMOUNT, PRICE FROM USERS WHERE OWNER=?", (username,))
    result = cursor.fetchall()
    data = []
    for owner, nameitem, typeitem, category, amount, price in result:
        data.append({"owner": owner, "nameItem":nameitem, "typeItem": typeitem, "category": category, "amount": amount, "price": price})
    connect.close()
    return data

@app.post("/mint")
def main(owner:str, nameItem:str, typeItem:str, categoryItem:str, amountItem:int, priceItem:int):
    connect = sqlite3.connect("data/data.db")
    cursor = connect.cursor()
    cursor.execute("""
    INSERT INTO ITEMS (
    OWNER,
    NAMEITEM,
    TYPEITEM,
    CATEGORY,
    AMOUNT,
    PRICE
    ) VALUES (?, ?, ?, ?, ?, ?)
    """, (owner, nameItem, typeItem, categoryItem, amountItem, priceItem))
    connect.commit()
    connect.close()