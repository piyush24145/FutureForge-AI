import { useState, useEffect, useRef } from "react";
import {
    FaFileAlt,
    FaRoad,
    FaMicrophone,
    FaRobot,
    FaPlay,
    FaUndo,
    FaCheckCircle,
    FaSpinner,
    FaPaperPlane,
    FaUser,
    FaFolderOpen,
    FaLock,
    FaChartLine,
    FaBullhorn
} from "react-icons/fa";

function InteractiveSimulator() {
    const [activeTab, setActiveTab] = useState("resume");

    // Resume Scan States
    const [isScanning, setIsScanning] = useState(false);
    const [scanStepText, setScanStepText] = useState("");
    const [isScanDone, setIsScanDone] = useState(false);
    const [resumeScore, setResumeScore] = useState(0);

    // Roadmap States
    const [selectedRole, setSelectedRole] = useState("fullstack");
    const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
    const [roadmapGenerated, setRoadmapGenerated] = useState(false);
    const [roadmapProgress, setRoadmapProgress] = useState([false, false, false, false]); // completed states for 4 nodes

    // Interview States
    const [interviewAnswer, setInterviewAnswer] = useState("");
    const [isGrading, setIsGrading] = useState(false);
    const [interviewResult, setInterviewResult] = useState(null);
    const [waveformActive, setWaveformActive] = useState(false);

    // Chat Mentor States
    const [chatMessages, setChatMessages] = useState([
        {
            sender: "mentor",
            text: "Hello! I'm your FutureForge AI Mentor. Ask me any career-related question, or select one of the queries below!",
            time: "Just now"
        }
    ]);
    const [chatInput, setChatInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);

    // Auto-scroll chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages, isTyping]);

    // Handle Resume Scan Simulation
    const handleStartScan = () => {
        setIsScanning(true);
        setIsScanDone(false);
        setResumeScore(0);
        
        const steps = [
            "Parsing uploaded document...",
            "Extracting skills & experience...",
            "Comparing against 10k+ job descriptions...",
            "Mapping skill gaps & score estimation..."
        ];

        steps.forEach((text, index) => {
            setTimeout(() => {
                if (index === steps.length - 1) {
                    setIsScanning(false);
                    setIsScanDone(true);
                    // Animate score count up
                    let score = 0;
                    const interval = setInterval(() => {
                        score += 2;
                        if (score >= 84) {
                            setResumeScore(84);
                            clearInterval(interval);
                        } else {
                            setResumeScore(score);
                        }
                    }, 25);
                } else {
                    setScanStepText(text);
                }
            }, (index + 1) * 700);
        });
    };

    // Handle Roadmap Generation
    const handleGenerateRoadmap = () => {
        setIsGeneratingRoadmap(true);
        setRoadmapGenerated(false);
        setRoadmapProgress([false, false, false, false]); // Reset

        setTimeout(() => {
            setIsGeneratingRoadmap(false);
            setRoadmapGenerated(true);
        }, 1500);
    };

    const toggleRoadmapStep = (index) => {
        // Toggle step, but keep order logically checking/unchecking
        const nextProgress = [...roadmapProgress];
        nextProgress[index] = !nextProgress[index];
        setRoadmapProgress(nextProgress);
    };

    // Handle Interview Grading Simulation
    const handleUsePresetAnswer = () => {
        setInterviewAnswer("UseEffect runs asynchronously after paint to handle side effects like data fetching and subscription listeners. LayoutEffect runs synchronously before repaint, which is perfect for reading DOM layouts and avoiding flicker.");
    };

    const handleGradeInterview = () => {
        if (!interviewAnswer.trim()) return;
        setWaveformActive(true);
        setIsGrading(true);
        setInterviewResult(null);

        setTimeout(() => {
            setWaveformActive(false);
            setTimeout(() => {
                setIsGrading(false);
                setInterviewResult({
                    score: "8.8",
                    summary: "Great delivery and deep conceptual breakdown.",
                    strengths: ["Lifecycle accuracy", "Correct Paint vs Repaint timing explanation"],
                    gaps: ["Could mention performance drawbacks of layoutEffect blocking repaint"]
                });
            }, 600);
        }, 1800);
    };

    const resetInterview = () => {
        setInterviewAnswer("");
        setInterviewResult(null);
        setWaveformActive(false);
    };

    // Handle Mentor Chat
    const handleSendChatMessage = (textToSend) => {
        const queryText = textToSend || chatInput;
        if (!queryText.trim()) return;

        // User Message
        const userMsg = { sender: "user", text: queryText, time: "Just now" };
        setChatMessages(prev => [...prev, userMsg]);
        setChatInput("");
        setIsTyping(true);

        // Simulated AI replies
        setTimeout(() => {
            setIsTyping(false);
            let mentorResponse = "";
            if (queryText.toLowerCase().includes("react")) {
                mentorResponse = "To land a React job without experience, focus on building 2 high-quality projects showing complex state management (Redux/Zustand), integration with real APIs, and responsive design. Put them on GitHub with detailed READMEs and deploy them live!";
            } else if (queryText.toLowerCase().includes("sql")) {
                mentorResponse = "Learn SQL first! Databases like PostgreSQL are standard across tech companies. Understanding schemas, joins, and indexing creates a solid foundation, after which NoSQL (like MongoDB) will be very easy to pick up.";
            } else if (queryText.toLowerCase().includes("projects")) {
                mentorResponse = "A stellar portfolio needs: 1) A full-stack CRUD application with auth (e.g., e-commerce or kanban board), 2) A real-time feature (e.g. chat or live dashboard), and 3) A tool that solves a personal problem. Deploy with CI/CD!";
            } else {
                mentorResponse = "That's a fantastic question! As your career mentor, I suggest parsing your resume first on our platform so we can generate tailored advice for this goal. What path are you currently targeting?";
            }

            setChatMessages(prev => [...prev, {
                sender: "mentor",
                text: mentorResponse,
                time: "Just now"
            }]);
        }, 1200);
    };

    // Roadmap configs
    const roadmapStepsData = {
        fullstack: [
            { id: 1, title: "HTML5, CSS3, ES6 JavaScript", time: "Week 1-3", desc: "Core web standards, flexbox/grid, async flow, promises." },
            { id: 2, title: "React.js State & Component Architecture", time: "Week 4-7", desc: "Hooks, Context API, Tailwind integration, client routing." },
            { id: 3, title: "Node.js REST Backend & ORM", time: "Week 8-11", desc: "Express setup, relational routing, Prisma, JWT Authentication." },
            { id: 4, title: "Docker Containerization & AWS Deploy", time: "Week 12-14", desc: "Dockerfile configurations, docker-compose, AWS EC2, GitHub Actions." }
        ],
        frontend: [
            { id: 1, title: "Modern ES6 JS & Tailwind CSS", time: "Week 1-2", desc: "Advanced Array methods, custom designs, utility tokens." },
            { id: 2, title: "React Fundamentals & Global State", time: "Week 3-6", desc: "Zustand/Redux Toolkit, performance profiling, form libraries." },
            { id: 3, title: "Next.js App Router & SSR", time: "Week 7-10", desc: "Server components, SEO optimization, static vs dynamic caching." },
            { id: 4, title: "Testing (Jest, Playwright) & CI/CD", time: "Week 11-12", desc: "Unit testing components, End-to-end user flow tests." }
        ],
        devops: [
            { id: 1, title: "Linux Basics & Shell Scripting", time: "Week 1-2", desc: "Bash scripts, user permissions, networking tools, cron jobs." },
            { id: 2, title: "Docker & Container Architecture", time: "Week 3-5", desc: "Image layers optimization, volume mounts, multi-stage builds." },
            { id: 3, title: "Kubernetes & Orchestration", time: "Week 6-10", desc: "Pods, services, configmaps, ingress routing, Helm charts." },
            { id: 4, title: "Terraform (IaC) & GitHub Actions", time: "Week 11-14", desc: "Declarative infrastructure, automated testing and deployment." }
        ]
    };

    return (
        <div className="w-full max-w-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl relative">
            {/* Top Browser Bar */}
            <div className="bg-slate-100/70 dark:bg-slate-950/70 px-4 py-3 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center gap-3">
                {/* Mac buttons */}
                <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-400"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                </div>
                {/* URL Frame */}
                <div className="flex-1 bg-white/60 dark:bg-slate-900/60 border border-slate-200/30 dark:border-slate-850 px-3 py-1 rounded-lg text-[11px] text-slate-400 dark:text-slate-500 font-mono text-center select-none truncate">
                    https://futureforge.ai/sandbox-demo
                </div>
            </div>

            {/* Main Application Interface Grid */}
            <div className="grid grid-cols-12 min-h-[420px]">
                {/* Sidebar Menu */}
                <div className="col-span-12 md:col-span-4 bg-slate-50/50 dark:bg-slate-950/40 p-4 border-r border-b md:border-b-0 border-slate-200/50 dark:border-slate-800/50 flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible">
                    <button
                        onClick={() => setActiveTab("resume")}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 w-full whitespace-nowrap cursor-pointer ${
                            activeTab === "resume"
                                ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-white"
                        }`}
                    >
                        <FaFileAlt className="text-sm shrink-0" />
                        Resume Auditor
                    </button>
                    <button
                        onClick={() => setActiveTab("roadmap")}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 w-full whitespace-nowrap cursor-pointer ${
                            activeTab === "roadmap"
                                ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-white"
                        }`}
                    >
                        <FaRoad className="text-sm shrink-0" />
                        Roadmap Generator
                    </button>
                    <button
                        onClick={() => setActiveTab("interview")}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 w-full whitespace-nowrap cursor-pointer ${
                            activeTab === "interview"
                                ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-white"
                        }`}
                    >
                        <FaMicrophone className="text-sm shrink-0" />
                        Interview Coach
                    </button>
                    <button
                        onClick={() => setActiveTab("mentor")}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 w-full whitespace-nowrap cursor-pointer ${
                            activeTab === "mentor"
                                ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-white"
                        }`}
                    >
                        <FaRobot className="text-sm shrink-0" />
                        Mentor Chat
                    </button>
                </div>

                {/* Simulation Screen */}
                <div className="col-span-12 md:col-span-8 p-4 sm:p-5 flex flex-col justify-between bg-white dark:bg-slate-900/90 relative">
                    
                    {/* 1. RESUME AUDITOR SIMULATOR */}
                    {activeTab === "resume" && (
                        <div className="h-full flex flex-col justify-between gap-4">
                            <div>
                                <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    <FaFileAlt className="text-purple-500" /> Resume Gap Auditor
                                </h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                    Simulate parsing a developer profile to map skill deficits.
                                </p>
                            </div>

                            {!isScanning && !isScanDone && (
                                <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-850 rounded-2xl p-6 bg-slate-50/50 dark:bg-slate-950/20 hover:border-purple-500/40 dark:hover:border-purple-500/40 transition-colors duration-300">
                                    <FaFolderOpen className="text-3xl text-purple-400 mb-3 animate-bounce" />
                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                        Upload your Resume (PDF)
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-1">
                                        Max size 5MB • Click button below for instant demo
                                    </p>
                                    <button
                                        onClick={handleStartScan}
                                        className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold rounded-xl shadow-md cursor-pointer transition-all duration-200 active:scale-95"
                                    >
                                        Scan Sample Developer Resume
                                    </button>
                                </div>
                            )}

                            {isScanning && (
                                <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
                                    {/* Mock Document Container with Laser Scan Beam */}
                                    <div className="w-28 h-36 bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 relative shadow-inner">
                                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-purple-500 dark:bg-purple-400 shadow-md shadow-purple-500 animate-scan"></div>
                                        <div className="space-y-2.5 mt-2">
                                            <div className="h-2 w-12 bg-purple-200 dark:bg-purple-950/60 rounded"></div>
                                            <div className="h-1.5 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                            <div className="h-1.5 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                            <div className="h-1.5 w-22 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                            <div className="h-1.5 w-12 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-350">
                                        <FaSpinner className="animate-spin text-purple-500" />
                                        <span>{scanStepText}</span>
                                    </div>
                                </div>
                            )}

                            {isScanDone && (
                                <div className="flex-1 flex flex-col gap-4 animate-fade-in-up">
                                    {/* Score and Gap Analysis Dashboard */}
                                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                                        <div className="col-span-12 sm:col-span-4 bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 flex flex-col items-center justify-center min-h-[90px] sm:min-h-0">
                                            <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400">Match Score</span>
                                            <span className="text-3xl font-black text-purple-600 dark:text-purple-400 mt-1">{resumeScore}%</span>
                                        </div>
                                        <div className="col-span-12 sm:col-span-8 bg-slate-50 dark:bg-slate-950/30 border border-slate-200/50 dark:border-slate-850 rounded-xl p-3">
                                            <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1.5">Identified Gap Areas</div>
                                            <div className="flex flex-wrap gap-1">
                                                <span className="px-2 py-0.5 rounded-md bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-300 text-[10px] font-bold border border-red-200/30 dark:border-red-900/30">Docker</span>
                                                <span className="px-2 py-0.5 rounded-md bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-300 text-[10px] font-bold border border-red-200/30 dark:border-red-900/30">GraphQL</span>
                                                <span className="px-2 py-0.5 rounded-md bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-300 text-[10px] font-bold border border-red-200/30 dark:border-red-900/30">System Design</span>
                                            </div>
                                            <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mt-2.5 mb-1">Top Match Strengths</div>
                                            <div className="flex flex-wrap gap-1">
                                                <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200/30 dark:border-emerald-900/30">React.js</span>
                                                <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200/30 dark:border-emerald-900/30">Node.js</span>
                                                <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200/30 dark:border-emerald-900/30">Tailwind CSS</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-950/20 border border-slate-200/40 dark:border-slate-850 p-3 rounded-xl">
                                        <div className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase">AI Gap Analysis Guidance</div>
                                        <p className="text-[10.5px] text-slate-600 dark:text-slate-350 mt-1 leading-relaxed">
                                            Your core frontend stacks are exceptional, but lack containerization and micro-routing experience. Adding <strong className="text-purple-600 dark:text-purple-400">Docker</strong> containers to your backend portfolio will elevate your profile eligibility.
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleStartScan}
                                        className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-white text-[11px] font-bold rounded-xl cursor-pointer transition-colors"
                                    >
                                        <FaUndo /> Scan New Profile
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 2. ROADMAP GENERATOR SIMULATOR */}
                    {activeTab === "roadmap" && (
                        <div className="h-full flex flex-col justify-between gap-4">
                            <div>
                                <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    <FaRoad className="text-purple-500" /> Interactive Roadmap Builder
                                </h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                    Generate dynamic month-by-month curricula tailored to career roles.
                                </p>
                            </div>

                            {!isGeneratingRoadmap && !roadmapGenerated && (
                                <div className="flex-1 flex flex-col justify-center gap-3.5 bg-slate-50/50 dark:bg-slate-950/20 p-5 rounded-2xl border border-slate-200/40 dark:border-slate-850">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-1">
                                            Select Target Career Goal:
                                        </label>
                                        <select
                                            value={selectedRole}
                                            onChange={(e) => setSelectedRole(e.target.value)}
                                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 outline-hidden focus:ring-1 focus:ring-purple-500 text-slate-800 dark:text-white"
                                        >
                                            <option value="fullstack">Fullstack Developer (Node/React)</option>
                                            <option value="frontend">Frontend Specialist (Next.js/React)</option>
                                            <option value="devops">DevOps & Cloud Engineer (AWS/Kubernetes)</option>
                                        </select>
                                    </div>
                                    <button
                                        onClick={handleGenerateRoadmap}
                                        className="py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold rounded-xl shadow-md cursor-pointer transition-all duration-200"
                                    >
                                        Generate Tailored Learning Roadmap
                                    </button>
                                </div>
                            )}

                            {isGeneratingRoadmap && (
                                <div className="flex-1 flex flex-col items-center justify-center p-6">
                                    <FaSpinner className="animate-spin text-4xl text-purple-500 mb-3" />
                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-350">
                                        Synthesizing custom learning roadmap...
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-1">
                                        Structuring curriculum modules based on current industry standards
                                    </p>
                                </div>
                            )}

                            {roadmapGenerated && (
                                <div className="flex-1 flex flex-col gap-3.5 animate-fade-in-up">
                                    {/* Progress indicator */}
                                    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-950/30 border border-slate-200/50 dark:border-slate-850 p-2.5 rounded-xl">
                                        <div>
                                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Curriculum Completion</span>
                                            <div className="text-xs font-black text-purple-600 dark:text-purple-400">
                                                {roadmapProgress.filter(Boolean).length} of 4 Modules Completed
                                            </div>
                                        </div>
                                        <div className="w-24 bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                                            <div
                                                className="bg-purple-600 h-full transition-all duration-550"
                                                style={{ width: `${(roadmapProgress.filter(Boolean).length / 4) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Scrollable roadmap nodes */}
                                    <div className="flex-1 max-h-[180px] overflow-y-auto space-y-2.5 pr-1">
                                        {roadmapStepsData[selectedRole].map((step, idx) => {
                                            const isDone = roadmapProgress[idx];
                                            const isPreviousDone = idx === 0 || roadmapProgress[idx - 1];
                                            const isLocked = !isDone && !isPreviousDone;

                                            return (
                                                <div
                                                    key={step.id}
                                                    onClick={() => !isLocked && toggleRoadmapStep(idx)}
                                                    className={`border rounded-xl p-2.5 flex items-start gap-3 transition-all duration-300 relative select-none ${
                                                        isLocked
                                                            ? "bg-slate-50/40 dark:bg-slate-900/40 border-slate-100 dark:border-slate-850 opacity-45 cursor-not-allowed"
                                                            : "bg-white dark:bg-slate-900 cursor-pointer hover:border-purple-500/40 border-slate-200/60 dark:border-slate-800/80"
                                                    }`}
                                                >
                                                    {/* Completion bullet */}
                                                    <div className="mt-0.5">
                                                        {isDone ? (
                                                            <FaCheckCircle className="text-emerald-500 text-sm shrink-0" />
                                                        ) : isLocked ? (
                                                            <FaLock className="text-slate-400 text-[11px] shrink-0" />
                                                        ) : (
                                                            <div className="w-3.5 h-3.5 rounded-full border border-slate-350 dark:border-slate-600 shrink-0"></div>
                                                        )}
                                                    </div>

                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-center">
                                                            <h5 className={`text-[11px] font-bold ${isDone ? "line-through text-slate-450 dark:text-slate-500" : "text-slate-800 dark:text-white"}`}>
                                                                {step.title}
                                                            </h5>
                                                            <span className="text-[9px] font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded">
                                                                {step.time}
                                                            </span>
                                                        </div>
                                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 leading-tight">
                                                            {step.desc}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Success/Action bar */}
                                    <div className="flex gap-2.5">
                                        <button
                                            onClick={() => setRoadmapGenerated(false)}
                                            className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-white text-[11px] font-bold rounded-xl cursor-pointer transition-colors"
                                        >
                                            Change Goal
                                        </button>
                                        {roadmapProgress.every(Boolean) && (
                                            <div className="flex-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-xl px-2 flex items-center justify-center text-center animate-pulse">
                                                🎉 Ready to apply for matching roles!
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 3. INTERVIEW COACH SIMULATOR */}
                    {activeTab === "interview" && (
                        <div className="h-full flex flex-col justify-between gap-4">
                            <div>
                                <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    <FaMicrophone className="text-purple-500" /> AI Mock Interview simulator
                                </h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                    Submit code answers or verbal mocks to receive immediate AI grades.
                                </p>
                            </div>

                            {!isGrading && !interviewResult && (
                                <div className="flex-1 flex flex-col gap-3 animate-fade-in-up">
                                    <div className="bg-slate-50 dark:bg-slate-950/30 border border-slate-200/50 dark:border-slate-850 p-3 rounded-xl text-left">
                                        <span className="text-[9px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">Question 1: React State Hooks</span>
                                        <p className="text-[11.5px] font-bold text-slate-800 dark:text-white mt-1 leading-normal">
                                            "Explain the difference between useEffect dependencies and layoutEffect in React."
                                        </p>
                                    </div>

                                    <div className="flex-1 flex flex-col">
                                        <textarea
                                            value={interviewAnswer}
                                            onChange={(e) => setInterviewAnswer(e.target.value)}
                                            placeholder="Write your response here..."
                                            className="w-full flex-1 min-h-[90px] text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 outline-hidden focus:ring-1 focus:ring-purple-500 text-slate-800 dark:text-white resize-none"
                                        />
                                        <div className="flex justify-between items-center mt-2.5">
                                            <button
                                                onClick={handleUsePresetAnswer}
                                                className="text-[10px] font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                                            >
                                                ✨ Insert High-Quality Sample Answer
                                            </button>
                                            <span className="text-[9px] text-slate-400">
                                                {interviewAnswer.length} chars
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleGradeInterview}
                                        disabled={!interviewAnswer.trim()}
                                        className={`py-2.5 rounded-xl text-[11px] font-bold shadow-md cursor-pointer transition-all duration-200 ${
                                            interviewAnswer.trim()
                                                ? "bg-purple-600 hover:bg-purple-500 text-white"
                                                : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                                        }`}
                                    >
                                        Submit Answer for AI Grading
                                    </button>
                                </div>
                            )}

                            {isGrading && (
                                <div className="flex-1 flex flex-col items-center justify-center p-6">
                                    {waveformActive && (
                                        <div className="flex items-center gap-1.5 mb-5 h-8">
                                            <span className="w-1.5 bg-purple-500 rounded-full animate-audio-bar-1"></span>
                                            <span className="w-1.5 bg-indigo-500 rounded-full animate-audio-bar-2"></span>
                                            <span className="w-1.5 bg-purple-600 rounded-full animate-audio-bar-3"></span>
                                            <span className="w-1.5 bg-indigo-600 rounded-full animate-audio-bar-4"></span>
                                            <span className="w-1.5 bg-purple-400 rounded-full animate-audio-bar-5"></span>
                                        </div>
                                    )}
                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-350">
                                        Analyzing answer semantics and syntax...
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-1">
                                        Generating comprehensive feedback score
                                    </p>
                                </div>
                            )}

                            {interviewResult && (
                                <div className="flex-1 flex flex-col gap-3 animate-fade-in-up">
                                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                                        <div className="col-span-12 sm:col-span-4 bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 flex flex-col items-center justify-center min-h-[90px] sm:min-h-0">
                                            <span className="text-[9px] uppercase font-bold text-purple-600 dark:text-purple-400 text-center">AI Evaluation</span>
                                            <span className="text-3xl font-black text-purple-600 dark:text-purple-400 mt-1">{interviewResult.score} <span className="text-xs text-slate-400 font-light">/10</span></span>
                                        </div>
                                        <div className="col-span-12 sm:col-span-8 bg-slate-50 dark:bg-slate-950/30 border border-slate-200/50 dark:border-slate-850 rounded-xl p-2.5">
                                            <div className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1">Key Strengths</div>
                                            <ul className="space-y-0.5">
                                                {interviewResult.strengths.map((st, i) => (
                                                    <li key={i} className="text-[10px] text-slate-750 dark:text-slate-300 flex items-center gap-1.5">
                                                        <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                                                        {st}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-950/20 border border-slate-200/40 dark:border-slate-850 p-2.5 rounded-xl">
                                        <div className="text-[9px] font-bold text-purple-600 dark:text-purple-400 uppercase">Constructive Feedback</div>
                                        <p className="text-[10px] text-slate-600 dark:text-slate-350 mt-1 leading-relaxed">
                                            {interviewResult.summary}
                                        </p>
                                        <div className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 mt-2">Area to Improve</div>
                                        <p className="text-[10px] text-red-600 dark:text-red-400 mt-0.5">
                                            {interviewResult.gaps[0]}
                                        </p>
                                    </div>
                                    <button
                                        onClick={resetInterview}
                                        className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-white text-[11px] font-bold rounded-xl cursor-pointer transition-colors"
                                    >
                                        <FaUndo /> Try Another Response
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 4. MENTOR CHAT SIMULATOR */}
                    {activeTab === "mentor" && (
                        <div className="h-full flex flex-col justify-between gap-4">
                            <div>
                                <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    <FaRobot className="text-purple-500" /> Career AI Chat Mentor
                                </h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                    Interact with a virtual mentor to resolve career and placement queries.
                                </p>
                            </div>

                            {/* Chat history list */}
                            <div className="flex-1 bg-slate-50 dark:bg-slate-950/30 border border-slate-200/50 dark:border-slate-850 p-3 rounded-2xl overflow-y-auto max-h-[170px] space-y-3">
                                {chatMessages.map((msg, i) => (
                                    <div
                                        key={i}
                                        className={`flex gap-2.5 max-w-[85%] ${
                                            msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                                        }`}
                                    >
                                        {/* Avatar */}
                                        <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] text-white shadow-xs ${
                                            msg.sender === "user" ? "bg-indigo-650" : "bg-purple-600"
                                        }`}>
                                            {msg.sender === "user" ? <FaUser size={10} /> : <FaRobot size={10} />}
                                        </div>
                                        {/* Message Content */}
                                        <div className={`p-2.5 rounded-2xl text-[10.5px] leading-relaxed shadow-xs ${
                                            msg.sender === "user"
                                                ? "bg-indigo-600 text-white rounded-tr-none"
                                                : "bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800 text-slate-750 dark:text-slate-200 rounded-tl-none"
                                        }`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}

                                {isTyping && (
                                    <div className="flex gap-2.5 max-w-[85%] mr-auto items-center">
                                        <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] text-white bg-purple-600 shadow-xs">
                                            <FaRobot size={10} />
                                        </div>
                                        <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800 flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-typing-1"></span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-typing-2"></span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-typing-3"></span>
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Chat interaction options */}
                            <div className="space-y-2.5">
                                <div className="flex flex-wrap gap-1">
                                    <button
                                        onClick={() => handleSendChatMessage("How can I land a React developer role without experience?")}
                                        className="text-[9px] font-bold bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1.5 rounded-lg transition-colors cursor-pointer"
                                    >
                                        💡 React dev job roadmap
                                    </button>
                                    <button
                                        onClick={() => handleSendChatMessage("Should I learn SQL or NoSQL first?")}
                                        className="text-[9px] font-bold bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1.5 rounded-lg transition-colors cursor-pointer"
                                    >
                                        💡 SQL vs NoSQL path
                                    </button>
                                    <button
                                        onClick={() => handleSendChatMessage("What projects stand out on a junior portfolio?")}
                                        className="text-[9px] font-bold bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1.5 rounded-lg transition-colors cursor-pointer"
                                    >
                                        💡 Portfolio projects guidance
                                    </button>
                                </div>

                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
                                        placeholder="Ask mentor a career question..."
                                        className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 outline-hidden focus:ring-1 focus:ring-purple-500 text-slate-800 dark:text-white"
                                    />
                                    <button
                                        onClick={() => handleSendChatMessage()}
                                        className="p-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-md cursor-pointer transition-colors duration-200 flex items-center justify-center"
                                    >
                                        <FaPaperPlane size={11} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default InteractiveSimulator;
