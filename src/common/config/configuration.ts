export default () => ({
  port: process.env.PORT,
  database: {
    host: process.env.DATABASE_HOST,
  },
});
