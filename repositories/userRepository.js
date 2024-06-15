const AppDataSource = require("../db/dataSource");
const User = require("../models/user");

const UserRepository = AppDataSource.getRepository(User);

module.exports = UserRepository;
