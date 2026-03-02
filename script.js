let data = JSON.parse(localStorage.getItem("lesData")) || [];
let editIndex = -1;

let kuota = {
    "TK-Calistung": 15,
    "SD-Matematika": 15,
    "SD-Bahasa Inggris": 15,
    "SMP-Matematika": 15,
    "SMP-Bahasa Inggris": 15
};

document.getElementById("jenjang").addEventListener("change", function() {
    let paketSelect = document.getElementById("paket");
    paketSelect.innerHTML = '<option value="">-- Pilih Paket Les --</option>';

    if (this.value === "TK") {
        paketSelect.innerHTML += '<option value="Calistung">Calistung</option>';
    }
    if (this.value === "SD") {
        paketSelect.innerHTML += '<option value="Matematika">Matematika</option>';
        paketSelect.innerHTML += '<option value="Bahasa Inggris">Bahasa Inggris</option>';
    }
    if (this.value === "SMP") {
        paketSelect.innerHTML += '<option value="Matematika">Matematika</option>';
        paketSelect.innerHTML += '<option value="Bahasa Inggris">Bahasa Inggris</option>';
    }
});

function daftar() {
    let nama = document.getElementById("nama").value;
    let jenjang = document.getElementById("jenjang").value;
    let jenisKelamin = document.getElementById("jenisKelamin").value;
    let orangTua = document.getElementById("orangTua").value;
    let noHp = document.getElementById("noHp").value;
    let paket = document.getElementById("paket").value;

    if (!nama || !jenjang || !jenisKelamin || !orangTua || !noHp || !paket) {
        alert("Lengkapi semua data!");
        return;
    }

    let key = `${jenjang}-${paket}`;
    let jumlahTerisi = data.filter(d => `${d.jenjang}-${d.paket}` === key && d.status === "Diterima").length;

    let status = "Diterima";
    if (jumlahTerisi >= kuota[key]) {
        status = "Ditolak (Kuota Penuh)";
    }

    if (editIndex === -1) {
        data.push({ nama, jenjang, jenisKelamin, orangTua, noHp, paket, status });
    } else {
        data[editIndex] = { nama, jenjang, jenisKelamin, orangTua, noHp, paket, status };
        editIndex = -1;
    }

    localStorage.setItem("lesData", JSON.stringify(data));

    tampilkanData();
    resetForm();
}

function tampilkanData() {
    let table = document.getElementById("dataTable");
    table.innerHTML = "";

    data.forEach((item, index) => {
        table.innerHTML += `
            <tr>
                <td>${item.nama}</td>
                <td>${item.jenjang}</td>
                <td>${item.jenisKelamin}</td>
                <td>${item.orangTua}</td>
                <td>${item.noHp}</td>
                <td>${item.paket}</td>
                <td>${item.status}</td>
                <td>
                    <button onclick="editData(${index})">Edit</button>
                    <button onclick="hapusData(${index})">Hapus</button>
                </td>
            </tr>
        `;
    });

    tampilkanKuota();
}

function tampilkanKuota() {
    let list = document.getElementById("kuotaList");
    list.innerHTML = "";

    for (let key in kuota) {
        let terisi = data.filter(d => `${d.jenjang}-${d.paket}` === key && d.status === "Diterima").length;
        let sisa = kuota[key] - terisi;

        list.innerHTML += `<li>${key} : Sisa ${sisa} dari ${kuota[key]}</li>`;
    }
}

function editData(index) {
    let item = data[index];

    document.getElementById("nama").value = item.nama;
    document.getElementById("jenjang").value = item.jenjang;

    let event = new Event("change");
    document.getElementById("jenjang").dispatchEvent(event);

    document.getElementById("jenisKelamin").value = item.jenisKelamin;
    document.getElementById("orangTua").value = item.orangTua;
    document.getElementById("noHp").value = item.noHp;
    document.getElementById("paket").value = item.paket;

    editIndex = index;
}

function hapusData(index) {
    if (confirm("Yakin hapus data?")) {
        data.splice(index, 1);
        localStorage.setItem("lesData", JSON.stringify(data));
        tampilkanData();
    }
}

function resetForm() {
    document.getElementById("nama").value = "";
    document.getElementById("jenjang").value = "";
    document.getElementById("jenisKelamin").value = "";
    document.getElementById("orangTua").value = "";
    document.getElementById("noHp").value = "";
    document.getElementById("paket").innerHTML = '<option value="">-- Pilih Paket Les --</option>';
}

tampilkanData();