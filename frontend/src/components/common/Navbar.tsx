import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHooks';
import { logout } from '../../store/slices/authSlice';
import { toggleMobileMenu, closeMobileMenu, addToast } from '../../store/slices/uiSlice';
import {
  Brain,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Award,
  BookOpen,
  HelpCircle,
  ShieldAlert,
  Bookmark,
  FileCheck,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { mobileMenuOpen } = useAppSelector((state) => state.ui);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(addToast({ type: 'info', message: 'You have logged out successfully.' }));
    navigate('/');
    dispatch(closeMobileMenu());
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 font-bold text-xl text-slate-900 group"
            onClick={() => dispatch(closeMobileMenu())}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Brain className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="leading-none text-slate-900 font-extrabold tracking-tight">
                TEST<span className="text-brand-600">HUB</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide">PRACTICE & TEST</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </Link>
            <Link
              to="/tests"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/tests') ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Explore Tests
            </Link>
            <Link
              to="/sections"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/sections') ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Sections
            </Link>
            <Link
              to="/practice"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/practice') ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Practice Mode
            </Link>
            <Link
              to="/daily-test"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/daily-test') ? 'text-amber-600 bg-amber-50' : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              Daily Test
            </Link>
            <Link
              to="/leaderboard"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/leaderboard') ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Leaderboard
            </Link>
          </div>

          {/* Right Action Items */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {user?.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors flex items-center gap-1"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Admin Panel
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="px-3.5 py-2 rounded-lg text-sm font-medium bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-brand-600 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-all"
                >
                  Register Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => dispatch(toggleMobileMenu())}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top duration-200">
          <Link
            to="/"
            onClick={() => dispatch(closeMobileMenu())}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-100"
          >
            Home
          </Link>
          <Link
            to="/tests"
            onClick={() => dispatch(closeMobileMenu())}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-100"
          >
            Explore Tests
          </Link>
          <Link
            to="/sections"
            onClick={() => dispatch(closeMobileMenu())}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-100"
          >
            Sections & Topics
          </Link>
          <Link
            to="/practice"
            onClick={() => dispatch(closeMobileMenu())}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-100"
          >
            Practice Mode
          </Link>
          <Link
            to="/daily-test"
            onClick={() => dispatch(closeMobileMenu())}
            className="block px-3 py-2 rounded-lg text-base font-medium text-amber-700 bg-amber-50 hover:bg-amber-100"
          >
            🔥 Daily Test #125
          </Link>
          <Link
            to="/leaderboard"
            onClick={() => dispatch(closeMobileMenu())}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-100"
          >
            Leaderboard
          </Link>

          {isAuthenticated ? (
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Signed in as {user?.name}
              </div>
              <Link
                to="/dashboard"
                onClick={() => dispatch(closeMobileMenu())}
                className="block px-3 py-2 rounded-lg text-base font-medium text-brand-600 bg-brand-50"
              >
                User Dashboard
              </Link>
              <Link
                to="/my-tests"
                onClick={() => dispatch(closeMobileMenu())}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                My Test History
              </Link>
              <Link
                to="/bookmarks"
                onClick={() => dispatch(closeMobileMenu())}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Bookmarked Questions
              </Link>
              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  onClick={() => dispatch(closeMobileMenu())}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-purple-700 bg-purple-50"
                >
                  Admin Control Panel
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-rose-600 hover:bg-rose-50"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <Link
                to="/login"
                onClick={() => dispatch(closeMobileMenu())}
                className="block w-full text-center px-4 py-2 rounded-xl text-base font-medium text-slate-700 bg-slate-100"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => dispatch(closeMobileMenu())}
                className="block w-full text-center px-4 py-2 rounded-xl text-base font-medium text-white bg-brand-600"
              >
                Register Free
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
