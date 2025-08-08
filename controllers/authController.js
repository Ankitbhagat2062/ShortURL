// controllers/authController.js
import User from '../models/User.js';

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ username,email, password });
    await user.save();
    res.status(201).json({ msg: 'User registered successfully' ,user:user});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    res.json({ msg: 'Logged in successfully',Id:user._id },); // In a real app, generate a JWT here
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};