const bookForm = document.getElementById("bookForm");
const bookTable = document.getElementById("bookTable");
const loanTable = document.getElementById("loanTable");

let buku = JSON.parse(localStorage.getItem("buku")) || [];
let pinjam = JSON.parse(localStorage.getItem("pinjam")) || [];

function simpanData() {
  localStorage.setItem("buku", JSON.stringify(buku));
  localStorage.setItem("pinjam", JSON.stringify(pinjam));
}


function tampilkanBuku() {
  bookTable.innerHTML = "";
  buku.forEach((b, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${b.judul}</td>
      <td>${b.penulis}</td>
      <td>${b.tahun}</td>
      <td>${b.stok}</td>
      <td>
        <button onclick="pinjamBuku(${index})">Pinjam</button>
        <button onclick="hapusBuku(${index})" class="delete">Hapus</button>
      </td>
    `;
    bookTable.appendChild(row);
  });
}


bookForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const judul = document.getElementById("title").value;
  const penulis = document.getElementById("author").value;
  const tahun = document.getElementById("year").value;
  const stok = document.getElementById("stock").value;

  buku.push({ judul, penulis, tahun, stok: parseInt(stok) });
  simpanData();
  tampilkanBuku();
  bookForm.reset();
});


function hapusBuku(index) {
  if (confirm("Yakin ingin menghapus buku ini?")) {
    buku.splice(index, 1);
    simpanData();
    tampilkanBuku();
  }
}


function pinjamBuku(index) {
  const b = buku[index];
  if (b.stok > 0) {
    const peminjam = prompt("Masukkan nama peminjam:");
    if (!peminjam) return;

    const batasHari = parseInt(prompt("Masukkan batas waktu peminjaman (hari):", "7"));
    if (isNaN(batasHari) || batasHari <= 0) {
      alert("Batas waktu tidak valid!");
      return;
    }

    const hariIni = new Date();
    const jatuhTempo = new Date(hariIni);
    jatuhTempo.setDate(hariIni.getDate() + batasHari);

    pinjam.push({
      judul: b.judul,
      peminjam,
      tanggalPinjam: hariIni.toLocaleDateString("id-ID"),
      batasKembali: jatuhTempo.toLocaleDateString("id-ID"),
      tanggalKembali: null
    });

    b.stok -= 1;
    simpanData();
    tampilkanBuku();
    tampilkanPinjam();
  } else {
    alert("Stok buku habis!");
  }
}


function kembalikanBuku(index) {
  const hariIni = new Date();
  pinjam[index].tanggalKembali = hariIni.toLocaleDateString("id-ID");

  const idxBuku = buku.findIndex(b => b.judul === pinjam[index].judul);
  if (idxBuku !== -1) buku[idxBuku].stok += 1;

  simpanData();
  tampilkanBuku();
  tampilkanPinjam();
}


function statusPinjam(batas, kembali) {
  const hariIni = new Date();
  const batasTgl = new Date(batas);

  if (!kembali && hariIni > batasTgl) {
    return "⛔ Terlambat!";
  } else if (kembali) {
    const tglKembali = new Date(kembali);
    return tglKembali > batasTgl ? "⚠️ Dikembalikan Terlambat" : "✅ Tepat Waktu";
  } else {
    return "⏳ Masih Dipinjam";
  }
}


function tampilkanPinjam() {
  loanTable.innerHTML = "";
  pinjam.forEach((p, index) => {
    const status = statusPinjam(p.batasKembali, p.tanggalKembali);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${p.judul}</td>
      <td>${p.peminjam}</td>
      <td>${p.tanggalPinjam}</td>
      <td>${p.batasKembali}</td>
      <td>${p.tanggalKembali ? p.tanggalKembali : "-"}</td>
      <td>${status}</td>
      <td>
        ${
          !p.tanggalKembali
            ? `<button onclick="kembalikanBuku(${index})" class="return">Kembalikan</button>`
            : "-"
        }
      </td>
    `;
    loanTable.appendChild(row);
  });
}

tampilkanBuku();
tampilkanPinjam();
