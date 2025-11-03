import { PrismaClient, User, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export class UserService {
  /**
   * Create a new user
   */
  static async createUser(email: string, name: string, password: string, role: Role = Role.USER): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role,
        },
      });
      return user;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new Error('Email already exists');
      }
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      include: { author: true, articles: true },
    });
  }

  /**
   * Get user by email
   */
  static async getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Get all users
   */
  static async getAllUsers(limit: number = 10, offset: number = 0): Promise<User[]> {
    return prisma.user.findMany({
      take: limit,
      skip: offset,
      include: { author: true },
    });
  }

  /**
   * Update user
   */
  static async updateUser(id: number, data: Partial<Omit<User, 'id' | 'password'>>): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete user
   */
  static async deleteUser(id: number): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }

  /**
   * Authenticate user
   */
  static async authenticateUser(email: string, password: string): Promise<{ user: User; token: string } | null> {
    const user = await this.getUserByEmail(email);
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    return { user, token };
  }

  /**
   * Verify JWT token
   */
  static async verifyToken(token: string): Promise<any> {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'secret');
    } catch (error) {
      return null;
    }
  }
}
