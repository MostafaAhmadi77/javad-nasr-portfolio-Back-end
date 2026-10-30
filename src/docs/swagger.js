const swaggerUi = require("swagger-ui-express");

// OpenAPI 3.0 specification for Swagger documentation
const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Javad Nasr Portfolio — API Documentation",
    version: "1.0.0",
    description:
      "Comprehensive RESTful API documentation for Javad Nasr portfolio backend. Supports dual-image uploads with ordering and reading time calculation.",
    contact: {
      name: "Taha Ayati (DevLab)",
      email: "tahaayati2007@gmail.com",
    },
  },
  servers: [
    {
      url: "/",
      description: "Local development server",
    },
  ],
  tags: [
    {
      name: "Articles",
      description: "Manage portfolio articles (create, read, update, delete, upload ordered images)",
    },
    {
      name: "System",
      description: "Health check and system endpoints",
    },
  ],
  paths: {
    "/health": {
      get: {
        tags: ["System"],
        summary: "Server health check",
        description: "Returns server status and uptime.",
        responses: {
          200: {
            description: "Server is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "integer", example: 200 },
                    statusCode: { type: "integer", example: 200 },
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Server is healthy" },
                    uptime: { type: "number", example: 15.42 },
                    timestamp: {
                      type: "string",
                      example: "2026-10-30T10:00:00.000Z",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1": {
      get: {
        tags: ["System"],
        summary: "API v1 welcome endpoint",
        responses: {
          200: {
            description: "Welcome message",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "integer", example: 200 },
                    statusCode: { type: "integer", example: 200 },
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Javad Nasr Portfolio Backend API v1",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/articles": {
      get: {
        tags: ["Articles"],
        summary: "Retrieve all articles",
        description:
          "Returns all articles sorted by newest first with support for status, tag, and search filtering.",
        parameters: [
          {
            name: "status",
            in: "query",
            required: false,
            description: "Filter by status (PUBLISHED or DRAFT)",
            schema: {
              type: "string",
              enum: ["PUBLISHED", "DRAFT"],
            },
          },
          {
            name: "tags",
            in: "query",
            required: false,
            description: "Filter by category tag",
            schema: {
              type: "string",
            },
          },
          {
            name: "search",
            in: "query",
            required: false,
            description: "Search keyword in article title or summary",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "List of articles retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ArticleListResponse",
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Articles"],
        summary: "Create a new article with up to 2 ordered images",
        description:
          "Creates a new article. Accepts up to 2 images under the 'pictures' field. Order 1 is assigned to the Cover/Hero image, and order 2 to the In-content body image.",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["title", "summary", "description"],
                properties: {
                  title: {
                    type: "string",
                    description: "Article title (3 to 128 characters)",
                    example: "The New Performance Agenda: What Organizations Need to Rethink in 2026",
                  },
                  summary: {
                    type: "string",
                    description: "Short summary / excerpt",
                    example:
                      "Insights from McKinsey's State of Organizations 2026 — and what they mean for business leaders.",
                  },
                  description: {
                    type: "string",
                    description: "Full content of the article",
                    example:
                      "The business environment has changed faster than many organizations have been able to adapt. Technology and AI are redefining how work gets done.",
                  },
                  readingTime: {
                    type: "string",
                    description:
                      "Estimated reading time (optional - automatically calculated from content if omitted)",
                    example: "12 min read",
                  },
                  status: {
                    type: "string",
                    enum: ["PUBLISHED", "DRAFT"],
                    default: "DRAFT",
                    description: "Publishing status",
                  },
                  tags: {
                    type: "string",
                    default: "Strategy",
                    description: "Category tag",
                  },
                  author: {
                    type: "string",
                    default: "Javad Nasr",
                    description: "Author name",
                  },
                  pictures: {
                    type: "array",
                    items: {
                      type: "string",
                      format: "binary",
                    },
                    description:
                      "Up to 2 images (JPEG, PNG, WebP, max 2MB each). Image 1 = Cover/Hero, Image 2 = In-content",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Article created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ArticleSingleResponse",
                },
              },
            },
          },
          400: {
            description: "Invalid image format or file size error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          409: {
            description: "Article with this title already exists",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          422: {
            description: "Validation error occurred",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/v1/articles/{id}": {
      get: {
        tags: ["Articles"],
        summary: "Retrieve single article by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "24-character MongoDB ObjectId",
            schema: {
              type: "string",
              example: "654321654321654321654321",
            },
          },
        ],
        responses: {
          200: {
            description: "Article found successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ArticleSingleResponse",
                },
              },
            },
          },
          404: {
            description: "No article with this ID was found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          422: {
            description: "The entered ID is invalid",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Articles"],
        summary: "Update article by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "MongoDB ObjectId",
            schema: {
              type: "string",
              example: "654321654321654321654321",
            },
          },
        ],
        requestBody: {
          required: false,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  summary: { type: "string" },
                  description: { type: "string" },
                  readingTime: { type: "string" },
                  status: {
                    type: "string",
                    enum: ["PUBLISHED", "DRAFT"],
                  },
                  tags: { type: "string" },
                  author: { type: "string" },
                  pictures: {
                    type: "array",
                    items: {
                      type: "string",
                      format: "binary",
                    },
                    description: "New images with order 1 and 2 to replace old ones",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Article updated successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ArticleSingleResponse",
                },
              },
            },
          },
          404: {
            description: "No article with this ID was found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          409: {
            description: "Article with this title already exists",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          422: {
            description: "Validation error or invalid ID",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Articles"],
        summary: "Delete article and its images",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "MongoDB ObjectId",
            schema: {
              type: "string",
              example: "654321654321654321654321",
            },
          },
        ],
        responses: {
          200: {
            description: "The article and its pictures were successfully deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "integer", example: 200 },
                    statusCode: { type: "integer", example: 200 },
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        message: {
                          type: "string",
                          example: "The article and its pictures were successfully deleted.",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "No article with this ID was found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          422: {
            description: "The entered ID is invalid",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/v1/articles/{id}/remove": {
      delete: {
        tags: ["Articles"],
        summary: "Delete article (legacy endpoint)",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "MongoDB ObjectId",
            schema: {
              type: "string",
              example: "654321654321654321654321",
            },
          },
        ],
        responses: {
          200: { description: "Article deleted successfully" },
          404: { description: "Article not found" },
          422: { description: "Invalid ID" },
        },
      },
    },
  },
  components: {
    schemas: {
      ArticlePicture: {
        type: "object",
        properties: {
          url: {
            type: "string",
            example: "/uploads/9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d.webp",
          },
          order: {
            type: "integer",
            example: 1,
            description: "Image order (1 for Cover/Hero image, 2 for In-content body image)",
          },
        },
      },
      Article: {
        type: "object",
        properties: {
          _id: { type: "string", example: "67215f98a287901b2c45e891" },
          title: {
            type: "string",
            example: "The New Performance Agenda: What Organizations Need to Rethink in 2026",
          },
          summary: {
            type: "string",
            example:
              "Insights from McKinsey's State of Organizations 2026 — and what they mean for business leaders.",
          },
          description: {
            type: "string",
            example:
              "The business environment has changed faster than many organizations have been able to adapt...",
          },
          readingTime: {
            type: "string",
            example: "12 min read",
          },
          readTime: {
            type: "string",
            example: "12 min read",
            description: "Frontend-compatible alias for reading time",
          },
          pictures: {
            type: "array",
            items: { $ref: "#/components/schemas/ArticlePicture" },
          },
          picture: {
            type: "string",
            nullable: true,
            example: "/uploads/9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d.webp",
            description: "Direct URL of primary Cover image",
          },
          status: {
            type: "string",
            enum: ["PUBLISHED", "DRAFT"],
            example: "PUBLISHED",
          },
          tags: {
            type: "string",
            example: "Strategy",
          },
          author: {
            type: "string",
            example: "Javad Nasr",
          },
          createdAt: {
            type: "string",
            example: "2026-10-30T10:00:00.000Z",
          },
          updatedAt: {
            type: "string",
            example: "2026-10-30T10:00:00.000Z",
          },
        },
      },
      ArticleListResponse: {
        type: "object",
        properties: {
          status: { type: "integer", example: 200 },
          statusCode: { type: "integer", example: 200 },
          success: { type: "boolean", example: true },
          data: {
            type: "object",
            properties: {
              articles: {
                type: "array",
                items: { $ref: "#/components/schemas/Article" },
              },
              count: { type: "integer", example: 1 },
            },
          },
        },
      },
      ArticleSingleResponse: {
        type: "object",
        properties: {
          status: { type: "integer", example: 200 },
          statusCode: { type: "integer", example: 200 },
          success: { type: "boolean", example: true },
          data: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Article created successfully.",
              },
              article: { $ref: "#/components/schemas/Article" },
            },
          },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          status: { type: "integer", example: 422 },
          statusCode: { type: "integer", example: 422 },
          success: { type: "boolean", example: false },
          error: {
            type: "string",
            example: "The entered ID is invalid.",
          },
          message: {
            type: "string",
            example: "The entered ID is invalid.",
          },
        },
      },
    },
  },
};

module.exports = { swaggerUi, swaggerDocument };
