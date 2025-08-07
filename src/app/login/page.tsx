// Dosya Yolu: /src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // DEĞİŞİKLİK: 'step' ve 'code' state'lerine artık ihtiyacımız yok.
  // Yerine, linkin gönderilip gönderilmediğini tutan 'emailSent' state'i geldi.
  const [emailSent, setEmailSent] = useState(false);
  
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // 1. AŞAMA: E-posta ve şifrenin doğruluğunu kontrol et.
      const { error: passwordError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (passwordError) {
        throw new Error('E-posta veya şifre hatalı.');
      }
      
      // 2. AŞAMA: Şifre doğruysa, geçici oturumu kapat ve asıl "Sihirli Link"i gönder.
      await supabase.auth.signOut();

      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: { 
          shouldCreateUser: false,
          // Kullanıcı linke tıkladığında, bu callback rotası çalışacak.
          // Bu rotayı bir sonraki adımda oluşturacağız.
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (otpError) {
        throw new Error('Giriş linki gönderilemedi. Lütfen tekrar deneyin.');
      }

      // Her şey yolundaysa, arayüzü "e-posta gönderildi" moduna geçir.
      setEmailSent(true);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
            <Link href="/" className="text-brand-dark font-poppins font-bold text-3xl tracking-wider hover:opacity-80 transition-opacity">
                PİDE<span className="text-brand-red">EFSANESİ</span>
            </Link>
            <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-gray-900">
              Admin Paneli Girişi
            </h2>
        </div>

        {/* --- DEĞİŞİKLİK: Arayüz artık kod istemiyor --- */}

        {emailSent ? (
          // E-POSTA GÖNDERİLDİKTEN SONRA GÖSTERİLECEK EKRAN
          <div className="text-center bg-white p-8 rounded-xl shadow-lg">
            <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-4 text-xl font-semibold text-gray-800">Giriş Linki Gönderildi</h3>
            <p className="mt-2 text-gray-600">
              Giriş işlemini tamamlamak için <strong>{email}</strong> adresine gönderdiğimiz sihirli linke tıklayın.
            </p>
            <p className="mt-4 text-sm text-gray-500">
              E-posta gelmediyse, spam klasörünüzü kontrol etmeyi unutmayın.
            </p>
          </div>
        ) : (
          // İLK AÇILIŞTAKİ E-POSTA VE ŞİFRE FORMU
          <form 
            onSubmit={handleLogin} 
            className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-lg"
          >
            <div className="rounded-md -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">E-posta Adresi</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="relative block w-full appearance-none rounded-t-md border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-brand-red focus:outline-none focus:ring-brand-red"
                  placeholder="E-posta Adresi"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Şifre</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="relative block w-full appearance-none rounded-b-md border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-brand-red focus:outline-none focus:ring-brand-red"
                  placeholder="Şifre"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-brand-red py-3 px-4 text-sm font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Doğrulanıyor...' : 'Giriş Linki Gönder'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}