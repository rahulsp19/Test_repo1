# UserHub API

A lightweight Node.js + Express backend service for user management, authentication, and payment processing.

## Features

- User registration and login
- JWT-based authentication
- Password management
- Payment processing
- Database query handling
- Logging system

## Getting Started

```bash
npm install
node src/server.js
```

## API Endpoints

- `POST /api/users/register` — Register a new user
- `POST /api/users/login` — Login
- `GET /api/users/:id` — Get user profile
- `POST /api/payments` — Process a payment
- `GET /api/health` — Health check

## Tech Stack

- Node.js
- Express
- MySQL
- JWT
