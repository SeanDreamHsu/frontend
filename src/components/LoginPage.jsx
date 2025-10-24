import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { XCircle } from 'lucide-react';
import { auth } from '../lib/firebase';

const LoginPage = ({ show, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginView, setIsLoginView] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLoginView) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-md bg-white/95 p-8 rounded-3xl shadow-xl border border-sky-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-700"
        >
          <XCircle size={24} />
        </button>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-700">
            {isLoginView ? 'Welcome Back' : 'Create Account'}
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-600">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-600">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength="6"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 rounded-xl text-lg font-semibold text-white bg-sky-500 hover:bg-sky-400 disabled:bg-slate-300 disabled:text-slate-500 transition-colors"
          >
            {loading ? 'Processing...' : isLoginView ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLoginView(!isLoginView)}
            className="font-medium text-sky-600 hover:text-sky-500"
          >
            {isLoginView ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
