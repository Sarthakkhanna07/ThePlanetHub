// pages/login.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        router.replace('/central');
      }
    });
  }, []);

  const handleEmailLogin = async () => {
    setLoading(true);
    setMessage('');
    const redirectTo = `${window.location.origin}/central`; // ✅ Direct to central
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: redirectTo,
      },
    });
    setLoading(false);
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Check your email for the login link.');
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const redirectTo = `${window.location.origin}/central`; // ✅ Direct to central
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });
    setLoading(false);
    if (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-gray-800 text-white p-3 rounded mb-4"
        />
        <button
          onClick={handleEmailLogin}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded mb-4"
        >
          {loading ? 'Sending...' : 'Send Magic Link'}
        </button>

        <div className="text-center text-gray-400 mb-4">or</div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Continue with Google
        </button>

        {message && (
          <p className="mt-4 text-sm text-green-400 text-center">{message}</p>
        )}

        <p className="mt-6 text-center text-gray-400 text-sm">
          Don’t have an account?{' '}
          <a href="/signup" className="text-blue-400 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
