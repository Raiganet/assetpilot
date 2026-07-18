'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password min 6 chars'),
});

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: data.email, password: data.password });
      if (error) { toast.error(error.message); return; }
      toast.success('Login successful!');
      window.location.href = '/';
    } finally { setLoading(false); }
  };

  return (
    <Card variant="glass" className="animate-slide-up">
      <CardContent>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Sign In</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input {...register('email')} type="email" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800" placeholder="you@example.com" />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input {...register('password')} type="password" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800" placeholder="••••••••" />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</Button>
        </form>
      </CardContent>
    </Card>
  );
}