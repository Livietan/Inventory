package main

import (
	"context"
	"crypto/md5"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
)

type USER struct {
	Status bool `json:"Status"`
	FirstName string `json:"FirstName"`
	LastName  string `json:"LastName"`
	Signature string `json:"Signature"`
	Password  string `json:"Password"`
}

type ITEM struct {
	Signature string `json:"Signature"`
	NameItem string `json:"NameItem"`
	TypeItem string `json:"TypeItem"`
	AmountItem string `json:"AmountItem"`
	PriceItem string `json:"PriceItem"`
	Total string `json:"Total"`
	Value string `json:"Value"`
}

type SHIPPING struct {
	SignatureSend string `json:"SignatureSend"`
	SignatureRecieve string `json:"SignatureRecieve"`
	NameItem string `json:"NameItem"`
	TypeItem string `json:"TypeItem"`
	AmountItem string `json:"AmountItem"`
}

type TRANSACTION struct {
	Transaction_Signature string `json:"Transaction_Signature"`
	Sender string `json:"Sender"`
	Reciever string `json:"Reciever"`
	Direction string `json:"Direction"`
	NameItem string `json:"NameItem"`
	TypeItem string `json:"TypeItem"`
	Amount string `json:"Amount"`
	Price string `json:"Price"`
	Time string `json:"Time"`
}

type ResponseServer struct {
	Status bool   `json:"Status"`
	Detail string `json:"Detail"`
}

var database *pgxpool.Pool
func main() {
	connectDB()
	defer database.Close()

	http.HandleFunc("/register", Register)
	http.HandleFunc("/login", Login)
	http.HandleFunc("/insert", InsertITEMS)
	http.HandleFunc("/GetStatItem", GetStatItem)
	http.HandleFunc("/GetItems", GetData)
	http.HandleFunc("/Delete", Delete)
	http.HandleFunc("/Update", Update)
	http.HandleFunc("/Shipping", Shipping)

	fmt.Println("Run http://127.0.0.1:8000 OK")
	http.ListenAndServe("127.0.0.1:8000", nil)
	fmt.Println("Stop http://127.0.0.1:8000")
}

func connectDB() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal(err)
	}

	password := os.Getenv("PASSWORD")
	databaseURL := fmt.Sprintf("postgres://postgres:%s@127.0.0.1:5432/inventory", password)

	database, err = pgxpool.New(context.Background(), databaseURL)
	if err != nil {
		log.Println("\nERROR line(95): ", err)
	}

	if Ping := database.Ping(context.Background()); Ping != nil {
		log.Println("\nERROR line(100):", Ping)
	}
	fmt.Println("Connection to database OK")
}

func Register(w http.ResponseWriter, r *http.Request) {
	var user USER

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		log.Println("\nERROR line(119): ", err)
		http.Error(w, "Invalid Body", http.StatusBadRequest)
		return
	}
	Signature := sha256.Sum256([]byte(user.Signature))
	signatureStr := hex.EncodeToString(Signature[:])

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Println("\nERROR line(127): ", err)
		http.Error(w, "Fail to hash password", http.StatusInternalServerError)
		return
	}

	Result, err := database.Exec(context.Background(), "INSERT INTO USERS (FIRSTNAME, LASTNAME, SIGNATURE, PASSWORD) VALUES ($1, $2, $3, $4)",
	user.FirstName, user.LastName, signatureStr, passwordHash)
	if err != nil {
		log.Println("\nERROR line(134): ", err)
		json.NewEncoder(w).Encode(ResponseServer{
			Status: false,
			Detail: "Username Not Aviable",
		})
		return
	}
	if Result.RowsAffected() == 0 {
		json.NewEncoder(w).Encode(ResponseServer{
			Status: false,
			Detail: "Register Fail",
		})
		return
	} else {
		json.NewEncoder(w).Encode(USER{
			Status:    true,
			FirstName: user.FirstName,
			LastName:  user.LastName,
			Signature: signatureStr,
		})
		fmt.Println("Run http://127.0.0.1:8000/register OK")
	}
}

