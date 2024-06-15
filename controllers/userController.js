const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserRepository = require("../repositories/userRepository");

// Secret for JWT
const JWT_SECRET = process.env.JWT_SECRET;

const signUp = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await UserRepository.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = UserRepository.create({ email, password: hashedPassword });
    await UserRepository.save(newUser);

    res.status(201).json({
      message: "User created successfully",
      user: { email: newUser.email, id: newUser.id },
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await UserRepository.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { user: { id: user.id, email: user.email } },
      JWT_SECRET,
      {
        expiresIn: "1h", //  expires in 1 hour
      }
    );

    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

const getLoggedInUser = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Find the user by ID
    const user = await UserRepository.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

module.exports = {
  signUp,
  login,
  getLoggedInUser,
};
