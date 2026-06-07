import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaSun, FaMoon, FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
    const [darkMode, setDarkMode] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const isDark = localStorage.getItem("darkMode") === "true";
        setDarkMode(isDark);
        if (isDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, []);

    const toggleDarkMode = () => {
        const nextVal = !darkMode;
        setDarkMode(nextVal);
        localStorage.setItem("darkMode", nextVal ? "true" : "false");
        if (nextVal) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

    return (
        <nav className="sticky top-0 z-50 px-6 md:px-8 py-4 transition-all duration-300 glass-panel shadow-sm">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Brand Logo */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-500 flex items-center justify-center text-white font-black shadow-md shadow-purple-500/20 group-hover:rotate-12 transition-transform duration-300">
                        F
                    </span>
                    <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-500 to-indigo-600 dark:from-purple-400 dark:via-indigo-300 dark:to-purple-400 tracking-tight">
                        FutureForge <span className="font-light">AI</span>
                    </h1>
                </Link>

                {/* Desktop Menu Links */}
                <div className="hidden md:flex items-center gap-8">
                    <a 
                        href="/#features" 
                        className="text-sm font-semibold text-slate-600 dark:text-slate-350 hover:text-purple-600 dark:hover:text-purple-400 transition-colors relative nav-link-underline py-1"
                    >
                        Features
                    </a>
                    <a 
                        href="/#how-it-works" 
                        className="text-sm font-semibold text-slate-600 dark:text-slate-350 hover:text-purple-600 dark:hover:text-purple-400 transition-colors relative nav-link-underline py-1"
                    >
                        How It Works
                    </a>
                </div>

                {/* Actions & Theme Toggler */}
                <div className="flex gap-3.5 items-center">
                    {/* Theme Toggle Button */}
                    <button 
                        onClick={toggleDarkMode} 
                        className="p-2.5 rounded-xl border border-slate-200/65 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 hover:bg-purple-50 dark:hover:bg-purple-950/30 text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 shadow-xs cursor-pointer transition-all active:scale-[0.92] duration-300 flex items-center justify-center"
                        aria-label="Toggle Dark Mode"
                    >
                        {darkMode ? (
                            <FaSun className="w-4 h-4 text-amber-500 animate-spin-slow" />
                        ) : (
                            <FaMoon className="w-4 h-4 text-indigo-500" />
                        )}
                    </button>

                    {/* Login & Register Buttons (Desktop) */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            to="/login"
                            className="px-5 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 border border-slate-200 dark:border-slate-850 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-all active:scale-[0.97] cursor-pointer"
                        >
                            Login
                        </Link>

                        <Link
                            to="/register"
                            className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-md shadow-purple-500/15 hover:shadow-lg hover:shadow-purple-500/25 transition-all active:scale-[0.97] cursor-pointer"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle button */}
                    <button 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                        className="md:hidden p-2.5 rounded-xl border border-slate-200/65 dark:border-slate-800/80 bg-white/45 dark:bg-slate-900/45 text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 shadow-xs cursor-pointer transition-all active:scale-[0.92] duration-300 flex items-center justify-center"
                    >
                        {mobileMenuOpen ? <FaTimes className="w-4 h-4" /> : <FaBars className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer Overlay */}
            {mobileMenuOpen && (
                <div className="md:hidden mt-4 pt-4 border-t border-slate-100 dark:border-slate-900/60 flex flex-col gap-4 animate-fade-in-up">
                    <a 
                        href="/#features" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-sm font-semibold text-slate-600 dark:text-slate-350 hover:text-purple-600 dark:hover:text-purple-400 px-2 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                    >
                        Features
                    </a>
                    <a 
                        href="/#how-it-works" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-sm font-semibold text-slate-600 dark:text-slate-350 hover:text-purple-600 dark:hover:text-purple-400 px-2 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                    >
                        How It Works
                    </a>
                    <hr className="border-slate-100 dark:border-slate-900" />
                    <div className="flex flex-col gap-2.5">
                        <Link
                            to="/login"
                            onClick={() => setMobileMenuOpen(false)}
                            className="w-full text-center px-5 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 border border-slate-200 dark:border-slate-850 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all active:scale-[0.98] cursor-pointer"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            onClick={() => setMobileMenuOpen(false)}
                            className="w-full text-center px-5 py-3 text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-md shadow-purple-500/15 hover:shadow-lg hover:shadow-purple-500/25 transition-all active:scale-[0.98] cursor-pointer"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;