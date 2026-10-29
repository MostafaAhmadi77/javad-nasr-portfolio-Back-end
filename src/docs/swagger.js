const swaggerUi = require("swagger-ui-express");

// تنظیمات مشخصات OpenAPI نسخه ۳.۰ (Swagger)
const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Javad Nasr Portfolio — API Documentation",
    version: "1.0.0",
    description:
      "مستندات کامل API بک‌اند پروژه پورتفولیو جواد نصر برای مدیریت مقالات و تصاویر",
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
      description: "مدیریت مقالات پورتفولیو (ایجاد، دریافت، ویرایش، حذف)",
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
        description: "این اندپوینت وضعیت فعال بودن سرور و آپ‌تایم را برمی‌گرداند.",
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
                    uptime: { type: "number", example: 12.34 },
                    timestamp: {
                      type: "string",
                      example: "2026-10-29T19:00:00.000Z",
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
        summary: "روت خوش‌آمدگویی و نسخه API",
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
          "لیست مقالات را به ترتیب جدیدترین برمی‌گرداند. امکان فیلتر با وضعیت، تگ و کلمه کلیدی وجود دارد.",
        parameters: [
          {
            name: "status",
            in: "query",
            required: false,
            description: "فیلتر بر اساس وضعیت انتشار مقاله",
            schema: {
              type: "string",
              enum: ["PUBLISHED", "DRAFT"],
            },
          },
          {
            name: "tags",
            in: "query",
            required: false,
            description: "فیلتر بر اساس دسته‌بندی یا تگ مقاله",
            schema: {
              type: "string",
              enum: ["AI", "Human", "Assisted", "Verified", "Comprehensive"],
            },
          },
          {
            name: "search",
            in: "query",
            required: false,
            description: "جستجو در عنوان یا خلاصه مقاله",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "لیست مقالات با موفقیت دریافت شد",
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
        summary: "ایجاد مقاله جدید با عکس اختیاری",
        description:
          "یک مقاله جدید ثبت می‌کند. در صورت تمایل می‌توانید عکس (حداکثر ۲ مگابایت، فرمت‌های jpg, png, webp) آپلود کنید.",
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
                    description: "عنوان مقاله (۳ تا ۱۲۸ کاراکتر و غیرتکراری)",
                    example: "آشنایی با هوش مصنوعی نوین",
                  },
                  summary: {
                    type: "string",
                    description: "خلاصه کوتاه مقاله (۵۰ تا ۲۵۰ کاراکتر)",
                    example:
                      "در این مقاله به بررسی کاربردهای مدرن هوش مصنوعی و تاثیرات آن بر زندگی روزمره می‌پردازیم.",
                  },
                  description: {
                    type: "string",
                    description: "متن کامل مقاله (۵۰ تا ۲۰۰۰ کاراکتر)",
                    example:
                      "هوش مصنوعی یکی از جذاب‌ترین حوزه‌های فناوری است که با سرعت فوق‌العاده‌ای در حال پیشرفت است و صنایع گوناگون را دگرگون ساخته است.",
                  },
                  status: {
                    type: "string",
                    enum: ["PUBLISHED", "DRAFT"],
                    default: "DRAFT",
                    description: "وضعیت انتشار مقاله",
                  },
                  tags: {
                    type: "string",
                    enum: [
                      "AI",
                      "Human",
                      "Assisted",
                      "Verified",
                      "Comprehensive",
                    ],
                    default: "Human",
                    description: "دسته‌بندی مقاله",
                  },
                  picture: {
                    type: "string",
                    format: "binary",
                    description: "فایل تصویر مقاله (اختیاری، حداکثر ۲ مگابایت)",
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
            description: "خطای اعتبارسنجی مقادیر ورودی",
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
        summary: "دریافت یک مقاله بر اساس شناسه (ID)",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "شناسه ۲۴ کاراکتری مقاله در مونگو (MongoDB ObjectId)",
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
            description: "شناسه وارد شده معتبر نیست",
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
        summary: "ویرایش مقاله بر اساس شناسه (ID)",
        description:
          "فیلدهای مقاله را ویرایش می‌کند. در صورت آپلود عکس جدید، تصویر قبلی به صورت خودکار از سرور پاک می‌شود.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "شناسه ۲۴ کاراکتری مقاله در مونگو",
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
                  title: {
                    type: "string",
                    description: "عنوان جدید مقاله",
                  },
                  summary: {
                    type: "string",
                    description: "خلاصه جدید مقاله",
                  },
                  description: {
                    type: "string",
                    description: "متن کامل جدید مقاله",
                  },
                  status: {
                    type: "string",
                    enum: ["PUBLISHED", "DRAFT"],
                  },
                  tags: {
                    type: "string",
                    enum: [
                      "AI",
                      "Human",
                      "Assisted",
                      "Verified",
                      "Comprehensive",
                    ],
                  },
                  picture: {
                    type: "string",
                    format: "binary",
                    description: "فایل تصویر جدید برای جایگزینی تصویر قبلی",
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
            description: "مقاله‌ای با این شناسه یافت نشد",
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
            description: "شناسه یا داده‌های ارسالی نامعتبر هستند",
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
        summary: "حذف مقاله بر اساس شناسه (ID)",
        description:
          "مقاله را از پایگاه داده و فایل تصویر مرتبط با آن را از روی دیسک سرور حذف می‌کند.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "شناسه ۲۴ کاراکتری مقاله در مونگو",
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
                          example: "The article was successfully deleted.",
                        },
                      },
                    },
                  },
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
            description: "شناسه وارد شده نامعتبر است",
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
        summary: "حذف مقاله (مسیر قدیمی - جهت حفظ سازگاری)",
        description:
          "این مسیر به عنوان آلترناتیو روت DELETE /api/v1/articles/{id} حفظ شده است.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "شناسه مقاله در مونگو",
            schema: {
              type: "string",
              example: "654321654321654321654321",
            },
          },
        ],
        responses: {
          200: {
            description: "مقاله با موفقیت حذف شد",
          },
          404: {
            description: "مقاله‌ای یافت نشد",
          },
          422: {
            description: "شناسه نامعتبر است",
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Article: {
        type: "object",
        properties: {
          _id: { type: "string", example: "67215f98a287901b2c45e891" },
          title: { type: "string", example: "آشنایی با هوش مصنوعی نوین" },
          summary: {
            type: "string",
            example:
              "در این مقاله به بررسی کاربردهای مدرن هوش مصنوعی و تاثیرات آن می‌پردازیم.",
          },
          description: {
            type: "string",
            example:
              "متن کامل توضیحات مقاله که شامل جزئیات تکنولوژی و نکات فنی است...",
          },
          picture: {
            type: "string",
            nullable: true,
            example: "/uploads/a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg",
          },
          status: {
            type: "string",
            enum: ["PUBLISHED", "DRAFT"],
            example: "PUBLISHED",
          },
          tags: {
            type: "string",
            enum: ["AI", "Human", "Assisted", "Verified", "Comprehensive"],
            example: "AI",
          },
          createdAt: {
            type: "string",
            example: "2026-10-29T18:00:00.000Z",
          },
          updatedAt: {
            type: "string",
            example: "2026-10-29T18:00:00.000Z",
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
              count: { type: "integer", example: 5 },
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
