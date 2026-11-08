// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
package main

import (
	"embed"
	"fmt"
	"io/fs"
	"net"
	"net/http"
	"os"
	"os/exec"
	"os/signal"
	"runtime"
	"syscall"
	"time"
)

//go:embed all:web
var webFS embed.FS

func openBrowser(url string) error {
	var cmd string
	var args []string

	switch runtime.GOOS {
	case "windows":
		cmd = "rundll32"
		args = []string{"url.dll,FileProtocolHandler", url}
	case "darwin":
		cmd = "open"
		args = []string{url}
	default: // "linux", "freebsd", "openbsd", "netbsd"
		cmd = "xdg-open"
		args = []string{url}
	}
	return exec.Command(cmd, args...).Start()
}

func main() {
	fmt.Println("==================================================================")
	fmt.Println("   NOTULENJMM - MPK SMK NEGERI 13 BANDUNG (v0.8.0)")
	fmt.Println("   Sistem Manajemen Risalah Sidang & Dokumentasi Digital")
	fmt.Println("   Karya: Davin Maritza | Lisensi: MIT License")
	fmt.Println("==================================================================")

	subFS, err := fs.Sub(webFS, "web")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading embedded assets: %v\n", err)
		os.Exit(1)
	}

	// Try default port 3000, fallback to random free port if busy
	listener, err := net.Listen("tcp", "127.0.0.1:3000")
	if err != nil {
		listener, err = net.Listen("tcp", "127.0.0.1:0")
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error binding local port: %v\n", err)
			os.Exit(1)
		}
	}

	port := listener.Addr().(*net.TCPAddr).Port
	appURL := fmt.Sprintf("http://127.0.0.1:%d", port)

	fileServer := http.FileServer(http.FS(subFS))
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "SAMEORIGIN")
		fileServer.ServeHTTP(w, r)
	})

	server := &http.Server{}

	go func() {
		if err := server.Serve(listener); err != nil && err != http.ErrServerClosed {
			fmt.Fprintf(os.Stderr, "Server error: %v\n", err)
		}
	}()

	fmt.Printf("[+] Server desktop aktif pada: %s\n", appURL)
	fmt.Println("[+] Membuka NotulenJMM di peramban sistem...")
	fmt.Println("[+] Tekan Ctrl+C untuk menutup aplikasi.")
	fmt.Println("==================================================================")

	time.Sleep(300 * time.Millisecond)
	_ = openBrowser(appURL)

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)
	<-sigChan

	fmt.Println("\n[*] Menutup NotulenJMM Desktop. Sampai jumpa!")
}
