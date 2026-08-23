# Sophia Therapy backend

This backend is designed around the existing `index.html` and `admin.html`.

## 1. Install

npm install

## 2. Environment

Create `.env` from `.env.example`.

Required:
- DATABASE_URL
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- ADMIN_USERNAME
- ADMIN_PASSWORD
- ADMIN_API_TOKEN

## 3. Database

Run `schema.sql` against your PostgreSQL database.

For Render PostgreSQL, use the database's connection string as `DATABASE_URL`.

## 4. Render

Build Command:
npm install

Start Command:
npm start

Publish/static-site deployment is NOT enough for this backend. Use a Render Web Service.

## 5. Important frontend change

The existing admin currently uploads the file directly to Cloudinary, then calls POST /api/videos to save metadata. That endpoint is supported here.

However, the existing admin's Book/Services/Users/Payments/Gallery code still uses localStorage in places. To make EVERY device share the same data, those frontend reads/writes must be changed to the API endpoints in this server.

The server already provides:
- /api/services
- /api/images
- /api/videos
- /api/users
- /api/bookings
- /api/payments
- /api/pins
- /api/admin/login
- /api/health