func Login(w http.ResponseWriter, r *http.Request) {
	var user USER
	var first_name, last_name, signature, password string

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		log.Println("\nERROR line(175): ", err)
		http.Error(w, "Invalid Body", http.StatusBadRequest)
		return
	}

	Signature := sha256.Sum256([]byte(user.Signature))
	signatureStr := hex.EncodeToString(Signature[:])

	err := database.QueryRow(context.Background(), "SELECT FIRSTNAME, LASTNAME, SIGNATURE, PASSWORD FROM USERS WHERE SIGNATURE=$1",
	signatureStr).Scan(&first_name, &last_name, &signature, &password)
	if err == pgx.ErrNoRows {
		log.Println("\nERROR line(184): ", err)
		json.NewEncoder(w).Encode(ResponseServer{
			Status: false,
			Detail: "User Not Found",
		})
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(password), []byte(user.Password))
	if err != nil {
		json.NewEncoder(w).Encode(ResponseServer{Status: false, Detail: "Wrong password"})
		return
	}

	json.NewEncoder(w).Encode(USER{
		Status:    true,
		FirstName: first_name,
		LastName:  last_name,
		Signature: signatureStr,
	})
	fmt.Println("Run http://127.0.0.1:8000/login OK")
}

func InsertITEMS(w http.ResponseWriter, r *http.Request) {
	var item ITEM

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
		log.Println("\nERROR line(223): ", err)
		http.Error(w, "Invalid Body", http.StatusBadRequest)
		return
	}

	Result, err := database.Exec(context.Background(), "UPDATE ITEMS SET AMOUNT=$1, PRICE=$2 WHERE SIGNATURE=$3 AND NAMEITEM=$4 AND TYPEITEM=$5",
	item.AmountItem, item.PriceItem, item.Signature, item.NameItem, item.TypeItem)
	if err != nil{
		log.Println("\nERROR line(229)", err)
		return
	}
	if Result.RowsAffected() == 0 {
		Result, err = database.Exec(context.Background(), "INSERT INTO ITEMS (SIGNATURE, NAMEITEM, TYPEITEM, AMOUNT, PRICE) VALUES ($1, $2, $3, $4, $5)",
		item.Signature, item.NameItem, item.TypeItem, item.AmountItem, item.PriceItem)
		if err != nil {
			log.Println("\nERROR line(236): ", err)
			return
		}
		if Result.RowsAffected() == 0 {
			log.Println("\nERROR line(236): ", Result)
			json.NewEncoder(w).Encode(ResponseServer{
				Status: false,
				Detail: "Insert item fail",
			})
			return
		} else {
			json.NewEncoder(w).Encode(ResponseServer{
				Status: true,
			})
			fmt.Println("Run http://127.0.0.1:8000/insert OK")
		}
	} else {
		json.NewEncoder(w).Encode(ResponseServer{
			Status: true,
		})
		fmt.Println("Run http://127.0.0.1:8000/insert OK")
	}
}

func GetStatItem(w http.ResponseWriter, r *http.Request) {
	var user USER
	var total, value string

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		log.Println("\nERROR line(277): ", err)
		http.Error(w, "invalid Body", http.StatusBadRequest)
		return
	}

	err := database.QueryRow(context.Background(), "SELECT COALESCE(SUM(AMOUNT), 0), COALESCE(SUM(AMOUNT * PRICE), 0) FROM ITEMS WHERE SIGNATURE=$1",
	user.Signature,).Scan(&total, &value)
	if err == pgx.ErrNoRows {
		log.Println("\nERROR line(283): ", err)
		json.NewEncoder(w).Encode(ResponseServer{
			Status: false,
			Detail: "Data Not Found",
		})
		return
	}
	json.NewEncoder(w).Encode(ITEM{
		Total: total,
		Value: value,
	})
	fmt.Println("Run http://127.0.0.1:8000/GetStatItem OK")
}


