# Event Management Backend (Vercel + MongoDB Atlas)

A lightweight, serverless Express REST API connected to MongoDB Atlas, ready to deploy to **Vercel** with a single click.

---

## 🚀 Step 1: Deploy to Vercel

### Method A: Deploy via GitHub (Recommended)
1. Import your GitHub repository (`viom773929/Event-Management`) in the [Vercel Dashboard](https://vercel.com/new).
2. Vercel automatically detects the project at the root (`package.json` & `vercel.json`).
3. Under **Environment Variables**, add:
   - **Key**: `MONGODB_URI`
   - **Value**: `mongodb+srv://viom773929_db_user:YOUR_PASSWORD@cluster0.vneaw9j.mongodb.net/event_management?retryWrites=true&w=majority`
4. Click **Deploy**. Vercel will provide your live URL (e.g. `https://event-management-*.vercel.app`).

### Method B: Deploy using Vercel CLI
```bash
cd backend
npm install -g vercel
vercel
```
When prompted, set `MONGODB_URI` in the project settings or run `vercel env add MONGODB_URI`.

---

## 📱 Step 2: Connect to Flutter Mobile App

Open the Flutter project's `.env` file and update `BASE_URL`:

```env
BASE_URL=https://your-project.vercel.app
```

That's it! Your Flutter app will now automatically fetch, create, and manage events, tickets, and bookings directly on your MongoDB Atlas database.

---

## 💻 Local Development

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Create `.env` file from `.env.example`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://viom773929_db_user:YOUR_PASSWORD@cluster0.vneaw9j.mongodb.net/event_management?retryWrites=true&w=majority
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`.

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | API Status & Documentation |
| `GET` | `/api/admin/ping` | Health Check |
| `GET` | `/api/v1/events` | List Events (supports `?search=`, `?category=`, `?page=`) |
| `POST` | `/api/v1/events` | Create Event |
| `GET` | `/api/v1/events/:id` | Event Details |
| `GET` | `/api/v1/events/:id/ticket-types` | Ticket types for an event |
| `POST` | `/api/v1/ticket` | Generate Ticket |
| `GET` | `/api/v1/tickets/me` | Logged-in User's Tickets |
| `POST` | `/api/v1/booking` | Initiate Booking / Purchase Ticket |
| `GET` | `/api/v1/booking/:orderId/status` | Check Order Status |
| `GET` | `/api/v4/users/me` | Current User Profile |
| `PUT` | `/api/v4/users/me` | Update User Profile |
