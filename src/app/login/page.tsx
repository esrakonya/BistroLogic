// Dosya Yolu: /src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Squares2X2Icon, LockClosedIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        throw new Error('Invalid email or password.');
      }
      
      // Giriş başarılı: Önce refresh yapıp session'ı güncelle, sonra uçur.
      router.refresh();
      router.push('/admin');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] p-4 font-sans antialiased">
      <div className="w-full max-w-[400px] space-y-10 animate-in fade-in zoom-in-95 duration-700">
        
        {/* --- BRANDING --- */}
        <div className="text-center space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 group transition-all">
                <div className="bg-neutral-900 p-2 rounded-xl group-hover:scale-110 transition-transform">
                    <Squares2X2Icon className="h-8 w-8 text-white stroke-2" />
                </div>
                <span className="text-3xl font-serif font-bold tracking-tighter text-neutral-900">
                  Servely
                </span>
            </Link>
            <div className="space-y-1">
                <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">Admin Access</h2>
                <p className="text-sm text-neutral-400 font-medium uppercase tracking-widest">Authorized Personnel Only</p>
            </div>
        </div>

        {/* --- LOGIN FORM --- */}
        <div className="bg-white p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-neutral-100">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              {/* Email Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-neutral-300 group-focus-within:text-neutral-900 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 bg-neutral-50 border-none rounded-2xl text-neutral-900 placeholder-neutral-400 focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all text-sm"
                  placeholder="Admin Email"
                />
              </div>

              {/* Password Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-neutral-300 group-focus-within:text-neutral-900 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 bg-neutral-50 border-none rounded-2xl text-neutral-900 placeholder-neutral-400 focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            {error && (
              <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 text-red-600 text-xs font-bold p-4 rounded-xl text-center border border-red-100"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-4 rounded-2xl transition-all transform active:scale-[0.98] shadow-xl shadow-neutral-200 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:shadow-none"
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>
        </div>

        {/* --- FOOTER LINK --- */}
        <div className="text-center">
            <Link href="/" className="text-sm font-bold text-neutral-400 hover:text-neutral-900 transition-colors uppercase tracking-widest">
                ← Back to main site
            </Link>
        </div>
      </div>
    </div>
  );
}