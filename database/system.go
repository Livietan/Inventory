package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Faild to load .env")
	}
	password := os.Getenv("PASSWORD")

	databaseURL := fmt.Sprintf("postgres://postgres:%s@localhost:5432/inventory", password)
	connect, err := pgx.Connect(context.Background(), databaseURL)
	if err != nil {
		log.Fatal(err)
	}
	defer connect.Close(context.Background())
	fmt.Println("connecting to postgresql success")
}