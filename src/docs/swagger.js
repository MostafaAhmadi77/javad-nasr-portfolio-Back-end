const swaggerUi = require("swagger-ui-express");

// تنظیمات مشخصات OpenAPI نسخه ۳.۰ (Swagger)
const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Javad Nasr Portfolio — API Documentation",
    version: "1.0.0",
    description:
      "مستندات کامل API بک‌اند پروژه پورتفولیو جواد نصر برای مدیریت مقالات، آپلود چندگانه تصاویر (با حفظ ترتیب) و محاسبه زمان خواندن",
    contact: {
      name: "Taha Ayati (DevLab)",
      email: "tahaayati2007@gmail.com",
    },
  },
  servers: [
    {
      url: "/",
      description: "سرور محلی (Local Server)",
    },
  ],
  tags: [
    {
      name: "Articles",
      description: "مدیریت مقالات پورتفولیو (ایجاد، دریافت، ویرایش، حذف، آپلود تصاویر مرتب)",
    },
    {
      name: "System",
      description: "روت‌های بررسی وضعیت و سلامت سرور",
    },
  ],
  paths: {
    "/health": {
      get: {
        tags: ["System"],
        summary: "بررسی وضعیت سلامت سرور (Health Check)",
        responses: {
          200: {
            description: "سرور فعال و بدون مشکل است",
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
        summary: "روت خوش‌آمدگویی نسخه ۱ API",
        responses: {
          200: {
            description: "پیام خوش‌آمدگویی",
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
        summary: "دریافت همه مقالات با امکان فیلتر و جستجو",
        description:
          "لیست مقالات را با تصاویر مرتب‌شده و مدت زمان مطالعه برمی‌گرداند.",
        parameters: [
          {
            name: "status",
            in: "query",
            required: false,
            description: "فیلتر بر اساس وضعیت (PUBLISHED یا DRAFT)",
            schema: {
              type: "string",
              enum: ["PUBLISHED", "DRAFT"],
            },
          },
          {
            name: "tags",
            in: "query",
            required: false,
            description: "فیلتر بر اساس دسته‌بندی موضوعی",
            schema: {
              type: "string",
            },
          },
          {
            name: "search",
            in: "query",
            required: false,
            description: "جستجو در عنوان یا متن خلاصه مقاله",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "لیست مقالات با موفقیت بازگردانده شد",
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
        summary: "ایجاد مقاله جدید با حداکثر ۲ تصویر با ترتیب مشخص",
        description:
          "یک مقاله جدید ثبت می‌کند. امکان ارسال حداکثر ۲ تصویر با فیلد pictures وجود دارد. عکس اول به عنوان تصویر شاخص (Hero/Cover با order: 1) و عکس دوم به عنوان تصویر محتوایی (In-content با order: 2) ثبت می‌شود.",
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
                    description: "عنوان مقاله (۳ تا ۱۲۸ کاراکتر)",
                    example: "The New Performance Agenda: What Organizations Need to Rethink in 2026",
                  },
                  summary: {
                    type: "string",
                    description: "خلاصه کوتاه مقاله (Excerpt)",
                    example:
                      "Insights from McKinsey's State of Organizations 2026 — and what they mean for business leaders.",
                  },
                  description: {
                    type: "string",
                    description: "متن کامل محتوای مقاله",
                    example:
                      "The business environment has changed faster than many organizations have been able to adapt. Technology and AI are redefining how work gets done.",
                  },
                  readingTime: {
                    type: "string",
                    description:
                      "مدت زمان مطالعه (اختیاری - در صورت ارسال نشدن خودکار بر اساس متن محاسبه می‌شود)",
                    example: "12 min read",
                  },
                  status: {
                    type: "string",
                    enum: ["PUBLISHED", "DRAFT"],
                    default: "DRAFT",
                    description: "وضعیت انتشار مقاله",
                  },
                  tags: {
                    type: "string",
                    default: "Strategy",
                    description: "دسته‌بندی یا تگ مقاله",
                  },
                  author: {
                    type: "string",
                    default: "Javad Nasr",
                    description: "نام نویسنده مقاله",
                  },
                  pictures: {
                    type: "array",
                    items: {
                      type: "string",
                      format: "binary",
                    },
                    description:
                      "فایل‌های تصاویر (حداکثر ۲ تصویر، فرمت‌های jpg, png, webp). تصویر اول = Cover/Hero و تصویر دوم = In-content",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "مقاله با موفقیت ایجاد شد",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ArticleSingleResponse",
                },
              },
            },
          },
          400: {
            description: "فرمت نامعتبر فایل یا خطای آپلود",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          409: {
            description: "عنوان مقاله تکراری است",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          422: {
            description: "خطای اعتبارسنجی مقادیر",
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
        summary: "دریافت جزئیات مقاله با شناسه",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "شناسه ۲۴ کاراکتری مقاله در MongoDB",
            schema: {
              type: "string",
              example: "654321654321654321654321",
            },
          },
        ],
        responses: {
          200: {
            description: "اطلاعات مقاله با موفقیت یافت شد",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ArticleSingleResponse",
                },
              },
            },
          },
          404: {
            description: "مقاله‌ای با این شناسه یافت نشد",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          422: {
            description: "شناسه ارسالی نامعتبر است",
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
        summary: "ویرایش مقاله و به‌روزرسانی تصاویر با ترتیب",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "شناسه مقاله در MongoDB",
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
                    description: "تصاویر جدید با ترتیب ۱ و ۲ جهت جایگزینی",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "مقاله با موفقیت ویرایش شد",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ArticleSingleResponse",
                },
              },
            },
          },
          404: {
            description: "مقاله‌ای یافت نشد",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          409: {
            description: "عنوان جدید تکراری است",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          422: {
            description: "داده‌های ارسالی یا شناسه نامعتبر است",
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
        summary: "حذف مقاله و تصاویر آن از سرور",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "شناسه مقاله در MongoDB",
            schema: {
              type: "string",
              example: "654321654321654321654321",
            },
          },
        ],
        responses: {
          200: {
            description: "مقاله با موفقیت حذف شد",
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
                          example: "مقاله و تصاویر آن با موفقیت حذف شدند.",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "مقاله‌ای یافت نشد",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          422: {
            description: "شناسه نامعتبر است",
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
        summary: "حذف مقاله (مسیر قدیمی جهت سازگاری)",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "شناسه مقاله در MongoDB",
            schema: {
              type: "string",
              example: "654321654321654321654321",
            },
          },
        ],
        responses: {
          200: { description: "مقاله حذف شد" },
          404: { description: "یافت نشد" },
          422: { description: "شناسه نامعتبر است" },
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
            description: "ترتیب عکس (۱ برای عکس اصلی/شاخص Hero، و ۲ برای عکس داخل محتوا In-content)",
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
            description: "فیلد هماهنگ با فرانت‌پروژه",
          },
          pictures: {
            type: "array",
            items: { $ref: "#/components/schemas/ArticlePicture" },
          },
          picture: {
            type: "string",
            nullable: true,
            example: "/uploads/9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d.webp",
            description: "آدرس تصویر اصلی/شاخص",
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
                example: "مقاله با موفقیت ایجاد شد.",
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
            example: "شناسه مقاله نامعتبر است.",
          },
          message: {
            type: "string",
            example: "شناسه مقاله نامعتبر است.",
          },
        },
      },
    },
  },
};

module.exports = { swaggerUi, swaggerDocument };
