import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
    FaUpload, 
    FaBriefcase, 
    FaChevronRight, 
    FaArrowRight 
} from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getLatestResumeAnalysis } from "../services/resumeService";
import { getReadinessScore } from "../services/interviewService";

function Dashboard() {
    const [resumeData, setResumeData] = useState(null);
    const [readiness, setReadiness] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [resumeRes, readinessRes] = await Promise.all([
                    getLatestResumeAnalysis(),
                    getReadinessScore()
                ]);

                if (resumeRes.success && resumeRes.analysis) {
                    setResumeData(resumeRes.analysis);
                }
                if (readinessRes.success) {
                    setReadiness(readinessRes.score);
                }
            } catch (err) {
                console.error("Failed to load dashboard metrics:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex bg-gray-100 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100">
                <Sidebar />
                <div className="flex-1 min-h-screen flex flex-col">
                    <Topbar />
                    <div className="p-8 flex-1 flex items-center justify-center bg-grid-pattern">
                        <div className="text-center">
                            <div className="animate-spin h-12 w-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
                            <p className="text-slate-550 dark:text-slate-400 mt-4 font-medium">Loading your profile dashboard...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Calculate roadmap progress
    const totalSteps = resumeData?.roadmap?.length || 0;
    const completedSteps = resumeData?.roadmap?.filter(s => s.status === "completed").length || 0;
    const roadmapProgress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

    // Get internship match percentage from top match or highest match
    let internshipMatchStr = "N/A";
    if (resumeData?.internships && resumeData.internships.length > 0) {
        const matches = resumeData.internships.map(i => {
            const m = parseInt(i.match);
            return isNaN(m) ? 0 : m;
        });
        const maxMatch = Math.max(...matches, 0);
        if (maxMatch > 0) {
            internshipMatchStr = `${maxMatch}%`;
        } else {
            internshipMatchStr = "85%"; // reasonable default fallback
        }
    }

    const displayName = resumeData?.name || "Alex Chen";

    return (
        <div className="flex bg-gray-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen font-sans">
            <Sidebar />

            <div className="flex-1 min-h-screen flex flex-col overflow-hidden">
                <Topbar />

                <div className="p-8 flex-1 overflow-y-auto bg-grid-pattern max-h-[calc(100vh-64px)]">
                    {!resumeData ? (
                        <div className="max-w-2xl mx-auto mt-14 p-10 rounded-3xl bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800 hover:border-purple-500/30 transition-all duration-300 shadow-xl relative text-center animate-fade-in-up">
                            {/* Glowing internal decorative light */}
                            <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full filter blur-[50px] pointer-events-none"></div>

                            <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight mb-3">
                                Welcome to FutureForge AI!
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm leading-relaxed max-w-md mx-auto">
                                Upload and analyze your resume to generate a personalized career career score, skills roadmap, internship matches, and mock interviews.
                            </p>
                            <Link
                                to="/resume-analysis"
                                className="px-6 py-3.5 bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl font-bold shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-all active:scale-[0.98] inline-flex items-center gap-2.5 cursor-pointer text-sm"
                            >
                                <FaUpload size={14} />
                                Analyze Your Resume Now
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-fade-in-up">
                            
                            {/* Header Row */}
                            <div className="flex justify-between items-center text-left">
                                <div>
                                    <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                                        Dashboard
                                    </h1>
                                    <p className="text-slate-500 dark:text-slate-450 text-xs mt-1">Here is your customized progress assessment.</p>
                                </div>
                            </div>

                            {/* 1. TOP STATS CARDS */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 perspective-1000">
                                
                                {/* Resume Score Card */}
                                <div className="tilt-card p-6 rounded-3xl bg-white dark:bg-slate-900/35 backdrop-blur-xl border border-slate-200 dark:border-slate-900 hover:border-purple-500/30 transition-all duration-500 relative group overflow-hidden shadow-md dark:shadow-xl">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full filter blur-[25px] pointer-events-none"></div>
                                    <h3 className="font-bold text-xs text-slate-550 dark:text-slate-450 uppercase tracking-wider">
                                        Resume Score
                                    </h3>
                                    <p className="text-5xl font-black mt-3 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 text-transparent bg-clip-text text-glow-purple tracking-tight">
                                        {resumeData.score ? `${resumeData.score}%` : "N/A"}
                                    </p>
                                </div>

                                {/* Career Readiness Card */}
                                <div className="tilt-card p-6 rounded-3xl bg-white dark:bg-slate-900/35 backdrop-blur-xl border border-slate-200 dark:border-slate-900 hover:border-emerald-500/30 transition-all duration-500 relative group overflow-hidden shadow-md dark:shadow-xl">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full filter blur-[25px] pointer-events-none"></div>
                                    <h3 className="font-bold text-xs text-slate-550 dark:text-slate-450 uppercase tracking-wider">
                                        Career Readiness
                                    </h3>
                                    <p className="text-5xl font-black mt-3 bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-400 text-transparent bg-clip-text tracking-tight animate-shimmer" style={{ textShadow: "0 0 20px rgba(16, 185, 129, 0.25)" }}>
                                        {readiness !== null ? `${readiness}%` : "N/A"}
                                    </p>
                                </div>

                                {/* Roadmap Progress Card */}
                                <div className="tilt-card p-6 rounded-3xl bg-white dark:bg-slate-900/35 backdrop-blur-xl border border-slate-200 dark:border-slate-900 hover:border-blue-500/30 transition-all duration-500 relative group overflow-hidden shadow-md dark:shadow-xl">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full filter blur-[25px] pointer-events-none"></div>
                                    <h3 className="font-bold text-xs text-slate-550 dark:text-slate-450 uppercase tracking-wider">
                                        Roadmap Progress
                                    </h3>
                                    <p className="text-5xl font-black mt-3 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400 text-transparent bg-clip-text text-glow-indigo tracking-tight">
                                        {roadmapProgress}%
                                    </p>
                                </div>

                                {/* Internship Match Card */}
                                <div className="tilt-card p-6 rounded-3xl bg-white dark:bg-slate-900/35 backdrop-blur-xl border border-slate-200 dark:border-slate-900 hover:border-orange-500/30 transition-all duration-500 relative group overflow-hidden shadow-md dark:shadow-xl">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full filter blur-[25px] pointer-events-none"></div>
                                    <h3 className="font-bold text-xs text-slate-550 dark:text-slate-450 uppercase tracking-wider">
                                        Internship Match
                                    </h3>
                                    <p className="text-5xl font-black mt-3 bg-gradient-to-r from-orange-500 to-amber-500 dark:from-orange-400 dark:to-amber-400 text-transparent bg-clip-text tracking-tight" style={{ textShadow: "0 0 20px rgba(249, 115, 22, 0.25)" }}>
                                        {internshipMatchStr}
                                    </p>
                                </div>
                            </div>

                            {/* 2. MAIN GRID */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                
                                {/* Left Section: AI guidance, Roadmap wave, Skills, Opportunities */}
                                <div className="lg:col-span-8 space-y-8">
                                    
                                    {/* AI Career Guidance Banner */}
                                    <div className="relative overflow-hidden p-8 rounded-3xl bg-white dark:bg-slate-900/35 border border-slate-200 dark:border-slate-900 shadow-md dark:shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 group text-left">
                                        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/5 rounded-full filter blur-[80px] -z-10"></div>
                                        <div className="space-y-3">
                                            <span className="text-[10px] font-bold tracking-widest text-purple-600 dark:text-purple-400 uppercase">
                                                AI Career Guidance
                                            </span>
                                            <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                                                Hello, {displayName}! Ready to advance your journey?
                                            </h2>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xl">
                                                Today's priority: Refine CV & apply to <span className="text-purple-600 dark:text-purple-400 font-bold">"AI Summer Intern"</span>. Your readiness score is at <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{readiness || 85}%</span>.
                                            </p>
                                        </div>
                                        
                                        {/* Right drawing vector */}
                                        <div className="hidden md:block opacity-35 text-purple-500 dark:text-purple-400 pr-4 shrink-0 pointer-events-none">
                                            <svg width="100" height="60" viewBox="0 0 100 60">
                                                <path d="M5,40 Q25,10 45,30 T85,10" fill="none" stroke="currentColor" strokeWidth="3" className="animate-draw-path" />
                                                <circle cx="85" cy="10" r="4" fill="currentColor" className="animate-pulse-dot" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* My Career Roadmap Wave Graph */}
                                    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/35 backdrop-blur-xl border border-slate-200 dark:border-slate-900 shadow-md dark:shadow-2xl flex flex-col gap-6">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 tracking-tight">
                                                    My Career Roadmap
                                                </h3>
                                            </div>
                                            <div className="flex bg-slate-50 dark:bg-slate-950 p-0.5 rounded-xl border border-slate-200 dark:border-slate-900 text-[9px] font-bold uppercase tracking-wider">
                                                <button className="px-2.5 py-1 rounded-lg bg-purple-650 text-white cursor-pointer shadow-xs">Practice</button>
                                                <button className="px-2.5 py-1 rounded-lg text-slate-500 dark:text-slate-400 cursor-pointer">Stages</button>
                                            </div>
                                        </div>

                                        <div className="relative pt-6 pb-2">
                                            <svg viewBox="0 0 500 150" className="w-full h-36 overflow-visible">
                                                <defs>
                                                    <linearGradient id="curve-gradient" x1="0" y1="0" x2="1" y2="0">
                                                        <stop offset="0%" stopColor="#c084fc" />
                                                        <stop offset="35%" stopColor="#c084fc" />
                                                        <stop offset="70%" stopColor="#818cf8" />
                                                        <stop offset="100%" stopColor="#6366f1" />
                                                    </linearGradient>
                                                    <linearGradient id="fill-gradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#818cf8" stopOpacity="0.12" />
                                                        <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
                                                    </linearGradient>
                                                </defs>

                                                <path 
                                                    d="M 30,110 C 100,110 120,40 180,40 C 240,40 260,80 320,80 C 380,80 400,120 470,120 L 470,150 L 30,150 Z"
                                                    fill="url(#fill-gradient)"
                                                    className="opacity-70"
                                                />

                                                <path 
                                                    d="M 30,110 C 100,110 120,40 180,40 C 240,40 260,80 320,80 C 380,80 400,120 470,120"
                                                    fill="none"
                                                    stroke="url(#curve-gradient)"
                                                    strokeWidth="3"
                                                    strokeLinecap="round"
                                                    className="animate-draw-path"
                                                />

                                                {/* Checkpoint nodes */}
                                                <g className="cursor-pointer group">
                                                    <circle cx="30" cy="110" r="5" fill="#c084fc" />
                                                    <circle cx="30" cy="110" r="11" fill="none" stroke="#c084fc" strokeWidth="1.5" className="animate-ping opacity-30" />
                                                    <text x="30" y="132" fill="#94a3b8" fontSize="8.5" textAnchor="middle" fontWeight="bold">Skills Dev (90%)</text>
                                                </g>

                                                <g className="cursor-pointer group">
                                                    <circle cx="180" cy="40" r="5" fill="#a855f7" />
                                                    <circle cx="180" cy="40" r="12" fill="none" stroke="#a855f7" strokeWidth="1.5" className="animate-pulse-dot" />
                                                    <text x="180" y="22" fill="#f1f5f9" fontSize="9" textAnchor="middle" fontWeight="black" className="fill-purple-600 dark:fill-purple-300">Intern Prep (95%)</text>
                                                </g>

                                                <g className="cursor-pointer group">
                                                    <circle cx="320" cy="80" r="5" fill="#818cf8" />
                                                    <circle cx="320" cy="80" r="11" fill="none" stroke="#818cf8" strokeWidth="1.5" className="animate-ping opacity-35" />
                                                    <text x="320" y="62" fill="#94a3b8" fontSize="8.5" textAnchor="middle" fontWeight="bold">Portfolio (60%)</text>
                                                </g>

                                                <g className="cursor-pointer group">
                                                    <circle cx="470" cy="120" r="5" fill="#6366f1" />
                                                    <circle cx="470" cy="120" r="11" fill="none" stroke="#6366f1" strokeWidth="1.5" className="animate-ping opacity-30" />
                                                    <text x="470" y="142" fill="#94a3b8" fontSize="8.5" textAnchor="middle" fontWeight="bold">Full-Time (20%)</text>
                                                </g>
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Skills Progress & Recommended Opportunities Split Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                                        
                                        {/* Skills Progress List */}
                                        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/35 backdrop-blur-xl border border-slate-200 dark:border-slate-900 shadow-md dark:shadow-2xl flex flex-col gap-5">
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-bold text-slate-800 dark:text-slate-100 tracking-tight text-base">
                                                    Skills Progress
                                                </h3>
                                                <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2.5 py-1 rounded-lg border border-purple-100 dark:border-purple-900/30">
                                                    Practice
                                                </span>
                                            </div>

                                            <div className="space-y-4 pt-1">
                                                <SkillBar label="Python" value={88} />
                                                <SkillBar label="ML" value={75} />
                                                <SkillBar label="UX" value={92} />
                                                <SkillBar label="Data Analysis" value={65} />
                                            </div>
                                        </div>

                                        {/* Recommended Opportunities List */}
                                        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/35 backdrop-blur-xl border border-slate-200 dark:border-slate-900 shadow-md dark:shadow-2xl flex flex-col gap-5">
                                            <h3 className="font-bold text-slate-800 dark:text-slate-100 tracking-tight text-base">
                                                Recommended Opportunities
                                            </h3>
                                            <div className="space-y-3 pt-1">
                                                <JobRow title="Junior AI Engineer" company="TechCorp" />
                                                <JobRow title="Product Analyst" company="StartupX" />
                                                <JobRow title="Data Scientist" company="Globex" />
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                {/* Right Section (Sidebar widgets) */}
                                <div className="lg:col-span-4 space-y-8 text-left">
                                    
                                    {/* Mentor Insights Card */}
                                    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/35 backdrop-blur-xl border border-slate-200 dark:border-slate-900 shadow-md dark:shadow-2xl flex flex-col gap-5">
                                        <div>
                                            <h3 className="font-bold text-slate-800 dark:text-slate-100 tracking-tight text-base">
                                                Mentor Insights
                                            </h3>
                                        </div>

                                        <div className="space-y-4 pt-1">
                                            {/* Insights block 1 */}
                                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-gradient-to-br dark:from-slate-950 dark:to-slate-900 border border-slate-150 dark:border-slate-900 relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full filter blur-[25px] pointer-events-none"></div>
                                                <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide">Python projects Focus</h4>
                                                <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 leading-relaxed">
                                                    Focus on Python projects this week. Adding dynamic modules raises your score.
                                                </p>
                                            </div>

                                            {/* Insights block 2 */}
                                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-gradient-to-br dark:from-slate-950 dark:to-slate-900 border border-slate-150 dark:border-slate-900 relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full filter blur-[25px] pointer-events-none"></div>
                                                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">Practice mock interview</h4>
                                                <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 leading-relaxed">
                                                    Practice mock interviews for Globex. Refine confidence score assessments.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Upcoming Events Card */}
                                    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/35 backdrop-blur-xl border border-slate-200 dark:border-slate-900 shadow-md dark:shadow-2xl flex flex-col gap-5">
                                        <div>
                                            <h3 className="font-bold text-slate-800 dark:text-slate-100 tracking-tight text-base">
                                                Upcoming Events
                                            </h3>
                                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Schedule</p>
                                        </div>

                                        <div className="space-y-4 pt-1">
                                            <TimelineItem time="10:00" title="Junior AI Engineer" subtitle="TechCorp" color="bg-purple-500" />
                                            <TimelineItem time="12:00" title="ML Project" subtitle="StartupK" color="bg-indigo-500" />
                                            <TimelineItem time="14:30" title="Portfolio" subtitle="Portfolio" color="bg-blue-500" />
                                            <TimelineItem time="15:00" title="Data Analysis" subtitle="Globex" color="bg-purple-400" />
                                            <TimelineItem time="16:30" title="Upcoming Event" subtitle="StartupK" color="bg-indigo-400" />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Sub-Component: Linear Skill Progress meter
function SkillBar({ label, value }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-650 dark:text-slate-350">{label}</span>
                <span className="text-slate-500 dark:text-slate-400">{value}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200 dark:border-slate-900/80">
                <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-slide-in-bar shadow-[0_0_10px_#a855f7]"
                    style={{ width: `${value}%` }}
                ></div>
            </div>
        </div>
    );
}

// Sub-Component: Jobs opportunities list row
function JobRow({ title, company }) {
    return (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-150 dark:border-slate-900 hover:border-purple-500/25 transition-all group">
            <div className="flex items-center gap-3">
                <div className="w-8.5 h-8.5 rounded-xl bg-purple-50 dark:bg-purple-950/45 text-purple-600 dark:text-purple-400 flex items-center justify-center text-sm shadow-inner group-hover:scale-105 transition-transform shrink-0">
                    <FaBriefcase size={12} />
                </div>
                <div>
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 tracking-tight leading-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {title}
                    </h4>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 block">{company}</span>
                </div>
            </div>
            <Link 
                to="/internship-finder"
                className="px-3.5 py-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:text-white border border-slate-200 dark:border-slate-850 hover:border-purple-500/35 bg-white dark:bg-slate-900/50 rounded-xl transition-all flex items-center gap-1 active:scale-95 cursor-pointer shadow-xs"
            >
                View
                <FaChevronRight size={7} />
            </Link>
        </div>
    );
}

// Sub-Component: Event timeline item
function TimelineItem({ time, title, subtitle, color }) {
    return (
        <div className="flex gap-4 items-start text-left">
            <div className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-450 w-9 shrink-0 text-right pt-0.5">
                {time}
            </div>
            <div className="relative flex flex-col items-center pt-1.5 shrink-0">
                <span className={`w-2.5 h-2.5 rounded-full ${color} shadow-inner`}></span>
                <span className="w-0.5 h-10 bg-slate-200 dark:bg-slate-900 mt-1 absolute top-3"></span>
            </div>
            <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-750 dark:text-slate-200 leading-tight">
                    {title}
                </h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">
                    {subtitle}
                </p>
            </div>
        </div>
    );
}

export default Dashboard;