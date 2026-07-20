import prisma from '@/lib/prisma';
import { UserRole } from '@/lib/constants/roles';

export class ProfileService {
  /**
   * Retrieve database profile corresponding to user UUID
   */
  static async getProfile(userId: string) {
    return prisma.profile.findUnique({
      where: { id: userId },
      include: {
        donorProfile: true,
      },
    });
  }

  /**
   * Create a new database profile linked to user UUID
   */
  static async createProfile(userId: string, email: string, data: {
    fullName: string;
    phone: string;
    district: string;
    state: string;
    role?: UserRole;
  }) {
    return prisma.profile.create({
      data: {
        id: userId,
        email,
        fullName: data.fullName,
        phone: data.phone,
        district: data.district,
        state: data.state,
        role: data.role || 'USER',
      },
    });
  }

  /**
   * Update database profile linked to user UUID
   */
  static async updateProfile(userId: string, data: {
    fullName: string;
    phone: string;
    district: string;
    state: string;
  }) {
    return prisma.profile.update({
      where: { id: userId },
      data: {
        fullName: data.fullName,
        phone: data.phone,
        district: data.district,
        state: data.state,
      },
    });
  }

  /**
   * Create or update database profile linked to user UUID
   */
  static async upsertProfile(data: {
    id: string;
    email: string;
    fullName: string;
    phone?: string | null;
    district: string;
    state: string;
    role?: UserRole;
  }) {
    return prisma.profile.upsert({
      where: { id: data.id },
      update: {
        fullName: data.fullName,
        phone: data.phone,
        district: data.district,
        state: data.state,
      },
      create: {
        id: data.id,
        email: data.email,
        fullName: data.fullName,
        phone: data.phone,
        district: data.district,
        state: data.state,
        role: data.role || 'USER',
      },
    });
  }
}
