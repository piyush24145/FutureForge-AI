import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
    FaTrophy, FaAward, FaCheckCircle, FaSpinner, FaBookOpen, FaPlay, 
    FaUserCheck, FaChevronDown, FaChevronUp, FaSyncAlt, FaHistory, 
    FaInfoCircle, FaLightbulb, FaTimes, FaUserAlt, FaCheck, FaExclamationTriangle,
    FaLaptopCode, FaUserTie, FaRocket, FaBrain, FaUndoAlt, FaCheckDouble
} from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { 
    generateQuestions, 
    submitInterview, 
    getInterviewHistory, 
    getReadinessScore 
} from "../services/interviewService";

function InterviewPrep() {
    // Top states
    const [readinessScore, setReadinessScore] = useState(0);
    const [history, setHistory] = useState([]);
    const [loadingStats, setLoadingStats] = useState(true);
    const [isFallbackMode, setIsFallbackMode] = useState(false);

    // Practice Questions Panel states
    const [practiceCategory, setPracticeCategory] = useState("Technical");
    const [practiceQuestions, setPracticeQuestions] = useState([]);
    const [loadingQuestions, setLoadingQuestions] = useState(false);
    const [expandedQuestion, setExpandedQuestion] = useState(null);
    const [userAnswers, setUserAnswers] = useState({});
    const [evaluationFeedback, setEvaluationFeedback] = useState({});
    const [evaluatingIndex, setEvaluatingIndex] = useState(null);
    const [practiceError, setPracticeError] = useState("");

    // Mock Interview Simulator states
    const [mockStep, setMockStep] = useState("idle"); // idle | generating | interviewing | submitting | report
    const [mockCategory, setMockCategory] = useState("Full-Stack Web Dev");
    const [mockQuestions, setMockQuestions] = useState([]);
    const [currentMockIndex, setCurrentMockIndex] = useState(0);
    const [mockAnswers, setMockAnswers] = useState([]);
    const [currentAnswer, setCurrentAnswer] = useState("");
    const [mockReport, setMockReport] = useState(null);
    const [mockError, setMockError] = useState("");

    // Detail Modal state
    const [selectedHistoryReport, setSelectedHistoryReport] = useState(null);

    // AI loader step tracker
    const [loaderStep, setLoaderStep] = useState(0);
    const loadingSteps = [
        "Curating customized simulator questions...",
        "Formulating optimal assessment criteria...",
        "Synchronizing grading environment configurations...",
        "Preparing visual reporting panels..."
    ];

    // Categories details mapping with icons
    const categoriesList = [
        { id: "Technical", label: "Technical", icon: <FaLaptopCode /> },
        { id: "HR", label: "HR & Talent", icon: <FaUserTie /> },
        { id: "Projects", label: "Projects Focus", icon: <FaRocket /> },
        { id: "Behavioral", label: "Behavioral", icon: <FaBrain /> }
    ];

    const mockOptions = [
        "Full-Stack Web Dev",
        "Frontend Engineer",
        "Backend Engineer",
        "Data Scientist",
        "HR & Behavior"
    ];

    useEffect(() => {
        loadDashboardData();
        fetchPracticeQuestions("Technical");
    }, []);

    // Loader interval step trigger
    useEffect(() => {
        let interval;
        const activeLoader = mockStep === "generating" || mockStep === "submitting";
        if (activeLoader) {
            setLoaderStep(0);
            interval = setInterval(() => {
                setLoaderStep(prev => (prev < 3 ? prev + 1 : prev));
            }, 1200);
        } else {
            setLoaderStep(0);
        }
        return () => clearInterval(interval);
    }, [mockStep]);

    const loadDashboardData = async () => {
        setLoadingStats(true);
        try {
            const readinessRes = await getReadinessScore();
            if (readinessRes.success) {
                setReadinessScore(readinessRes.score);
            }
            const historyRes = await getInterviewHistory();
            if (historyRes.success) {
                setHistory(historyRes.history);
            }
        } catch (err) {
            console.error("Error loading stats/history:", err);
        } finally {
            setLoadingStats(false);
        }
    };

    const fetchPracticeQuestions = async (category) => {
        setLoadingQuestions(true);
        setPracticeError("");
        setExpandedQuestion(null);
        setExpandedQuestion(null);
        setEvaluationFeedback({});
        setUserAnswers({});
        try {
            const data = await generateQuestions(category);
            if (data.success) {
                setPracticeQuestions(data.questions);
                if (data.isFallback) setIsFallbackMode(true);
            } else {
                setPracticeError("Failed to fetch practice questions. Try again.");
            }
        } catch (err) {
            console.error("Error generating practice questions:", err);
            setPracticeError("Network error generating practice questions.");
        } finally {
            setLoadingQuestions(false);
        }
    };

    const handleCategoryChange = (category) => {
        setPracticeCategory(category);
        fetchPracticeQuestions(category);
    };

    const handleEvaluatePractice = async (index, questionText) => {
        const ans = userAnswers[index] || "";
        if (!ans.trim()) {
            alert("Please type your answer before submitting.");
            return;
        }

        setEvaluatingIndex(index);
        try {
            const result = await submitInterview(practiceCategory, [
                { question: questionText, userAnswer: ans }
            ]);
            if (result.success && result.report && result.report.questions.length > 0) {
                const evalData = result.report.questions[0];
                setEvaluationFeedback(prev => ({
                    ...prev,
                    [index]: {
                        score: evalData.score,
                        feedback: evalData.feedback,
                        modelAnswer: evalData.modelAnswer
                    }
                }));
                loadDashboardData();
            } else {
                alert("Failed to analyze response. Please try again.");
            }
        } catch (err) {
            console.error("Evaluation error:", err);
            alert("Error communicating with AI evaluator.");
        } finally {
            setEvaluatingIndex(null);
        }
    };

    // Mock Interview Actions
    const handleStartMockSimulation = async () => {
        setMockStep("generating");
        setMockError("");
        try {
            const data = await generateQuestions(mockCategory);
            if (data.success && data.questions.length > 0) {
                setMockQuestions(data.questions);
                if (data.isFallback) setIsFallbackMode(true);
                setMockAnswers(new Array(data.questions.length).fill(""));
                setCurrentMockIndex(0);
                setCurrentAnswer("");
                setMockStep("interviewing");
            } else {
                setMockStep("idle");
                setMockError("Could not generate mock questions. Please try again.");
            }
        } catch (err) {
            console.error("Mock generation error:", err);
            setMockStep("idle");
            setMockError("Error generating mock questions. Please check connection.");
        }
    };

    const handleNextMockQuestion = () => {
        const updated = [...mockAnswers];
        updated[currentMockIndex] = currentAnswer;
        setMockAnswers(updated);

        if (currentMockIndex < mockQuestions.length - 1) {
            const nextIdx = currentMockIndex + 1;
            setCurrentMockIndex(nextIdx);
            setCurrentAnswer(mockAnswers[nextIdx] || "");
        }
    };

    const handlePrevMockQuestion = () => {
        const updated = [...mockAnswers];
        updated[currentMockIndex] = currentAnswer;
        setMockAnswers(updated);

        if (currentMockIndex > 0) {
            const prevIdx = currentMockIndex - 1;
            setCurrentMockIndex(prevIdx);
            setCurrentAnswer(mockAnswers[prevIdx]);
        }
    };

    const handleSubmitMockInterview = async () => {
        const updated = [...mockAnswers];
        updated[currentMockIndex] = currentAnswer;
        setMockAnswers(updated);

        const qaList = mockQuestions.map((q, idx) => ({
            question: q.question,
            userAnswer: updated[idx] || "No answer provided."
        }));

        setMockStep("submitting");
        try {
            const result = await submitInterview(mockCategory, qaList);
            if (result.success && result.report) {
                setMockReport(result.report);
                setMockStep("report");
                loadDashboardData();
            } else {
                setMockStep("interviewing");
                alert("Failed to submit and grade interview. Please retry.");
            }
        } catch (err) {
            console.error("Mock submit error:", err);
            setMockStep("interviewing");
            alert("Error submitting interview for AI grading.");
        }
    };

    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1 bg-gray-100 dark:bg-slate-950 min-h-screen relative bg-grid-pattern transition-colors duration-300">
                <Topbar />

                <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
                    {/* Header Banner */}
                    <div className="glass-panel p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
                        <div className="space-y-2">
                            <h1 className="text-3xl md:text-5xl font-black text-slate-855 dark:text-white flex items-center gap-3 tracking-tight">
                                <span className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-650 to-indigo-550 text-white shadow-lg shadow-purple-500/20 animate-float block">
                                    <FaBookOpen className="text-2xl md:text-3xl" />
                                </span>
                                Interview Preparation
                            </h1>
                            <p className="text-slate-500 dark:text-slate-450 text-sm md:text-base max-w-2xl leading-relaxed">
                                Refine your career pitches, behavioral answers, and technical knowledge. Try individual questions or launch a full simulated AI assessment.
                            </p>
                        </div>
                    </div>

                    {/* Readiness Gauge & Info Panel */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-purple-500/20 relative overflow-hidden flex flex-col justify-between glow-purple min-h-[200px]">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full filter blur-[100px] animate-spin-slow"></div>
                            
                            <div className="space-y-2">
                                <span className="bg-purple-800/50 border border-purple-750/60 text-purple-200 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit">
                                    <FaUserCheck /> Assessment Engine
                                </span>
                                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-3">
                                    Evaluate and boost your developer hireability
                                </h2>
                                <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-xl">
                                    AI readiness aggregates mock scores and practice analysis history. Target 85%+ to secure top tech position matching.
                                </p>
                            </div>
                            
                            <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-wider text-slate-450 border-t border-white/5 pt-4 mt-6">
                                <span>⚡ Practical Specializations</span>
                                <span className="text-slate-700">•</span>
                                <span>🤖 Gemini Flash 2.0 Evaluation</span>
                                <span className="text-slate-700">•</span>
                                <span>🏆 Professional Model Answers</span>
                            </div>
                        </div>

                        {/* Readiness Circle widget */}
                        <div className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-slate-850 flex flex-col justify-between items-center text-center shadow-xs">
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Interview Readiness</h3>
                            
                            <div className="relative w-28 h-28 my-4 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="40" stroke="rgba(168, 85, 247, 0.1)" strokeWidth="7" fill="transparent" />
                                    <circle 
                                        cx="50" 
                                        cy="50" 
                                        r="40" 
                                        stroke="url(#readinessGrad)" 
                                        strokeWidth="7" 
                                        fill="transparent" 
                                        strokeDasharray="251.2" 
                                        strokeDashoffset={251.2 - (251.2 * readinessScore) / 100}
                                        strokeLinecap="round"
                                        className="transition-all duration-1000 ease-out"
                                    />
                                    <defs>
                                        <linearGradient id="readinessGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#a855f7" />
                                            <stop offset="100%" stopColor="#6366f1" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <span className="absolute text-2xl font-black text-slate-850 dark:text-white">
                                    {loadingStats ? <FaSpinner className="animate-spin text-lg text-purple-500" /> : `${readinessScore}%`}
                                </span>
                            </div>

                            <div className="w-full space-y-1">
                                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                    <div 
                                        className="bg-purple-600 dark:bg-purple-500 h-full rounded-full transition-all duration-1000"
                                        style={{ width: `${readinessScore}%` }}
                                    ></div>
                                </div>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest block pt-1">
                                    {readinessScore >= 80 ? "Hireability: High 🚀" : readinessScore >= 50 ? "Hireability: Medium 📈" : "Keep Practicing! 🌱"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {isFallbackMode && (
                        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40 p-4 rounded-2xl shadow-sm flex items-center justify-between gap-4 animate-fade-in">
                            <div className="flex items-center gap-3 text-amber-805 dark:text-amber-300">
                                <FaExclamationTriangle className="text-amber-500 text-lg animate-bounce shrink-0" />
                                <p className="text-xs font-semibold">
                                    <strong>AI Busy Mode:</strong> FutureForge AI has loaded a local question bank so you can practice mock interviews without interruptions.
                                </p>
                            </div>
                            <button 
                                onClick={() => setIsFallbackMode(false)}
                                className="text-amber-600 dark:text-amber-400 hover:text-amber-700 text-xs font-black cursor-pointer uppercase tracking-wider"
                            >
                                Dismiss
                            </button>
                        </div>
                    )}

                    {/* Workspace Columns */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* PRACTICE CORNER PANEL */}
                        <div className="glass-panel rounded-3xl p-6 shadow-sm border border-slate-200/60 dark:border-slate-800/80 flex flex-col justify-between min-h-[560px]">
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-extrabold text-slate-850 dark:text-white flex items-center gap-2 tracking-tight">
                                        <FaUserCheck className="text-purple-600 dark:text-purple-400" /> AI Practice Corner
                                    </h3>
                                    <button 
                                        onClick={() => fetchPracticeQuestions(practiceCategory)}
                                        className="text-purple-650 hover:text-purple-500 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors active:scale-95"
                                        title="Generate new questions"
                                    >
                                        <FaSyncAlt className="text-[10px]" /> Regenerate
                                    </button>
                                </div>

                                {/* Category Pills with icons */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 bg-slate-50 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200/40 dark:border-slate-850">
                                    {categoriesList.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => handleCategoryChange(cat.id)}
                                            className={`py-2 px-2.5 rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                                                practiceCategory === cat.id
                                                    ? "bg-purple-650 text-white shadow-xs"
                                                    : "text-slate-550 hover:text-slate-850 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/50"
                                            }`}
                                        >
                                            {cat.icon}
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>

                                {practiceError && (
                                    <div className="bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 p-4 rounded-xl border border-red-200 dark:border-red-900/30 text-xs flex items-center gap-2 mb-4 font-medium">
                                        <FaInfoCircle className="shrink-0" /> <span>{practiceError}</span>
                                    </div>
                                )}

                                {/* Collapsible Question List */}
                                {loadingQuestions ? (
                                    <div className="text-center py-24">
                                        <FaSpinner className="animate-spin text-purple-600 text-3xl mx-auto mb-4" />
                                        <p className="text-slate-550 dark:text-slate-400 font-bold text-sm">Generating practice questions...</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                                        {practiceQuestions.map((q, idx) => {
                                            const isOpen = expandedQuestion === idx;
                                            const answerVal = userAnswers[idx] || "";
                                            const feedback = evaluationFeedback[idx];

                                            return (
                                                <div 
                                                    key={idx} 
                                                    className={`border rounded-2xl p-4 transition-all ${
                                                        isOpen 
                                                            ? "border-purple-300 dark:border-purple-900/60 bg-purple-50/10 dark:bg-purple-950/5 shadow-xs" 
                                                            : "border-slate-200 dark:border-slate-850 bg-slate-50/30 dark:bg-slate-900/10 hover:bg-slate-50 dark:hover:bg-slate-900/30"
                                                    }`}
                                                >
                                                    <div 
                                                        onClick={() => setExpandedQuestion(isOpen ? null : idx)}
                                                        className="flex justify-between items-center cursor-pointer gap-4"
                                                    >
                                                        <div className="flex-1 flex items-center gap-2">
                                                            <span className="text-[10px] uppercase font-black text-purple-650 bg-purple-50 dark:bg-purple-950/45 px-2 py-0.5 rounded border border-purple-100 dark:border-purple-900/50 shrink-0">
                                                                Q{idx + 1}
                                                            </span>
                                                            <span className="font-extrabold text-slate-850 dark:text-white text-xs md:text-sm leading-snug">{q.question}</span>
                                                        </div>
                                                        <span className="text-slate-400 dark:text-slate-600 text-xs shrink-0">
                                                            {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                                                        </span>
                                                    </div>

                                                    {isOpen && (
                                                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-4">
                                                            <div className="space-y-1.5">
                                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Response</label>
                                                                <textarea
                                                                    rows="3"
                                                                    value={answerVal}
                                                                    onChange={(e) => setUserAnswers({...userAnswers, [idx]: e.target.value})}
                                                                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl p-3 text-xs focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none text-slate-700 dark:text-slate-350"
                                                                    placeholder="Compose your professional answer..."
                                                                ></textarea>
                                                            </div>

                                                            <div className="flex justify-end">
                                                                <button
                                                                    onClick={() => handleEvaluatePractice(idx, q.question)}
                                                                    disabled={evaluatingIndex === idx}
                                                                    className="bg-gradient-to-r from-purple-600 to-indigo-650 hover:from-purple-555 hover:to-indigo-500 text-white font-bold py-2.5 px-5 rounded-xl text-xs shadow-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                                                                >
                                                                    {evaluatingIndex === idx ? (
                                                                        <>
                                                                            <FaSpinner className="animate-spin" /> Analyzing Answer...
                                                                        </>
                                                                    ) : "Analyze Answer"}
                                                                </button>
                                                            </div>

                                                            {/* AI Feedback critique wrapper */}
                                                            {feedback && (
                                                                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl p-4 shadow-inner space-y-4.5">
                                                                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-2">
                                                                        <span className="font-extrabold text-slate-850 dark:text-white text-xs">AI Evaluation Score:</span>
                                                                        <span className="text-purple-650 dark:text-purple-400 font-black text-sm bg-purple-50 dark:bg-purple-950/40 px-3 py-1 rounded-full border border-purple-150/40 dark:border-purple-900/50">
                                                                            {feedback.score}/100
                                                                        </span>
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Feedback & Critique</span>
                                                                        <p className="text-slate-650 dark:text-slate-400 text-xs leading-relaxed font-normal">{feedback.feedback}</p>
                                                                    </div>
                                                                    <div className="bg-purple-50/40 dark:bg-purple-950/15 p-3 rounded-xl border border-purple-100/50 dark:border-purple-900/30">
                                                                        <span className="text-[10px] font-black text-purple-700 dark:text-purple-400 flex items-center gap-1 mb-1.5 uppercase tracking-wider">
                                                                            <FaLightbulb /> Suggested Model Answer
                                                                        </span>
                                                                        <p className="text-slate-700 dark:text-slate-300 text-xs italic leading-relaxed">{feedback.modelAnswer}</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* MOCK INTERVIEW SIMULATOR PANEL */}
                        <div className="glass-panel rounded-3xl p-6 shadow-sm border border-slate-200/60 dark:border-slate-800/80 flex flex-col justify-between min-h-[560px]">
                            {/* STATE 1: IDLE */}
                            {mockStep === "idle" && (
                                <div className="flex flex-col justify-between h-full space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-extrabold text-slate-850 dark:text-white flex items-center gap-2 tracking-tight">
                                            <FaPlay className="text-purple-600 dark:text-purple-400 text-sm" /> Mock Simulator Dashboard
                                        </h3>
                                        <p className="text-slate-500 dark:text-slate-450 text-xs md:text-sm leading-relaxed">
                                            Practice under simulated test conditions. We will generate 5 questions. Compose your answers within the editor pane, submit, and receive detailed report grades evaluating your strengths.
                                        </p>

                                        {mockError && (
                                            <div className="bg-red-50 dark:bg-red-950/20 text-red-750 dark:text-red-300 p-4 rounded-xl border border-red-200 dark:border-red-900/30 text-xs flex items-center gap-2">
                                                <FaInfoCircle className="shrink-0" /> <span>{mockError}</span>
                                            </div>
                                        )}

                                        <div className="space-y-3 pt-2">
                                            <label className="block text-xs font-black text-slate-450 uppercase tracking-widest">Select Mock Specialization Focus</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {mockOptions.map((opt) => (
                                                    <button
                                                        key={opt}
                                                        onClick={() => setMockCategory(opt)}
                                                        className={`py-3 px-3.5 rounded-2xl font-bold text-xs border transition-all text-center cursor-pointer ${
                                                            mockCategory === opt
                                                                ? "bg-purple-600 text-white border-transparent shadow-xs"
                                                                : "bg-white dark:bg-slate-900 text-slate-650 dark:text-slate-350 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950"
                                                        }`}
                                                    >
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={handleStartMockSimulation}
                                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-650 hover:from-purple-550 hover:to-indigo-500 text-white font-extrabold py-4 rounded-2xl transition-all shadow-md active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 text-sm mt-8"
                                    >
                                        <FaPlay /> Start Simulator
                                    </button>
                                </div>
                            )}

                            {/* STATE 2: LOADING GENERATION */}
                            {(mockStep === "generating" || mockStep === "submitting") && (
                                <div className="flex flex-col items-center justify-center text-center py-20 my-auto h-full space-y-6">
                                    <div className="relative w-16 h-16">
                                        <div className="absolute inset-0 border-4 border-purple-600/25 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-lg font-black text-slate-850 dark:text-white">
                                            {mockStep === "generating" ? "Generating Simulated Session" : "Grading Performance Report"}
                                        </h4>
                                        <p className="text-purple-600 dark:text-purple-400 text-xs font-bold animate-pulse">
                                            {loadingSteps[loaderStep]}
                                        </p>
                                        <div className="flex gap-1 justify-center pt-2">
                                            {loadingSteps.map((_, idx) => (
                                                <span 
                                                    key={idx} 
                                                    className={`w-2 h-1 rounded-full transition-all duration-300 ${
                                                        idx <= loaderStep ? "bg-purple-600 w-5" : "bg-slate-200 dark:bg-slate-800"
                                                    }`}
                                                ></span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STATE 3: INTERVIEWING PRACTICE QUESTIONS */}
                            {mockStep === "interviewing" && (
                                <div className="flex flex-col justify-between h-full space-y-6">
                                    <div>
                                        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-3 mb-5">
                                            <span className="text-[10px] uppercase font-black tracking-widest text-purple-650 bg-purple-50 dark:bg-purple-950/40 border border-purple-150/40 dark:border-purple-900/50 px-3 py-1 rounded">
                                                {mockCategory} Focus
                                            </span>
                                            <button 
                                                onClick={() => {
                                                    if(window.confirm("Exit simulator? Current progress will be lost.")) setMockStep("idle");
                                                }}
                                                className="text-slate-400 hover:text-red-500 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                                            >
                                                <FaTimes /> Exit Mock
                                            </button>
                                        </div>

                                        {/* Glowing Progress bar */}
                                        <div className="space-y-2 mb-6">
                                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                                <div 
                                                    className="bg-gradient-to-r from-purple-600 to-indigo-500 h-full rounded-full transition-all duration-300"
                                                    style={{ width: `${((currentMockIndex + 1) / mockQuestions.length) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block text-right">
                                                Question {currentMockIndex + 1} of {mockQuestions.length}
                                            </span>
                                        </div>

                                        <h4 className="text-base md:text-lg font-black text-slate-850 dark:text-white leading-snug mb-5">
                                            {mockQuestions[currentMockIndex]?.question}
                                        </h4>

                                        <div className="space-y-1.5">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Type Your Answer Response</label>
                                            <textarea
                                                rows="5"
                                                value={currentAnswer}
                                                onChange={(e) => setCurrentAnswer(e.target.value)}
                                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl p-4 text-xs focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none text-slate-700 dark:text-slate-350"
                                                placeholder="Compose your response here..."
                                            ></textarea>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center gap-4 mt-6">
                                        <button
                                            onClick={handlePrevMockQuestion}
                                            disabled={currentMockIndex === 0}
                                            className="flex-1 bg-slate-100 hover:bg-slate-205 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-650 dark:text-slate-350 font-bold py-3 rounded-xl text-xs transition-all disabled:opacity-50 cursor-pointer"
                                        >
                                            Back
                                        </button>

                                        {currentMockIndex < mockQuestions.length - 1 ? (
                                            <button
                                                onClick={handleNextMockQuestion}
                                                className="flex-1 bg-purple-650 hover:bg-purple-500 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-xs cursor-pointer active:scale-95"
                                            >
                                                Next Question
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleSubmitMockInterview}
                                                className="flex-1 bg-gradient-to-r from-emerald-650 to-teal-600 hover:from-emerald-555 hover:to-teal-500 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-xs cursor-pointer active:scale-95"
                                            >
                                                Grade Interview
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* STATE 5: PERFORMANCE REPORT CARD DISPLAY */}
                            {mockStep === "report" && mockReport && (
                                <div className="flex flex-col justify-between h-full space-y-5">
                                    <div className="space-y-5">
                                        <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-850 pb-3">
                                            <div>
                                                <h3 className="font-extrabold text-slate-850 dark:text-white text-base">Performance Report</h3>
                                                <span className="text-[10px] text-slate-450 uppercase font-black tracking-wider">Category: {mockReport.category}</span>
                                            </div>
                                            <div className="bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 px-3 py-1.5 rounded-xl text-center border border-purple-100/50 dark:border-purple-900/40 min-w-[75px]">
                                                <span className="block text-[8px] font-black uppercase text-purple-500 tracking-wider">Score</span>
                                                <span className="text-base font-black">{mockReport.score}%</span>
                                            </div>
                                        </div>

                                        {/* Score breakdown metrics gauges */}
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200/50 dark:border-slate-850 text-center">
                                                <span className="block text-base font-extrabold text-slate-850 dark:text-white">{mockReport.communication}%</span>
                                                <span className="text-[9px] uppercase font-black text-slate-450 tracking-wider">Communication</span>
                                            </div>
                                            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200/50 dark:border-slate-850 text-center">
                                                <span className="block text-base font-extrabold text-slate-855 dark:text-white">{mockReport.technicalKnowledge}%</span>
                                                <span className="text-[9px] uppercase font-black text-slate-450 tracking-wider">Technical</span>
                                            </div>
                                            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200/50 dark:border-slate-850 text-center">
                                                <span className="block text-base font-extrabold text-slate-850 dark:text-white">{mockReport.confidence}%</span>
                                                <span className="text-[9px] uppercase font-black text-slate-450 tracking-wider">Confidence</span>
                                            </div>
                                        </div>

                                        {/* Strengths & Weaknesses block */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-emerald-50/25 dark:bg-emerald-950/5 border border-emerald-200/30 dark:border-emerald-900/30 p-3.5 rounded-2xl">
                                                <span className="text-[10px] font-black text-emerald-800 dark:text-emerald-450 flex items-center gap-1.5 mb-2 uppercase tracking-wider">
                                                    <FaCheck className="text-emerald-555" /> Key Strengths
                                                </span>
                                                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 font-medium">
                                                    {mockReport.strengths.map((s, idx) => (
                                                        <li key={idx} className="flex items-start gap-1">
                                                            <span className="text-emerald-500">•</span>
                                                            <span>{s}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="bg-amber-50/20 dark:bg-amber-950/5 border border-amber-200/30 dark:border-amber-900/30 p-3.5 rounded-2xl">
                                                <span className="text-[10px] font-black text-amber-800 dark:text-amber-450 flex items-center gap-1.5 mb-2 uppercase tracking-wider">
                                                    <FaExclamationTriangle className="text-amber-555" /> Improvements
                                                </span>
                                                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 font-medium">
                                                    {mockReport.weaknesses.map((w, idx) => (
                                                        <li key={idx} className="flex items-start gap-1">
                                                            <span className="text-amber-500">•</span>
                                                            <span>{w}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Detailed Question Logs */}
                                        <div className="space-y-2">
                                            <span className="block text-[10px] font-black text-slate-450 uppercase tracking-widest">Questions Log Report</span>
                                            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                                                {mockReport.questions.map((q, idx) => (
                                                    <details key={idx} className="border border-slate-200/60 dark:border-slate-800 rounded-xl bg-slate-50/40 dark:bg-slate-950 p-2.5 text-xs">
                                                        <summary className="font-extrabold text-slate-705 dark:text-slate-300 cursor-pointer flex justify-between items-center outline-none">
                                                            <span className="truncate pr-4">Q{idx + 1}: {q.question}</span>
                                                            <span className="bg-purple-50 dark:bg-purple-950/40 text-purple-650 dark:text-purple-400 px-2 py-0.5 rounded-full font-black text-[10px] shrink-0 border border-purple-100/50 dark:border-purple-900/40">{q.score}%</span>
                                                        </summary>
                                                        <div className="mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-850 space-y-2 font-medium">
                                                            <p className="text-slate-700 dark:text-slate-300"><strong>Your Answer:</strong> <span className="text-slate-600 dark:text-slate-400">{q.userAnswer}</span></p>
                                                            <p className="text-slate-700 dark:text-slate-300"><strong>Critique:</strong> <span className="text-slate-600 dark:text-slate-400">{q.feedback}</span></p>
                                                            <p className="bg-purple-50/30 dark:bg-purple-950/15 p-2 rounded border border-purple-100/40 dark:border-purple-900/30 text-slate-800 dark:text-slate-300 italic"><strong>Model Suggestion:</strong> {q.modelAnswer}</p>
                                                        </div>
                                                    </details>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setMockStep("idle")}
                                        className="w-full bg-slate-850 hover:bg-slate-750 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-all text-xs mt-4 cursor-pointer"
                                    >
                                        Restart Simulator
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* HISTORY LOG PANEL */}
                    <div className="glass-panel rounded-3xl p-6 shadow-sm border border-slate-200/60 dark:border-slate-800/80">
                        <h3 className="text-xl font-extrabold text-slate-850 dark:text-white flex items-center gap-2 mb-6 tracking-tight">
                            <FaHistory className="text-purple-600 dark:text-purple-400" /> Practice & Simulator Logs
                        </h3>

                        {history.length === 0 ? (
                            <div className="text-center py-12 border border-dashed border-slate-250 dark:border-slate-850 rounded-2xl text-slate-500 text-sm font-semibold">
                                No assessment sessions found. Attempt practice questions or mock tests above to display logs.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-xs md:text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                                            <th className="py-3 px-4">Track Specialization</th>
                                            <th className="py-3 px-4">Date Completed</th>
                                            <th className="py-3 px-4">Grade Score</th>
                                            <th className="py-3 px-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                                        {history.map((record) => {
                                            const scoreVal = record.score || 0;
                                            const getScoreColor = (sc) => {
                                                if (sc >= 85) return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
                                                if (sc >= 70) return "bg-purple-500/10 text-purple-500 border border-purple-500/20";
                                                return "bg-blue-500/10 text-blue-500 border border-blue-500/20";
                                            };

                                            return (
                                                <tr key={record._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all font-medium text-slate-700 dark:text-slate-300">
                                                    <td className="py-4 px-4 font-extrabold text-slate-850 dark:text-white text-xs md:text-sm">{record.category}</td>
                                                    <td className="py-4 px-4 text-slate-500 text-[11px]">{new Date(record.createdAt).toLocaleDateString(undefined, {
                                                        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                    })}</td>
                                                    <td className="py-4 px-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-black ${getScoreColor(scoreVal)}`}>
                                                            {scoreVal}%
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-right">
                                                        <button
                                                            onClick={() => setSelectedHistoryReport(record)}
                                                            className="text-purple-650 hover:text-purple-500 text-xs font-black cursor-pointer hover:underline"
                                                        >
                                                            View Report
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* View Report Detail Modal */}
                    {selectedHistoryReport && (
                        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4">
                            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full relative overflow-hidden shadow-2xl animate-scale-in">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full filter blur-3xl"></div>
                                
                                <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-850 mb-6">
                                    <div>
                                        <h3 className="text-xl font-extrabold text-slate-850 dark:text-white tracking-tight">
                                            Simulated Report Detail
                                        </h3>
                                        <span className="text-[10px] text-slate-450 uppercase font-black tracking-wider">
                                            Track: {selectedHistoryReport.category}
                                        </span>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedHistoryReport(null)}
                                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-450 dark:text-slate-500 transition-colors cursor-pointer"
                                    >
                                        <FaTimes size={16} />
                                    </button>
                                </div>

                                <div className="space-y-5 max-h-[380px] overflow-y-auto pr-2">
                                    <div className="flex items-center justify-between p-3.5 bg-purple-50/50 dark:bg-purple-950/20 border border-purple-150/40 dark:border-purple-900/35 rounded-2xl">
                                        <span className="font-extrabold text-purple-900 dark:text-purple-300 text-xs">AI Evaluation Score Rating:</span>
                                        <span className="text-purple-700 dark:text-purple-400 font-black text-sm bg-white dark:bg-slate-900 px-3.5 py-1 rounded-full border border-purple-100 dark:border-purple-800/40">
                                            {selectedHistoryReport.score}%
                                        </span>
                                    </div>

                                    {/* Mock breakdown display in modal */}
                                    {selectedHistoryReport.communication !== undefined && (
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-850 text-center text-xs">
                                                <span className="block font-black text-slate-800 dark:text-white">{selectedHistoryReport.communication}%</span>
                                                <span className="text-[8px] uppercase font-bold text-slate-400 block tracking-wider">Comm.</span>
                                            </div>
                                            <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-850 text-center text-xs">
                                                <span className="block font-black text-slate-800 dark:text-white">{selectedHistoryReport.technicalKnowledge}%</span>
                                                <span className="text-[8px] uppercase font-bold text-slate-400 block tracking-wider">Tech.</span>
                                            </div>
                                            <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-850 text-center text-xs">
                                                <span className="block font-black text-slate-800 dark:text-white">{selectedHistoryReport.confidence}%</span>
                                                <span className="text-[8px] uppercase font-bold text-slate-400 block tracking-wider">Conf.</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Strengths & Weaknesses display in modal */}
                                    {selectedHistoryReport.strengths && selectedHistoryReport.strengths.length > 0 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-emerald-50/20 dark:bg-emerald-950/5 border border-emerald-200/30 dark:border-emerald-900/35 p-3 rounded-xl">
                                                <span className="text-[9px] font-black text-emerald-800 dark:text-emerald-450 flex items-center gap-1 mb-1.5 uppercase tracking-wider">
                                                    <FaCheck /> Key Strengths
                                                </span>
                                                <ul className="text-[11px] text-slate-650 dark:text-slate-400 space-y-1 font-medium">
                                                    {selectedHistoryReport.strengths.map((s, idx) => (
                                                        <li key={idx} className="flex items-start gap-1">
                                                            <span className="text-emerald-555">•</span>
                                                            <span>{s}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="bg-amber-50/20 dark:bg-amber-950/5 border border-amber-200/30 dark:border-amber-900/35 p-3 rounded-xl">
                                                <span className="text-[9px] font-black text-amber-800 dark:text-amber-455 flex items-center gap-1.5 mb-1.5 uppercase tracking-wider">
                                                    <FaExclamationTriangle /> Improvements
                                                </span>
                                                <ul className="text-[11px] text-slate-655 dark:text-slate-400 space-y-1 font-medium">
                                                    {selectedHistoryReport.weaknesses.map((w, idx) => (
                                                        <li key={idx} className="flex items-start gap-1">
                                                            <span className="text-amber-555">•</span>
                                                            <span>{w}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                    {selectedHistoryReport.questions && selectedHistoryReport.questions.length > 0 ? (
                                        <div className="space-y-2.5">
                                            <span className="block text-[10px] font-black text-slate-450 uppercase tracking-widest">Detailed Questions Log</span>
                                            <div className="space-y-3">
                                                {selectedHistoryReport.questions.map((q, idx) => (
                                                    <details key={idx} className="border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/45 dark:bg-slate-950 p-3 text-xs font-medium">
                                                        <summary className="font-extrabold text-slate-705 dark:text-slate-350 cursor-pointer flex justify-between items-center outline-none">
                                                            <span className="truncate pr-4">Q{idx + 1}: {q.question}</span>
                                                            <span className="bg-purple-50 dark:bg-purple-950/40 text-purple-650 dark:text-purple-400 px-2 py-0.5 rounded-full font-black text-[10px] border border-purple-100/50 dark:border-purple-900/40 shrink-0">{q.score}%</span>
                                                        </summary>
                                                        <div className="mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-850 space-y-2">
                                                            <p className="text-slate-700 dark:text-slate-300"><strong>Your Answer:</strong> <span className="text-slate-600 dark:text-slate-400">{q.userAnswer}</span></p>
                                                            <p className="text-slate-700 dark:text-slate-300"><strong>Critique:</strong> <span className="text-slate-600 dark:text-slate-400">{q.feedback}</span></p>
                                                            <p className="bg-purple-50/35 dark:bg-purple-950/15 p-2 rounded border border-purple-100/40 dark:border-purple-900/30 italic text-slate-800 dark:text-slate-350"><strong>Model Suggestion:</strong> {q.modelAnswer}</p>
                                                        </div>
                                                    </details>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-xs space-y-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-205 dark:border-slate-850 font-medium">
                                            <p className="text-slate-705 dark:text-slate-300"><strong>Your Answer:</strong> <span className="text-slate-600 dark:text-slate-400">{selectedHistoryReport.answer}</span></p>
                                            <p className="text-slate-705 dark:text-slate-300"><strong>Critique:</strong> <span className="text-slate-600 dark:text-slate-400">{selectedHistoryReport.feedback}</span></p>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => setSelectedHistoryReport(null)}
                                    className="w-full bg-slate-850 hover:bg-slate-750 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold py-3.5 rounded-xl transition-all text-xs mt-6 cursor-pointer"
                                >
                                    Close Report
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default InterviewPrep;