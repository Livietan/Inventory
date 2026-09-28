package main

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
)

var database *pgxpool.Pool

type ResponseSignature struct {
	Status    bool   `json:"Status"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Signature string `json:"Signature"`
}

type ResponseError struct {
	Status bool   `json:"Status"`
	Detail string `json:"Detail"`
}

func main() {
	connectUSERS()
	defer database.Close()

	http.HandleFunc("/register", Register)
	http.HandleFunc("/login", Login)
	http.HandleFunc("/insert", insertITEMS)
	http.HandleFunc("/GetStatItem", GetStatItem)
	http.HandleFunc("/GetItems", GetItems)
	http.HandleFunc("/Delete", Delete)
	http.HandleFunc("/Update", Update)

	fmt.Println("Run http://127.0.0.1:8000 OK")
	http.ListenAndServe("127.0.0.1:8000", nil)
}

func connectUSERS() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("error: ", err)
	}

	password := os.Getenv("PASSWORD")
	databaseURL := fmt.Sprintf("postgres://postgres:%s@127.0.0.1:5432/inventory", password)

	database, err = pgxpool.New(context.Background(), databaseURL)
	if err != nil {
		log.Fatal("fail to connect database: ", err)
	}

	if errorPing := database.Ping(context.Background()); errorPing != nil {
		log.Fatal("Bad connection: ", errorPing)
	}
	fmt.Println("Connection to database OK")
}

type RegisterJSON struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Signature string `json:"Signature"`
	Password  string `json:"Password"`
}

func Register(w http.ResponseWriter, r *http.Request) {
	var register RegisterJSON
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if err := json.NewDecoder(r.Body).Decode(&register); err != nil {
		http.Error(w, "Invalid Body", http.StatusBadRequest)
		return
	}
	Signature := sha256.Sum256([]byte(register.Signature))
	signatureStr := hex.EncodeToString(Signature[:])

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(register.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Fail to hash password", http.StatusInternalServerError)
		return
	}

	_, err = database.Exec(context.Background(), "INSERT INTO USERS (FIRSTNAME, LASTNAME, SIGNATURE, PASSWORD) VALUES ($1, $2, $3, $4)", register.FirstName, register.LastName, signatureStr, passwordHash)
	if err != nil {
		json.NewEncoder(w).Encode(ResponseError{
			Status: false,
			Detail: "Insert Unsuccess!",
		})
		return
	}
	json.NewEncoder(w).Encode(ResponseSignature{
		Status:    true,
		FirstName: register.FirstName,
		LastName:  register.LastName,
		Signature: signatureStr,
	})
	fmt.Println("Run http://127.0.0.1:8000/register OK")
}

type LoginJSON struct {
	Signature string `json:"Signature"`
	Password  string `json:"Password"`
}

func Login(w http.ResponseWriter, r *http.Request) {
	var login LoginJSON
	var first_name, last_name, signature, password string
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if err := json.NewDecoder(r.Body).Decode(&login); err != nil {
		http.Error(w, "Invalid Body", http.StatusBadRequest)
		return
	}

	Signature := sha256.Sum256([]byte(login.Signature))
	signatureStr := hex.EncodeToString(Signature[:])

	err := database.QueryRow(context.Background(), "SELECT FIRSTNAME, LASTNAME, SIGNATURE, PASSWORD FROM USERS WHERE SIGNATURE=$1", signatureStr).Scan(&first_name, &last_name, &signature, &password)
	if err != nil {
		json.NewEncoder(w).Encode(ResponseError{
			Status: false,
			Detail: "User Not Found",
		})
		log.Println("ERROR: ", err)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(password), []byte(login.Password))
	if err != nil {
		json.NewEncoder(w).Encode(ResponseError{Status: false, Detail: "Wrong password"})
		return
	}

	json.NewEncoder(w).Encode(ResponseSignature{
		Status:    true,
		FirstName: first_name,
		LastName:  last_name,
		Signature: signatureStr,
	})
	fmt.Println("Run http://127.0.0.1:8000/login OK")
}

type InsertItem struct {
	Signature  string `json:"Signature"`
	NameItem   string `json:"NameItem"`
	TypeItem   string `json:"TypeItem"`
	AmountItem string `json:"AmountItem"`
	PriceItem  string `json:"PriceItem"`
}

func insertITEMS(w http.ResponseWriter, r *http.Request) {
	var inserItem InsertItem
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if err := json.NewDecoder(r.Body).Decode(&inserItem); err != nil {
		http.Error(w, "Invalid Body", http.StatusBadRequest)
		return
	}

	_, err := database.Exec(context.Background(), "INSERT INTO ITEMS (SIGNATURE, NAMEITEM, TYPEITEM, AMOUNT, PRICE) VALUES ($1, $2, $3, $4, $5)", inserItem.Signature, inserItem.NameItem, inserItem.TypeItem, inserItem.AmountItem, inserItem.PriceItem)
	if err != nil {
		json.NewEncoder(w).Encode(ResponseError{
			Status: false,
			Detail: "Insert item fail",
		})
		log.Println("ERROR: ", err)
		return
	}
	fmt.Println("Run http://127.0.0.1:8000/insert OK")
}

type DataItem struct {
	Signature string `json:"Signature"`
	Total string `json:"Total"`
	Value string `json:"Value"`
}

func GetStatItem(w http.ResponseWriter, r *http.Request) {
	var dataItem DataItem
	var total, value string
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if err := json.NewDecoder(r.Body).Decode(&dataItem); err != nil {
		http.Error(w, "invalid Body", http.StatusBadRequest)
		return
	}

	err := database.QueryRow(context.Background(), "SELECT SUM(AMOUNT), SUM(PRICE) FROM ITEMS WHERE SIGNATURE=$1", dataItem.Signature,).Scan(&total, &value)
	if err != nil {
		json.NewEncoder(w).Encode(ResponseError{
			Status: false,
			Detail: "Fail to load stat item",
		})
		return
	}
	json.NewEncoder(w).Encode(DataItem{
		Total: total,
		Value: value,
	})
	fmt.Println("Run http://127.0.0.1:8000/GetStatItem OK")
}

type Items struct {
	Signature string `json:"Signature"`
	NameItem string `json:"NameItem"`
	TypeItem string `json:"TypeItem"`
	Amount string `json:"Amount"`
	Price string `json:"Price"`
}

func GetItems(w http.ResponseWriter, r *http.Request) {
	var DataItem Items
	var items []Items

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if err := json.NewDecoder(r.Body).Decode(&DataItem); err != nil {
		http.Error(w, "Invalid Body", http.StatusBadRequest)
		return
	}

	rows, err := database.Query(context.Background(), "SELECT NAMEITEM, TYPEITEM, AMOUNT, PRICE FROM ITEMS WHERE SIGNATURE=$1", DataItem.Signature)
	if err != nil {
		json.NewEncoder(w).Encode(ResponseError{
			Status: false,
			Detail: "Cannot Load items",
		})
		return
	}

	for rows.Next() {
		err = rows.Scan(&DataItem.NameItem, &DataItem.TypeItem, &DataItem.Amount, &DataItem.Price)
		if err != nil {
			continue
		}

		items = append(items, DataItem)
	}
	json.NewEncoder(w).Encode(items)
	fmt.Println("Run http://127.0.0.1:8000/GetItem OK")
}

type ItemDelete struct {
	Signature string `json:"Signature"`
	NameItem string `json:"NameItem"`
	TypeItem string `json:"TypeItem"`
}

func Delete(w http.ResponseWriter, r *http.Request) {
	var itemDelete ItemDelete
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if err := json.NewDecoder(r.Body).Decode(&itemDelete); err != nil {
		http.Error(w, "Invalid Body", http.StatusBadRequest)
		return
	}

	_, err := database.Exec(context.Background(), "DELETE FROM ITEM WHERE SIGNATURE=$1 AND NAMEITEM=$2 AND TYPEITEM=$3", itemDelete.Signature, itemDelete.NameItem, itemDelete.TypeItem,)
	if err != nil {
		json.NewEncoder(w).Encode(ResponseError{
			Status: false,
			Detail: "Cannot Delete Item",
		})
	}
	fmt.Println("Run http://127.0.0.1:8000/Delete OK")
}

type ItemUpdate struct {
	Signature string `json:"Signature"`
	NameItem string `json:"NameItem"`
	TypeItem string `json:"TypeItem"`
	Amount string `json:"Amount"`
	Price string `json:"Price"`
}

func Update(w http.ResponseWriter, r *http.Request) {
	var itemUpdate ItemUpdate
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if err := json.NewDecoder(r.Body).Decode(&itemUpdate); err != nil {
		http.Error(w, "Invalid Body", http.StatusBadRequest)
		return
	}

	_, err := database.Exec(context.Background(), "UPDATE ITEM SET AMOUNT=$1, PRICE=$2 WHERE SIGNATURE=$3 AND NAMEITEM=$4 AND TYPEITEM=$5", itemUpdate.Amount, itemUpdate.Price, itemUpdate.Signature, itemUpdate.NameItem, itemUpdate.TypeItem,)
	if err != nil {
		json.NewEncoder(w).Encode(ResponseError{
			Status: false,
			Detail: "Cannot Update Item",
		})
	}
	fmt.Println("Run http://127.0.0.1:8000/Update OK")
}