type dataItems struct {
	Status bool `json:"Status"`
	Value1 []ITEM `json:"Value1"`
	Value2 []TRANSACTION `json:"Value2"`
}

func GetData(w http.ResponseWriter, r *http.Request) {
	var item USER

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
		log.Println("\nERROR line(320): ", err)
		http.Error(w, "Invalid Body", http.StatusBadRequest)
		return
	}

	items, err := executeQueryItem(item.Signature)
	if err != nil {
		log.Println(err)
		return
	}
	transactions, err := executeQueryTransaction(item.Signature)
	if err != nil {
		log.Println(err)
		return
	}
	json.NewEncoder(w).Encode(dataItems{
		Status: true,
		Value1: items,
		Value2: transactions,
	})
	fmt.Println("Run http://127.0.0.1:8000/GetItem OK")
}

func Delete(w http.ResponseWriter, r *http.Request) {
	var item ITEM

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
		log.Println("\nERROR line(377): ", err)
		http.Error(w, "Invalid Body", http.StatusBadRequest)
		return
	}

	Result, err := database.Exec(context.Background(), "DELETE FROM ITEMS WHERE SIGNATURE=$1 AND NAMEITEM=$2 AND TYPEITEM=$3",
	item.Signature, item.NameItem, item.TypeItem,)
	if err != nil {
		log.Println("\nERROR line(383): ", err)
		return
	}

	if Result.RowsAffected() == 0 {
		json.NewEncoder(w).Encode(ResponseServer{
			Status: false,
			Detail: "Cannot Delete Item",
		})
		return
	} else {
		json.NewEncoder(w).Encode(ResponseServer{
			Status: true,
		})
		fmt.Println("Run http://127.0.0.1:8000/Delete OK")
	}
}

func Update(w http.ResponseWriter, r *http.Request) {
	var item ITEM

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
		log.Println("\nERROR line(417): ", err)
		http.Error(w, "Invalid Body", http.StatusBadRequest)
		return
	}

	Result, err := database.Exec(context.Background(), "UPDATE ITEMS SET AMOUNT=$1, PRICE=$2 WHERE SIGNATURE=$3 AND NAMEITEM=$4 AND TYPEITEM=$5",
	item.AmountItem, item.PriceItem, item.Signature, item.NameItem, item.TypeItem,)
	if err != nil {
		log.Println("\nERROR line(423): ", err)
		return
	}

	if Result.RowsAffected() == 0 {
		json.NewEncoder(w).Encode(ResponseServer{
			Status: false,
			Detail: "Cannot Update Item",
		})
		return
	} else {
		json.NewEncoder(w).Encode(ResponseServer{
			Status: true,
		})
		fmt.Println("Run http://127.0.0.1:8000/Update OK")
	}
}

