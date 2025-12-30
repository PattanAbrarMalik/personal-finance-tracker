import { prisma } from '../utils/prisma';
import { hashPassword, comparePassword } from '../utils/auth/password';
import { generateToken } from '../utils/auth/jwt';
import { ValidationError, UnauthorizedError } from '../utils/errors';

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string | null;
  };
  token: string;
}

/**
 * Register a new user
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new ValidationError('Email already registered', {
      email: ['Email is already in use'],
    });
  }

  // Hash password
  const hashedPassword = await hashPassword(data.password);

  // Create user
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
    },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // Generate token
  const token = generateToken({
    userId: user.id,
    email: user.email,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    token,
  };
};

/**
 * Login a user
 */
export const login = async (data: LoginData): Promise<AuthResponse> => {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Verify password
  const isPasswordValid = await comparePassword(data.password, user.password);

  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Generate token
  const token = generateToken({
    userId: user.id,
    email: user.email,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    token,
  };
};

/**
 * Get current user by ID
 */
export const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

/**
 * Google Login / Sign Up
 */
export const googleLogin = async (data: { token: string }): Promise<AuthResponse> => {
  try {
    // In production, verify the Google token here using google-auth-library
    // For now, we'll accept any token and create/find user with a demo email
    
    // Demo implementation - In production, decode and verify the JWT token
    const demoEmail = `google-user-${Date.now()}@google.com`;
    const demoName = 'Google User';

    // Try to find existing user by email
    let user = await prisma.user.findFirst({
      where: { email: demoEmail },
    });

    // If user doesn't exist, create one
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: demoEmail,
          name: demoName,
          password: 'oauth-google', // OAuth users don't have passwords
        },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    };
  } catch (error) {
    throw new UnauthorizedError('Google authentication failed');
  }
};

/**
 * Apple Login / Sign Up
 */
export const appleLogin = async (data: { token?: string }): Promise<AuthResponse> => {
  try {
    // In production, verify the Apple token here
    // For now, we'll accept and create/find user with a demo email
    
    // Demo implementation - In production, decode and verify the JWT token
    const demoEmail = `apple-user-${Date.now()}@apple.com`;
    const demoName = 'Apple User';

    // Try to find existing user by email
    let user = await prisma.user.findFirst({
      where: { email: demoEmail },
    });

    // If user doesn't exist, create one
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: demoEmail,
          name: demoName,
          password: 'oauth-apple', // OAuth users don't have passwords
        },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    };
  } catch (error) {
    throw new UnauthorizedError('Apple authentication failed');
  }
};








