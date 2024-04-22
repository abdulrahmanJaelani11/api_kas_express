const { CoreApi } = require("midtrans-client");

const core = new CoreApi({
  isProduction: false, // Ubah ke true untuk mode produksi
  serverKey: "SB-Mid-server-W1HGUhhpJ0optximcU5OT_9M", // Ganti dengan Server Key Anda
  clientKey: "SB-Mid-client-DP8SMsONFunaoJn0", // Ganti dengan Client Key Anda
});

module.exports = core;
