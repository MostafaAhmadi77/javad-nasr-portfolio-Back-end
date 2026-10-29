# Javad Nasr Portfolio — Backend API

![Project Banner](https://raw.githubusercontent.com/MostafaAhmadi77/javad-nasr-portfolio-Back-end/main/public/banner.png)

A modular RESTful API built with **Node.js, Express.js, and MongoDB** to manage portfolio articles, content, and image uploads.

## Overview

Javad Nasr Portfolio Backend provides the server-side functionality for managing portfolio articles. It offers structured API endpoints, data validation, secure image uploads, and centralized error handling.

The project follows a modular architecture designed to keep the codebase maintainable, organized, and easy to extend.

## Features

- **RESTful API:** Create, retrieve, and delete articles.
- **MongoDB Integration:** Store and manage article data using Mongoose.
- **Request Validation:** Validate incoming data with Yup and Mongoose schema constraints.
- **Image Uploads:** Upload article images using Multer with file type and size restrictions.
- **Secure File Handling:** Generate unique filenames to prevent naming conflicts.
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

## API Reference

Base URL:

```text
http://localhost:3000/api/v1
```

| Method | Endpoint | Description |
|---|---|---|
| POST | `/articles` | Create an article with an optional image |
| GET | `/articles` | Retrieve all articles |
| DELETE | `/articles/:id/remove` | Delete an article by ID |
| GET | `/uploads/:filename` | Access an uploaded image |

### Article Fields

| Field | Type | Description |
|---|---|---|
| `title` | String | Required, unique article title |
| `summary` | String | Required short summary |
| `description` | String | Required full article content |
| `picture` | File / String | Optional article image |
| `status` | String | `PUBLISHED` or `DRAFT` |
| `tags` | String | Article category or tag |

### Image Upload Restrictions

- Maximum file size: **2 MB**
- Supported formats: JPEG, PNG, and WebP
- Uploaded filenames are generated using UUIDs.

## Error Handling

The API uses consistent error handling for common scenarios:

| Status Code | Description |
|---|---|
| `400` | Invalid image or upload error |
| `404` | Article or resource not found |
| `409` | Duplicate article title |
| `422` | Validation error or invalid MongoDB ObjectId |
| `500` | Internal server error |

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

## Author

**Javad Nasr Portfolio — Backend API**

Repository: [GitHub](https://github.com/MostafaAhmadi77/javad-nasr-portfolio-Back-end)
