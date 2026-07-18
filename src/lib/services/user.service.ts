import { UserRepository } from '@/lib/repositories/user.repository';
import type {
  UserProfile,
  UserCreate,
  UserUpdate,
  UserFilters,
} from '@/lib/types/user.types';
import type { PaginatedResponse, ApiResponse } from '@/lib/types/common.types';

export class UserService {
  static async getUsers(
    filters: UserFilters = {},
    page: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<PaginatedResponse<UserProfile>>> {
    try {
      const data = await UserRepository.findAll(filters, page, pageSize);
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch users',
      };
    }
  }

  static async getUserById(id: string): Promise<ApiResponse<UserProfile>> {
    try {
      const data = await UserRepository.findById(id);
      if (!data) {
        return { success: false, error: 'User not found' };
      }
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch user',
      };
    }
  }

  static async createUser(
    userData: UserCreate
  ): Promise<ApiResponse<UserProfile>> {
    try {
      // Validate password strength
      if (userData.password.length < 8) {
        return {
          success: false,
          error: 'Password must be at least 8 characters',
        };
      }

      const data = await UserRepository.create(userData);
      return { success: true, data, message: 'User created successfully' };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create user',
      };
    }
  }

  static async updateUser(
    id: string,
    userData: UserUpdate
  ): Promise<ApiResponse<UserProfile>> {
    try {
      const data = await UserRepository.update(id, userData);
      return { success: true, data, message: 'User updated successfully' };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update user',
      };
    }
  }

  static async deleteUser(id: string): Promise<ApiResponse<void>> {
    try {
      await UserRepository.delete(id);
      return { success: true, message: 'User deleted successfully' };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete user',
      };
    }
  }

  static async getUserStatistics(): Promise<
    ApiResponse<{
      total: number;
      byRole: Record<string, number>;
      byStatus: Record<string, number>;
    }>
  > {
    try {
      const data = await UserRepository.getStatistics();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to fetch statistics',
      };
    }
  }
}