const { DataSource } = require("typeorm");

const User = require("../models/user");

const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // Better to set this to false in production
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});

module.exports = AppDataSource;
