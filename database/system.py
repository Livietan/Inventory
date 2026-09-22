import sqlite3, hashlib
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
    SIGNATURE VARCHAR(64),
    NAMEITEM VARCHAR(16),
    TYPEITEM VARCHAR(16),
    AMOUNT INTEGER,
    PRICE INTEGER
    )
    """)
    connect.commit()
    connect.close()

@app.post("/register")
def main(firstName:str, lastName:str, username:str, password:str):
    connect = sqlite3.connect("data/data.db")
    cursor = connect.cursor()
    try:
        signature = hashlib.sha256(username.encode("utf-8")).hexdigest()
        cursor.execute("""
        INSERT INTO USERS (FIRSTNAME, LASTNAME, SIGNATURE, PASSWORD) VALUES (?, ?, ?, ?)
        """, (firstName, lastName, signature, password))
        connect.commit()
        cursor.execute("SELECT FIRSTNAME, LASTNAME, SIGNATURE, PASSWORD FROM USERS WHERE SIGNATURE=? AND PASSWORD=?", (signature, password))
        result = cursor.fetchone()
        A, B, C, D = result
        return {"status": True, "firstName": A, "lastName": B, "signature": C}
    except Exception as e:
        return {"status": False, "detail": str(e)}
    finally:
        connect.close()

@app.post("/login")
def main(username:str, password:str):
    signature = hashlib.sha256(username.encode("utf-8")).hexdigest()
    connect = sqlite3.connect("data/data.db")
    cursor = connect.cursor()
    cursor.execute("SELECT FIRSTNAME, LASTNAME, SIGNATURE, PASSWORD FROM USERS WHERE SIGNATURE=? AND PASSWORD=?", (signature, password))

    result = cursor.fetchone()
    if result:
        A, B, C, D = result
        return {"status": True, "firstName": A, "lastName": B, "signature": C}
    else:
        return {"status": False, "detail": "password not found or account not aviable"}

@app.post("/GetData")
def main(sign:str):
    connect = sqlite3.connect("data/data.db")
    cursor = connect.cursor()
    cursor.execute("SELECT FIRSTNAME, LASTNAME, SIGNATURE, PASSWORD FROM USERS WHERE SIGNATURE=?", (sign,))
    result = cursor.fetchone()
    if result:
        A, B, C, D = result
        return {"firstName": A, "lastName": B, "signature": C}

@app.post("/GetItems")
def main(username:str):
    connect = sqlite3.connect("data/data.db")
    cursor = connect.cursor()
    cursor.execute("SELECT SIGNATURE, NAMEITEM, TYPEITEM, AMOUNT, PRICE FROM ITEMS WHERE SIGNATURE=?", (username,))
    result = cursor.fetchall()
    data = []
    for owner, nameitem, typeitem, amount, price in result:
        data.append({"nameItem":nameitem, "typeItem": typeitem, "amount": amount, "price": price})
    connect.close()
    if data:
        return {"status": True, "value": data}
    else:
        return {"status": False, "value": []}

@app.post("/AddItem")
def main(signature:str, nameItem:str, typeItem:str, amountItem:int, priceItem:int):
    try:
        connect = sqlite3.connect("data/data.db")
        cursor = connect.cursor()
        cursor.execute("""
        INSERT INTO ITEMS (
        SIGNATURE,
        NAMEITEM,
        TYPEITEM,
        AMOUNT,
        PRICE
        ) VALUES (?, ?, ?, ?, ?)
        """, (signature, nameItem, typeItem, amountItem, priceItem))
        connect.commit()
        connect.close()
        return {"status": True}
    except Exception as e :
        return {"detail": e}