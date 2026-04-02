"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Shield, Lock, Send } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!supabase) {
      setError('Authentication service unavailable');
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      router.push('/admin/dashboard');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full">
      <div className="w-full max-w-[400px] min-w-[300px] sm:min-w-[400px] p-8 bg-rl-white/5 border border-rl-white/10 rounded-2xl shadow-2xl backdrop-blur-sm">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-rl-space-blue/20 rounded-full flex items-center justify-center border border-rl-space-blue/30">
            <Shield className="w-8 h-8 text-rl-space-blue" />
          </div>
        </div>
        
        <h2 className="text-2xl font-heading font-bold text-center mb-2">RESTRICTED ACCESS</h2>
        <p className="text-rl-white/60 text-center mb-8 font-sans text-sm">Authorized Skyward Administrators Only</p>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center font-sans">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-rl-white/80 mb-1">Clearance Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-rl-black/50 border border-rl-white/10 rounded-lg py-3 px-4 text-rl-white focus:outline-none focus:border-rl-space-blue transition-colors pl-11"
                placeholder="admin@diuskyward.com"
              />
              <Lock className="w-5 h-5 text-rl-white/40 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-rl-white/80 mb-1">Passcode</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-rl-black/50 border border-rl-white/10 rounded-lg py-3 px-4 text-rl-white focus:outline-none focus:border-rl-space-blue transition-colors pl-11"
                placeholder="••••••••"
              />
              <Lock className="w-5 h-5 text-rl-white/40 absolute left-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-rl-space-blue hover:bg-rl-space-blue/80 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? 'AUTHENTICATING...' : (
              <>
                INITIALIZE UPLINK
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
