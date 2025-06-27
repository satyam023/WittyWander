const User = require("../models/User");

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "Email already registered." });

    // Create user — password will be hashed by schema pre-save hook
    const user = new User({ username, email, password });
    await user.save();

    // Generate JWT token
    const token = user.generateToken();
    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Signup failed. Please try again." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found." });

    // Validate password using schema method
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid credentials." });

    // Generate JWT token
    const token = user.generateToken();

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
};
