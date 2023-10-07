export const configuration = () => ({
  database: {
    type: process.env.DATABASE_TYPE || 'mysql',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
    username: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || 'root',
    database: process.env.DATABASE_NAME || 'test',
    autoLoadEntities: true,
    synchronize: process.env.NODE_ENV !== 'production',
  },
  throttler: [
    {
      name: 'short',
      ttl: parseInt(process.env.SHORT_TERM_LIMITER_DURATION) || 1000,
      limit: parseInt(process.env.SHORT_TERM_LIMITER) || 10,
    },
    {
      name: 'medium',
      ttl: parseInt(process.env.MEDIUM_TERM_LIMITER_DURATION) || 10000,
      limit: parseInt(process.env.MEDIUM_TERM_LIMITER) || 100,
    },
    {
      name: 'long',
      ttl: parseInt(process.env.LONG_TERM_LIMITER_DURATION) || 60000,
      limit: parseInt(process.env.LONG_TERM_LIMITER) || 300,
    },
  ],
});