func Shipping(w http.ResponseWriter, r *http.Request){
	var shipping SHIPPING
	var amount, price int

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")

	DB, err := database.Begin(context.Background())
	if err != nil {
		log.Println("\nERROR line(453): ", err) 
		return
	}
	defer DB.Rollback(context.Background())

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	
	if err := json.NewDecoder(r.Body).Decode(&shipping); err != nil {
		log.Println("\nERROR line(465): ", err)
		http.Error(w, "Invalid Body", http.StatusBadRequest)
		return
	}

	ResultSelectSend := DB.QueryRow(context.Background(), "SELECT AMOUNT, PRICE FROM ITEMS WHERE SIGNATURE=$1 AND NAMEITEM=$2 AND TYPEITEM=$3",
	shipping.SignatureSend,
	shipping.NameItem,
	shipping.TypeItem).Scan(&amount, &price)

	if ResultSelectSend != nil {
		log.Println("\nERROR line(446): ", ResultSelectSend)
		json.NewEncoder(w).Encode(ResponseServer{
			Status: false,
			Detail: "Item Not Aviable Or DataBase Corrupted",
		})
		return
	}
	sender_amount, err := strconv.Atoi(shipping.AmountItem)
	if err != nil {
		log.Println("\nERROR line(459): ", err)
		return
	}
	rate := amount - sender_amount
	if rate < 0 {
		json.NewEncoder(w).Encode(ResponseServer{
			Status: false,
			Detail: "Cannot send item with amount more than your item",
		})
		return
	} else {
		ResultUpdateSend, err := DB.Exec(context.Background(), "UPDATE ITEMS SET AMOUNT=$1 WHERE SIGNATURE=$2 AND NAMEITEM=$3 AND TYPEiTEM=$4",
		rate, shipping.SignatureSend, shipping.NameItem, shipping.TypeItem)
		if err != nil {
			log.Println("\nERROR line(472): ", err)
			json.NewEncoder(w).Encode(ResponseServer{
				Status: false,
				Detail: "Database Coruppted",
			})
			return
		}
		if ResultUpdateSend.RowsAffected() == 0 {
			json.NewEncoder(w).Encode(ResponseServer{
				Status: false,
				Detail: "SomeThing Wrong",
			})
			return
		} else {
			var AmountRecieve int
			ResultSelectRecieve := DB.QueryRow(context.Background(), "SELECT AMOUNT FROM ITEMS WHERE SIGNATURE=$1 AND NAMEITEM=$2 AND TYPEITEM=$3",
			shipping.SignatureRecieve, shipping.NameItem, shipping.TypeItem).Scan(&AmountRecieve)

			rate = AmountRecieve + sender_amount

			if ResultSelectRecieve != nil {
				ResultInsertRecieve, err := DB.Exec(context.Background(), "INSERT INTO ITEMS (SIGNATURE, NAMEITEM, TYPEITEM, AMOUNT, PRICE) VALUES ($1, $2, $3, $4, $5)",
				shipping.SignatureRecieve, shipping.NameItem, shipping.TypeItem, sender_amount, price)
				if err != nil {
					json.NewEncoder(w).Encode(ResponseServer{
						Status: false,
						Detail: "Database coruppted",
					})
					return
				}
				if ResultInsertRecieve.RowsAffected() == 0 {
					json.NewEncoder(w).Encode(ResponseServer{
						Status: false,
						Detail: "Fail to create item recieve",
					})
					return
				} else {
					request1, err1 := GenerateTransactionHistory(shipping.SignatureSend, shipping.SignatureSend, shipping.SignatureRecieve, "Send", shipping.NameItem, shipping.TypeItem, sender_amount, price, DB)
					request2, err2 := GenerateTransactionHistory(shipping.SignatureRecieve, shipping.SignatureSend, shipping.SignatureRecieve, "Recieve", shipping.NameItem, shipping.TypeItem, sender_amount, price, DB)
					if err1 != nil || err2 != nil {
						log.Println(err1)
						log.Println(err2)
						json.NewEncoder(w).Encode(ResponseServer{
							Status: false,
							Detail: "Database Crash",
						})
						return
					}
					if request1.RowsAffected() == 0 || request2.RowsAffected() == 0 {
						json.NewEncoder(w).Encode(ResponseServer{
							Status: false,
							Detail: "Fail create invoice",
						})
						return
					}
					err = DB.Commit(context.Background())
					if err != nil {
						log.Println("\nERROR line(544): ", err)
					    json.NewEncoder(w).Encode(ResponseServer{
							Status: false,
							Detail: "Commit failed",
						})
						return
					}
					json.NewEncoder(w).Encode(ResponseServer{
						Status: true,
					})
					fmt.Println("Run http://127.0.0.1:8000/Shipping OK")
				}
			} else {
				ResultUpdateRecieve, err := DB.Exec(context.Background(), "UPDATE ITEMS SET AMOUNT=$1 WHERE SIGNATURE=$2 AND NAMEITEM=$3 AND TYPEITEM=$4",
				rate, shipping.SignatureRecieve, shipping.NameItem, shipping.TypeItem)
				if err != nil {
					log.Println("\nERROR line(527): ", err)
					json.NewEncoder(w).Encode(ResponseServer{
						Status: false,
						Detail: "Database coruppted",
					})
					return
				}
				if ResultUpdateRecieve.RowsAffected() == 0 {
					json.NewEncoder(w).Encode(ResponseServer{
						Status: false,
						Detail: "Fail to update item recieve",
					})
					return
				} else {
					request1, err1 := GenerateTransactionHistory(shipping.SignatureSend, shipping.SignatureSend, shipping.SignatureRecieve, "Send", shipping.NameItem, shipping.TypeItem, sender_amount, price, DB)
					if err1 != nil {
						log.Println("\nERROR line(518): ", err1)
						return
					}
					request2, err2 := GenerateTransactionHistory(shipping.SignatureRecieve, shipping.SignatureSend, shipping.SignatureRecieve, "Recieve", shipping.NameItem, shipping.TypeItem, sender_amount, price, DB)
					if err2 != nil {
						log.Println("\nERROR line(518): ", err2)
						return
					}
					if request1.RowsAffected() == 0 || request2.RowsAffected() == 0 {
						json.NewEncoder(w).Encode(ResponseServer{
							Status: false,
							Detail: "Fail create invoice",
						})
						return
					}
					err = DB.Commit(context.Background())
					if err != nil {
						log.Println("\nERROR line(544): ", err)
					    json.NewEncoder(w).Encode(ResponseServer{
							Status: false,
							Detail: "Commit failed",
						})
						return
					}
					json.NewEncoder(w).Encode(ResponseServer{
						Status: true,
					})
					fmt.Println("Run http://127.0.0.1:8000/Shipping OK")
				}
			}
		}
	}
}

