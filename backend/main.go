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

type Register struct {
	FirstName string `json:"first_name"`
	LastName string `json:"last_name"`
	Signature string `json:"Signature"`
	Password string `json:"Password"`
}

type Login struct {
	Signature string `json:"Signature"`
	Password string `json:"Password"`
}

type ResponseSignature struct {
	Status bool `json:"Status"`
	FirstName string `json:"first_name"`
	LastName string `json:"last_name"`
	Signature string `json:"Signature"`
}

type ResponseError struct {
	Status bool `json:"Status"`
	Detail string `json:"Detail"`
}

func main() {
	connect()
	defer database.Close()

	http.HandleFunc("/register", insert)
	http.HandleFunc("/login", access)

	fmt.Println("Run http://127.0.0.1:8000 OK")
	http.ListenAndServe("127.0.0.1:8000", nil)
}

func connect() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("error: ", err)
	}

	password := os.Getenv("PASSWORD")
	databaseURL := fmt.Sprintf("postgres://postgres:%s@127.0.0.1:5432/inventory", password)

	database, err = pgxpool.New(context.Background(), databaseURL)
	if err != nil {
		log.Fatal("fail to connect database: ",err)
	}

	if errorPing := database.Ping(context.Background()); errorPing != nil {
		log.Fatal("Bad connection: ", errorPing)
	}
	fmt.Println("Connection to database OK")
}

func insert(w http.ResponseWriter, r *http.Request) {
	var register Register
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
		Status: true,
		FirstName: register.FirstName,
		LastName: register.LastName,
		Signature: signatureStr,
	})
	fmt.Println("Run http://127.0.0.1:8000/register OK")
}

func access(w http.ResponseWriter, r *http.Request) {
	var login Login
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

	err := database.QueryRow(context.Background(), "SELECT FIRSTNAME, LASTNAME, SIGNATURE, PASSWORD FROM USERS WHERE SIGNATURE=$1", signatureStr,).Scan(&first_name, &last_name, &signature, &password)
	if err != nil {
		json.NewEncoder(w).Encode(ResponseError{
			Status: false,
			Detail: "User Not Found",
		})
		log.Println("Error: ", err)
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