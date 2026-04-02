"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { AlertCircle, Lock, User, Eye, EyeOff, LogIn, Shield } from 'lucide-react';
import Link from 'next/link';

interface LoginError {
  field?: string;
  message: string;
}

export default function TeamLoginPage() {
  const router = useRouter();
  const [uid, setUid] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<LoginError[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const validateForm = (): boolean => {
    const newErrors: LoginError[] = [];

    if (!uid.trim()) {
      newErrors.push({ field: 'uid', message: 'UID/Username is required' });
    }

    if (!password) {
      newErrors.push({ field: 'password', message: 'Password is required' });
    }

    if (password && password.length < 6) {
      newErrors.push({ field: 'password', message: 'Password must be at least 6 characters' });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors([]);

    try {
      if (!supabase) {
        console.error('Supabase client is null');
        setErrors([{ message: 'Supabase not configured' }]);
        setLoading(false);
        return;
      }

      console.log('Attempting login with UID:', uid);

      // Query team_members table to verify credentials
      const { data: members, error: queryError } = await supabase
        .from('team_members')
        .select('*')
        .eq('uid', uid)
        .single();

      console.log('Query result:', { members, queryError });

      if (queryError) {
        console.error('Query error:', queryError);
        setErrors([{ message: `Database error: ${queryError.message}` }]);
        setLoading(false);
        return;
      }

      if (!members) {
        console.error('No member found with UID:', uid);
        setErrors([{ message: 'Invalid UID or password' }]);
        setLoading(false);
        return;
      }

      console.log('Member found:', members.name, 'Stored password:', members.password_hash);

      // Check password
      if (members.password_hash !== password) {
        console.error('Password mismatch. Entered:', password, 'Expected:', members.password_hash);
        setErrors([{ message: 'Invalid UID or password' }]);
        setLoading(false);
        return;
      }

      // Check if member is active
      if (members.status !== 'active') {
        setErrors([{ message: `Account is ${members.status}. Please contact admin.` }]);
        setLoading(false);
        return;
      }

      // Generate session token (in production, use JWT)
      const sessionToken = Math.random().toString(36).substring(2, 15);
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      // Update last login and session
      await supabase
        .from('team_members')
        .update({
          last_login: new Date().toISOString(),
          session_token: sessionToken,
          session_expires_at: expiresAt.toISOString(),
        })
        .eq('id', members.id);

      // Store session in localStorage
      localStorage.setItem('team_member_session', JSON.stringify({
        id: members.id,
        uid: members.uid,
        name: members.name,
        email: members.email,
        avatar_url: members.avatar_url,
        role: members.role,
        sessionToken: sessionToken,
        expiresAt: expiresAt.toISOString(),
      }));

      // Log activity
      await supabase
        .from('team_member_activity_log')
        .insert({
          member_id: members.id,
          activity_type: 'login',
          description: `Team member logged in`,
        });

      // Redirect to member dashboard
      router.push(`/team/member/${members.id}/dashboard`);
    } catch (error) {
      console.error('Login error:', error);
      setErrors([{ message: 'An error occurred during login. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #000 0%, #111 50%, #000 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      {/* Stars - only render on client to prevent hydration mismatch */}
      {mounted && (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.3 }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} style={{ position: 'absolute', width: 2, height: 2, background: '#fff', borderRadius: '50%', left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} />
          ))}
        </div>
      )}

      {/* Card */}
      <div style={{ width: '100%', maxWidth: 400, background: 'rgba(17,17,17,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 40, position: 'relative' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 8, height: 8, background: '#0052FF', borderRadius: '50%' }} />
            <div style={{ width: 8, height: 8, background: '#fff', borderRadius: '50%' }} />
            <div style={{ width: 8, height: 8, background: '#0052FF', borderRadius: '50%' }} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>TEAM ACCESS</h1>
          <p style={{ fontSize: 11, color: 'rgba(224,224,224,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Member Dashboard Authentication</p>
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: 12, marginBottom: 20 }}>
            {errors.map((e, i) => <p key={i} style={{ color: '#ef4444', fontSize: 13, margin: 0 }}>{e.message}</p>)}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ fontSize: 11, color: 'rgba(224,224,224,0.8)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, display: 'block' }}>UID / Username</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px' }}>
              <User size={18} color="#0052FF" />
              <input type="text" value={uid} onChange={(e) => setUid(e.target.value)} placeholder="Enter your UID" style={{ flex: 1, background: 'none', border: 'none', color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'monospace' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 11, color: 'rgba(224,224,224,0.8)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, display: 'block' }}>Password</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px' }}>
              <Lock size={18} color="#0052FF" />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" style={{ flex: 1, background: 'none', border: 'none', color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'monospace' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                {showPassword ? <EyeOff size={18} color="#0052FF" /> : <Eye size={18} color="#0052FF" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: loading ? '#333' : '#0052FF', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 }}>
            {loading ? 'Authenticating...' : <><LogIn size={18} /> Enter Dashboard</>}
          </button>
        </form>

        {/* Footer */}
        <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
            <Shield size={16} color="#0052FF" />
            <span style={{ fontSize: 11, color: 'rgba(224,224,224,0.6)', textTransform: 'uppercase' }}>Secure Authentication</span>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(224,224,224,0.6)', marginBottom: 4 }}>Don't have access yet?</p>
          <p style={{ fontSize: 12, color: 'rgba(224,224,224,0.4)', marginBottom: 16 }}>Contact your administrator for credentials</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
            <Link href="/" style={{ fontSize: 12, color: 'rgba(224,224,224,0.6)', textDecoration: 'none' }}>Back Home</Link>
            <div style={{ width: 4, height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: '50%' }} />
            <Link href="/admin/login" style={{ fontSize: 12, color: 'rgba(224,224,224,0.6)', textDecoration: 'none' }}>Admin Portal</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
