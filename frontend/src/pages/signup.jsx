// pages/signup.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to central hub
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        router.replace('/central');
      }
    });
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const redirectTo = `${window.location.origin}/central`;
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
      setMessage('Check your email for a signup link.');
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    const redirectTo = `${window.location.origin}/central`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });
    setLoading(false);
    if (error) setMessage(error.message);
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-800 text-white p-3 rounded"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-400">or</div>

        <button
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-2 rounded"
        >
          Sign up with Google
        </button>

        {message && (
          <p className="mt-4 text-sm text-green-400 text-center">{message}</p>
        )}

        <p className="mt-6 text-center text-gray-400 text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-blue-400 hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}
