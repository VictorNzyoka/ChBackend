const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Signup
module.exports.signup = async (req, res) => {
  const { name, phoneNumber, password,email } = req.body; 

  try {
    // Check if the phone number is already registered
    const existingUser = await User.findOne({ where: {email} });
    if (existingUser) {
      return res.status(400).json({ message: 'Phone number already in use' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with role set to 'User'
    const newUser = await User.create({
      name,
      phoneNumber,
      email,
      password: hashedPassword,
      role: 'User', 
    });

    return res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};


// Login
module.exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find user by email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Check if user status is 'ignored' (pending approval)
      if (user.status === 'ignored') {
        return res.status(403).json({
          message: 'Your account is pending approval. Please wait for admin approval.',
        });
      }
  
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Generate access token
      const accessToken = jwt.sign(
        { userId: user.uuid, role: user.role }, 
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
  
      // Generate refresh token
      const refreshToken = jwt.sign(
        { userId: user.uuid },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
      );
  
      return res.status(200).json({
        message: 'Login successful',
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  };
// Refresh token
module.exports.refreshToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(403).json({ message: 'Token required' });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    // Generate a new access token
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return res.status(200).json({ accessToken });
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};


