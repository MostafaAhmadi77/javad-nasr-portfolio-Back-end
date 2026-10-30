# Javad Nasr Portfolio — Backend API

![Project Banner](https://raw.githubusercontent.com/MostafaAhmadi77/javad-nasr-portfolio-Back-end/main/public/banner.png)

A modular RESTful API built with **Node.js, Express.js, and MongoDB** to manage portfolio articles, dual-image uploads with ordering, reading time calculation, and static asset serving.

## Overview

Javad Nasr Portfolio Backend provides the server-side functionality for managing portfolio articles. It offers structured API endpoints, interactive Swagger documentation, data validation, secure multi-image uploads (Cover + In-content images with explicit ordering), automatic reading time calculation, disk cleanup, and centralized error handling.

The project follows a clean, beginner-friendly yet production-ready architecture designed to keep the codebase easy to understand and extend.

## Features

- **RESTful API:** Create, retrieve, update, and delete articles following REST conventions.
- **Ordered Dual-Image Uploads:** Upload up to 2 images per article with strict ordering:
  - `order: 1` — Primary Cover / Hero image (displayed at the top of the article and on article cards).
  - `order: 2` — In-content image (displayed inside the body of the article between sections).
- **Automatic Reading Time Calculation:** Specify custom reading time (e.g. `12 min read`) or let the backend calculate it automatically based on article length (~200 words per minute).
- **Interactive Swagger Documentation:** Explore and test all API endpoints directly from your browser via Swagger UI (`/api-docs` or `/docs`).
- **Disk File Cleanup:** Automatically deletes obsolete or deleted image files from disk when articles are updated or removed.
- **MongoDB Integration:** Store and manage article data using Mongoose.
- **Request Validation:** Validate incoming data with Yup and Mongoose schema constraints.
- **Secure File Handling:** Generate unique filenames using UUIDs to prevent naming conflicts.
- **Centralized Error Handling:** Consistent error responses for validation errors, duplicates, invalid IDs, and server errors.
- **CORS Configuration:** Configure cross-origin requests for seamless frontend integration.
- **Static File Serving:** Access uploaded article images through dedicated `/uploads` URLs.

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
| POST | `/api/v1/articles` | Create an article with up to 2 ordered images |
| PUT / PATCH | `/api/v1/articles/:id` | Update an existing article and/or its images |
| DELETE | `/api/v1/articles/:id` | Delete an article by ID (removes associated images from disk) |
| DELETE | `/api/v1/articles/:id/remove` | Legacy delete endpoint (maintained for backward compatibility) |
| GET | `/uploads/:filename` | Access an uploaded image |

### Query Parameters for `GET /api/v1/articles`

| Parameter | Type | Description |
|---|---|---|
| `status` | String | Filter by status (`PUBLISHED` or `DRAFT`) |
| `tags` | String | Filter by tag (e.g. `Strategy`, `Leadership`, `AI`) |
| `search` | String | Search keyword in title or summary (case-insensitive) |

### Article Fields

| Field | Type | Description |
|---|---|---|
| `title` | String | Required, unique article title (3-128 chars) |
| `summary` | String | Required short summary / excerpt (20-300 chars) |
| `description` | String | Required full article content (20-10000 chars) |
| `readingTime` | String | Reading duration (e.g. `12 min read`). Auto-calculated if omitted. |
| `readTime` | String | Direct alias of `readingTime` for seamless frontend compatibility |
| `pictures` | Array | Array of image objects: `[{ url: "/uploads/...", order: 1 }, { url: "/uploads/...", order: 2 }]` |
| `picture` | String | Direct URL of primary Cover image (`order: 1`) |
| `status` | String | `PUBLISHED` or `DRAFT` (default: `DRAFT`) |
| `tags` | String | Category tag (default: `Human`) |
| `author` | String | Author name (default: `Javad Nasr`) |

### Image Upload Restrictions

- Maximum number of files: **2 images** per article
- File field name: `pictures` (or `picture`)
- Order 1: Hero / Cover image
- Order 2: In-content image
- Maximum file size: **2 MB** per image
- Supported formats: JPEG, PNG, and WebP
- Uploaded filenames are generated using UUIDs.
- Old image files are automatically deleted from disk on update or article deletion.

## Error Handling

The API uses consistent error handling for common scenarios:

| Status Code | Description |
|---|---|
| `400` | Invalid image format or upload size error |
| `404` | Article or resource not found |
| `409` | Duplicate article title |
| `422` | Validation error or invalid MongoDB ObjectId |
| `500` | Internal server error |

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

## Author

**Javad Nasr Portfolio — Backend API**

Repository: [GitHub](https://github.com/MostafaAhmadi77/javad-nasr-portfolio-Back-end)
