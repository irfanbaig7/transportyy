# MERN Stack Project

**M**ongoDB · **E**xpress · **R**eact (Vite + Tailwind) · **N**ode

```
chalo/
├── client/    → React + Vite + Tailwind  (runs on http://localhost:5173)
└── server/    → Express + MongoDB        (runs on http://localhost:5000)
```

---

## Requirements

- **Node.js** installed (v18 ya usse upar). Check karo: `node -v`
- Ek **MongoDB URI** — ya to local MongoDB (`mongodb://127.0.0.1:27017/mern_app`),
  ya free **MongoDB Atlas** cluster ka connection string.

---

## Setup — sirf 2 baar `npm install` karna hai

### 1) Server chalao (backend)

```bash
cd server
npm install
```

Ab apna MongoDB URI paste karo `server/.env` file me:

```
PORT=5000
MONGO_URI=paste-your-mongodb-uri-here   ← yaha apna URI daalo
```

Phir server start karo:

```bash
npm run dev
```

Server chalega 👉 **http://localhost:5000**
Test: browser me `http://localhost:5000/api/health` kholo.

> Note: URI paste na karo tab bhi server chal jayega, bas MongoDB "disconnected"
> dikhayega. URI paste karke server restart karte hi connect ho jayega.

### 2) Client chalao (frontend) — naye terminal me

```bash
cd client
npm install
npm run dev
```

Frontend chalega 👉 **http://localhost:5173**

Bas! Dono terminals chalu rakho. Browser me **http://localhost:5173** kholo —
page pe server aur MongoDB dono ka status live dikhega, aur "Items" section se
tum data MongoDB me add/delete karke test kar sakte ho.

---

## Kaise connect hota hai?

Frontend se jo bhi request `/api/...` pe jaati hai, use Vite automatically
backend (`http://localhost:5000`) pe bhej deta hai (`client/vite.config.js` me
proxy set hai). Isliye CORS ki tension nahi.

## API endpoints

| Method | Endpoint          | Kaam                                  |
| ------ | ----------------- | ------------------------------------- |
| GET    | `/api/health`     | Server + DB status                    |
| GET    | `/api/items`      | Saare items list karo                 |
| POST   | `/api/items`      | Naya item banao — body: `{ "name" }`  |
| DELETE | `/api/items/:id`  | Item delete karo                      |

## Production build (optional)

```bash
cd client
npm run build      # dist/ folder banega
```
