const express = require("express");
const app = express();
const db = require("./database");
const cors = require("cors");
const port = 3001;
const moment = require("moment");
const hostname = "192.168.19.197";
// const hostname = "localhost";

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/get-status", (req, res) => {
  let query = "SELECT * FROM ref_status";
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.get("/get-status/:id", (req, res) => {
  let query = `SELECT * FROM ref_status WHERE id = ${req.params.id}`;
  db.query(query, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.json(results[0]);
  });
});

app.put("/status/:id", (req, res) => {
  let { status, biaya, created_date, created_by, updated_date, updated_by } =
    req.body;
  const status_id = req.params.id;
  const query = "UPDATE ref_status SET status = ?, biaya = ? WHERE id = ?";
  const values = [status, biaya, status_id];

  db.query(query, values, (err, results) => {
    if (err) throw err;
    res.status(201).json({ status: 200, message: "Status berhasil diupdate" });
  });
});

app.post("/status", (req, res) => {
  let { status, biaya, created_date, created_by, updated_date, updated_by } =
    req.body;
  const status_id = req.params.id;
  const query = "INSERT INTO ref_status (status, biaya) VALUES (?, ?)";
  const values = [status, biaya];

  db.query(query, values, (err, results) => {
    if (err) throw err;
    res.status(201).json({
      status: 200,
      message: "Status berhasil menambahkan data status",
    });
  });
});

