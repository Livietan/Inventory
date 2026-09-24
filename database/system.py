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
    sign = "90cc33a41b541af2c1964e3e10a46088cbdedf63031efaa35d588a698c91193f"
    nameItem = "RTX 4090"
    typeItem = "GPU"
    connect = sqlite3.connect("data/data.db")
    cursor = connect.cursor()
    cursor.execute("SELECT AMOUNT FROM ITEMS WHERE SIGNATURE=? AND NAMEITEM=? AND TYPEITEM=?", (sign, nameItem, typeItem))
    print(cursor.fetchone())
    
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
def main(signature:str):
    connect = sqlite3.connect("data/data.db")
    cursor = connect.cursor()
    cursor.execute("SELECT FIRSTNAME, LASTNAME, SIGNATURE, PASSWORD FROM USERS WHERE SIGNATURE=?", (signature,))
    result = cursor.fetchone()
    if result:
        A, B, C, D = result
        return {"firstName": A, "lastName": B, "signature": C}

@app.post("/GetItems")
def main(signature:str):
    connect = sqlite3.connect("data/data.db")
    cursor = connect.cursor()
    cursor.execute("SELECT SIGNATURE, NAMEITEM, TYPEITEM, AMOUNT, PRICE FROM ITEMS WHERE SIGNATURE=?", (signature,))
    result = cursor.fetchall()
    data = []
    for signature, nameitem, typeitem, amount, price in result:
        data.append({"nameItem":nameitem, "typeItem": typeitem, "amount": amount, "price": price})
    connect.close()
    if data:
        return {"status": True, "value": data}
    else:
        return {"status": False, "value": []}

@app.post("/GetStat")
def main(signature:str):
    try:
        connect = sqlite3.connect("data/data.db")
        cursor = connect.cursor()
        cursor.execute("SELECT SUM(AMOUNT), SUM(PRICE) FROM ITEMS WHERE SIGNATURE=?", (signature,))
        result = cursor.fetchone()
        if result:
            A, B = result
            C = B * A
            return {"amount": A, "price": C}
    except Exception as e:
        return {"amount": 0, "price": 0}
        

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
        return {"status": False, "detail": e}

@app.post("/delete")
def main(signature:str, nameItem:str, typeItem:str):
    try:
        connect = sqlite3.connect("data/data.db")
        cursor = connect.cursor()
        cursor.execute("DELETE FROM ITEMS WHERE SIGNATURE=? AND NAMEITEM=? AND TYPEITEM=?", (signature, nameItem, typeItem))
        connect.commit()
        connect.close()
        return {"status": True}
    except Exception as e :
        return {"status": False, "detail": str(e)}

@app.post("/update")
def main(signature:str, nameItem:str, typeItem:str, amount:str, price:str):
    try:
        connect = sqlite3.connect("data/data.db")
        cursor = connect.cursor()
        cursor.execute("""
        UPDATE ITEMS SET AMOUNT=?, 
        PRICE=?
        WHERE SIGNATURE=? AND NAMEITEM=? AND TYPEITEM=?""",
        (amount, price, signature, nameItem, typeItem))
        connect.commit()
        connect.close()
        return {"status": True}
    except Exception as e:
        return {"status": False, "detail": str(e)}

@app.post("shipping")
def main(signatureSender:str, signatureRecieve:str, nameItem:str, typeItem:str, amount:str):
    connect = sqlite3.connect("data/data.db")
    cursor = connect.cursor()
    cursor.execute("SELECT AMOUNT FROM ITEMS WHERE SIGNATURE=? AND NAMEITEM=? AND TYPEITEM=?", (signatureSender, nameItem, typeItem))
    rate = cursor.fetchone() - amount
    cursor.execute("UPDATE ITEMS SET AMOUNT=? WHERE SIGNATURE=? AND NAMEITEM=? AND TYPEITEM=?" (rate, signatureSender, nameItem, typeItem))
    connect.commit()
    connect.close()