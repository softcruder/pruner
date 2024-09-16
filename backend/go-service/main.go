package main

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"
	"path/filepath"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/joho/godotenv"
)

var collection *mongo.Collection

func main() {
    // Load environment variables from .env file
    err := godotenv.Load()
    if err != nil {
        fmt.Println("Error loading .env file")
        return
    }

    // Create a context with a timeout
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    // Retrieve environment variables
    baseURL := os.Getenv("BASE_URL")
    databaseURL := os.Getenv("DATABASE_URL")
    port := os.Getenv("PORT")

    // Default values (if needed)
    if baseURL == "" {
        baseURL = "http://localhost:8080"
    }
    if databaseURL == "" {
        databaseURL = "mongodb+srv://cluster-dev.dcovz.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority&appName=Cluster-Dev"
    }
    if port == "" {
        port = "8080"
    }

	// Construct the path to the certificate file
	certPath, err := filepath.Abs("X509-cert-8770032064220163901.pem")
	if err != nil {
		log.Fatalf("Failed to get absolute path of certificate: %v", err)
	}

	// Construct the MongoDB connection URI
	uri := fmt.Sprintf("%s&tlsCertificateKeyFile=%s", databaseURL, certPath)

	// Set up the client options
	serverAPIOptions := options.ServerAPI(options.ServerAPIVersion1)
	clientOptions := options.Client().
		ApplyURI(uri).
		SetServerAPIOptions(serverAPIOptions)

	// Connect to MongoDB
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(ctx)

	// Ping the database to verify the connection
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatalf("Failed to ping database: %v", err)
	}

	fmt.Println("Connected to MongoDB!")

    defer client.Disconnect(ctx)

	// Set up the collection
	collection = client.Database("pruner").Collection("urls")

	http.HandleFunc("/shorten", shortenURL)
	http.HandleFunc("/r/", redirectURL)
	log.Println("Starting server on port:", port)
	log.Fatal(http.ListenAndServe((":" + port), nil))
}

// Function to handle shortening URLs and return short ID only
func shortenURL(w http.ResponseWriter, r *http.Request) {
    shortID := generateShortID()
    w.Write([]byte(shortID))
}

func redirectURL(w http.ResponseWriter, r *http.Request) {
	shortID := strings.TrimPrefix(r.URL.Path, "/r/")
	
	var result bson.M
	err := collection.FindOne(context.Background(), bson.M{"short_id": shortID}).Decode(&result)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w, "URL not found", http.StatusNotFound)
		} else {
			log.Printf("Error finding URL: %v", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
		}
		return
	}

	longURL := result["long_url"].(string)
	http.Redirect(w, r, longURL, http.StatusMovedPermanently)
}

func generateShortID() string {
	const length = 8
	randomBytes := make([]byte, length)
	_, err := rand.Read(randomBytes)
	if err != nil {
		log.Printf("Error generating random bytes: %v", err)
		return ""
	}
	
	shortID := base64.URLEncoding.EncodeToString(randomBytes)
	// Remove any trailing '=' and truncate to 6 characters
	shortID = strings.TrimRight(shortID, "=")[:8]
	return shortID
}
