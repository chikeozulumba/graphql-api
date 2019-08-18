export const {
    APP_PORT,
    DB_URL,
    NODE_ENV,
    SESSION_NAME,
    SESSION_SECRET,
    SESSION_LIFETIME,
    REDIS_HOST,
    REDIS_PASSWORD,
    REDIS_PORT,
} = process.env

export const IN_PROD = NODE_ENV === 'production' ? true : false