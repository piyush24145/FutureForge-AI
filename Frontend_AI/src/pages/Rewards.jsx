import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
    FaTrophy, FaAward, FaMedal, FaCheckCircle, FaStar, FaCrown, 
    FaArrowRight, FaGamepad, FaLock, FaGlobe, FaRoad, FaMagic, 
    FaHistory, FaCheck, FaExclamationCircle, FaTimes, FaUndoAlt, FaFileAlt
} from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getLatestResumeAnalysis } from "../services/resumeService";

function Rewards() {
    const [latestAnalysis, setLatestAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load states from local storage for generic role-based roadmap
    const [selectedRole] = useState(() => {
        return localStorage.getItem("roadmap_selectedRole") || "";
    });
    const [roadmapData] = useState(() => {
        const saved = localStorage.getItem("roadmap_data");
        try {
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            return null;
        }
    });
    const [completedSkills] = useState(() => {
        const saved = localStorage.getItem("roadmap_completedSkills");
        try {
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            return {};
        }
    });

    // Load states for personal resume-based roadmap
    const [completedPersonalSteps] = useState(() => {
        const saved = localStorage.getItem("roadmap_completedPersonalSteps");
        try {
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            return {};
        }
    });

    // States for interactive upgrades
    const [activeTab, setActiveTab] = useState("all");
    const [showLedger, setShowLedger] = useState(false);
    const [redeemedItem, setRedeemedItem] = useState(null);

    const [spentPoints, setSpentPoints] = useState(() => {
        return Number(localStorage.getItem("rewards_spent_points")) || 0;
    });

    const [claimedItems, setClaimedItems] = useState(() => {
        try {
            const saved = localStorage.getItem("rewards_claimed_items");
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });

    useEffect(() => {
        loadLatestAnalysis();
    }, []);

    const loadLatestAnalysis = async () => {
        setLoading(true);
        try {
            const data = await getLatestResumeAnalysis();
            if (data.success) {
                setLatestAnalysis(data.analysis);
            }
        } catch (err) {
            console.error("Error fetching analysis for rewards:", err);
        } finally {
            setLoading(false);
        }
    };

    const [unlockedBadge, setUnlockedBadge] = useState(null);

    // Calculate Role-Based Roadmap Progress & Points
    const totalRoleSkills = roadmapData && Array.isArray(roadmapData.roadmap)
        ? roadmapData.roadmap.reduce((acc, curr) => acc + (Array.isArray(curr.skills) ? curr.skills.length : 0), 0)
        : 0;
    const completedRoleCount = Object.values(completedSkills).filter(Boolean).length;
    const roleProgress = totalRoleSkills > 0 ? Math.round((completedRoleCount / totalRoleSkills) * 100) : 0;

    const baseRolePoints = completedRoleCount * 20; // 20 points per skill
    const roleBronze = roleProgress >= 20;
    const roleSilver = roleProgress >= 50;
    const roleGold = roleProgress >= 75;
    const roleDiamond = roleProgress >= 90;
    const roleBonusPoints = (roleDiamond ? 1500 : (roleGold ? 1000 : (roleSilver ? 600 : (roleBronze ? 300 : 0))));

    // Calculate Resume-Based Roadmap Progress & Points
    const personalSteps = latestAnalysis && Array.isArray(latestAnalysis.roadmap) ? latestAnalysis.roadmap : [];
    const totalPersonalSteps = personalSteps.length;
    const completedPersonalCount = personalSteps.filter((step, index) => {
        const stepKey = `${latestAnalysis?._id}-${step.step || index}`;
        return !!completedPersonalSteps[stepKey];
    }).length;
    const personalProgress = totalPersonalSteps > 0 ? Math.round((completedPersonalCount / totalPersonalSteps) * 100) : 0;

    const baseResumePoints = completedPersonalCount * 50; // 50 points per step
    const resumeBronze = personalProgress >= 20;
    const resumeSilver = personalProgress >= 50;
    const resumeGold = personalProgress >= 75;
    const resumeDiamond = personalProgress >= 90;
    const resumeBonusPoints = (resumeDiamond ? 1500 : (resumeGold ? 1000 : (resumeSilver ? 600 : (resumeBronze ? 300 : 0))));

    useEffect(() => {
        if (loading) return;
        
        const currentUnlocks = [];
        if (roleProgress >= 20) currentUnlocks.push({ id: 'role_bronze', name: 'Role-Based Bronze Medal', points: 300 });
        if (roleProgress >= 50) currentUnlocks.push({ id: 'role_silver', name: 'Role-Based Silver Medal', points: 600 });
        if (roleProgress >= 75) currentUnlocks.push({ id: 'role_gold', name: 'Role-Based Gold Medal', points: 1000 });
        if (roleProgress >= 90) currentUnlocks.push({ id: 'role_diamond', name: 'Role-Based Diamond Star', points: 1500 });

        if (personalProgress >= 20) currentUnlocks.push({ id: 'resume_bronze', name: 'Resume-Based Bronze Medal', points: 300 });
        if (personalProgress >= 50) currentUnlocks.push({ id: 'resume_silver', name: 'Resume-Based Silver Medal', points: 600 });
        if (personalProgress >= 75) currentUnlocks.push({ id: 'resume_gold', name: 'Resume-Based Gold Medal', points: 1000 });
        if (personalProgress >= 90) currentUnlocks.push({ id: 'resume_diamond', name: 'Resume-Based Diamond Star', points: 1500 });

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
    }, [roleProgress, personalProgress, loading]);

    // Consolidated calculations
    const totalBasePoints = baseRolePoints + baseResumePoints;
    const totalBonusPoints = roleBonusPoints + resumeBonusPoints;
    const totalPoints = totalBasePoints + totalBonusPoints;
    const availablePoints = Math.max(0, totalPoints - spentPoints);

    // Determine User Level title
    const getLevelTitle = (points) => {
        if (points >= 3000) return "Master of Roadmaps 💎";
        if (points >= 1500) return "Elite Tech Explorer 🚀";
        if (points >= 600) return "Rising Developer 🌟";
        if (points >= 300) return "Active Learner ⚡";
        return "Tech Novice 🌱";
    };

    const currentRank = getLevelTitle(totalPoints);

    // Rank progress calculations
    const getRankProgress = (points) => {
        if (points >= 3000) return { percent: 100, next: "Max Rank Achieved 🎉", needed: 0 };
        if (points >= 1500) {
            const needed = 3000 - points;
            const percent = Math.min(100, Math.round(((points - 1500) / 1500) * 100));
            return { percent, next: "Master of Roadmaps 💎", needed };
        }
        if (points >= 600) {
            const needed = 1500 - points;
            const percent = Math.min(100, Math.round(((points - 600) / 900) * 100));
            return { percent, next: "Elite Tech Explorer 🚀", needed };
        }
        if (points >= 300) {
            const needed = 600 - points;
            const percent = Math.min(100, Math.round(((points - 300) / 300) * 100));
            return { percent, next: "Rising Developer 🌟", needed };
        }
        const needed = 300 - points;
        const percent = Math.min(100, Math.round((points / 300) * 100));
        return { percent, next: "Active Learner ⚡", needed };
    };

    const rankInfo = getRankProgress(totalPoints);

    // Role-based achievements
    const roleAchievements = [
        {
            id: 'role_bronze',
            name: "Role Bronze Medal",
            description: "Complete 20% progress on the Role-Based roadmap.",
            points: 300,
            unlocked: roleBronze,
            color: "from-amber-600 to-orange-500",
            glow: "shadow-amber-500/10 dark:shadow-amber-500/20",
            bg: "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-300",
            icon: <FaMedal className="text-3xl text-amber-600 dark:text-amber-500" />
        },
        {
            id: 'role_silver',
            name: "Role Silver Medal",
            description: "Reach 50% progress on the Role-Based roadmap.",
            points: 600,
            unlocked: roleSilver,
            color: "from-slate-400 to-zinc-300",
            glow: "shadow-slate-450/10 dark:shadow-slate-500/20",
            bg: "bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-805 text-slate-705 dark:text-slate-300",
            icon: <FaMedal className="text-3xl text-slate-450" />
        },
        {
            id: 'role_gold',
            name: "Role Gold Medal",
            description: "Achieve 75% progress on the Role-Based roadmap.",
            points: 1000,
            unlocked: roleGold,
            color: "from-yellow-500 to-amber-400",
            glow: "shadow-yellow-500/10 dark:shadow-yellow-500/20",
            bg: "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900/50 text-yellow-700 dark:text-yellow-300",
            icon: <FaAward className="text-3xl text-yellow-500" />
        },
        {
            id: 'role_diamond',
            name: "Role Diamond Star",
            description: "Reach 90%+ progress on the Role-Based roadmap.",
            points: 1500,
            unlocked: roleDiamond,
            color: "from-cyan-400 to-blue-500",
            glow: "shadow-cyan-500/10 dark:shadow-cyan-500/20",
            bg: "bg-cyan-50 dark:bg-cyan-950/20 border-cyan-200 dark:border-cyan-900/50 text-cyan-800 dark:text-cyan-300",
            icon: <FaCrown className="text-3xl text-cyan-500" />
        }
    ];

    // Resume-based achievements
    const resumeAchievements = [
        {
            id: 'resume_bronze',
            name: "Resume Bronze Medal",
            description: "Complete 20% progress on the Resume-Based roadmap.",
            points: 300,
            unlocked: resumeBronze,
            color: "from-amber-600 to-orange-500",
            glow: "shadow-amber-500/10 dark:shadow-amber-500/20",
            bg: "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-300",
            icon: <FaMedal className="text-3xl text-amber-600 dark:text-amber-500" />
        },
        {
            id: 'resume_silver',
            name: "Resume Silver Medal",
            description: "Reach 50% progress on the Resume-Based roadmap.",
            points: 600,
            unlocked: resumeSilver,
            color: "from-slate-400 to-zinc-300",
            glow: "shadow-slate-450/10 dark:shadow-slate-500/20",
            bg: "bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-805 text-slate-705 dark:text-slate-300",
            icon: <FaMedal className="text-3xl text-slate-455" />
        },
        {
            id: 'resume_gold',
            name: "Resume Gold Medal",
            description: "Achieve 75% progress on the Resume-Based roadmap.",
            points: 1000,
            unlocked: resumeGold,
            color: "from-yellow-500 to-amber-400",
            glow: "shadow-yellow-500/10 dark:shadow-yellow-500/20",
            bg: "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900/50 text-yellow-700 dark:text-yellow-300",
            icon: <FaAward className="text-3xl text-yellow-500" />
        },
        {
            id: 'resume_diamond',
            name: "Resume Diamond Star",
            description: "Reach 90%+ progress on the Resume-Based roadmap.",
            points: 1500,
            unlocked: resumeDiamond,
            color: "from-cyan-400 to-blue-500",
            glow: "shadow-cyan-500/10 dark:shadow-cyan-500/20",
            bg: "bg-cyan-50 dark:bg-cyan-950/20 border-cyan-200 dark:border-cyan-900/50 text-cyan-800 dark:text-cyan-300",
            icon: <FaCrown className="text-3xl text-cyan-500" />
        }
    ];

    const allMilestones = [...roleAchievements.map(x => ({...x, type: 'Role'})), ...resumeAchievements.map(x => ({...x, type: 'Resume'}))];

    const filteredMilestones = allMilestones.filter(item => {
        if (activeTab === "unlocked") return item.unlocked;
        if (activeTab === "locked") return !item.unlocked;
        return true;
    });

    const virtualProducts = [
        {
            id: "mentor_badge",
            title: "AI Mentor Gold Emblem",
            category: "Profile Cosmetic",
            points: 500,
            description: "Unlocks a custom golden neon emblem next to your profile avatar.",
            icon: <FaCrown className="text-yellow-500 text-2xl" />
        },
        {
            id: "pro_theme",
            title: "Cyberpunk Glow Skin",
            category: "Dashboard Theme",
            points: 800,
            description: "Unlock an ultra-premium neon dark theme for your workspace panel.",
            icon: <FaMagic className="text-pink-500 text-2xl" />
        },
        {
            id: "pdf_templates",
            title: "Premium Resume Pack",
            category: "Career Resource",
            points: 1200,
            description: "Download 5 ATS-optimized premium resume templates tailored for Big Tech.",
            icon: <FaFileAlt className="text-indigo-500 text-2xl" />
        },
        {
            id: "custom_avatar",
            title: "Cyber Explorer Avatars",
            category: "Avatar Pack",
            points: 1500,
            description: "Exclusive bundle of AI-generated technology themed profile avatars.",
            icon: <FaGamepad className="text-emerald-500 text-2xl" />
        }
    ];

    const handleRedeem = (item) => {
        if (availablePoints < item.points) return;
        const newSpent = spentPoints + item.points;
        setSpentPoints(newSpent);
        localStorage.setItem("rewards_spent_points", String(newSpent));

        const newClaimed = [...claimedItems, item.id];
        setClaimedItems(newClaimed);
        localStorage.setItem("rewards_claimed_items", JSON.stringify(newClaimed));

        setRedeemedItem(item);
        setTimeout(() => setRedeemedItem(null), 3000);
    };

    const handleResetClaims = () => {
        setSpentPoints(0);
        setClaimedItems([]);
        localStorage.setItem("rewards_spent_points", "0");
        localStorage.setItem("rewards_claimed_items", "[]");
    };

    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1 bg-gray-100 dark:bg-slate-950 min-h-screen relative bg-grid-pattern transition-colors duration-300 min-w-0">
                <Topbar />

                <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="glass-panel p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
                        <div className="space-y-2">
                            <h1 className="text-3xl md:text-5xl font-black text-slate-850 dark:text-white flex items-center gap-3 tracking-tight">
                                <span className="p-2.5 rounded-2xl bg-gradient-to-tr from-yellow-500 to-amber-400 text-white shadow-lg shadow-yellow-500/20 animate-float block">
                                    <FaTrophy className="text-2xl md:text-3xl" />
                                </span>
                                Rewards & Rank
                            </h1>
                            <p className="text-slate-500 dark:text-slate-450 text-sm md:text-base max-w-2xl leading-relaxed">
                                Complete your roadmaps, solve assessments, and earn developer score points to level up and redeem special aesthetic flairs!
                            </p>
                        </div>
                        
                        {/* Interactive Rank Progress Badge */}
                        <div className="w-full md:w-80 bg-slate-900/5 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 p-4.5 rounded-2xl">
                            <div className="flex justify-between items-center text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                                <span>Level Progress</span>
                                <span className="text-purple-600 dark:text-purple-400">{rankInfo.percent}%</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-850 h-2.5 rounded-full overflow-hidden">
                                <div 
                                    className="bg-gradient-to-r from-purple-600 to-indigo-500 h-full rounded-full transition-all duration-1000"
                                    style={{ width: `${rankInfo.percent}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between items-center text-xs mt-2 font-medium text-slate-500 dark:text-slate-450">
                                <span>{totalPoints} Pts</span>
                                <span>Next: {rankInfo.next}</span>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl shadow-md border border-slate-100 dark:border-slate-800/80">
                            <div className="animate-spin h-10 w-10 border-4 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
                            <p className="text-gray-500 dark:text-slate-400 mt-4 font-medium">Assembling your gamified rewards dashboard...</p>
                        </div>
                    ) : (
                        <>
                            {/* Hero Card & Stats Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Lifetime Membership Card (3D Holographic style) */}
                                <div className="perspective-1000 lg:col-span-2">
                                    <div className="tilt-card bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-purple-500/20 relative overflow-hidden flex flex-col justify-between min-h-[260px] glow-purple">
                                        {/* Graphic mesh layer */}
                                        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full filter blur-[100px] animate-spin-slow"></div>
                                        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-indigo-500/10 rounded-full filter blur-[80px]"></div>
                                        
                                        <div className="flex justify-between items-start z-10">
                                            <div className="space-y-1">
                                                <span className="bg-purple-800/50 border border-purple-700/60 text-purple-200 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit">
                                                    <FaStar className="animate-pulse" /> {currentRank}
                                                </span>
                                                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black block mt-2">Verified Career Card</span>
                                            </div>
                                            
                                            <button 
                                                onClick={() => setShowLedger(true)}
                                                className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 active:scale-95 text-xs text-slate-200 border border-white/10 rounded-xl px-3 py-1.5 font-bold cursor-pointer transition-all shadow-md backdrop-blur-md"
                                            >
                                                <FaHistory className="text-[10px]" /> View Ledger
                                            </button>
                                        </div>

                                        <div className="z-10 mt-8">
                                            <div className="flex items-baseline gap-2">
                                                <h2 className="text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-105 to-purple-300">
                                                    {availablePoints}
                                                </h2>
                                                <span className="text-purple-400 font-extrabold text-lg uppercase tracking-wider">Available Pts</span>
                                            </div>
                                            <p className="text-slate-400 text-xs mt-1 font-medium">
                                                Spend these points below in the Rewards shop. Lifetime Earned: <span className="text-white font-bold">{totalPoints} Pts</span>
                                            </p>
                                        </div>

                                        <div className="flex justify-between items-end border-t border-white/5 pt-4 mt-6 z-10 text-xs text-slate-450">
                                            <div>
                                                <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Learner Name</span>
                                                <span className="font-semibold text-slate-300">Active Developer</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">System Network</span>
                                                <span className="font-semibold text-purple-300">FutureForge.AI</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Track breakdown Stats panel */}
                                <div className="space-y-4 flex flex-col justify-between">
                                    <div className="glass-panel p-5 rounded-2xl flex items-center justify-between shadow-xs border border-slate-200/50 dark:border-slate-800/60">
                                        <div className="space-y-1">
                                            <span className="text-xs font-bold text-slate-450 uppercase tracking-wider block">Role Roadmap</span>
                                            <h4 className="text-lg font-black text-slate-850 dark:text-white leading-tight">
                                                {completedRoleCount} / {totalRoleSkills} Skills
                                            </h4>
                                        </div>
                                        <span className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-950/45 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-sm">
                                            {roleProgress}%
                                        </span>
                                    </div>

                                    <div className="glass-panel p-5 rounded-2xl flex items-center justify-between shadow-xs border border-slate-200/50 dark:border-slate-800/60">
                                        <div className="space-y-1">
                                            <span className="text-xs font-bold text-slate-450 uppercase tracking-wider block">Resume Roadmap</span>
                                            <h4 className="text-lg font-black text-slate-850 dark:text-white leading-tight">
                                                {completedPersonalCount} / {totalPersonalSteps} Steps
                                            </h4>
                                        </div>
                                        <span className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/45 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                                            {personalProgress}%
                                        </span>
                                    </div>

                                    <div className="glass-panel p-5 rounded-2xl flex items-center justify-between shadow-xs border border-slate-200/50 dark:border-slate-800/60">
                                        <div className="space-y-1">
                                            <span className="text-xs font-bold text-slate-450 uppercase tracking-wider block">Unlocked Badges</span>
                                            <h4 className="text-lg font-black text-slate-855 dark:text-white leading-tight">
                                                {[roleBronze, roleSilver, roleGold, roleDiamond, resumeBronze, resumeSilver, resumeGold, resumeDiamond].filter(Boolean).length} / 8 Earned
                                            </h4>
                                        </div>
                                        <span className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/45 text-amber-600 dark:text-amber-400 flex items-center justify-center text-lg">
                                            <FaAward />
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Active Tracks Overview Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Role Track progress block */}
                                <div className="glass-panel rounded-3xl p-6 shadow-sm border border-slate-200/60 dark:border-slate-800/80 flex flex-col justify-between space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="space-y-1">
                                                <h3 className="font-extrabold text-slate-855 dark:text-white text-xl flex items-center gap-2">
                                                    <FaRoad className="text-purple-600 dark:text-purple-400" /> Role-Based Track
                                                </h3>
                                                <p className="text-xs text-slate-500">
                                                    {roadmapData ? `Targeting: ${roadmapData.role || selectedRole}` : "No active role-based roadmap"}
                                                </p>
                                            </div>
                                            <span className="text-purple-700 dark:text-purple-300 bg-purple-100/60 dark:bg-purple-950/40 border border-purple-200/30 px-3 py-1 rounded-full text-xs font-black">
                                                +{baseRolePoints} Pts
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                                <div
                                                    className="bg-purple-600 dark:bg-purple-500 h-full rounded-full transition-all duration-1000"
                                                    style={{ width: `${roleProgress}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
                                                <span>Progress: {roleProgress}%</span>
                                                <span>{completedRoleCount} / {totalRoleSkills} Skills Completed</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-4">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Unlocked Milestones</span>
                                        <div className="flex flex-wrap gap-2">
                                            {roleBronze && <span className="bg-amber-100/60 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-200/50 dark:border-amber-900/50">🥉 Bronze</span>}
                                            {roleSilver && <span className="bg-slate-100 dark:bg-slate-800/60 text-slate-800 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-bold border border-slate-200/60 dark:border-slate-700">🥈 Silver</span>}
                                            {roleGold && <span className="bg-yellow-100/60 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-300 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200/50 dark:border-yellow-900/50">🥇 Gold</span>}
                                            {roleDiamond && <span className="bg-cyan-100/60 dark:bg-cyan-950/30 text-cyan-800 dark:text-cyan-300 px-3 py-1 rounded-full text-xs font-bold border border-cyan-200/50 dark:border-cyan-900/50">💎 Diamond</span>}
                                            {!roleBronze && <span className="text-slate-400 dark:text-slate-500 text-xs font-semibold italic bg-slate-50 dark:bg-slate-900/20 border border-slate-150 dark:border-slate-800 px-3 py-1 rounded-full">No medals unlocked</span>}
                                        </div>
                                        <div className="flex justify-end">
                                            <Link to="/career-roadmap" className="text-purple-600 dark:text-purple-400 hover:text-purple-500 text-xs font-bold flex items-center gap-1 hover:underline">
                                                Explore Track <FaArrowRight className="text-[10px]" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Resume Track progress block */}
                                <div className="glass-panel rounded-3xl p-6 shadow-sm border border-slate-200/60 dark:border-slate-800/80 flex flex-col justify-between space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="space-y-1">
                                                <h3 className="font-extrabold text-slate-850 dark:text-white text-xl flex items-center gap-2">
                                                    <FaMagic className="text-purple-600 dark:text-purple-400" /> Resume-Based Track
                                                </h3>
                                                <p className="text-xs text-slate-500">
                                                    {latestAnalysis ? `Targeting: ${latestAnalysis.career}` : "No active resume roadmap"}
                                                </p>
                                            </div>
                                            <span className="text-purple-700 dark:text-purple-300 bg-purple-100/60 dark:bg-purple-950/40 border border-purple-200/30 px-3 py-1 rounded-full text-xs font-black">
                                                +{baseResumePoints} Pts
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                                <div
                                                    className="bg-purple-600 dark:bg-purple-500 h-full rounded-full transition-all duration-1000"
                                                    style={{ width: `${personalProgress}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between items-center text-xs text-slate-505 font-medium">
                                                <span>Progress: {personalProgress}%</span>
                                                <span>{completedPersonalCount} / {totalPersonalSteps} Steps Completed</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-4">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Unlocked Milestones</span>
                                        <div className="flex flex-wrap gap-2">
                                            {resumeBronze && <span className="bg-amber-100/60 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-200/50 dark:border-amber-900/50">🥉 Bronze</span>}
                                            {resumeBronze && resumeSilver && <span className="bg-slate-100 dark:bg-slate-800/60 text-slate-800 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-bold border border-slate-200/60 dark:border-slate-700">🥈 Silver</span>}
                                            {resumeGold && <span className="bg-yellow-100/60 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-300 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200/50 dark:border-yellow-900/50">🥇 Gold</span>}
                                            {resumeDiamond && <span className="bg-cyan-100/60 dark:bg-cyan-950/30 text-cyan-800 dark:text-cyan-300 px-3 py-1 rounded-full text-xs font-bold border border-cyan-200/50 dark:border-cyan-900/50">💎 Diamond</span>}
                                            {!resumeBronze && <span className="text-slate-400 dark:text-slate-500 text-xs font-semibold italic bg-slate-50 dark:bg-slate-900/20 border border-slate-150 dark:border-slate-800 px-3 py-1 rounded-full">No medals unlocked</span>}
                                        </div>
                                        <div className="flex justify-end">
                                            {latestAnalysis ? (
                                                <Link to="/career-roadmap" className="text-purple-600 dark:text-purple-400 hover:text-purple-500 text-xs font-bold flex items-center gap-1 hover:underline">
                                                    Explore Track <FaArrowRight className="text-[10px]" />
                                                </Link>
                                            ) : (
                                                <Link to="/resume-analysis" className="text-purple-600 dark:text-purple-400 hover:text-purple-500 text-xs font-bold flex items-center gap-1 hover:underline">
                                                    Analyze Resume <FaArrowRight className="text-[10px]" />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Milestones & Badges Showcase Panel */}
                            <div className="glass-panel rounded-3xl p-6 shadow-sm border border-slate-200/60 dark:border-slate-800/80 space-y-6">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-extrabold text-slate-850 dark:text-white flex items-center gap-2">
                                            <FaAward className="text-purple-600 dark:text-purple-400" /> Milestone Records & Badges
                                        </h3>
                                        <p className="text-xs text-slate-500">
                                            Unlock milestone medals and points bonuses by progressing through career path checklists.
                                        </p>
                                    </div>

                                    {/* Filters navigation tab */}
                                    <div className="bg-slate-100 dark:bg-slate-900/80 p-1.5 rounded-xl flex gap-1 border border-slate-200/30 dark:border-slate-800">
                                        {[
                                            { key: "all", label: "All Badges" },
                                            { key: "unlocked", label: "Unlocked 🔓" },
                                            { key: "locked", label: "Locked 🔒" }
                                        ].map(tab => (
                                            <button
                                                key={tab.key}
                                                onClick={() => setActiveTab(tab.key)}
                                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                                    activeTab === tab.key
                                                        ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-xs border border-slate-200/30 dark:border-slate-700"
                                                        : "text-slate-450 hover:text-slate-700 dark:hover:text-slate-300"
                                                }`}
                                            >
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {filteredMilestones.length === 0 ? (
                                    <div className="text-center py-12 border border-dashed border-slate-250 dark:border-slate-850 rounded-2xl">
                                        <FaExclamationCircle className="mx-auto text-slate-300 dark:text-slate-700 text-3xl mb-3" />
                                        <p className="text-slate-450 font-bold text-sm">No milestones match your current filter settings.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {filteredMilestones.map((item, index) => (
                                            <div
                                                key={index}
                                                className={`tilt-card rounded-2xl p-5 border text-center transition-all flex flex-col justify-between relative group ${
                                                    item.unlocked
                                                        ? `bg-gradient-to-b ${item.bg} ${item.glow} hover:shadow-lg border-transparent -translate-y-0.5`
                                                        : "bg-slate-50/50 dark:bg-slate-900/10 border-slate-200 dark:border-slate-800/80 opacity-55 hover:opacity-75"
                                                }`}
                                            >
                                                {/* Lock/Unlock overlay badges */}
                                                <div className="absolute top-3 right-3 z-10">
                                                    {item.unlocked ? (
                                                        <FaCheckCircle className="text-emerald-500 text-base" />
                                                    ) : (
                                                        <FaLock className="text-slate-400 dark:text-slate-650 text-xs" />
                                                    )}
                                                </div>

                                                <div className="flex flex-col items-center">
                                                    <span className="text-[9px] uppercase font-black tracking-widest text-slate-400 mb-3 block">
                                                        {item.type} Milestone
                                                    </span>

                                                    {/* Glowing circle container */}
                                                    <div className={`w-16 h-16 rounded-full bg-gradient-to-tr ${
                                                        item.unlocked ? item.color : "from-slate-200 to-slate-100 dark:from-slate-805 dark:to-slate-900"
                                                    } text-white flex items-center justify-center shadow-inner mb-4 relative overflow-hidden`}>
                                                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                        {item.icon}
                                                    </div>

                                                    <h4 className="font-extrabold text-slate-850 dark:text-white text-lg tracking-tight">
                                                        {item.name}
                                                    </h4>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                                                        {item.description}
                                                    </p>
                                                </div>

                                                <div className="mt-5 pt-3 border-t border-slate-105 dark:border-slate-800/80 flex items-center justify-center gap-1.5 text-xs">
                                                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Bonus Pts:</span>
                                                    <span className={`font-black ${item.unlocked ? "text-purple-700 dark:text-purple-450" : "text-slate-400 dark:text-slate-650"}`}>
                                                        +{item.points} Pts
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Rewards Redemption Store */}
                            <div className="glass-panel rounded-3xl p-6 shadow-sm border border-slate-200/60 dark:border-slate-800/80 space-y-6">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-extrabold text-slate-850 dark:text-white flex items-center gap-2">
                                            <FaCrown className="text-purple-600 dark:text-purple-400" /> Rewards Center
                                        </h3>
                                        <p className="text-xs text-slate-505 font-medium">
                                            Redeem your active available points balance for custom aesthetic skins and document packs.
                                        </p>
                                    </div>

                                    {claimedItems.length > 0 && (
                                        <button
                                            onClick={handleResetClaims}
                                            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-450 font-bold bg-red-500/5 border border-red-500/10 rounded-xl px-3 py-1.5 transition-all cursor-pointer active:scale-95"
                                        >
                                            <FaUndoAlt className="text-[10px]" /> Reset Purchases
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {virtualProducts.map((product) => {
                                        const isClaimed = claimedItems.includes(product.id);
                                        const canAfford = availablePoints >= product.points;

                                        return (
                                            <div
                                                key={product.id}
                                                className={`tilt-card rounded-2xl p-5 border flex flex-col justify-between transition-all relative ${
                                                    isClaimed
                                                        ? "bg-slate-50/40 dark:bg-slate-900/25 border-emerald-500/30"
                                                        : "bg-white dark:bg-slate-905/60 border-slate-200 dark:border-slate-800/80 hover:shadow-md hover:border-purple-500/40"
                                                }`}
                                            >
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-start">
                                                        <span className="text-[9px] uppercase font-black tracking-widest text-slate-405 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                                                            {product.category}
                                                        </span>
                                                        <span className={`text-xs font-black ${isClaimed ? "text-emerald-555" : "text-purple-600 dark:text-purple-400"}`}>
                                                            {product.points} Pts
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shadow-inner">
                                                            {product.icon}
                                                        </div>
                                                        <h4 className="font-extrabold text-slate-850 dark:text-white text-sm tracking-tight leading-tight">
                                                            {product.title}
                                                        </h4>
                                                    </div>

                                                    <p className="text-xs text-slate-505 dark:text-slate-400 leading-relaxed font-normal">
                                                        {product.description}
                                                    </p>
                                                </div>

                                                <div className="mt-6">
                                                    {isClaimed ? (
                                                        <span className="w-full flex items-center justify-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold py-2.5 rounded-xl select-none">
                                                            <FaCheck /> Claimed
                                                        </span>
                                                    ) : (
                                                        <button
                                                            disabled={!canAfford}
                                                            onClick={() => handleRedeem(product)}
                                                            className={`w-full text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer border ${
                                                                canAfford
                                                                    ? "bg-gradient-to-r from-purple-600 to-indigo-650 hover:from-purple-500 hover:to-indigo-500 text-white border-transparent active:scale-[0.98] shadow-sm shadow-purple-950/20"
                                                                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-850 cursor-not-allowed"
                                                            }`}
                                                        >
                                                            {canAfford ? "Redeem Reward" : "Insufficient Pts"}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Points Ledger Modal */}
                    {showLedger && (
                        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4">
                            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full relative overflow-hidden shadow-2xl animate-scale-in">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full filter blur-3xl"></div>
                                
                                <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-6">
                                    <h3 className="text-xl font-extrabold text-slate-855 dark:text-white flex items-center gap-2">
                                        <FaHistory className="text-purple-600 dark:text-purple-400" /> Points History Ledger
                                    </h3>
                                    <button 
                                        onClick={() => setShowLedger(false)}
                                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-650 transition-colors cursor-pointer"
                                    >
                                        <FaTimes size={16} />
                                    </button>
                                </div>

                                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                                    {/* Lifetime Earned Credits */}
                                    <div className="space-y-2">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Earned Score</span>
                                        
                                        <div className="flex justify-between items-center text-xs p-3 bg-slate-50 dark:bg-slate-950/30 border border-slate-200/50 dark:border-slate-850 rounded-xl">
                                            <div>
                                                <span className="font-bold text-slate-705 dark:text-slate-300 block">Role-Based Roadmap Skills</span>
                                                <span className="text-[10px] text-slate-505">{completedRoleCount} skills completed ({baseRolePoints} base points)</span>
                                            </div>
                                            <span className="font-extrabold text-emerald-500">+{baseRolePoints} Pts</span>
                                        </div>

                                        <div className="flex justify-between items-center text-xs p-3 bg-slate-50 dark:bg-slate-950/30 border border-slate-200/50 dark:border-slate-850 rounded-xl">
                                            <div>
                                                <span className="font-bold text-slate-705 dark:text-slate-300 block">Resume-Based Roadmap Steps</span>
                                                <span className="text-[10px] text-slate-550">{completedPersonalCount} steps completed ({baseResumePoints} base points)</span>
                                            </div>
                                            <span className="font-extrabold text-emerald-500">+{baseResumePoints} Pts</span>
                                        </div>

                                        {/* Milestones check */}
                                        {allMilestones.filter(m => m.unlocked).map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-xs p-3 bg-purple-50/50 dark:bg-purple-950/10 border border-purple-150/40 dark:border-purple-900/30 rounded-xl">
                                                <div>
                                                    <span className="font-bold text-purple-900 dark:text-purple-300 block">{item.name}</span>
                                                    <span className="text-[10px] text-purple-650 dark:text-purple-400">{item.type} milestone badge unlocked</span>
                                                </div>
                                                <span className="font-extrabold text-emerald-555">+{item.points} Pts</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Redeemed Credits */}
                                    {claimedItems.length > 0 && (
                                        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Purchased Rewards</span>
                                            {claimedItems.map((claimedId) => {
                                                const product = virtualProducts.find(p => p.id === claimedId);
                                                if (!product) return null;
                                                return (
                                                    <div key={claimedId} className="flex justify-between items-center text-xs p-3 bg-red-50/50 dark:bg-red-950/10 border border-red-150/30 dark:border-red-900/20 rounded-xl">
                                                        <div>
                                                            <span className="font-bold text-red-905 dark:text-red-300 block">{product.title}</span>
                                                            <span className="text-[10px] text-slate-500">{product.category} redemption</span>
                                                        </div>
                                                        <span className="font-extrabold text-red-500">-{product.points} Pts</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 pt-4 border-t border-slate-105 dark:border-slate-800/80 flex items-center justify-between">
                                    <div className="text-xs space-y-1">
                                        <span className="text-slate-450 font-bold block">Lifetime: {totalPoints} Pts</span>
                                        <span className="text-slate-455 font-bold block">Spent: {spentPoints} Pts</span>
                                    </div>
                                    <div className="bg-purple-600/10 border border-purple-500/20 rounded-2xl py-2 px-5 font-black text-lg text-purple-700 dark:text-purple-300">
                                        {availablePoints} Available
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Redeemed toast notification popup */}
                    {redeemedItem && (
                        <div className="fixed bottom-6 right-6 bg-slate-900 text-white border border-purple-500/30 py-3.5 px-6 rounded-2xl flex items-center gap-3.5 shadow-2xl z-50 animate-fade-in-up">
                            <span className="p-2 rounded-xl bg-purple-500/20 text-purple-350">
                                {redeemedItem.icon}
                            </span>
                            <div>
                                <h4 className="font-extrabold text-sm text-slate-200">Claimed Successfully!</h4>
                                <p className="text-[10px] text-slate-400">{redeemedItem.title} unlocked</p>
                            </div>
                        </div>
                    )}

                    {/* Unlocked Badge Confetti Modal */}
                    {unlockedBadge && (
                        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
                            <div className="bg-slate-900 border border-purple-500/30 rounded-3xl p-8 max-w-sm text-center relative overflow-hidden shadow-2xl animate-scale-in mx-4">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500/20 rounded-full filter blur-3xl"></div>
                                <div className="w-20 h-20 bg-gradient-to-tr from-yellow-500 to-amber-400 rounded-full flex items-center justify-center text-white text-4xl mx-auto shadow-lg shadow-yellow-500/20 mb-6 animate-bounce">
                                    <FaTrophy />
                                </div>
                                <h2 className="text-3xl font-extrabold text-white tracking-tight">Congratulations!</h2>
                                <p className="text-purple-300 mt-2 font-bold text-lg leading-snug">
                                    {unlockedBadge.id.includes("bronze") && "Yah! Congrats you achieved Bronze! Ready for the next Silver medal!"}
                                    {unlockedBadge.id.includes("silver") && "Yah! Congrats you achieved Silver! Ready for the next Gold medal!"}
                                    {unlockedBadge.id.includes("gold") && "Yah! Congrats you achieved Gold! Ready for the next Diamond medal!"}
                                    {unlockedBadge.id.includes("diamond") && "Yah! Congrats you achieved Diamond! You have fully mastered this track!"}
                                </p>
                                <p className="text-slate-450 mt-4 text-xs leading-relaxed font-normal">
                                    You reached a milestone on your learning journey. You've been awarded a bonus of:
                                </p>
                                <div className="mt-5 bg-white/5 border border-white/10 rounded-2xl py-3 px-6 w-fit mx-auto font-black text-2xl text-yellow-300">
                                    +{unlockedBadge.points} Pts
                                </div>
                                <button
                                    onClick={() => setUnlockedBadge(null)}
                                    className="w-full mt-8 bg-gradient-to-r from-purple-600 to-indigo-650 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all cursor-pointer shadow-md shadow-purple-950/30 active:scale-[0.98]"
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

export default Rewards;
