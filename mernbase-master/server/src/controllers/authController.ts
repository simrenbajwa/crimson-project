import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import User from '../models/user';

// ---------- Inline validation (no separate middleware) ----------
const signupSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(100),
  lastName:  z.string().trim().min(1, 'Last name is required').max(100),
  email:     z.string().trim().toLowerCase().email('Enter a valid email'),
  password:  z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email:    z.string().trim().toLowerCase().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

// ---------- Helpers ----------
const publicUser = (u: any) => ({
  id: u.id, // relies on Mongoose virtual getter
  firstName: u.firstName,
  lastName: u.lastName,
  email: u.email,
});

const DUP_KEY_CODE = 11000;

// ---------- Controllers ----------
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate + sanitize
    const { firstName, lastName, email, password } = signupSchema.parse(req.body ?? {});

    // Pre-check (still handle race with E11000)
    const exists = await User.findOne({ email }).lean();
    if (exists) {
      res.status(409).json({ message: 'Email already registered' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ firstName, lastName, email, passwordHash });

    res.status(201).json({
      message: 'Signup successful',
      user: publicUser(user),
    });
  } catch (e: any) {
    if (e?.name === 'ZodError') {
      const message = e.errors?.map((er: any) => er.message).join(', ') || 'Invalid input';
      res.status(400).json({ message });
      return;
    }
    if (e?.code === DUP_KEY_CODE) {
      res.status(409).json({ message: 'Email already registered' });
      return;
    }
    console.error('Signup error:', e?.stack || e);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate + sanitize
    const { email, password } = loginSchema.parse(req.body ?? {});

    // Explicitly select passwordHash in case schema uses select:false later
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user?.passwordHash) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    res.json({
      message: 'Login successful',
      user: publicUser(user),
    });
  } catch (e: any) {
    if (e?.name === 'ZodError') {
      const message = e.errors?.map((er: any) => er.message).join(', ') || 'Invalid input';
      res.status(400).json({ message });
      return;
    }
    console.error('Login error:', e?.stack || e);
    res.status(500).json({ message: 'Server error' });
  }
};
