# Javad Nasr Portfolio — Backend API

![Project Banner](https://raw.githubusercontent.com/MostafaAhmadi77/javad-nasr-portfolio-Back-end/main/public/banner.png)

A modular RESTful API built with **Node.js, Express.js, and MongoDB** to manage portfolio articles, content, and image uploads.

## Overview

Javad Nasr Portfolio Backend provides the server-side functionality for managing portfolio articles. It offers structured API endpoints, interactive Swagger documentation, data validation, secure image uploads, file cleanup, and centralized error handling.

The project follows a clean, modular architecture designed to keep the codebase maintainable, organized, and easy for developers at any level to extend.

## Features

- **RESTful API:** Create, retrieve, update, and delete articles following REST conventions.
- **Interactive Swagger Documentation:** Explore and test all API endpoints directly from your browser via Swagger UI (`/api-docs` or `/docs`).
- **MongoDB Integration:** Store and manage article data using Mongoose.
- **Request Validation:** Validate incoming data with Yup and Mongoose schema constraints.
- **Image Uploads & Cleanup:** Upload article images using Multer with file type and size restrictions, and automatically delete old/unused files on update or delete.
- **Secure File Handling:** Generate unique filenames using UUIDs to prevent naming conflicts.
- **Centralized Error Handling:** Handle validation errors, duplicate titles, invalid IDs, and server errors consistently.
- **CORS Configuration:** Configure cross-origin requests for frontend integration.
- **Static File Serving:** Access uploaded article images through dedicated URLs.
- **Environment Configuration:** Manage application settings through environment variables.

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js 5 | Web framework and REST API |
| MongoDB | NoSQL database |
| Mongoose | MongoDB object modeling |
| Swagger UI Express | Interactive API documentation |
| Yup | Request validation |
| Multer | File upload handling |
| dotenv | Environment variable management |
| Nodemon | Development server auto-restart |

## Project Structure

```text
javad-nasr-portfolio-Back-end/
├── public/
│   ├── banner.png
│   └── uploads/
│       └── articles/
├── src/
│   ├── docs/
│   │   └── swagger.js
│   ├── middlewares/
│   │   ├── errorHandler.js
│   │   ├── setHeaders.js
│   │   └── uploader.js
│   ├── models/
│   │   └── articles.js
│   ├── modules/
│   │   └── articles/
│   │       ├── articles.controller.js
│   │       ├── articles.routes.js
│   │       └── articles.validator.js
│   ├── utils/
│   │   └── responses.js
│   ├── app.js
│   └── server.js
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── LICENSE
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or later
- [MongoDB](https://www.mongodb.com/) or a MongoDB Atlas account
- npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/MostafaAhmadi77/javad-nasr-portfolio-Back-end.git
   ```

2. Navigate to the project directory:

   ```bash
   cd javad-nasr-portfolio-Back-end
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/javad-nasr-portfolio
```

Update `MONGO_URI` with your MongoDB Atlas connection string if you use a cloud database.

### Run the Application

Start the development server:

```bash
npm run dev
```

Start the application in production mode:

```bash
npm start
```

The API will be available at:

```text
http://localhost:3000
```

## Swagger API Documentation

Interactive Swagger UI documentation is available at:

```text
http://localhost:3000/api-docs
```

(or automatically redirected from `http://localhost:3000/docs`)

You can explore all endpoints, view request/response schemas, and test endpoints live with the **Try it out** button.

## API Reference

Base URL:

```text
http://localhost:3000/api/v1
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api-docs` | Interactive Swagger API documentation |
| GET | `/health` | Server health check endpoint |
| GET | `/api/v1` | Root API welcome endpoint |
| GET | `/api/v1/articles` | Retrieve all articles (supports `status`, `tags`, and `search` query filters) |
| GET | `/api/v1/articles/:id` | Retrieve a single article by ID |
| POST | `/api/v1/articles` | Create an article with an optional image |
| PUT / PATCH | `/api/v1/articles/:id` | Update an existing article and/or its image |
| DELETE | `/api/v1/articles/:id` | Delete an article by ID (removes associated image from disk) |
| DELETE | `/api/v1/articles/:id/remove` | Legacy delete endpoint (maintained for backward compatibility) |
| GET | `/uploads/:filename` | Access an uploaded image |

### Query Parameters for `GET /api/v1/articles`

| Parameter | Type | Description |
|---|---|---|
| `status` | String | Filter by status (`PUBLISHED` or `DRAFT`) |
| `tags` | String | Filter by tag (`AI`, `Human`, `Assisted`, `Verified`, `Comprehensive`) |
| `search` | String | Search keyword in title or summary (case-insensitive) |

### Article Fields

| Field | Type | Description |
|---|---|---|
| `title` | String | Required, unique article title (3-128 chars) |
| `summary` | String | Required short summary (50-250 chars) |
| `description` | String | Required full article content (50-2000 chars) |
| `picture` | File / String | Optional article image |
| `status` | String | `PUBLISHED` or `DRAFT` (default: `DRAFT`) |
| `tags` | String | `AI`, `Human`, `Assisted`, `Verified`, `Comprehensive` (default: `Human`) |

### Image Upload Restrictions

- Maximum file size: **2 MB**
- Supported formats: JPEG, PNG, and WebP
- Uploaded filenames are generated using UUIDs.
- Unused/old image files are automatically deleted on article update or removal.

## Error Handling

The API uses consistent error handling for common scenarios:

| Status Code | Description |
|---|---|
| `400` | Invalid image format or upload error |
| `404` | Article or resource not found |
| `409` | Duplicate article title |
| `422` | Validation error or invalid MongoDB ObjectId |
| `500` | Internal server error |

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

## Author

**Javad Nasr Portfolio — Backend API**

Repository: [GitHub](https://github.com/MostafaAhmadi77/javad-nasr-portfolio-Back-end)
