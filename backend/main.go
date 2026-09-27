package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

var database *pgxpool.Pool

type User struct {
	ID string `json:ID`
	FristName string `json:FristName`
	LastName string `json:LastName`
	Signature string `json:Signature`
	Password string `json:Password`
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Faild to load .env")
	}
	password := os.Getenv("PASSWORD")

	databaseURL := fmt.Sprintf("postgres://postgres:%s@localhost:5432/inventory", password)
	connect, err := pgxpool.New(context.Background(), databaseURL)
	if err != nil {
		log.Fatal(err)
	}
	defer connect.Close()

	err = connect.Ping(context.Background())
	if err != nil {
		log.Fatal(err)
	}

	mux := http.NewServeMux()
	mux.HandleFunc("POST /register", register)
}

func register(w http.ResponseWriter, r *http.Request) {
	var user User

	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		log.Fatal(err)
	}

	err = database.QueryRow(
		r.Context(),
		`INSER INTO USERS (
		FIRSTNAME,
		LASTNAME,
		SIGNATURE,
		PASSWORD
		) VALUES ($1, $2, $3, $4)
		RETUNING ID`,
		user.FristName,
		user.LastName,
		user.Signature,
		user.Password,
	).Scan(&user.ID)
	if err != nil{
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
