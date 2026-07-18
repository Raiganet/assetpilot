import { createClient as createServerClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type {
  UserProfile,
  UserCreate,
  UserUpdate,
  UserFilters,
} from '@/lib/types/user.types';
import type { PaginatedResponse } from '@/lib/types/common.types';

export class UserRepository {
  // Get all users with filters and pagination
  static async findAll(
    filters: UserFilters = {},
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResponse<UserProfile>> {
    const supabase = await createServerClient();

    let query = supabase.from('profiles').select('*', { count: 'exact' });

    if (filters.search) {
      query = query.or(
        `full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
      );
    }

    if (filters.role) {
      query = query.eq('role', filters.role);
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    const totalPages = Math.ceil((count || 0) / pageSize);

    return {
      data: data as UserProfile[],
      total: count || 0,
      page,
      pageSize,
      totalPages,
    };
  }

  // Get user by ID
  static async findById(id: string): Promise<UserProfile | null> {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data as UserProfile;
  }

  // Create user with auth
  static async create(userData: UserCreate): Promise<UserProfile> {
    const adminClient = createAdminClient();

    // Create auth user
    const { data: authData, error: authError } = 
      await adminClient.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          full_name: userData.full_name,
          role: userData.role,
        },
      });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Failed to create user');

    // Update profile
    const { data: profileData, error: profileError } = await adminClient
      .from('profiles')
      .update({
        full_name: userData.full_name,
        phone: userData.phone,
        role: userData.role,
      })
      .eq('id', authData.user.id)
      .select()
      .single();

    if (profileError) throw profileError;

    return profileData as UserProfile;
  }

  // Update user
  static async update(id: string, userData: UserUpdate): Promise<UserProfile> {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('profiles')
      .update(userData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return data as UserProfile;
  }

  // Delete user
  static async delete(id: string): Promise<void> {
    const adminClient = createAdminClient();

    const { error } = await adminClient.auth.admin.deleteUser(id);

    if (error) throw error;
  }

  // Get user statistics
  static async getStatistics(): Promise<{
    total: number;
    byRole: Record<string, number>;
    byStatus: Record<string, number>;
  }> {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('profiles')
      .select('role, status');

    if (error) throw error;

    const byRole: Record<string, number> = {};
    const byStatus: Record<string, number> = {};

    data.forEach((user) => {
      byRole[user.role] = (byRole[user.role] || 0) + 1;
      byStatus[user.status] = (byStatus[user.status] || 0) + 1;
    });

    return {
      total: data.length,
      byRole,
      byStatus,
    };
  }
}