import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import User from '../models/User.js';
import asyncHandler from '../middleware/asyncHandler.js';

const SALT_ROUNDS = 10;

export const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ error: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    message: 'User registered successfully',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({
    message: 'Login successful',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
});

