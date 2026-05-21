# ☕ Black Energie | Luxury Coffee Experience

Black Energie is a premium e-commerce platform designed for a high-end coffee brand. It features a sophisticated, dark-themed user interface, a comprehensive administrative dashboard, and a secure backend architecture designed for performance and reliability.

## 🌟 Key Features

### User Experience
- **Luxury Product Catalog**: A visually stunning shop featuring single-origin beans and curated packs.
- **Premium Magazine**: A dedicated content section for coffee lifestyle and science.
- **Dynamic Pricing**: Support for multiple weight options (e.g., 250g, 500g, 1kg) per product.
- **Rating System**: Real-time customer reviews and star ratings.
- **Fast Order Flow**: Streamlined WhatsApp-integrated checkout for high conversion.

### Administration
- **Secured Dashboard**: JWT-protected analytics and business stats.
- **Catalog Management**: Full CRUD operations for products with automated slug generation and image uploads.
- **Order Tracking**: Manage customer orders and update fulfillment status.
- **OTP Login**: Secure passwordless admin authentication.

## 🛡️ Security Features
- **JWT Authentication**: Protected administrative routes.
- **Input Sanitization**: XSS protection on all user-submitted data.
- **Secure File Uploads**: MIME type validation and size limits for packaging images.
- **SQL Injection Protection**: Parameterized queries using `mysql2`.

## 🚀 Tech Stack

- **Frontend**: React.js, Vite, Framer Motion (Animations), Lucide Icons.
- **Backend**: Node.js, Express.
- **Database**: MySQL (MariaDB).
- **Utilities**: Multer (Uploads), Nodemailer (OTP Service), Axios.

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- MySQL / XAMPP

### 1. Database Setup
1. Create a database named `black_energie`.
2. Import the `black_energie.sql` file provided in the root directory.

### 2. Backend Setup
```bash
cd server
npm install
# Create a .env file with the following variables:
# PORT=5000
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=
# DB_NAME=black_energie
# JWT_SECRET=your_secret_key
# SMTP_USER=your_email
# SMTP_PASS=your_app_password
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

## 📁 Project Structure

```text
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── admin/          # Admin Dashboard views
│   │   ├── user/           # Customer-facing pages
│   │   └── assets/         # Multimedia resources
├── server/                 # Node.js Backend
│   ├── config/             # Database connection
│   ├── controllers/        # Business logic
│   ├── middlewares/        # Auth & Upload security
│   ├── routes/             # API Endpoints
│   └── uploads/            # Product images storage
└── black_energie.sql       # Database schema & seed data
```

## 📜 License
This project is proprietary. All rights reserved by Black Energie.

---
*Crafted for perfection. Fuel your drive.*
