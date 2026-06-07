import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaRoad, FaMagic, FaInfoCircle, FaArrowRight, FaCheckCircle, FaTrashAlt, FaFileAlt, FaTrophy } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import RoleSelector from "../components/RoleSelector";
import RoadmapCard from "../components/RoadmapCard";
import EmptyState from "../components/EmptyState";
import { fetchRoadmap } from "../services/roadmapService";
import { getLatestResumeAnalysis } from "../services/resumeService";

function CareerRoadmap() {
    const [activeTab, setActiveTab] = useState(() => {
        return localStorage.getItem("roadmap_activeTab") || "role";
    });

    // Role-based state
    const [selectedRole, setSelectedRole] = useState(() => {
        return localStorage.getItem("roadmap_selectedRole") || "";
    });
    const [loading, setLoading] = useState(false);
    const [showRoadmap, setShowRoadmap] = useState(() => {
        return localStorage.getItem("roadmap_showRoadmap") === "true";
    });
    const [roadmapData, setRoadmapData] = useState(() => {
        const saved = localStorage.getItem("roadmap_data");
        try {
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            return null;
        }
    });
    const [completedSkills, setCompletedSkills] = useState(() => {
        const saved = localStorage.getItem("roadmap_completedSkills");
        try {
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            return {};
        }
    });
    const [error, setError] = useState("");
    const [loaderStep, setLoaderStep] = useState(0);

    const loadingSteps = [
        "Ingesting career path specifications...",
        "Mapping prerequisite skills and developer competencies...",
        "Designing month-by-month sequential checkpoints...",
        "Compiling curated project recommendations...",
        "Assembling your interactive roadmap board..."
    ];

    // Personal (Resume-based) state
    const [latestAnalysis, setLatestAnalysis] = useState(null);
    const [loadingPersonal, setLoadingPersonal] = useState(false);
    const [errorPersonal, setErrorPersonal] = useState("");
    const [completedPersonalSteps, setCompletedPersonalSteps] = useState(() => {
        const saved = localStorage.getItem("roadmap_completedPersonalSteps");
        try {
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            return {};
        }
    });

    useEffect(() => {
        localStorage.setItem("roadmap_activeTab", activeTab);
        if (activeTab === "personal") {
            loadLatestAnalysis();
        }
    }, [activeTab]);

    useEffect(() => {
        let interval;
        if (loading) {
            setLoaderStep(0);
            interval = setInterval(() => {
                setLoaderStep(prev => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
            }, 1200);
        } else {
            setLoaderStep(0);
        }
        return () => clearInterval(interval);
    }, [loading]);

    const loadLatestAnalysis = async () => {
        setLoadingPersonal(true);
        setErrorPersonal("");
        try {
            const data = await getLatestResumeAnalysis();
            if (data.success) {
                setLatestAnalysis(data.analysis);
            } else {
                setErrorPersonal(data.message || "Failed to fetch latest analysis.");
            }
        } catch (err) {
            console.error("Personal roadmap fetch error:", err);
            setErrorPersonal("Failed to load your personal resume roadmap.");
        } finally {
            setLoadingPersonal(false);
        }
    };

    const generateRoadmap = async () => {
        if (!selectedRole) {
            alert("Please select a role.");
            return;
        }

        setLoading(true);
        setShowRoadmap(false);
        setError("");
        setCompletedSkills({});

        try {
            const result = await fetchRoadmap(selectedRole);
            if (result.success && result.data) {
                setRoadmapData(result.data);
                setShowRoadmap(true);
                localStorage.setItem("roadmap_data", JSON.stringify(result.data));
                localStorage.setItem("roadmap_showRoadmap", "true");
                localStorage.setItem("roadmap_selectedRole", selectedRole);
                localStorage.setItem("roadmap_completedSkills", JSON.stringify({}));
            } else {
                setError(result.message || "Failed to generate roadmap. Please try again.");
            }
        } catch (err) {
            console.error("Roadmap generation error:", err);
            const errMsg = err.response?.data?.message || "Error generating roadmap. Please try again.";
            setError(errMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleSkill = (skillKey) => {
        setCompletedSkills((prev) => {
            const updated = {
                ...prev,
                [skillKey]: !prev[skillKey],
            };
            localStorage.setItem("roadmap_completedSkills", JSON.stringify(updated));
            return updated;
        });
    };

    const handleResetRoleRoadmap = () => {
        if (window.confirm("Are you sure you want to reset this roadmap? This will clear your checked skills progress.")) {
            setSelectedRole("");
            setRoadmapData(null);
            setShowRoadmap(false);
            setCompletedSkills({});
            setError("");
            localStorage.removeItem("roadmap_data");
            localStorage.removeItem("roadmap_showRoadmap");
            localStorage.removeItem("roadmap_selectedRole");
            localStorage.removeItem("roadmap_completedSkills");
        }
    };

    const handleTogglePersonalStep = (stepKey) => {
        setCompletedPersonalSteps((prev) => {
            const updated = {
                ...prev,
                [stepKey]: !prev[stepKey],
            };
            localStorage.setItem("roadmap_completedPersonalSteps", JSON.stringify(updated));
            return updated;
        });
    };

    // Calculations for generic role-based roadmap
    const totalSkills = roadmapData && Array.isArray(roadmapData.roadmap)
        ? roadmapData.roadmap.reduce((acc, curr) => acc + (Array.isArray(curr.skills) ? curr.skills.length : 0), 0)
        : 0;
    const completedCount = Object.values(completedSkills).filter(Boolean).length;
    const progressPercent = totalSkills > 0 ? Math.round((completedCount / totalSkills) * 100) : 0;

    // Calculations for personal resume roadmap
    const personalSteps = latestAnalysis && Array.isArray(latestAnalysis.roadmap) ? latestAnalysis.roadmap : [];
    const totalPersonalSteps = personalSteps.length;
    const completedPersonalCount = personalSteps.filter((step, index) => {
        const stepKey = `${latestAnalysis?._id}-${step.step || index}`;
        return !!completedPersonalSteps[stepKey];
    }).length;
    const personalProgressPercent = totalPersonalSteps > 0 ? Math.round((completedPersonalCount / totalPersonalSteps) * 100) : 0;

    const [unlockedBadge, setUnlockedBadge] = useState(null);

    useEffect(() => {
        if (loading || loadingPersonal) return;
        
        const currentUnlocks = [];
        if (progressPercent >= 20) currentUnlocks.push({ id: 'role_bronze', name: 'Role-Based Bronze Medal', points: 300 });
        if (progressPercent >= 50) currentUnlocks.push({ id: 'role_silver', name: 'Role-Based Silver Medal', points: 600 });
        if (progressPercent >= 75) currentUnlocks.push({ id: 'role_gold', name: 'Role-Based Gold Medal', points: 1000 });
        if (progressPercent >= 90) currentUnlocks.push({ id: 'role_diamond', name: 'Role-Based Diamond Star', points: 1500 });

        if (personalProgressPercent >= 20) currentUnlocks.push({ id: 'resume_bronze', name: 'Resume-Based Bronze Medal', points: 300 });
        if (personalProgressPercent >= 50) currentUnlocks.push({ id: 'resume_silver', name: 'Resume-Based Silver Medal', points: 600 });
        if (personalProgressPercent >= 75) currentUnlocks.push({ id: 'resume_gold', name: 'Resume-Based Gold Medal', points: 1000 });
        if (personalProgressPercent >= 90) currentUnlocks.push({ id: 'resume_diamond', name: 'Resume-Based Diamond Star', points: 1500 });

        let notified = [];
        try {
            const saved = localStorage.getItem("roadmap_notifiedBadges");
            notified = saved ? JSON.parse(saved) : [];
        } catch (e) {
            notified = [];
        }

        const newUnlock = currentUnlocks.find(badge => !notified.includes(badge.id));
        if (newUnlock) {
            notified.push(newUnlock.id);
            localStorage.setItem("roadmap_notifiedBadges", JSON.stringify(notified));
            setUnlockedBadge(newUnlock);
        }
    }, [progressPercent, personalProgressPercent, loading, loadingPersonal]);

    const getAboutToAchieveMessage = () => {
        if (activeTab === "role") {
            if (!roadmapData || totalSkills === 0) return null;
            const nextCompletedCount = completedCount + 1;
            const nextProgress = Math.round((nextCompletedCount / totalSkills) * 100);
            
            if (progressPercent < 20 && nextProgress >= 20) {
                return { badge: "Bronze Medal", bonus: 300, icon: "🥉" };
            }
            if (progressPercent < 50 && nextProgress >= 50) {
                return { badge: "Silver Medal", bonus: 600, icon: "🥈" };
            }
            if (progressPercent < 75 && nextProgress >= 75) {
                return { badge: "Gold Medal", bonus: 1000, icon: "🥇" };
            }
            if (progressPercent < 90 && nextProgress >= 90) {
                return { badge: "Diamond Star", bonus: 1500, icon: "💎" };
            }
        } else {
            if (!latestAnalysis || totalPersonalSteps === 0) return null;
            const nextCompletedCount = completedPersonalCount + 1;
            const nextProgress = Math.round((nextCompletedCount / totalPersonalSteps) * 100);
            
            if (personalProgressPercent < 20 && nextProgress >= 20) {
                return { badge: "Bronze Medal", bonus: 300, icon: "🥉" };
            }
            if (personalProgressPercent < 50 && nextProgress >= 50) {
                return { badge: "Silver Medal", bonus: 600, icon: "🥈" };
            }
            if (personalProgressPercent < 75 && nextProgress >= 75) {
                return { badge: "Gold Medal", bonus: 1000, icon: "🥇" };
            }
            if (personalProgressPercent < 90 && nextProgress >= 90) {
                return { badge: "Diamond Star", bonus: 1500, icon: "💎" };
            }
        }
        return null;
    };
    
    const almostBadge = getAboutToAchieveMessage();

    return (
        <div className="flex bg-gray-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen font-sans">
            <Sidebar />

            <div className="flex-1 min-h-screen flex flex-col overflow-hidden">
                <Topbar />

                <div className="p-8 flex-1 overflow-y-auto bg-grid-pattern max-h-[calc(100vh-64px)]">
                    
                    {/* Header Details */}
                    <div className="mb-8 text-left">
                        <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tight">
                            Career Roadmap
                        </h1>
                        <p className="text-slate-500 dark:text-slate-450 text-xs mt-1">
                            Track checklist points and navigate customized career learning guides.
                        </p>
                    </div>

                    {/* Navigation Tabs (Glassmorphic) */}
                    <div className="flex gap-4 mb-8 bg-white dark:bg-slate-900/40 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 dark:border-slate-900 max-w-sm shadow-xs">
                        <button
                            onClick={() => setActiveTab("role")}
                            className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-2 cursor-pointer ${
                                activeTab === "role"
                                    ? "bg-purple-605 bg-purple-600 text-white shadow-md shadow-purple-500/15"
                                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/50 hover:text-slate-800 dark:hover:text-white"
                            }`}
                        >
                            <FaRoad /> Role-Based
                        </button>
                        <button
                            onClick={() => setActiveTab("personal")}
                            className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-2 cursor-pointer ${
                                activeTab === "personal"
                                    ? "bg-purple-605 bg-purple-600 text-white shadow-md shadow-purple-500/15"
                                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/50 hover:text-slate-800 dark:hover:text-white"
                            }`}
                        >
                            <FaMagic /> Resume-Based
                        </button>
                    </div>

                    {/* Almost There Alert Banner */}
                    {almostBadge && (
                        <div className="bg-gradient-to-r from-purple-100 via-indigo-50 to-purple-100 dark:from-purple-900/40 dark:via-indigo-950/60 dark:to-purple-900/40 border border-purple-200 dark:border-purple-500/20 text-slate-800 dark:text-white rounded-3xl p-5 shadow-md dark:shadow-2xl mb-8 flex items-center justify-between gap-4 animate-pulse text-left">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{almostBadge.icon}</span>
                                <p className="font-bold text-sm">
                                    <span className="text-purple-600 dark:text-purple-300">Almost there!</span> You are only <span className="font-black text-slate-900 dark:text-white">1 topic left</span> to unlock the <span className="text-yellow-600 dark:text-yellow-400 font-extrabold">{almostBadge.badge} (+{almostBadge.bonus} Pts)</span>!
                                </p>
                            </div>
                            <span className="text-[10px] uppercase tracking-wider bg-white dark:bg-white/10 text-slate-700 dark:text-white px-3.5 py-1.5 rounded-xl font-black whitespace-nowrap border border-slate-200 dark:border-white/5">
                                One Step Away
                            </span>
                        </div>
                    )}

                    {/* TAB CONTENT: ROLE ROADMAP */}
                    {activeTab === "role" && (
                        <div className="space-y-8 animate-fade-in-up">
                            {!showRoadmap && !loading && (
                                <div className="space-y-6">
                                    <RoleSelector
                                        selectedRole={selectedRole}
                                        setSelectedRole={setSelectedRole}
                                    />

                                    <button
                                        onClick={generateRoadmap}
                                        className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-purple-500/15 hover:shadow-xl hover:shadow-purple-500/25 transition-all active:scale-[0.98] flex items-center gap-2 cursor-pointer text-sm"
                                    >
                                        <FaMagic /> Generate Roadmap
                                    </button>
                                </div>
                            )}

                            {error && (
                                <div className="p-4.5 bg-red-50 dark:bg-red-950/45 border border-red-200 dark:border-red-800/40 text-red-755 dark:text-red-300 rounded-2xl text-xs flex items-center gap-3 text-left">
                                    <FaInfoCircle />
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Stepped AI Loading UI */}
                            {loading && (
                                <div className="mt-10 max-w-2xl mx-auto bg-slate-900/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative text-center animate-fade-in">
                                    {/* Glowing accent lights */}
                                    <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full filter blur-[50px] pointer-events-none"></div>
                                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full filter blur-[50px] pointer-events-none"></div>
                                    
                                    <div className="flex flex-col items-center justify-center space-y-6">
                                        {/* Spinning pulsing AI loader */}
                                        <div className="relative w-20 h-20">
                                            <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
                                            <div className="absolute inset-0 border-4 border-t-transparent border-purple-500 rounded-full animate-spin"></div>
                                            <div className="absolute inset-3 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl shadow-lg shadow-purple-500/35 animate-pulse">
                                                🗺️
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <h3 className="text-xl font-bold text-white tracking-tight">FutureForge AI Roadmap Generator</h3>
                                            <p className="text-purple-400 text-sm font-semibold animate-pulse tracking-wide h-6">
                                                {loadingSteps[loaderStep]}
                                            </p>
                                        </div>

                                        {/* Segmented Progress bar */}
                                        <div className="flex gap-1.5 w-60 justify-center">
                                            {loadingSteps.map((_, idx) => (
                                                <span 
                                                    key={idx} 
                                                    className={`h-1.5 rounded-full transition-all duration-500 ${
                                                        idx <= loaderStep ? "bg-purple-500 w-8" : "bg-slate-800 w-3.5"
                                                    }`}
                                                ></span>
                                            ))}
                                        </div>

                                        <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                                            Please wait while the AI structures your sequential roadmap goals.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {showRoadmap && roadmapData && (
                                <div className="space-y-8 animate-fade-in-up">
                                    {/* Progress Card (Glassmorphic) */}
                                    <div className="bg-white dark:bg-slate-900/35 backdrop-blur-xl border border-slate-200 dark:border-slate-900 p-6.5 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md dark:shadow-2xl text-left">
                                        <div className="flex-1">
                                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                                Roadmap Progress: <span className="bg-gradient-to-r from-purple-600 to-indigo-650 dark:from-purple-400 dark:to-indigo-305 text-transparent bg-clip-text font-black">{roadmapData.role || selectedRole}</span>
                                            </h2>
                                            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-950 rounded-full mt-4 overflow-hidden border border-slate-200 dark:border-slate-900">
                                                <div
                                                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_#a855f7]"
                                                    style={{ width: `${progressPercent}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center justify-center bg-purple-50 dark:bg-purple-950/45 text-purple-755 dark:text-purple-400 px-5 py-3.5 rounded-2xl font-black border border-purple-150 dark:border-purple-900/40 min-w-[110px] shadow-inner shrink-0">
                                            <span className="text-2xl">{progressPercent}%</span>
                                            <span className="text-[10px] uppercase mt-0.5 tracking-wider font-bold text-purple-600 dark:text-purple-500">Completed</span>
                                        </div>
                                        <button
                                            onClick={handleResetRoleRoadmap}
                                            className="bg-slate-50 hover:bg-slate-150 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 dark:hover:text-white px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-850 hover:border-purple-500/25 transition-all font-bold flex items-center justify-center gap-2 cursor-pointer max-md:w-full shrink-0 text-sm active:scale-95 shadow-xs"
                                            title="Choose another role"
                                        >
                                            <FaTrashAlt /> Reset Track
                                        </button>
                                    </div>

                                    {/* Roadmap Grid Monthly cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {Array.isArray(roadmapData.roadmap) && roadmapData.roadmap.map((item, index) => (
                                            <RoadmapCard
                                                key={index}
                                                month={item.month}
                                                skills={Array.isArray(item.skills) ? item.skills : []}
                                                completedSkills={completedSkills}
                                                onToggleSkill={handleToggleSkill}
                                            />
                                        ))}
                                    </div>

                                    {/* Recommended Projects */}
                                    {Array.isArray(roadmapData.projects) && roadmapData.projects.length > 0 && (
                                        <div className="bg-white dark:bg-slate-900/35 backdrop-blur-xl border border-slate-200 dark:border-slate-900 rounded-3xl p-6.5 shadow-md dark:shadow-2xl text-left">
                                            <h2 className="text-xl font-bold mb-5 text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
                                                🚀 Recommended Projects
                                            </h2>
                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {roadmapData.projects.map((project, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex items-start gap-3.5 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-900/80 hover:border-purple-500/20 rounded-2xl transition-all font-semibold text-slate-700 dark:text-slate-300 text-sm leading-relaxed"
                                                    >
                                                        <span className="text-purple-600 dark:text-purple-400 text-base shrink-0">🚀</span>
                                                        <span>
                                                            {project.startsWith("🚀") ? project.substring(2).trim() : project}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB CONTENT: PERSONAL RESUME ROADMAP */}
                    {activeTab === "personal" && (
                        <div className="space-y-8 animate-fade-in-up">
                            {loadingPersonal && (
                                <div className="text-center py-20 bg-white dark:bg-slate-900/25 border border-slate-200 dark:border-slate-900 rounded-3xl backdrop-blur-md shadow-md">
                                    <div className="animate-spin h-10 w-10 border-4 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
                                    <p className="text-slate-550 dark:text-slate-455 mt-4 font-medium text-sm">Fetching your customized roadmap...</p>
                                </div>
                            )}

                            {errorPersonal && (
                                <div className="p-4.5 bg-red-50 dark:bg-red-950/45 border border-red-200 dark:border-red-800/40 text-red-755 dark:text-red-300 rounded-2xl text-xs flex items-center gap-3 text-left">
                                    <FaInfoCircle />
                                    <span>{errorPersonal}</span>
                                </div>
                            )}

                            {!loadingPersonal && !latestAnalysis && (
                                <div className="bg-white dark:bg-gradient-to-r dark:from-purple-950/40 dark:via-slate-900/50 dark:to-indigo-950/20 border border-slate-200 dark:border-slate-900 rounded-3xl p-8 shadow-md dark:shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden text-left">
                                    <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/5 rounded-full filter blur-[80px] -z-10"></div>
                                    <div className="flex-1 space-y-2.5 z-10">
                                        <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2.5">
                                            <FaFileAlt className="text-purple-600 dark:text-purple-400" /> Unlock Your Personalized Resume Roadmap
                                        </h3>
                                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-sm leading-relaxed">
                                            We haven't analyzed your resume yet. Upload your resume now to instantly identify your skillset gaps and generate a custom, interactive step-by-step learning roadmap tailored just for you!
                                        </p>
                                    </div>
                                    <Link
                                        to="/resume-analysis"
                                        className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-purple-500/15 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer text-center text-sm z-10 active:scale-[0.98]"
                                    >
                                        Analyze Resume <FaArrowRight />
                                    </Link>
                                </div>
                            )}

                            {!loadingPersonal && latestAnalysis && (
                                <div className="space-y-8 animate-fade-in-up">
                                    {/* Progress Card (Glassmorphic) */}
                                    <div className="bg-white dark:bg-slate-900/35 backdrop-blur-xl border border-slate-200 dark:border-slate-900 p-6.5 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md dark:shadow-2xl text-left">
                                        <div className="flex-1 text-left">
                                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                                Resume Roadmap: <span className="bg-gradient-to-r from-purple-600 to-indigo-650 dark:from-purple-450 dark:to-indigo-350 text-transparent bg-clip-text font-black">{latestAnalysis.career}</span>
                                            </h2>
                                            <p className="text-slate-500 dark:text-slate-500 text-xs mt-1">Based on resume file: <span className="font-semibold text-slate-655 dark:text-slate-400">{latestAnalysis.fileName}</span></p>
                                            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-950 rounded-full mt-4 overflow-hidden border border-slate-200 dark:border-slate-900">
                                                <div
                                                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_#a855f7]"
                                                    style={{ width: `${personalProgressPercent}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center justify-center bg-purple-50 dark:bg-purple-950/45 text-purple-755 dark:text-purple-400 px-5 py-3.5 rounded-2xl font-black border border-purple-150 dark:border-purple-900/40 min-w-[110px] shadow-inner shrink-0">
                                            <span className="text-2xl">{personalProgressPercent}%</span>
                                            <span className="text-[10px] uppercase mt-0.5 tracking-wider font-bold text-purple-600 dark:text-purple-500">Steps Done</span>
                                        </div>
                                    </div>

                                    {/* Connected Vertical Timeline */}
                                    {personalSteps.length === 0 ? (
                                        <div className="mt-8">
                                            <EmptyState
                                                title="No Steps Found"
                                                description="Your resume roadmap is empty. Try analyzing your resume again."
                                            />
                                        </div>
                                    ) : (
                                        <div className="mt-12 relative border-l border-slate-200 dark:border-slate-900 ml-6 md:ml-10 space-y-6 pb-10 text-left">
                                            {personalSteps.map((step, index) => {
                                                const stepKey = `${latestAnalysis._id}-${step.step || index}`;
                                                const isCompleted = !!completedPersonalSteps[stepKey];

                                                return (
                                                    <div 
                                                        key={index} 
                                                        className="relative pl-8 md:pl-12 group animate-fade-in"
                                                    >
                                                        {/* Step Checkbox node */}
                                                        <button
                                                            onClick={() => handleTogglePersonalStep(stepKey)}
                                                            className={`absolute -left-[17px] top-1.5 w-8.5 h-8.5 rounded-xl border flex items-center justify-center font-bold text-xs transition-all shadow-md group-hover:scale-105 cursor-pointer z-10 ${
                                                                isCompleted
                                                                    ? "bg-purple-600 border-purple-550 text-white shadow-purple-900/40"
                                                                    : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-900 text-slate-500 hover:border-purple-500"
                                                            }`}
                                                        >
                                                            {isCompleted ? (
                                                                <FaCheckCircle className="text-sm" />
                                                            ) : (
                                                                <span>{step.step || index + 1}</span>
                                                            )}
                                                        </button>

                                                        {/* Checkpoint Card block */}
                                                        <div
                                                            onClick={() => handleTogglePersonalStep(stepKey)}
                                                            className={`bg-white dark:bg-slate-900/35 backdrop-blur-xl rounded-2xl p-5 border border-slate-200 dark:border-slate-900 transition-all cursor-pointer shadow-sm ${
                                                                isCompleted
                                                                    ? "dark:border-slate-900/80 bg-slate-50/50 dark:bg-slate-900/10 opacity-60 hover:opacity-85 shadow-none"
                                                                    : "hover:border-purple-500/15 hover:shadow-lg dark:hover:shadow-2xl hover:-translate-y-0.5"
                                                            }`}
                                                        >
                                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                                                <h3 className={`font-bold text-base md:text-lg transition-all ${
                                                                    isCompleted ? "line-through text-slate-400 dark:text-slate-550" : "text-slate-750 dark:text-slate-200"
                                                                }`}>
                                                                    {step.title || step.skill}
                                                                </h3>
                                                                {step.skill && step.title && (
                                                                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/45 border border-purple-100 dark:border-purple-900/35 text-purple-600 dark:text-purple-400 whitespace-nowrap md:self-center self-start shadow-inner">
                                                                        {step.skill}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className={`text-xs mt-2 transition-all ${
                                                                isCompleted ? "text-slate-400 dark:text-slate-600" : "text-slate-500 dark:text-slate-450"
                                                            }`}>
                                                                Click to toggle step. Mark as completed once you have studied this topic.
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Unlocked Confetti Modal Banner */}
                    {unlockedBadge && (
                        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-purple-500/30 rounded-3xl p-8 max-w-sm text-center relative overflow-hidden shadow-2xl animate-scale-up mx-4">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500/20 rounded-full filter blur-3xl"></div>
                                <div className="w-20 h-20 bg-gradient-to-tr from-yellow-500 to-amber-400 rounded-full flex items-center justify-center text-white text-4xl mx-auto shadow-lg shadow-yellow-500/20 mb-6 animate-bounce">
                                    <FaTrophy />
                                </div>
                                <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Congratulations!</h2>
                                <p className="text-purple-600 dark:text-purple-300 mt-2 font-bold text-lg">
                                    {unlockedBadge.id.includes("bronze") && "Yah! Congrats you achieved Bronze! Ready for the next Silver medal!"}
                                    {unlockedBadge.id.includes("silver") && "Yah! Congrats you achieved Silver! Ready for the next Gold medal!"}
                                    {unlockedBadge.id.includes("gold") && "Yah! Congrats you achieved Gold! Ready for the next Diamond medal!"}
                                    {unlockedBadge.id.includes("diamond") && "Yah! Congrats you achieved Diamond! You have fully mastered this track!"}
                                </p>
                                <p className="text-slate-500 dark:text-slate-400 mt-4 text-sm leading-relaxed">
                                    You reached a milestone on your learning journey. You've been awarded a bonus of:
                                </p>
                                <div className="mt-5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-6 w-fit mx-auto font-black text-2xl text-yellow-600 dark:text-yellow-300">
                                    +{unlockedBadge.points} Pts
                                </div>
                                <button
                                    onClick={() => setUnlockedBadge(null)}
                                    className="w-full mt-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all cursor-pointer shadow-md shadow-purple-950/30 active:scale-[0.98] text-sm"
                                >
                                    Awesome!
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CareerRoadmap;