import sqlite3

connect = sqlite3.connect("data/data.db")

cursor = connect.cursor()

cursor.execute("""
CREATE TABLE user (
ID INTEGER PRIMARY KEY AUTOINCREMENT,
username VARCHAR(64),
password VARCHAR(32),
role VARCHAR(16)
);
""")

connect.commit()
connect.close()