// ANGGOTA
app.get("/get-anggota", (req, res) => {
  let query =
    "SELECT a.*, b.status, b.biaya FROM ref_anggota as a LEFT JOIN ref_status as b ON a.status_id = b.id";
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post("/anggota", (req, res) => {
  let { anggota, status } = req.body;
  const query =
    "INSERT INTO ref_anggota (nama, status_id, active) VALUES (?, ?, ?8)";
  const values = [anggota, status, 1];
  db.query(query, values, (err, results) => {
    if (err) throw err;
    res.status(201).json({
      status: 200,
      message: "Status berhasil menambahkan data anggota",
    });
  });
});

app.get("/get-anggota/:id", (req, res) => {
  const query = `SELECT * FROM ref_anggota WHERE id = ${req.params.id}`;
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
});

app.put("/anggota/:id", (req, res) => {
  let { anggota, status } = req.body;
  const anggota_id = req.params.id;
  const values = [anggota, status, anggota_id];
  const query = `UPDATE ref_anggota SET nama = ?, status_id = ? WHERE id = ?`;
  db.query(query, values, (err, rasult) => {
    if (err) throw err;
    res.status(201).json({ status: 200, message: "Berhasil mengubah anggota" });
  });
});

// TAHUN
app.get("/get-tahun", (req, res) => {
  let query = "SELECT a.* FROM ref_tahun as a";
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// BULAN
app.get("/get-bulan", (req, res) => {
  let query = "SELECT a.* FROM ref_bulan as a";
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// PEMBAYARAN

app.post("/pembayaran", (req, res) => {
  let { anggota_id, tahun_id, bulan_id, tipe_transaksi, nominal, keterangan } =
    req.body;
  const sql_cek = `SELECT a.nominal, b.nama, c.tahun, d.bulan FROM trans_pembayaran a
  JOIN ref_anggota b ON a.anggota_id = b.id
  JOIN ref_tahun c ON a.tahun_id = c.id
  JOIN ref_bulan d ON a.bulan_id = d.id
  WHERE anggota_id = ${anggota_id} AND tahun_id = ${tahun_id} AND bulan_id = ${bulan_id}`;

  const query =
    "INSERT INTO trans_pembayaran (anggota_id, tahun_id, bulan_id, tipe_transaksi, nominal, status, created_date, keterangan) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  let today = moment().format("YYYY-MM-DD HH:mm:ss");
  const values = [
    parseInt(anggota_id),
    tahun_id,
    bulan_id,
    tipe_transaksi,
    parseInt(nominal),
    1,
    today,
    keterangan,
  ];

  let dt_anggota;
  db.query(sql_cek, (err, result) => {
    if (err) throw err;
    dt_anggota = result[0];
    if (result.length == 0) {
      db.query(query, values, (err, results) => {
        if (err) throw err;
        res.status(200).json({
          status: 200,
          message: "Berhasil menyimpan data pembayaran",
        });
      });
    } else {
      res.status(200).json({
        status: 400,
        message: `Anggota dengan nama ${dt_anggota.nama} telah membayar uang kas tahun ${dt_anggota.tahun}, bulan ${dt_anggota.bulan} sebesar ${dt_anggota.nominal}`,
      });
    }
  });
});

app.get(`/get-pembayaran-det/:id/:tahun`, (req, res) => {
  const sql = `SELECT a.*, b.nominal, b.created_date, c.tahun FROM ref_bulan a 
  LEFT JOIN trans_pembayaran b ON a.id = b.bulan_id AND b.anggota_id = ${req.params.id} AND b.tahun_id = ${req.params.tahun}
  LEFT JOIN ref_tahun c ON b.tahun_id = c.id
  ORDER BY a.id`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    for (let i = 0; i < result.length; i++) {
      result[i].created_date = moment(result.created_date).format(
        "YYYY-MM-DD HH:mm:ss"
      );
    }
    res.status(200).json(result);
  });
});

// RIWAYAT
app.get("/get-riwayat", (req, res) => {
  const query = `SELECT b.nama as nama_anggota, a.nominal, a.created_date, a.tipe_transaksi
  FROM trans_pembayaran a 
  LEFT JOIN ref_anggota b ON a.anggota_id = b.id ORDER BY a.id DESC`;
  db.query(query, (err, result) => {
    if (err) throw err;
    for (let i = 0; i < result.length; i++) {
      result[i].created_date = moment(result[i].created_date).format(
        "YYYY-MM-DD HH:mm:ss"
      );
    }
    res.json(result);
  });
});

// DASHBOARD
app.get("/get-saldo", (req, res) => {
  const sql_pemasukan = `SELECT SUM(nominal) as saldo FROM trans_pembayaran WHERE tipe_transaksi = 'pemasukan'`;
  const sql_pengeluaran = `SELECT SUM(nominal) as saldo FROM trans_pembayaran WHERE tipe_transaksi = 'pengeluaran'`;
  db.query(sql_pemasukan, (err, result) => {
    if (err) throw err;
    res.json(result[0]);
  });
});

app.get("/get-transaksi-hari-ini", (req, res) => {
  const query = `SELECT a.id, b.nama as nama_anggota, a.nominal, a.tipe_transaksi, a.created_date 
  FROM trans_pembayaran a 
  LEFT JOIN ref_anggota b ON a.anggota_id = b.id
  ORDER BY a.id DESC LIMIT 5`;
  db.query(query, (err, result) => {
    if (err) throw err;
    for (let i = 0; i < result.length; i++) {
      result[i].created_date = moment(result[i].created_date).format(
        "YYYY-MM-DD HH:mm:ss"
      );
    }
    res.json(result);
  });
});

// LOGIN
app.post(`/auth`, (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT a.*, c.status FROM sec_user a 
  LEFT JOIN ref_anggota b ON a.anggota_id = b.id
  LEFT JOIN ref_status c ON b.status_id = c.id WHERE a.username = '${username}'`;
  db.query(query, (err, result) => {
    if (err) throw err;
    if (result.length > 0 && result[0].password == password) {
      res.json({
        status: 200,
        message: "Berhasil Login",
        result,
      });
    } else {
      res.json({
        status: 400,
        message: "Username atau Password yang anda masukan salah!",
      });
    }
  });
});

app.put(`/profile/:id`, (req, res) => {
  const id = req.params.id;
  const { full_name } = req.body;
  const query = `UPDATE sec_user SET full_name = ? WHERE id = ?`;
  const values = [full_name, id];

  db.query(query, values, (err, results) => {
    if (err) throw err;
    res.status(200).json({
      status: 200,
      message: "Berhasil merubah nama lengkap",
    });
  });
});

// PEMASUKAN
app.get(`/get-pemasukan`, (req, res) => {
  const sql = `SELECT SUM(nominal) as pemasukan FROM trans_pembayaran WHERE DATE(created_date) = CURRENT_DATE() AND tipe_transaksi = 'pemasukan'`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.status(200).json(result[0]);
  });
});

// PEMASUKAN
app.get(`/get-pengeluaran`, (req, res) => {
  const sql = `SELECT SUM(nominal) as pengeluaran FROM trans_pembayaran WHERE DATE(created_date) = CURRENT_DATE() AND tipe_transaksi = 'pengeluaran'`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.status(200).json(result[0]);
  });
});

app.listen(port, hostname, () => {
  //   console.log(`Example app listening on port ${port}`);
  console.log(`Server berjalan di http://${hostname}:${port}/`);
});