// Tool
func GenerateTransactionHistory(owner string, sender string, reciever string, direction string, nameItem string, typeItem string, amount int, price int, DB pgx.Tx) (pgconn.CommandTag, error) {
	time_now := time.Now()
	time_format := time_now.Format("04:15 01-02-2006")
	hashing := md5.Sum([]byte(time_format + owner))

	transaction_id := hex.EncodeToString(hashing[:])

	request, err := DB.Exec(context.Background(), `INSERT INTO LEDGER (TRANSACTION_SIGNATURE, SIGNATURE, SENDER, RECIEVER, DIRECTION, NAMEITEM, TYPEITEM, AMOUNT, PRICE) 
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, transaction_id, owner, sender, reciever, direction, nameItem, typeItem, amount, price)
	if err != nil {
		log.Println("\nERROR line(622): ", err)
		return request, err
	}
	return request, nil
}

func executeQueryItem(signature string) ([]ITEM, error) {
	Data := []ITEM{}
	rows, err := database.Query(context.Background(), "SELECT NAMEITEM, TYPEITEM, AMOUNT, PRICE FROM ITEMS WHERE SIGNATURE=$1",
	signature)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var item ITEM

		err = rows.Scan(
		&item.NameItem,
		&item.TypeItem,
		&item.AmountItem,
		&item.PriceItem)
		if err != nil {
			log.Println(err)
			continue
		}

		Data = append(Data, item)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return Data, nil
}

func executeQueryTransaction(signature string) ([]TRANSACTION, error) {
	Data := []TRANSACTION{}
	rows, err := database.Query(context.Background(), "SELECT TRANSACTION_SIGNATURE, SENDER, RECIEVER, DIRECTION, NAMEITEM, TYPEITEM, AMOUNT, PRICE, TIME FROM LEDGER WHERE SIGNATURE=$1",
	signature)
	
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var Datas TRANSACTION
		var timeData time.Time

		err = rows.Scan(
		&Datas.Transaction_Signature,
		&Datas.Sender,
		&Datas.Reciever,
		&Datas.Direction,
		&Datas.NameItem,
		&Datas.TypeItem,
		&Datas.Amount,
		&Datas.Price,
		&timeData)
		if err != nil {
			log.Println(err)
			continue
		}
		
		Datas.Time = timeData.Format("15:04 02-01-2006")
		Data = append(Data, Datas)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return Data, nil
}