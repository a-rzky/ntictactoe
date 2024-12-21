const cells = document.querySelectorAll(".cell");
let currentPlayer = "x"; // Pemain aktif
let clueCell = null; // Menyimpan kotak dengan opacity 30%
const winnerModal = document.getElementById("winnerModal");
const winnerText = document.getElementById("winnerText");
const closeModalBtn = document.querySelector(".close-btn");

cells.forEach(cell => {
    cell.addEventListener("click", () => {
        // Jika kotak belum terisi
        if (!cell.classList.contains("x") && !cell.classList.contains("o")) {
            // Tambahkan simbol pemain aktif
            cell.classList.add(currentPlayer);
            cell.textContent = currentPlayer.toUpperCase();

            // Hilangkan clueCell jika ada dan kotak lain yang diklik
            if (clueCell && cell !== clueCell) {
                removeClueCell(); // Hapus kotak random sebelumnya
            }

            // Cek apakah ada pemenang
            const winner = checkWinner();
            if (winner) {
                setTimeout(() => showModal(winner.toUpperCase()), 100);
                return;
            }

            // Cek apakah hanya tersisa 3 kotak kosong
            const emptyCells = Array.from(cells).filter(
                cell =>
                    !cell.classList.contains("x") &&
                    !cell.classList.contains("o")
            );

            if (emptyCells.length === 3) {
                // Tambahkan clue untuk pemain berikutnya
                addClueToRandomCell(currentPlayer === "x" ? "o" : "x");
            }

            // Cek apakah seri
            if (emptyCells.length === 0) {
                setTimeout(() => alert("It's a Draw!"), 100);
                resetGame();
                return;
            }

            // Ganti giliran pemain
            currentPlayer = currentPlayer === "x" ? "o" : "x";
        }
    });
});

// Fungsi untuk menambahkan clue ke kotak random
function addClueToRandomCell(player) {
    const playerCells = Array.from(cells).filter(cell =>
        cell.classList.contains(player)
    );

    if (playerCells.length > 0) {
        // Pilih kotak random dari yang sudah berisi simbol pemain berikutnya
        const randomIndex = Math.floor(Math.random() * playerCells.length);
        clueCell = playerCells[randomIndex];

        // Ubah opacity menjadi 30% sebagai clue
        clueCell.style.opacity = "0.3";
    }
}

// Fungsi untuk menghapus clueCell
function removeClueCell() {
    if (clueCell) {
        clueCell.textContent = ""; // Kosongkan konten teks
        clueCell.classList.remove("x", "o"); // Hapus simbol
        clueCell.style.opacity = "1"; // Reset opacity
        clueCell = null; // Reset clueCell
    }
}

// Fungsi untuk cek pemenang
function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Baris
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Kolom
        [0, 4, 8], [2, 4, 6]             // Diagonal
    ];

    for (let combination of winningCombinations) {
        if (combination.every(index => cells[index].classList.contains("x"))) {
            return "x"; // X menang
        }
        if (combination.every(index => cells[index].classList.contains("o"))) {
            return "o"; // O menang
        }
    }
    return null; // Belum ada yang menang
}

// Fungsi untuk munculkan modal
function showModal(winner) {
    winnerText.textContent = `${winner} Wins!`; // Set teks pemenang
    winnerModal.style.display = "block"; // Tampilkan modal
}

// Event untuk menutup modal
closeModalBtn.addEventListener("click", () => {
    winnerModal.style.display = "none";
    resetGame(); // Reset game setelah modal ditutup
});

// Tambahkan logic close modal jika klik di luar modal
window.addEventListener("click", e => {
    if (e.target === winnerModal) {
        winnerModal.style.display = "none";
        resetGame();
    }
});

// Fungsi untuk reset game
function resetGame() {
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("x", "o");
        cell.style.opacity = "1";
    });
    currentPlayer = "x";
    clueCell = null;
}
