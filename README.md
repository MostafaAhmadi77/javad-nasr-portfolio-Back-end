<div align="center">Javad Nasr Portfolio — Backend APIA clean, modular RESTful API built with Node.js, Express 5, and MongoDB for managing portfolio articles and media uploads.



License: MIT</div>OverviewJavad Nasr Portfolio — Backend is the server-side application powering the article management system of the portfolio platform (TahaAyati-DevLab/javad-nasr-portfolio-Back-end). It follows a modular architecture separating data models, request validators, upload middlewares, and controllers to deliver predictable JSON responses and secure image handling.Key FeaturesModular Architecture: Feature-based structure under src/modules/articles for clean separation of routes, controllers, and validation schemas.Strict Data Validation: Request payload validation powered by Yup paired with Mongoose schema constraints (trim, minlength, maxlength, enum, and unique indexing).Secure Image Uploads: File handling with Multer, enforcing a 2 MB file size limit, strict MIME-type filtering (image/jpeg, image/png, image/webp), and automatic UUID filename generation.Centralized Error Handling: Unified middleware catching validation errors (422), Multer upload errors (400), duplicate title conflicts (409), invalid ObjectIds (422), and unhandled server exceptions (500).CORS & Static Asset Serving: Pre-configured Cross-Origin Resource Sharing headers and direct static serving for uploaded article images via /uploads.Tech StackCategoryTechnologyVersionPurposeRuntimeNode.jsCommonJSJavaScript server runtimeFrameworkExpress.js^5.2.1Routing, middlewares, and HTTP serverDatabase & ODMMongoDB / Mongoose^9.11.0Schema modeling and database queriesValidationYup^1.7.1Schema-based request body validationFile UploadsMulter^2.4.0multipart/form-data image uploadsEnvironmentDotenv^18.0.6Environment variable managementDevelopmentNodemon^3.1.14Automatic server restarts during developmentProject Structurejavad-nasr-portfolio-Back-end/
├── public/
│   ├── banner.png                      # Project README banner image
│   └── uploads/
│       └── articles/                   # Uploaded article cover images
├── src/
│   ├── middlewares/
│   │   ├── errorHandler.js             # Centralized error-handling middleware
│   │   ├── setHeaders.js               # CORS & HTTP header configuration
│   │   └── uploader.js                 # Multer storage, UUID naming & MIME filter
│   ├── models/
│   │   └── articles.js                 # Mongoose Article schema & model
│   ├── modules/
│   │   └── articles/
│   │       ├── articles.controller.js  # CRUD business logic for articles
│   │       ├── articles.routes.js      # Express router definitions
│   │       └── articles.validator.js   # Yup validation rules
│   ├── utils/
│   │   └── responses.js                # Standardized JSON response helpers
│   ├── app.js                          # Express app configuration & routes
│   └── server.js                       # MongoDB connection & server entry point
├── .env                                # Environment variables (ignored in Git)
├── .gitignore
├── LICENSE
├── package.json
└── README.md
Getting Started1. PrerequisitesEnsure you have the following installed on your machine:Node.js (v18+ recommended)MongoDB (local instance or MongoDB Atlas URI)2. InstallationClone the repository and install dependencies:git clone https://github.com/TahaAyati-DevLab/javad-nasr-portfolio-Back-end.git
cd javad-nasr-portfolio-Back-end
npm install
3. Environment VariablesCreate a .env file in the root directory of the project:PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/javad-nasr-portfolio
4. Running the Server# Run in development mode with Nodemon
npm run dev

