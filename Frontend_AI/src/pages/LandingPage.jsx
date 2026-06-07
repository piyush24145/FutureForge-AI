import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import HowItWorks from "../components/HowItWorks";
import DashboardPreview from "../components/DashboardPreview";
import Footer from "../components/Footer";
import InteractiveSimulator from "../components/InteractiveSimulator";
import {
    FaFileAlt,
    FaRoad,
    FaBriefcase,
    FaMicrophone,
} from "react-icons/fa";

function LandingPage() {
    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen font-sans overflow-x-hidden relative bg-grid-pattern transition-colors duration-300">
            <Navbar />

            {/* HERO SECTION */}
            <section className="relative max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24 z-10">
                {/* Decorative Premium Glowing Orbs */}
                <div className="absolute top-10 left-10 w-80 h-80 bg-purple-600/10 dark:bg-purple-600/15 rounded-full filter blur-[110px] -z-10 animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-[420px] h-[420px] bg-indigo-600/10 dark:bg-indigo-600/15 rounded-full filter blur-[130px] -z-10 animate-pulse delay-700"></div>

                <div className="grid lg:grid-cols-12 gap-12 items-center">
                    {/* Hero Left Content */}
                    <div className="lg:col-span-5 space-y-6 animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100/70 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider select-none border border-purple-200/40 dark:border-purple-900/30">
                            <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping"></span>
                            FutureForge AI Platform
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
                            Your Intelligent
                            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-500 dark:from-purple-400 dark:via-indigo-300 dark:to-purple-400 text-glow-purple">
                                AI Career Partner
                            </span>
                        </h1>
                        <p className="text-slate-600 dark:text-slate-405 text-base md:text-lg leading-relaxed max-w-xl">
                            Audit your resume skills gap, build month-by-month roadmaps, search realistic internship opportunities, and practice challenging mock interviews with real-time feedback.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-2">
                            <Link 
                                to="/register" 
                                className="px-6 md:px-8 py-3.5 md:py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl text-sm md:text-base font-bold shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/35 hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] cursor-pointer"
                            >
                                Get Started Free
                            </Link>
                            <Link 
                                to="/login" 
                                className="px-6 md:px-8 py-3.5 md:py-4 border border-slate-200 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 rounded-2xl text-sm md:text-base font-bold hover:bg-slate-100/85 dark:hover:bg-slate-900/60 hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] cursor-pointer"
                            >
                                Try Interactive Demo
                            </Link>
                        </div>
                    </div>

                    {/* Hero Right Media - Interactive Simulator */}
                    <div className="lg:col-span-7 flex justify-center w-full relative z-10 animate-fade-in-up">
                        <InteractiveSimulator />
                    </div>
                </div>
            </section>


            {/* FEATURES SECTION */}
            <section
                id="features"
                className="max-w-7xl mx-auto px-6 md:px-8 py-24 relative"
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/5 dark:bg-indigo-600/10 rounded-full filter blur-[120px] -z-10 pointer-events-none animate-pulse"></div>

                <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                        Everything You Need To Succeed
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-lg">
                        Tailored tools that prepare you for the modern tech developer job market.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-14 perspective-1000">
                    <FeatureCard
                        icon={<FaFileAlt />}
                        title="Resume Analysis"
                        desc="Audit your resume dynamically using Gemini AI. Uncover critical skill gaps, calculate scores, and receive immediate recommendations."
                    />

                    <FeatureCard
                        icon={<FaRoad />}
                        title="Career Roadmap"
                        desc="Generate customized step-by-step roadmaps for development targets. Complete steps as you learn and track your progress."
                    />

                    <FeatureCard
                        icon={<FaBriefcase />}
                        title="Internship Finder"
                        desc="Get recommended realistic internships matching your current skills. Auto-sync with analysis to find roles you can apply for."
                    />

                    <FeatureCard
                        icon={<FaMicrophone />}
                        title="Interview Prep"
                        desc="Conduct verbal or technical mock interviews. Get structured score evaluations, strengths audits, and model responses."
                    />
                </div>
            </section>

            <HowItWorks />
            <DashboardPreview />
            <Footer />
        </div>
    );
}

function FeatureCard({ icon, title, desc }) {
    return (
        <div className="tilt-card glow-border p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl shadow-xs hover:shadow-xl hover:shadow-purple-500/5 hover:border-purple-500/40 transition-all duration-500 flex flex-col gap-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/45 text-purple-600 dark:text-purple-400 text-2xl flex items-center justify-center translate-z-10 shadow-inner">
                {icon}
            </div>

            <div className="translate-z-20 space-y-2">
                <h3 className="font-bold text-xl text-slate-850 dark:text-slate-100 tracking-tight">
                    {title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    {desc}
                </p>
            </div>
        </div>
    );
}

export default LandingPage;