import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
    FaMagic, FaFileAlt, FaInfoCircle, FaArrowRight, FaSearch, 
    FaMapMarkerAlt, FaFilter, FaCheckCircle, FaBuilding, FaUndoAlt
} from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import InternshipCard from "../components/InternshipCard";
import EmptyState from "../components/EmptyState";
import { getLatestResumeAnalysis, generateInternships } from "../services/resumeService";

function InternshipFinder() {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState("");

    // Interactive Search & Filters State
    const [searchQuery, setSearchQuery] = useState("");
    const [locationFilter, setLocationFilter] = useState("all");
    const [scoreFilter, setScoreFilter] = useState(0);

    // AI loader step tracker
    const [loaderStep, setLoaderStep] = useState(0);
    const loadingSteps = [
        "Parsing core skill parameters from your profile...",
        "Searching open tech vacancies across databases...",
        "Analyzing skill gaps and compatibility ratios...",
        "Structuring recommendation listings..."
    ];

    const demoInternships = [
        {
            company: "Google",
            role: "Software Engineer Intern",
            location: "Remote",
            stipend: "₹40,000/month",
            match: "95%",
            skills: ["React", "Node.js", "MongoDB"],
            applyUrl: "https://www.google.com/search?q=Google+Software+Engineer+Intern+jobs&ibp=htl;jobs"
        },
        {
            company: "Microsoft",
            role: "Frontend Intern",
            location: "Bangalore",
            stipend: "₹35,000/month",
            match: "90%",
            skills: ["React", "JavaScript", "Git"],
            applyUrl: "https://www.google.com/search?q=Microsoft+Frontend+Intern+jobs&ibp=htl;jobs"
        },
        {
            company: "Amazon",
            role: "Full Stack Intern",
            location: "Hyderabad",
            stipend: "₹45,000/month",
            match: "88%",
            skills: ["Node.js", "Express", "MongoDB"],
            applyUrl: "https://www.google.com/search?q=Amazon+Full+Stack+Intern+jobs&ibp=htl;jobs"
        },
        {
            company: "Vercel",
            role: "Frontend Engineer Intern",
            location: "Remote",
            stipend: "₹50,000/month",
            match: "94%",
            skills: ["Next.js", "React", "TailwindCSS"],
            applyUrl: "https://www.google.com/search?q=Vercel+Frontend+Engineer+Intern+jobs&ibp=htl;jobs"
        },
        {
            company: "Razorpay",
            role: "Backend Architect Intern",
            location: "Bangalore",
            stipend: "₹30,000/month",
            match: "85%",
            skills: ["Node.js", "PostgreSQL", "Redis"],
            applyUrl: "https://www.google.com/search?q=Razorpay+Backend+Architect+Intern+jobs&ibp=htl;jobs"
        },
        {
            company: "Stripe",
            role: "Product Engineering Intern",
            location: "Remote",
            stipend: "₹60,000/month",
            match: "91%",
            skills: ["React", "TypeScript", "Node.js"],
            applyUrl: "https://www.google.com/search?q=Stripe+Product+Engineering+Intern+jobs&ibp=htl;jobs"
        }
    ];

    useEffect(() => {
        loadLatestAnalysis();
    }, []);

    // Step through load descriptions during match generation
    useEffect(() => {
        let interval;
        if (generating) {
            setLoaderStep(0);
            interval = setInterval(() => {
                setLoaderStep(prev => (prev < 3 ? prev + 1 : prev));
            }, 1200);
        } else {
            setLoaderStep(0);
        }
        return () => clearInterval(interval);
    }, [generating]);

    const loadLatestAnalysis = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await getLatestResumeAnalysis();
            if (data.success) {
                setAnalysis(data.analysis);
            } else {
                setError(data.message || "Failed to fetch latest profile matching data.");
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setError("Error loading your latest profile data.");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateAIInternships = async () => {
        setGenerating(true);
        setError("");
        try {
            const data = await generateInternships();
            if (data.success && data.analysis) {
                setAnalysis(data.analysis);
            } else {
                setError(data.message || "Failed to generate AI matches.");
            }
        } catch (err) {
            console.error("Generation error:", err);
            setError("Failed to generate personalized internship matches.");
        } finally {
            setGenerating(false);
        }
    };

    const handleResetFilters = () => {
        setSearchQuery("");
        setLocationFilter("all");
        setScoreFilter(0);
    };

    const hasResume = !!analysis;
    const hasInternships = !!(analysis && analysis.internships && analysis.internships.length > 0);
    const displayInternships = hasInternships ? analysis.internships : demoInternships;
    const matchScore = hasResume ? analysis.score : 85;

    // Filtered internships computation
    const filteredInternships = displayInternships.filter(item => {
        const matchesSearch = 
            (item.company || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.role || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.skills || []).some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesLocation = 
            locationFilter === "all" ||
            (item.location || "").toLowerCase().includes(locationFilter.toLowerCase());
            
        const itemMatchScore = parseInt(item.match) || 85;
        const matchesScore = itemMatchScore >= scoreFilter;
        
        return matchesSearch && matchesLocation && matchesScore;
    });

    const topMatches = filteredInternships.filter(item => (parseInt(item.match) || 85) >= 90);
    const remainingMatches = filteredInternships.filter(item => (parseInt(item.match) || 85) < 90);

    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1 bg-gray-100 dark:bg-slate-950 min-h-screen relative bg-grid-pattern transition-colors duration-300 min-w-0">
                <Topbar />

                <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
                    {/* Header Banner */}
                    <div className="glass-panel p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
                        <div className="space-y-2">
                            <h1 className="text-3xl md:text-5xl font-black text-slate-850 dark:text-white flex items-center gap-3 tracking-tight">
                                <span className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-650 to-indigo-550 text-white shadow-lg shadow-purple-500/20 animate-float block">
                                    <FaBuilding className="text-2xl md:text-3xl" />
                                </span>
                                Internship Finder
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed">
                                AI-powered vacancy scanning. Match your skills from your resume with open positions and track your active application states.
                            </p>
                        </div>
                        {hasResume && !hasInternships && !generating && (
                            <button
                                onClick={handleGenerateAIInternships}
                                className="bg-gradient-to-r from-purple-600 to-indigo-650 hover:from-purple-500 hover:to-indigo-500 text-white px-5.5 py-3 rounded-2xl transition-all font-extrabold flex items-center gap-2 shadow-md shadow-purple-950/20 cursor-pointer text-sm"
                            >
                                <FaMagic className="text-xs" /> Generate AI Matches
                            </button>
                        )}
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-950/25 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300 p-4 rounded-2xl flex items-center gap-3 animate-fade-in text-sm font-medium">
                            <FaInfoCircle className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800/80">
                            <div className="animate-spin h-10 w-10 border-4 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
                            <p className="text-gray-500 dark:text-slate-400 mt-4 font-medium">Scanning vacancy repositories...</p>
                        </div>
                    ) : (
                        <>
                            {/* CTA & Match Summary Widgets */}
                            {!hasResume && (
                                <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-purple-500/20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 glow-purple">
                                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full filter blur-[100px] animate-spin-slow"></div>
                                    <div className="relative z-10 flex-1 space-y-2.5">
                                        <span className="bg-purple-800/50 border border-purple-750/60 text-purple-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit">
                                            <FaMagic /> Match Engine Offline
                                        </span>
                                        <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                                            Unlock Custom AI Matching
                                        </h3>
                                        <p className="text-slate-400 max-w-2xl text-xs md:text-sm leading-relaxed">
                                            We haven't analyzed your resume credentials yet. Complete your resume check to calculate matching compatibility ratings and extract matching positions instantly.
                                        </p>
                                    </div>
                                    <Link
                                        to="/resume-analysis"
                                        className="relative z-10 bg-white text-purple-700 hover:bg-purple-50 active:scale-[0.98] px-6 py-3.5 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 whitespace-nowrap cursor-pointer text-sm"
                                    >
                                        Analyze Resume <FaArrowRight className="text-xs" />
                                    </Link>
                                </div>
                            )}

                            {hasResume && !hasInternships && !generating && (
                                <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-purple-500/20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 glow-purple">
                                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full filter blur-[100px] animate-spin-slow"></div>
                                    <div className="relative z-10 flex-1 space-y-2.5">
                                        <span className="bg-purple-800/50 border border-purple-750/60 text-purple-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit">
                                            <FaMagic /> Data Ready
                                        </span>
                                        <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                                            Find Your Tailored Opportunities
                                        </h3>
                                        <p className="text-slate-400 max-w-2xl text-xs md:text-sm leading-relaxed">
                                            You have uploaded your profile details! Run the matching algorithm now to sync active opportunities with your tech skillset.
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleGenerateAIInternships}
                                        className="relative z-10 bg-gradient-to-r from-purple-600 to-indigo-650 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 whitespace-nowrap cursor-pointer text-sm"
                                    >
                                        <FaMagic className="text-xs" /> Generate AI Matches
                                    </button>
                                </div>
                            )}

                            {generating && (
                                <div className="glass-panel p-8 md:p-12 rounded-3xl border border-slate-200/50 dark:border-slate-800 text-center space-y-6 shadow-sm">
                                    <div className="relative w-20 h-20 mx-auto">
                                        <div className="absolute inset-0 border-4 border-purple-600/25 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                    <div className="space-y-2 max-w-md mx-auto">
                                        <h3 className="text-xl font-extrabold text-slate-850 dark:text-white">AI Engine Running</h3>
                                        <p className="text-purple-600 dark:text-purple-400 text-sm font-bold animate-pulse">
                                            {loadingSteps[loaderStep]}
                                        </p>
                                        <div className="flex gap-1.5 justify-center mt-4">
                                            {loadingSteps.map((_, idx) => (
                                                <span 
                                                    key={idx} 
                                                    className={`w-2.5 h-1.5 rounded-full transition-all duration-300 ${
                                                        idx <= loaderStep ? "bg-purple-600 w-6" : "bg-slate-200 dark:bg-slate-800"
                                                    }`}
                                                ></span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!generating && (
                                <>
                                    {/* Overall Compatiblity Gauge Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* Radial match progress gauge */}
                                        <div className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-slate-850 md:col-span-2 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xs">
                                            <div className="space-y-2 text-center md:text-left">
                                                <h2 className="text-lg font-black text-slate-850 dark:text-white">
                                                    {hasResume ? "AI Skills Compatibility Rating" : "Compatibility Rating (Demo)"}
                                                </h2>
                                                <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                                                    Calculated by comparing your extracted resume skills and coursework tags against target criteria across tech companies.
                                                </p>
                                                <div className="flex items-center justify-center md:justify-start gap-2 pt-2 text-xs font-semibold text-purple-600 dark:text-purple-400">
                                                    <FaCheckCircle className="text-[10px]" /> Verified Profile Matches Active
                                                </div>
                                            </div>
                                            
                                            {/* Beautiful custom gauge ring */}
                                            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                                    <circle cx="50" cy="50" r="40" stroke="rgba(168, 85, 247, 0.1)" strokeWidth="8" fill="transparent" />
                                                    <circle 
                                                        cx="50" 
                                                        cy="50" 
                                                        r="40" 
                                                        stroke="url(#purpleGradient)" 
                                                        strokeWidth="8" 
                                                        fill="transparent" 
                                                        strokeDasharray="251.2" 
                                                        strokeDashoffset={251.2 - (251.2 * matchScore) / 100}
                                                        strokeLinecap="round"
                                                        className="transition-all duration-1000 ease-out"
                                                    />
                                                    <defs>
                                                        <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                            <stop offset="0%" stopColor="#a855f7" />
                                                            <stop offset="100%" stopColor="#6366f1" />
                                                        </linearGradient>
                                                    </defs>
                                                </svg>
                                                <span className="absolute text-2xl font-black text-slate-850 dark:text-white">
                                                    {matchScore}%
                                                </span>
                                            </div>
                                        </div>

                                        {/* Status box metrics */}
                                        <div className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-slate-850 flex flex-col justify-between shadow-xs">
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Database Matches</span>
                                                <h3 className="text-3xl font-black text-slate-850 dark:text-white tracking-tight">
                                                    {filteredInternships.length}
                                                </h3>
                                                <p className="text-xs text-slate-500 font-medium">Positions matching current criteria filters.</p>
                                            </div>
                                            <div className="text-xs font-bold text-slate-450 border-t border-slate-100 dark:border-slate-800/80 pt-3 flex justify-between">
                                                <span>Remote positions:</span>
                                                <span className="text-slate-850 dark:text-white">
                                                    {displayInternships.filter(i => (i.location || "").toLowerCase().includes("remote")).length}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Search & Dynamic Interactive Filters Panel */}
                                    <div className="glass-panel p-5 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 shadow-sm">
                                        {/* Search Box */}
                                        <div className="relative flex-1 group">
                                            <input 
                                                type="text" 
                                                placeholder="Search by role, company, or skills..." 
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full bg-slate-900/5 dark:bg-slate-950/60 border border-slate-200/50 dark:border-slate-850 text-slate-800 dark:text-slate-200 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/20 text-xs placeholder-slate-450 transition-all"
                                            />
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-purple-400 transition-colors">
                                                <FaSearch className="w-3.5 h-3.5" />
                                            </span>
                                        </div>

                                        {/* Dropdown Filters */}
                                        <div className="flex flex-wrap sm:flex-nowrap gap-3 items-center">
                                            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl px-3 py-1.5">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Location:</span>
                                                <select 
                                                    value={locationFilter}
                                                    onChange={(e) => setLocationFilter(e.target.value)}
                                                    className="bg-transparent text-xs font-bold text-slate-700 dark:text-slate-300 border-none outline-none focus:ring-0 cursor-pointer pr-1"
                                                >
                                                    <option value="all">All Locations</option>
                                                    <option value="remote">Remote</option>
                                                    <option value="bangalore">Bangalore</option>
                                                    <option value="hyderabad">Hyderabad</option>
                                                </select>
                                            </div>

                                            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl px-3 py-1.5">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Min Match:</span>
                                                <select 
                                                    value={scoreFilter}
                                                    onChange={(e) => setScoreFilter(Number(e.target.value))}
                                                    className="bg-transparent text-xs font-bold text-slate-700 dark:text-slate-300 border-none outline-none focus:ring-0 cursor-pointer pr-1"
                                                >
                                                    <option value="0">All Scores</option>
                                                    <option value="90">90%+ Match</option>
                                                    <option value="85">85%+ Match</option>
                                                </select>
                                            </div>

                                            {(searchQuery || locationFilter !== "all" || scoreFilter !== 0) && (
                                                <button
                                                    onClick={handleResetFilters}
                                                    className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-400 font-bold bg-red-500/5 border border-red-500/10 rounded-xl px-3 py-2.5 transition-all cursor-pointer active:scale-95 shrink-0"
                                                >
                                                    <FaUndoAlt className="text-[10px]" /> Reset
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Listings Grid */}
                                    {filteredInternships.length === 0 ? (
                                        <div className="text-center py-20 border border-dashed border-slate-250 dark:border-slate-850 rounded-3xl">
                                            <EmptyState
                                                title="No Matching Positions Found"
                                                description="Try adjusting your location tags, lowering the match filter threshold, or clearing your text query."
                                            />
                                        </div>
                                    ) : (
                                        <div className="space-y-10">
                                            {/* Top Matches Section */}
                                            {topMatches.length > 0 && (
                                                <div className="space-y-5">
                                                    <h2 className="text-xl font-extrabold text-slate-850 dark:text-white flex items-center gap-2 tracking-tight">
                                                        🔥 Prime Matches (90%+)
                                                    </h2>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                        {topMatches.map((internship, index) => (
                                                            <InternshipCard
                                                                key={index}
                                                                company={internship.company}
                                                                role={internship.role}
                                                                location={internship.location}
                                                                stipend={internship.stipend}
                                                                match={typeof internship.match === 'string' && internship.match.endsWith('%') ? internship.match : `${internship.match}%`}
                                                                skills={internship.skills || []}
                                                                applyUrl={internship.applyUrl || internship.link}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Remaining Matches Section */}
                                            {remainingMatches.length > 0 && (
                                                <div className="space-y-5">
                                                    <h2 className="text-xl font-extrabold text-slate-850 dark:text-white flex items-center gap-2 tracking-tight">
                                                        💼 Core Opportunities
                                                    </h2>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                        {remainingMatches.map((internship, index) => (
                                                            <InternshipCard
                                                                key={index}
                                                                company={internship.company}
                                                                role={internship.role}
                                                                location={internship.location}
                                                                stipend={internship.stipend}
                                                                match={typeof internship.match === 'string' && internship.match.endsWith('%') ? internship.match : `${internship.match}%`}
                                                                skills={internship.skills || []}
                                                                applyUrl={internship.applyUrl || internship.link}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default InternshipFinder;