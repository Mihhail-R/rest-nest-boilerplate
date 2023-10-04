export default () => ({
  databasePort: parseInt(process.env.DATABASE_PORT, 10) || 3306,
  databaseHost: process.env.DATABASE_HOST || 'localhost',
  databaseUser: process.env.DATABASE_USER || 'root',
  databasePassword: process.env.DATABASE_PASSWORD || 'root',
  databaseName: process.env.DATABASE_NAME || 'test',
});
