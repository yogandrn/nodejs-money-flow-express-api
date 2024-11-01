# Cash Flow Record API with Express.js

Proyek ini adalah RESTful API untuk pencatatan keuangan (pemasukan dan pengeluaran) yang dibangun menggunakan **Express.js**. Dikembangkan sebagai bagian dari portofolio saya sebagai Backend Engineer, API ini mendukung autentikasi pengguna, pengelolaan transaksi, dan laporan keuangan.

## Fitur Utama
- **Manajemen Keuangan**: API menyediakan endpoint untuk mengelola pemasukan, pengeluaran, serta melihat dan mengelola histori transaksi.
- **Autentikasi JWT**: Menggunakan **JWT (JSON Web Token)** sebagai mekanisme autentikasi, memastikan keamanan akses ke data pengguna.
- **ORM dengan Sequelize**: Menggunakan **Sequelize** sebagai ORM untuk interaksi dengan basis data **MySQL**, memastikan manajemen data yang efisien dan terstruktur.
  
## Teknologi yang Digunakan
- **Node.js**: Platform backend yang mendukung kinerja aplikasi yang efisien.
- **Express.js**: Framework minimalis untuk membangun RESTful API yang cepat dan fleksibel.
- **JWT (JSON Web Token)**: Digunakan untuk autentikasi pengguna dan pengamanan API.
- **Sequelize**: ORM untuk Node.js yang memudahkan interaksi dengan database MySQL.
- **MySQL**: Basis data relasional yang digunakan untuk menyimpan data transaksi keuangan.

## Instalasi
1. Clone repository ini dengan perintah via CLI atau unduh file `.zip`.
  
2. Instalasi package yang diperlukan
   ```bash
   npm install
4. Copy file `.env.example` ke dalam file `.env`, kemudian pastikan semua key memiliki value. Terutama `JWT_SECRET`.
5. Buat database dengan menjalankan perintah berikut.
   ```bash
   npx sequelize db:create
6. Jalankan database migration untuk membuat table, kemudian jalankan seeder-nya.
   ```bash
   npx sequelize db:migrate
   npx sequelize db:seed:all
7. Jalankan perintah untuk menjalankan aplikasi di local dengan perintah
    ```bash
    npm run dev
