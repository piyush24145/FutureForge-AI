import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getUserProfile, updateUserProfile } from "../services/userService";
import { getReadinessScore } from "../services/interviewService";

function Profile() {
    const [profileData, setProfileData] = useState(null);
    const [readinessScore, setReadinessScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("personal"); // personal, academic, skills

    // Form states for modal edit
    const [formName, setFormName] = useState("");
    const [formEmail, setFormEmail] = useState("");
    const [formDegree, setFormDegree] = useState("");
    const [formMajor, setFormMajor] = useState("");
    const [formGradYear, setFormGradYear] = useState("");
    const [formGoal, setFormGoal] = useState("");
    const [formProjects, setFormProjects] = useState(0);
    const [formInternships, setFormInternships] = useState(0);
    const [formSkills, setFormSkills] = useState([]);
    const [skillInput, setSkillInput] = useState("");
    const [saveLoading, setSaveLoading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const [profileRes, readinessRes] = await Promise.all([
                getUserProfile(),
                getReadinessScore()
            ]);

            if (profileRes.success && profileRes.user) {
                setProfileData(profileRes.user);
                
                // Initialize form values
                const userObj = profileRes.user;
                setFormName(userObj.name || "");
                setFormEmail(userObj.email || "");
                setFormDegree(userObj.profile?.education?.degree || "");
                setFormMajor(userObj.profile?.education?.major || "");
                setFormGradYear(userObj.profile?.education?.gradYear || "");
                setFormGoal(userObj.profile?.careerGoal || "");
                setFormProjects(userObj.profile?.projectsCompleted || 0);
                setFormInternships(userObj.profile?.internshipsApplied || 0);
                setFormSkills(userObj.profile?.skills || []);
            }

            if (readinessRes.success) {
                setReadinessScore(readinessRes.score || 0);
            }
        } catch (err) {
            console.error("Failed to load user profile metrics:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaveLoading(true);
        try {
            const payload = {
                name: formName,
                email: formEmail,
                skills: formSkills,
                education: {
                    degree: formDegree,
                    major: formMajor,
                    gradYear: formGradYear
                },
                careerGoal: formGoal,
                projectsCompleted: formProjects,
                internshipsApplied: formInternships
            };

            const res = await updateUserProfile(payload);
            if (res.success && res.user) {
                setProfileData(res.user);
                // Also update localStorage user info to reflect name changes immediately
                const cachedUser = localStorage.getItem("user");
                if (cachedUser) {
                    try {
                        const parsed = JSON.parse(cachedUser);
                        parsed.name = res.user.name;
                        parsed.email = res.user.email;
                        localStorage.setItem("user", JSON.stringify(parsed));
                    } catch (e) {
                        console.error("Failed to update cached user details:", e);
                    }
                }
                setIsModalOpen(false);
                alert("Profile Updated Successfully!");
            }
        } catch (err) {
            console.error("Failed to save profile:", err);
            alert("Error updating profile. Please try again.");
        } finally {
            setSaveLoading(false);
        }
    };

    const handleAddSkill = (e) => {
        e.preventDefault();
        const cleaned = skillInput.trim();
        if (cleaned && !formSkills.some(s => s.toLowerCase() === cleaned.toLowerCase())) {
            setFormSkills([...formSkills, cleaned]);
            setSkillInput("");
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setFormSkills(formSkills.filter(s => s !== skillToRemove));
    };

    // Helper to auto-categorize skill badges with specific colors by developer stack
    const getSkillStyle = (skill) => {
        const s = skill.toLowerCase();
        if (s.includes("react") || s.includes("js") || s.includes("javascript") || s.includes("frontend") || s.includes("css") || s.includes("html") || s.includes("tailwind")) {
            return "bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800/60";
        }
        if (s.includes("node") || s.includes("express") || s.includes("backend") || s.includes("api") || s.includes("rest") || s.includes("next")) {
            return "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60";
        }
        if (s.includes("mongo") || s.includes("sql") || s.includes("db") || s.includes("database") || s.includes("postgres") || s.includes("redis")) {
            return "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60";
        }
        if (s.includes("python") || s.includes("java") || s.includes("c") || s.includes("git") || s.includes("docker") || s.includes("aws")) {
            return "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800/60";
        }
        return "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60";
    };

    if (loading) {
        return (
            <div className="flex">
                <Sidebar />
                <div className="flex-1 bg-gray-100 dark:bg-slate-950 min-h-screen flex flex-col min-w-0">
                    <Topbar />
                    <div className="p-4 sm:p-8 flex-1 flex items-center justify-center bg-grid-pattern">
                        <div className="text-center">
                            <div className="animate-spin h-14 w-14 border-4 border-purple-600 border-t-transparent rounded-full mx-auto shadow-lg"></div>
                            <p className="text-gray-500 dark:text-slate-400 mt-5 font-semibold text-lg animate-pulse">
                                Retrieving Developer Profile...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Dynamic completion score and milestone status calculations
    const milestoneSteps = [
        { label: "Account Setup", done: true, desc: "Registered successfully" },
        { label: "Education Profile", done: !!(profileData?.profile?.education?.degree || profileData?.profile?.education?.major), desc: "Add Academic Details" },
        { label: "Target Roles", done: !!profileData?.profile?.careerGoal, desc: "Add Career Objectives" },
        { label: "Core Skills", done: !!(profileData?.profile?.skills && profileData.profile.skills.length > 0), desc: "Map Tech Stack Tags" }
    ];

    let completionScore = 25;
    if (milestoneSteps[1].done) completionScore += 25;
    if (milestoneSteps[2].done) completionScore += 25;
    if (milestoneSteps[3].done) completionScore += 25;

    const displayName = profileData?.name || "Student User";
    const displayEmail = profileData?.email || "student@example.com";
    const initial = displayName ? displayName.charAt(0).toUpperCase() : "S";

    // SVG Readiness Dial Calculation
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (readinessScore / 100) * circumference;

    return (
        <div className="flex bg-gray-105 dark:bg-slate-955 min-h-screen">
            <Sidebar />

            <div className="flex-1 min-h-screen flex flex-col min-w-0 overflow-hidden">
                <Topbar />

                <div className="p-4 sm:p-8 flex-1 bg-grid-pattern overflow-y-auto max-h-[calc(100vh-64px)]">
                    
                    {/* Glassmorphic Hero Banner Block */}
                    <div className="relative rounded-3xl p-8 bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-800 text-white shadow-xl overflow-hidden border border-purple-500/25 animate-fade-in-up">
                        {/* Interactive glow blobs */}
                        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none animate-pulse"></div>
                        <div className="absolute -bottom-10 left-1/3 w-60 h-60 bg-purple-500/20 rounded-full blur-2xl pointer-events-none"></div>

                        <div className="relative flex flex-col md:flex-row justify-between items-center gap-6 z-10">
                            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                                {/* Glowing Initial Avatar with Active Pulse Ring */}
                                <div className="relative group">
                                    <div className="absolute -inset-1.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse-dot"></div>
                                    <div className="relative w-24 h-24 rounded-full bg-slate-900 text-white flex items-center justify-center text-4xl font-extrabold border-2 border-white/60 shadow-inner animate-float">
                                        {initial}
                                    </div>
                                    <span className="absolute bottom-1 right-1 h-4 w-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full shadow-md" title="Active Account"></span>
                                </div>

                                <div>
                                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                                        <h1 className="text-3xl font-extrabold tracking-tight drop-shadow-md">
                                            {displayName}
                                        </h1>
                                        <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-white/10">
                                            Student Dev
                                        </span>
                                    </div>
                                    
                                    {/* Email Indicator */}
                                    <p className="text-white/80 mt-2 flex items-center justify-center md:justify-start gap-2 text-sm font-medium">
                                        <svg className="w-4 h-4 text-purple-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0l-7.5-4.615a2.25 2.25 0 01-1.07-1.916V6.75" />
                                        </svg>
                                        {displayEmail}
                                    </p>
                                    
                                    {/* Career Goal Status Sub-Indicator */}
                                    <p className="text-purple-100 font-semibold mt-2 flex items-center justify-center md:justify-start gap-2 text-sm">
                                        <svg className="w-4 h-4 text-purple-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 0M12 7.5v6.75m0 0l-1.5-1.5m1.5 1.5l1.5-1.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {profileData?.profile?.careerGoal ? `Aiming for: ${profileData.profile.careerGoal}` : "Aspiring Software Engineer"}
                                    </p>
                                </div>
                            </div>

                            <button 
                                onClick={() => {
                                    setActiveTab("personal");
                                    setIsModalOpen(true);
                                }}
                                className="bg-white hover:bg-slate-50 text-indigo-700 px-6 py-3 rounded-2xl font-bold transition-all shadow-md active:scale-98 cursor-pointer flex items-center gap-2 text-sm border border-transparent hover:border-white/20"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                                </svg>
                                Edit Profile
                            </button>
                        </div>
                    </div>

                    {/* Interactive Completion Milestone Progress Bar */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-md mt-8 border border-slate-100 dark:border-slate-800/60 animate-fade-in-up">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
                                    Profile Strength Completion
                                </h2>
                                <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">
                                    Maintain comprehensive records to unlock highly customized AI mentorship sessions.
                                </p>
                            </div>
                            <span className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">
                                {completionScore}%
                            </span>
                        </div>

                        {/* Interactive Milestone Indicator Map */}
                        <div className="relative mt-8 px-4">
                            {/* Horizontal Connecting lines */}
                            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 z-0 rounded-full"></div>
                            <div 
                                className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-600 -translate-y-1/2 z-0 rounded-full transition-all duration-700"
                                style={{ width: `${Math.max(0, (completionScore - 25) / 75 * 100)}%` }}
                            ></div>

                            <div className="relative flex justify-between items-center z-10">
                                {milestoneSteps.map((step, idx) => (
                                    <div key={idx} className="flex flex-col items-center group">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-md border-2 transition-all duration-500 ${
                                            step.done 
                                                ? "bg-purple-600 text-white border-purple-200 dark:border-purple-900 glow-purple" 
                                                : "bg-slate-50 dark:bg-slate-850 text-slate-400 border-slate-200 dark:border-slate-800"
                                        }`}>
                                            {step.done ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                </svg>
                                            ) : (
                                                <span>{idx + 1}</span>
                                            )}
                                        </div>
                                        <span className={`text-xs font-bold mt-3 transition-colors duration-300 ${
                                            step.done ? "text-purple-600 dark:text-purple-400" : "text-slate-400 dark:text-slate-600"
                                        }`}>
                                            {step.label}
                                        </span>
                                        <span className="text-[10px] text-slate-400 dark:text-slate-600 mt-0.5 hidden sm:block">
                                            {step.done ? "Complete" : step.desc}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Metrics Ledger Grid with Trophy & Dial Gauge */}
                    <div className="grid md:grid-cols-3 gap-6 mt-8">
                        {/* Projects Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-md border border-slate-100 dark:border-slate-800/60 flex items-center justify-between tilt-card glow-border hover:border-purple-500/25">
                            <div>
                                <h3 className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-wider">
                                    Portfolio Projects
                                </h3>
                                <p className="text-4xl font-black mt-3 text-slate-800 dark:text-slate-100">
                                    {profileData?.profile?.projectsCompleted || 0}
                                </p>
                                <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-2">
                                    ★ Milestones achieved
                                </p>
                            </div>
                            <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-2xl border border-purple-100 dark:border-purple-900/50">
                                <svg className="w-8 h-8 text-purple-600 dark:text-purple-400 animate-float" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-5.25c-.621 0-1.125.504-1.125 1.125v3.375m9 0h-9m9-3.375c.621 0 1.125-.504 1.125-1.125V8.25c0-.621-.504-1.125-1.125-1.125M6 15.375c-.621 0-1.125-.504-1.125-1.125V8.25c0-.621.504-1.125 1.125-1.125m11.25 0H6m11.25 0V5.25a2.25 2.25 0 00-2.25-2.25h-6.75a2.25 2.25 0 00-2.25 2.25v2.25" />
                                </svg>
                            </div>
                        </div>

                        {/* Internships Applied Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-md border border-slate-100 dark:border-slate-800/60 flex items-center justify-between tilt-card glow-border hover:border-indigo-500/25">
                            <div>
                                <h3 className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-wider">
                                    Internship Finder Apps
                                </h3>
                                <p className="text-4xl font-black mt-3 text-slate-800 dark:text-slate-100">
                                    {profileData?.profile?.internshipsApplied || 0}
                                </p>
                                <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-2">
                                    ⚡ Applications submitted
                                </p>
                            </div>
                            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
                                <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .621-.504 1.125-1.125 1.125H4.875A1.125 1.125 0 013.75 18.4V14.15m16.5 0c0-1.2-.35-2.35-.97-3.32a3 3 0 00-2.58-1.58H6.8a3 3 0 00-2.58 1.58c-.62.97-.97 2.12-.97 3.32m16.5 0h-16.5m16.5 0v-3.75A2.25 2.25 0 0017.25 8.25h-10.5A2.25 2.25 0 004.5 10.5v3.75" />
                                </svg>
                            </div>
                        </div>

                        {/* Interview Readiness Dial */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-md border border-slate-100 dark:border-slate-800/60 flex items-center justify-between tilt-card glow-border hover:border-emerald-500/25">
                            <div>
                                <h3 className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-wider">
                                    AI Readiness Quotient
                                </h3>
                                <p className="text-4xl font-black mt-3 text-slate-800 dark:text-slate-100">
                                    {readinessScore}%
                                </p>
                                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-2">
                                    ✓ Based on mock scores
                                </p>
                            </div>
                            
                            {/* Radial SVG Score indicator */}
                            <div className="relative flex items-center justify-center w-20 h-20">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="40"
                                        cy="40"
                                        r={radius}
                                        className="stroke-slate-100 dark:stroke-slate-800"
                                        strokeWidth="6"
                                        fill="transparent"
                                    />
                                    <circle
                                        cx="40"
                                        cy="40"
                                        r={radius}
                                        className="stroke-emerald-500 dark:stroke-emerald-400 transition-all duration-1000"
                                        strokeWidth="6"
                                        fill="transparent"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={offset}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <span className="absolute text-[11px] font-black text-emerald-600 dark:text-emerald-400">
                                    Fit
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Left Column: Education & Goal | Right Column: Core Skill Inventory */}
                    <div className="grid md:grid-cols-2 gap-8 mt-8 mb-10">
                        
                        {/* Skills Card with Categorized Stack Styles */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-md border border-slate-100 dark:border-slate-800/60 tilt-card glow-border">
                            <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 mb-5 flex items-center gap-2">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m-0.006 0L2.25 12l4.179-2.25m0 4.5l5.571 3 5.571-3m-11.142 0L12 12l5.571 3m0-6L21.75 12l-4.179 2.25m0 0L21.75 12l-4.179-2.25m-11.142 0L12 12l5.571-3m0 0l-5.571-3-5.571 3" />
                                </svg>
                                Technology Stack Tag Matrix
                            </h2>
                            {profileData?.profile?.skills && profileData.profile.skills.length > 0 ? (
                                <div className="flex flex-wrap gap-2.5">
                                    {profileData.profile.skills.map((skill, index) => (
                                        <span 
                                            key={index} 
                                            className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition-all hover:scale-105 ${getSkillStyle(skill)}`}
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-400 dark:text-slate-500 text-xs italic">
                                    No tags listed yet. Set skills inside the editor or upload an evaluated resume to generate a matrix.
                                </p>
                            )}
                        </div>

                        {/* Education Details and Ambitions */}
                        <div className="space-y-6">
                            
                            {/* Academic profile */}
                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-md border border-slate-100 dark:border-slate-800/60 tilt-card glow-border">
                                <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147L12 14.286l7.74-4.139M4.26 10.147L12 6.009l7.74 4.138M4.26 10.147v6.009a2.25 2.25 0 002.185 2.247h11.11a2.25 2.25 0 002.185-2.247v-6.009m-15.48 0L12 14.286" />
                                    </svg>
                                    Academic Profile
                                </h2>
                                {profileData?.profile?.education?.degree ? (
                                    <div className="border-l-2 border-indigo-500 pl-4 py-1">
                                        <p className="font-extrabold text-slate-800 dark:text-slate-200 text-md">
                                            {profileData.profile.education.degree}
                                        </p>
                                        <p className="mt-1 text-slate-500 dark:text-slate-400 font-semibold text-sm">
                                            {profileData.profile.education.major || "No Major Specified"}
                                        </p>
                                        <p className="text-slate-400 dark:text-slate-500 mt-2 text-xs font-semibold">
                                            Graduation Class: {profileData.profile.education.gradYear || "Year Pending"}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-slate-400 dark:text-slate-500 text-xs italic">
                                        No academic credentials listed yet. Click edit to configure.
                                    </p>
                                )}
                            </div>

                            {/* Career Target Card */}
                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-md border border-slate-100 dark:border-slate-800/60 tilt-card glow-border">
                                <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3m12-9a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Career Vision
                                </h2>
                                {profileData?.profile?.careerGoal ? (
                                    <div className="relative p-4 bg-slate-50 dark:bg-slate-950/45 rounded-2xl border border-slate-150 dark:border-slate-850">
                                        <span className="absolute -top-3 left-4 text-3xl font-black text-indigo-300/30 leading-none">“</span>
                                        <p className="text-slate-600 dark:text-slate-300 text-sm font-semibold leading-relaxed italic pl-3 pr-2">
                                            {profileData.profile.careerGoal}
                                        </p>
                                        <span className="absolute -bottom-6 right-4 text-3xl font-black text-indigo-300/30 leading-none">”</span>
                                    </div>
                                ) : (
                                    <p className="text-slate-400 dark:text-slate-500 text-xs italic">
                                        No career goals stated yet. Describe what you hope to achieve so the AI Mentor can align.
                                    </p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Redesigned Edit Profile Modal with Tab controls */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl animate-scale-up border border-slate-100 dark:border-slate-800">
                        
                        <div className="flex justify-between items-center border-b dark:border-slate-800 pb-4 mb-6">
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">
                                    Edit Profile details
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">
                                    Update your parameters to match appropriate placement opportunities.
                                </p>
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-3xl font-bold p-1 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl leading-none transition-colors"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Modal Forms Navigation Tabs */}
                        <div className="flex gap-2 p-1.5 bg-slate-50 dark:bg-slate-950 rounded-2xl mb-6 border dark:border-slate-850">
                            {[
                                { id: "personal", label: "👤 Personal" },
                                { id: "academic", label: "🎓 Academic" },
                                { id: "skills", label: "🚀 Career & Skills" }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                        activeTab === tab.id
                                            ? "bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm border dark:border-slate-800"
                                            : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            
                            {/* Tab 1: Personal Info */}
                            {activeTab === "personal" && (
                                <div className="space-y-4 animate-fade-in">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider mb-1">
                                                Full Name
                                            </label>
                                            <input 
                                                type="text" 
                                                required 
                                                value={formName}
                                                onChange={(e) => setFormName(e.target.value)}
                                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-600/40"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider mb-1">
                                                Email Address
                                            </label>
                                            <input 
                                                type="email" 
                                                required 
                                                value={formEmail}
                                                onChange={(e) => setFormEmail(e.target.value)}
                                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-600/40"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider mb-1">
                                                Projects Completed
                                            </label>
                                            <input 
                                                type="number" 
                                                min="0"
                                                value={formProjects}
                                                onChange={(e) => setFormProjects(parseInt(e.target.value) || 0)}
                                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-600/40"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider mb-1">
                                                Internships Applied
                                            </label>
                                            <input 
                                                type="number" 
                                                min="0"
                                                value={formInternships}
                                                onChange={(e) => setFormInternships(parseInt(e.target.value) || 0)}
                                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-600/40"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Tab 2: Academic Info */}
                            {activeTab === "academic" && (
                                <div className="space-y-4 animate-fade-in">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider mb-1">
                                            Degree Title (e.g. B.Tech / B.Sc)
                                        </label>
                                        <input 
                                            type="text" 
                                            placeholder="Bachelor of Technology"
                                            value={formDegree}
                                            onChange={(e) => setFormDegree(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-600/40"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider mb-1">
                                                Major Field (e.g. CSE)
                                            </label>
                                            <input 
                                                type="text" 
                                                placeholder="Computer Science"
                                                value={formMajor}
                                                onChange={(e) => setFormMajor(e.target.value)}
                                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-600/40"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider mb-1">
                                                Graduation Class Year
                                            </label>
                                            <input 
                                                type="text" 
                                                placeholder="2027" 
                                                value={formGradYear}
                                                onChange={(e) => setFormGradYear(e.target.value)}
                                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-600/40"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Tab 3: Career & Skills */}
                            {activeTab === "skills" && (
                                <div className="space-y-4 animate-fade-in">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider mb-1">
                                            Career Vision & Target Roles
                                        </label>
                                        <textarea 
                                            rows="3" 
                                            placeholder="Describe your desired engineering domains, targets, or ideal positions..." 
                                            value={formGoal}
                                            onChange={(e) => setFormGoal(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-600/40 resize-none"
                                        ></textarea>
                                    </div>

                                    <div className="border-t dark:border-slate-850 pt-4">
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider mb-1">
                                            Skills Tags Creator
                                        </label>
                                        <div className="flex gap-2">
                                            <input 
                                                type="text" 
                                                placeholder="Enter a skill (e.g. React, Docker)" 
                                                value={skillInput}
                                                onChange={(e) => setSkillInput(e.target.value)}
                                                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-600/40"
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        const btn = document.getElementById("add-skill-btn");
                                                        btn?.click();
                                                    }
                                                }}
                                            />
                                            <button 
                                                type="button" 
                                                id="add-skill-btn"
                                                onClick={handleAddSkill}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold active:scale-98 transition-all cursor-pointer"
                                            >
                                                Add
                                            </button>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-2 mt-3.5 p-3.5 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl min-h-[60px] bg-slate-50/50 dark:bg-slate-955/40 items-center">
                                            {formSkills.length === 0 ? (
                                                <span className="text-slate-400 dark:text-slate-500 text-xs italic pl-1">
                                                    No skills tags added. Build your portfolio to populate the grid.
                                                </span>
                                            ) : (
                                                formSkills.map((skill) => (
                                                    <div 
                                                        key={skill}
                                                        className="bg-purple-100/70 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold px-3 py-1 text-xs rounded-full flex items-center gap-1.5 border border-purple-200/50 dark:border-purple-800/50"
                                                    >
                                                        {skill}
                                                        <button 
                                                            type="button"
                                                            onClick={() => handleRemoveSkill(skill)}
                                                            className="text-purple-500 hover:text-purple-800 dark:hover:text-purple-200 font-black text-sm leading-none focus:outline-none"
                                                            title="Remove Tag"
                                                        >
                                                            &times;
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons footer */}
                            <div className="border-t dark:border-slate-800 pt-5 flex justify-end gap-3 mt-6">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer active:scale-98"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={saveLoading}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-2xl text-xs font-bold transition-all disabled:bg-purple-300 disabled:dark:bg-purple-900/50 disabled:cursor-not-allowed cursor-pointer active:scale-98 shadow-md hover:shadow-lg"
                                >
                                    {saveLoading ? "Saving Changes..." : "Save Details"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;