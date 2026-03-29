import { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import { authService } from '../services/authService';

export default function Login({ onLogin, onSignup }) {
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    company: '',
    role: 'user',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      if (!validateEmail(formData.email)) {
        setError('Please enter a valid email');
        setLoading(false);
        return;
      }

      // Send login request to backend
      const response = await authService.login(formData.email, formData.password);
      
      // Backend returns { user, token }
      const userToPass = {
        ...response.user,
        token: response.token,
        email: formData.email,
      };

      onLogin(userToPass);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      if (!validateEmail(formData.email)) {
        setError('Please enter a valid email');
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      // Send signup request to backend
      const signupPayload = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        company: formData.company || 'Personal',
        role: formData.role || 'user',
      };

      const response = await authService.signup(signupPayload);
      
      // Backend returns { user, token }
      const userToPass = {
        ...response.user,
        token: response.token,
        email: formData.email,
      };

      onSignup(userToPass);
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 dark:from-[#0f1117] dark:via-[#161b22] dark:to-[#0d1117] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500 to-blue-500 rounded-2xl mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">ThinkNode</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isSignupMode ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white dark:bg-[#161b22] rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <form onSubmit={isSignupMode ? handleSignup : handleLogin} className="space-y-4">
            {/* Name Field (Signup only) */}
            {isSignupMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-[#0d1117] dark:text-white"
                />
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-[#0d1117] dark:text-white"
                />
              </div>
            </div>

            {/* Company Field (Signup only) */}
            {isSignupMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company (Optional)
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Your Company"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-[#0d1117] dark:text-white"
                />
              </div>
            )}

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-[#0d1117] dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field (Signup only) */}
            {isSignupMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-[#0d1117] dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* Remember Me / Forgot Password */}
            {!isSignupMode && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-violet-500" />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Remember me</span>
                </label>
                <button type="button" className="text-violet-500 hover:text-violet-600 font-medium">
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={clsx(
                'w-full py-2.5 rounded-lg font-medium text-white transition-all duration-200 flex items-center justify-center gap-2',
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 active:scale-95'
              )}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {isSignupMode ? 'Create Account' : 'Sign In'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 text-center border-t border-gray-200 dark:border-gray-700 pt-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {isSignupMode ? 'Already have an account?' : "Don't have an account?"}
              {' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignupMode(!isSignupMode);
                  setFormData({
                    email: '',
                    password: '',
                    name: '',
                    confirmPassword: '',
                    company: '',
                    role: 'user',
                  });
                  setError('');
                }}
                className="text-violet-500 hover:text-violet-600 font-semibold"
              >
                {isSignupMode ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        {!isSignupMode && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-xs font-semibold text-blue-900 dark:text-blue-300 mb-2">Demo Credentials:</p>
            <p className="text-xs text-blue-700 dark:text-blue-400">
              Email: <code className="bg-blue-100 dark:bg-blue-900/50 px-1 rounded">vicky@example.com</code>
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-400">
              Password: <code className="bg-blue-100 dark:bg-blue-900/50 px-1 rounded">password123</code>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
