import { FaGithub, FaLinkedin, FaGlobe, FaEnvelope } from "react-icons/fa";

function Footer() {
    return (
        <footer className="bg-slate-950 text-white py-16 px-8 relative overflow-hidden">
            {/* Glowing top gradient line divider */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/80 to-transparent"></div>

            {/* Background ambient neon lighting */}
            <div className="absolute bottom-[-100px] right-10 w-96 h-96 bg-purple-900/10 rounded-full filter blur-[125px] pointer-events-none animate-pulse"></div>
            <div className="absolute top-10 left-[-50px] w-80 h-80 bg-indigo-900/10 rounded-full filter blur-[100px] pointer-events-none animate-pulse delay-700"></div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10">
                {/* Brand Column */}
                <div className="md:col-span-5 space-y-5">
                    <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black shadow-md shadow-purple-500/20">
                            F
                        </span>
                        <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-300 to-indigo-300 tracking-tight">
                            FutureForge AI
                        </h3>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                        An intelligent, AI-powered career growth platform designed to analyze resume gaps, recommend tailored learning roadmaps, match internships, and run interactive mock interviews.
                    </p>
                    {/* Social links */}
                    <div className="flex gap-4 pt-2">
                        <a 
                            href="https://github.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-purple-400 hover:-translate-y-1 hover:border-purple-500/35 transition-all duration-300 cursor-pointer shadow-xs"
                        >
                            <FaGithub size={18} />
                        </a>
                        <a 
                            href="https://linkedin.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-purple-400 hover:-translate-y-1 hover:border-purple-500/35 transition-all duration-300 cursor-pointer shadow-xs"
                        >
                            <FaLinkedin size={18} />
                        </a>
                        <a 
                            href="https://google.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-purple-400 hover:-translate-y-1 hover:border-purple-500/35 transition-all duration-300 cursor-pointer shadow-xs"
                        >
                            <FaGlobe size={18} />
                        </a>
                        <a 
                            href="mailto:support@futureforge.ai" 
                            className="w-10 h-10 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-purple-400 hover:-translate-y-1 hover:border-purple-500/35 transition-all duration-300 cursor-pointer shadow-xs"
                        >
                            <FaEnvelope size={18} />
                        </a>
                    </div>
                </div>

                {/* Features Column */}
                <div className="md:col-span-3.5 space-y-5">
                    <h4 className="font-bold text-slate-200 text-sm uppercase tracking-wider">
                        Platform Features
                    </h4>
                    <ul className="space-y-3.5 text-slate-405 text-sm">
                        <li className="text-slate-405 hover:text-purple-400 hover:translate-x-1.5 transition-all duration-300 cursor-pointer flex items-center gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"></span>
                            Resume Audit & Analysis
                        </li>
                        <li className="text-slate-405 hover:text-purple-400 hover:translate-x-1.5 transition-all duration-300 cursor-pointer flex items-center gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"></span>
                            Personalized Roadmap Gen
                        </li>
                        <li className="text-slate-405 hover:text-purple-400 hover:translate-x-1.5 transition-all duration-300 cursor-pointer flex items-center gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"></span>
                            Smart Internship Match
                        </li>
                        <li className="text-slate-405 hover:text-purple-400 hover:translate-x-1.5 transition-all duration-300 cursor-pointer flex items-center gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"></span>
                            AI Mock Interview Engine
                        </li>
                    </ul>
                </div>

                {/* Connect Column */}
                <div className="md:col-span-3.5 space-y-5">
                    <h4 className="font-bold text-slate-200 text-sm uppercase tracking-wider">
                        Quick Links
                    </h4>
                    <ul className="space-y-3.5 text-slate-405 text-sm">
                        <li className="text-slate-405 hover:text-purple-400 hover:translate-x-1.5 transition-all duration-300 cursor-pointer flex items-center gap-2">
                            GitHub Codebase
                        </li>
                        <li className="text-slate-405 hover:text-purple-400 hover:translate-x-1.5 transition-all duration-300 cursor-pointer flex items-center gap-2">
                            LinkedIn Network
                        </li>
                        <li className="text-slate-405 hover:text-purple-400 hover:translate-x-1.5 transition-all duration-300 cursor-pointer flex items-center gap-2">
                            Developer Portfolio
                        </li>
                        <li className="text-slate-405 hover:text-purple-400 hover:translate-x-1.5 transition-all duration-300 cursor-pointer flex items-center gap-2">
                            Contact Support
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Copyright */}
            <div className="max-w-7xl mx-auto border-t border-slate-900 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
                <div>
                    &copy; {new Date().getFullYear()} FutureForge AI. Empowering next-generation student developer careers.
                </div>
                <div className="flex gap-4">
                    <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacy Policy</span>
                    <span className="hover:text-slate-400 cursor-pointer transition-colors">Terms of Service</span>
                </div>
            </div>
        </footer>
    );
}

export default Footer;