# Run in production mode
npm start
API ReferenceBase URL: http://localhost:3000/api/v1MethodEndpointContent-TypeDescriptionPOST/api/v1/articlesmultipart/form-data or application/jsonCreate a new article with an optional imageGET/api/v1/articlesapplication/jsonRetrieve all articles sorted by newest firstDELETE/api/v1/articles/:id/removeapplication/jsonDelete an existing article by its MongoDB IDGET/uploads/:filenameStatic ImageAccess an uploaded article cover imageArticle Schema ConstraintsFieldTypeRequiredConstraints / Allowed ValuesDefaulttitleStringYesUnique, trimmed, 3 to 128 characters—summaryStringYesTrimmed, 50 to 250 characters—descriptionStringYesTrimmed, 50 to 2000 characters—pictureFile / StringNo.jpg, .png, .webp (Max size: 2 MB)nullstatusStringNo"PUBLISHED", "DRAFT""DRAFT"tagsStringNo"AI", "Human", "Assisted", "Verified", "Comprehensive""Human"1. Create Article (POST /api/v1/articles)Sample Request Body (application/json or multipart/form-data){
  "title": "Building Scalable REST APIs with Node.js and Express",
  "summary": "A practical guide to designing clean, maintainable, and high-performance RESTful APIs using Node.js, Express, and MongoDB.",
  "description": "Modern backend development requires a solid architecture that separates routing, validation, and database logic. In this article, we explore how to structure an Express.js application using the modular pattern, implement schema validation with Yup, handle file uploads securely with Multer, and centralize error handling for consistent API responses across all endpoints.",
  "status": "PUBLISHED",
  "tags": "AI"
}
Success Response (201 Created){
  "status": 201,
  "success": true,
  "data": {
    "message": "Article created successfully.",
    "article": {
      "_id": "671f8a2c9d3e4b1a2c3d4e5f",
      "title": "Building Scalable REST APIs with Node.js and Express",
      "summary": "A practical guide to designing clean, maintainable, and high-performance RESTful APIs using Node.js, Express, and MongoDB.",
      "description": "Modern backend development requires a solid architecture that separates routing, validation, and database logic. In this article, we explore how to structure an Express.js application using the modular pattern, implement schema validation with Yup, handle file uploads securely with Multer, and centralize error handling for consistent API responses across all endpoints.",
      "picture": "d4e5f6a7-89b0-4c1d-9e2f-3a4b5c6d7e8f.png",
      "status": "PUBLISHED",
      "tags": "AI",
      "createdAt": "2026-10-29T12:00:00.000Z",
      "updatedAt": "2026-10-29T12:00:00.000Z"
    }
  }
}
2. Get All Articles (GET /api/v1/articles)Success Response (200 OK){
  "status": 200,
  "success": true,
  "data": {
    "articles": [
      {
        "_id": "671f8a2c9d3e4b1a2c3d4e5f",
        "title": "Building Scalable REST APIs with Node.js and Express",
        "summary": "A practical guide to designing clean, maintainable, and high-performance RESTful APIs using Node.js, Express, and MongoDB.",
        "description": "Modern backend development requires a solid architecture that separates routing, validation, and database logic...",
        "picture": "/uploads/d4e5f6a7-89b0-4c1d-9e2f-3a4b5c6d7e8f.png",
        "status": "PUBLISHED",
        "tags": "AI",
        "createdAt": "2026-10-29T12:00:00.000Z",
        "updatedAt": "2026-10-29T12:00:00.000Z"
      }
    ]
  }
}
3. Delete Article (DELETE /api/v1/articles/:id/remove)Success Response (200 OK){
  "status": 200,
  "success": true,
  "data": {
    "message": "The article was successfully deleted.",
    "article": {
      "_id": "671f8a2c9d3e4b1a2c3d4e5f",
      "title": "Building Scalable REST APIs with Node.js and Express"
    }
  }
}
Error CodesStatus CodeScenarioExample Message400 Bad RequestInvalid image format or file exceeds 2 MB"Image size must not exceed 2 MB." / "Invalid image format"404 Not FoundRoute or article ID does not exist"No article with this ID was found."409 ConflictArticle with the same title already exists"Article already exists."422 Unprocessable EntityYup validation failure or invalid MongoDB ObjectId"The entered ID is invalid." / Array of validation errors500 Internal Server ErrorUnexpected server or database error"An internal server error occurred."LicenseDistributed under the MIT License. See LICENSE for full details.