import { useState } from "react";
import {
    FaChartPie,
    FaFileAlt,
    FaRoad,
    FaBriefcase,
    FaMicrophone,
    FaCheckCircle,
    FaTimesCircle,
    FaArrowRight,
    FaStar,
    FaSlidersH
} from "react-icons/fa";

function DashboardPreview() {
    const [activeTab, setActiveTab] = useState("dashboard");
    
    // Interactive state inside preview
    const [roadmapTasks, setRoadmapTasks] = useState([
        { id: 1, text: "Build React portfolio", done: true, points: 15 },
        { id: 2, text: "Integrate REST APIs with Express", done: true, points: 20 },
        { id: 3, text: "Learn MongoDB Aggregations", done: false, points: 15 },
        { id: 4, text: "Setup Docker container", done: false, points: 25 },
        { id: 5, text: "Deploy app to AWS EC2", done: false, points: 25 },
    ]);

    const toggleTask = (id) => {
        setRoadmapTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
    };

    // Calculate dynamic progress
    const totalPoints = roadmapTasks.reduce((sum, t) => sum + t.points, 0);
    const completedPoints = roadmapTasks.filter(t => t.done).reduce((sum, t) => sum + t.points, 0);
    const dynamicProgress = Math.round((completedPoints / totalPoints) * 100);

    // Skills data for Radar Chart
    const skills = [
        { subject: 'Frontend', value: 90, fullMark: 100, x: 150, y: 35 },
        { subject: 'Backend', value: 80, fullMark: 100, x: 250, y: 90 },
        { subject: 'Database', value: 65, fullMark: 100, x: 250, y: 210 },
        { subject: 'DevOps', value: 45, fullMark: 100, x: 150, y: 265 },
        { subject: 'Sys Design', value: 50, fullMark: 100, x: 50, y: 210 },
        { subject: 'Testing', value: 70, fullMark: 100, x: 50, y: 90 },
    ];

    // Compute Radar Chart points dynamically
    const center = 150;
    const computeRadarPoints = (valScale) => {
        // Angles: 0(90deg), 60, 120, 180, 240, 300
        const angles = [-Math.PI/2, -Math.PI/6, Math.PI/6, Math.PI/2, Math.PI*5/6, Math.PI*7/6];
        const rMax = 100;
        return angles.map((angle, i) => {
            const val = skills[i].value * valScale;
            const r = (val / 100) * rMax;
            const x = center + r * Math.cos(angle);
            const y = center + r * Math.sin(angle);
            return `${x},${y}`;
        }).join(" ");
    };

    const polyPoints = computeRadarPoints(1);

    return (
        <section className="bg-slate-50/60 dark:bg-slate-950/60 py-24 px-6 md:px-8 border-t border-slate-100 dark:border-slate-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="text-center space-y-4 max-w-2xl mx-auto mb-16 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100/70 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider select-none border border-purple-200/40 dark:border-purple-900/30">
                        Interactive Dashboard Preview
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                        See FutureForge In Action
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg">
                        Interact with our student dashboard sandbox to preview real-time AI metrics.
                    </p>
                </div>

                {/* Dashboard Frame */}
                <div className="mt-12 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
                    <div className="grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
                        
                        {/* Interactive Preview Sidebar */}
                        <div className="col-span-12 md:col-span-3 bg-slate-950 text-white p-4 md:p-6 flex flex-col md:justify-between border-b md:border-b-0 md:border-r border-slate-900">
                            <div>
                                <div className="flex items-center gap-2.5 mb-4 md:mb-8 justify-between md:justify-start w-full">
                                    <div className="flex items-center gap-2.5">
                                        <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-sm font-black shadow-md shadow-purple-500/20">
                                            F
                                        </span>
                                        <span className="font-black text-lg tracking-tight">FutureForge <span className="font-light text-slate-400">AI</span></span>
                                    </div>
                                    <div className="md:hidden text-[10px] text-slate-500 font-mono">
                                        Demo sandbox
                                    </div>
                                </div>

                                <ul className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none">
                                    <li className="shrink-0 md:w-full">
                                        <button
                                            onClick={() => setActiveTab("dashboard")}
                                            className={`w-auto md:w-full flex items-center gap-3 px-3.5 py-2.5 md:px-4 md:py-3 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 cursor-pointer whitespace-nowrap ${
                                                activeTab === "dashboard"
                                                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                                                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                                            }`}
                                        >
                                            <FaChartPie className="text-base shrink-0" />
                                            Overview
                                        </button>
                                    </li>
                                    <li className="shrink-0 md:w-full">
                                        <button
                                            onClick={() => setActiveTab("resume")}
                                            className={`w-auto md:w-full flex items-center gap-3 px-3.5 py-2.5 md:px-4 md:py-3 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 cursor-pointer whitespace-nowrap ${
                                                activeTab === "resume"
                                                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                                                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                                            }`}
                                        >
                                            <FaFileAlt className="text-base shrink-0" />
                                            Resume Audit
                                        </button>
                                    </li>
                                    <li className="shrink-0 md:w-full">
                                        <button
                                            onClick={() => setActiveTab("roadmap")}
                                            className={`w-auto md:w-full flex items-center gap-3 px-3.5 py-2.5 md:px-4 md:py-3 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 cursor-pointer whitespace-nowrap ${
                                                activeTab === "roadmap"
                                                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                                                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                                            }`}
                                        >
                                            <FaRoad className="text-base shrink-0" />
                                            Roadmap Progress
                                        </button>
                                    </li>
                                    <li className="shrink-0 md:w-full">
                                        <button
                                            onClick={() => setActiveTab("internships")}
                                            className={`w-auto md:w-full flex items-center gap-3 px-3.5 py-2.5 md:px-4 md:py-3 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 cursor-pointer whitespace-nowrap ${
                                                activeTab === "internships"
                                                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                                                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                                            }`}
                                        >
                                            <FaBriefcase className="text-base shrink-0" />
                                            Matching Internships
                                        </button>
                                    </li>
                                    <li className="shrink-0 md:w-full">
                                        <button
                                            onClick={() => setActiveTab("interview")}
                                            className={`w-auto md:w-full flex items-center gap-3 px-3.5 py-2.5 md:px-4 md:py-3 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 cursor-pointer whitespace-nowrap ${
                                                activeTab === "interview"
                                                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                                                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                                            }`}
                                        >
                                            <FaMicrophone className="text-base shrink-0" />
                                            Mock Interview
                                        </button>
                                    </li>
                                </ul>
                            </div>

                            <div className="hidden md:block pt-4 border-t border-slate-900 text-xs text-slate-500">
                                Sandboxed Demo User
                            </div>
                        </div>

                        {/* Interactive Preview Main Window */}
                        <div className="col-span-12 md:col-span-9 p-4 sm:p-8 flex flex-col justify-between bg-slate-50/45 dark:bg-slate-900/40">
                            
                            {/* OVERVIEW PANEL */}
                            {activeTab === "dashboard" && (
                                <div className="space-y-8 animate-fade-in-up h-full flex flex-col justify-between">
                                    {/* Stats grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
                                        <div className="bg-purple-500/10 border border-purple-500/20 p-5 rounded-2xl relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300">
                                            <div className="absolute right-[-10px] bottom-[-10px] text-purple-500/10 text-6xl group-hover:rotate-12 transition-transform duration-500"><FaFileAlt /></div>
                                            <h4 className="font-bold text-xs uppercase tracking-wider text-purple-600 dark:text-purple-400">Resume Score</h4>
                                            <div className="flex items-baseline gap-1 mt-3">
                                                <span className="text-4xl font-black text-slate-800 dark:text-white">78</span>
                                                <span className="text-xs text-slate-400">/ 100</span>
                                            </div>
                                            <p className="text-[10px] text-slate-500 mt-2">Parsed 2 days ago</p>
                                        </div>

                                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300">
                                            <div className="absolute right-[-10px] bottom-[-10px] text-emerald-500/10 text-6xl group-hover:rotate-12 transition-transform duration-500"><FaRoad /></div>
                                            <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Roadmap Progress</h4>
                                            <div className="flex items-baseline gap-1 mt-3">
                                                <span className="text-4xl font-black text-slate-800 dark:text-white">{dynamicProgress}%</span>
                                            </div>
                                            <p className="text-[10px] text-slate-500 mt-2">Adjust tasks in "Roadmap" tab!</p>
                                        </div>

                                        <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-2xl relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300">
                                            <div className="absolute right-[-10px] bottom-[-10px] text-blue-500/10 text-6xl group-hover:rotate-12 transition-transform duration-500"><FaBriefcase /></div>
                                            <h4 className="font-bold text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400">Intern Match Score</h4>
                                            <div className="flex items-baseline gap-1 mt-3">
                                                <span className="text-4xl font-black text-slate-800 dark:text-white">85%</span>
                                            </div>
                                            <p className="text-[10px] text-slate-500 mt-2">Based on 12 matched roles</p>
                                        </div>
                                    </div>

                                    {/* SVG Radar Chart Block */}
                                    <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row gap-8 items-center">
                                        <div className="flex-1 space-y-4">
                                            <h4 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                                                <FaChartPie className="text-purple-500 text-sm" /> 
                                                AI Skill Mapping Radar
                                            </h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
                                                This graphic shows your skills mapped from your parsed resume. The purple polygon visualizes your capabilities against fullstack engineer requirements. Hover points or update resume to adjust values.
                                            </p>
                                            <div className="space-y-1.5 pt-2">
                                                <div className="flex justify-between text-[11px] font-bold text-slate-700 dark:text-slate-350">
                                                    <span>Frontend Core</span>
                                                    <span className="text-purple-600 dark:text-purple-400">90% (Expert)</span>
                                                </div>
                                                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                                    <div className="bg-purple-600 h-full w-[90%]"></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* SVG Radar Visualizer */}
                                        <div className="relative w-full max-w-[300px] shrink-0 flex items-center justify-center p-2 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-slate-200/30 dark:border-slate-850">
                                            <svg viewBox="0 0 300 300" className="w-full max-w-[300px] h-auto overflow-visible select-none">
                                                {/* Circular grids */}
                                                <circle cx="150" cy="150" r="100" fill="none" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="1" strokeDasharray="3 3" />
                                                <circle cx="150" cy="150" r="75" fill="none" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="1" strokeDasharray="3 3" />
                                                <circle cx="150" cy="150" r="50" fill="none" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="1" strokeDasharray="3 3" />
                                                <circle cx="150" cy="150" r="25" fill="none" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="1" strokeDasharray="3 3" />

                                                {/* Angle Axis Lines */}
                                                <line x1="150" y1="50" x2="150" y2="250" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="1" />
                                                <line x1="63.4" y1="100" x2="236.6" y2="200" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="1" />
                                                <line x1="63.4" y1="200" x2="236.6" y2="100" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="1" />

                                                {/* Radar Polygon Shape */}
                                                <polygon
                                                    points={polyPoints}
                                                    fill="rgba(168, 85, 247, 0.18)"
                                                    stroke="rgb(168, 85, 247)"
                                                    strokeWidth="2.5"
                                                    className="transition-all duration-500 animate-draw-path"
                                                />

                                                {/* Labels */}
                                                {skills.map((s, idx) => (
                                                    <text
                                                        key={idx}
                                                        x={s.x}
                                                        y={s.y}
                                                        textAnchor="middle"
                                                        alignmentBaseline="middle"
                                                        className="text-[9px] font-bold fill-slate-500 dark:fill-slate-400"
                                                    >
                                                        {s.subject} ({s.value}%)
                                                    </text>
                                                ))}

                                                {/* Glowing anchor dots */}
                                                <circle cx="150" cy="60" r="4" className="fill-purple-600 animate-pulse-dot" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* RESUME AUDIT PANEL */}
                            {activeTab === "resume" && (
                                <div className="space-y-6 animate-fade-in-up h-full flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold text-xl text-slate-800 dark:text-white flex items-center gap-2">
                                            <FaFileAlt className="text-purple-500" /> Resume parsing audit report
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                            Details of skill scoring compared against job requirements.
                                        </p>
                                    </div>

                                    {/* Skills checklist and score summary */}
                                    <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl p-5 flex-1 overflow-y-auto max-h-[260px] space-y-4">
                                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-350">Matched skills profile completeness</span>
                                            <span className="text-xs font-black text-purple-600 dark:text-purple-400">78% Match</span>
                                        </div>

                                        <div className="overflow-x-auto w-full">
                                            <table className="w-full text-left text-xs min-w-[340px]">
                                                <thead>
                                                    <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-850">
                                                        <th className="pb-2 font-bold uppercase text-[9px]">Skill Domain</th>
                                                        <th className="pb-2 font-bold uppercase text-[9px]">Your rating</th>
                                                        <th className="pb-2 font-bold uppercase text-[9px]">Market demand</th>
                                                        <th className="pb-2 font-bold uppercase text-[9px] text-right">Match</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-slate-750 dark:text-slate-300">
                                                    <tr>
                                                        <td className="py-2.5 font-bold">React.js & Frontend</td>
                                                        <td className="py-2.5">5 / 5 (Expert)</td>
                                                        <td className="py-2.5">High demand</td>
                                                        <td className="py-2.5 text-right"><FaCheckCircle className="text-emerald-500 inline text-sm" /></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-2.5 font-bold">Node.js & Express</td>
                                                        <td className="py-2.5">4 / 5 (Advanced)</td>
                                                        <td className="py-2.5">High demand</td>
                                                        <td className="py-2.5 text-right"><FaCheckCircle className="text-emerald-500 inline text-sm" /></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-2.5 font-bold">Relational Databases</td>
                                                        <td className="py-2.5">3 / 5 (Intermediate)</td>
                                                        <td className="py-2.5">Medium demand</td>
                                                        <td className="py-2.5 text-right"><FaCheckCircle className="text-emerald-500 inline text-sm" /></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-2.5 font-bold">Docker Containers</td>
                                                        <td className="py-2.5">0 / 5 (No rating)</td>
                                                        <td className="py-2.5">Crucial gap</td>
                                                        <td className="py-2.5 text-right"><FaTimesCircle className="text-red-500 inline text-sm" /></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-2.5 font-bold">AWS Deployment</td>
                                                        <td className="py-2.5">1 / 5 (Familiar)</td>
                                                        <td className="py-2.5">Critical gap</td>
                                                        <td className="py-2.5 text-right"><FaTimesCircle className="text-red-500 inline text-sm" /></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* CTA feedback box */}
                                    <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-xl flex items-center justify-between text-xs">
                                        <div className="text-slate-700 dark:text-slate-300">
                                            💡 <strong className="text-purple-600 dark:text-purple-400">Action Plan:</strong> Complete the Docker & AWS roadmap steps to unlock 4 matching backend roles.
                                        </div>
                                        <button onClick={() => setActiveTab("roadmap")} className="text-purple-600 dark:text-purple-400 font-bold hover:underline shrink-0 ml-3 flex items-center gap-1 cursor-pointer">
                                            Go to Roadmap <FaArrowRight size={10} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ROADMAP PROGRESS PANEL */}
                            {activeTab === "roadmap" && (
                                <div className="space-y-6 animate-fade-in-up h-full flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-xl text-slate-800 dark:text-white flex items-center gap-2">
                                                    <FaRoad className="text-purple-500" /> Career Roadmap Milestones
                                                </h3>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                    Check/uncheck tasks below to watch your score recalculate in real-time.
                                                </p>
                                            </div>
                                            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-black px-3.5 py-1.5 rounded-xl">
                                                {dynamicProgress}% Done
                                            </div>
                                        </div>
                                    </div>

                                    {/* Checkbox interactive list */}
                                    <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl p-5 flex-1 overflow-y-auto max-h-[260px] space-y-3">
                                        {roadmapTasks.map((task) => (
                                            <div
                                                key={task.id}
                                                onClick={() => toggleTask(task.id)}
                                                className={`flex items-center gap-3.5 p-3 rounded-xl border transition-all duration-300 cursor-pointer select-none ${
                                                    task.done
                                                        ? "bg-slate-50/50 dark:bg-slate-950/20 border-purple-500/30"
                                                        : "bg-white dark:bg-slate-900 border-slate-200/50 dark:border-slate-850 hover:border-purple-500/40"
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={task.done}
                                                    readOnly
                                                    className="w-4 h-4 text-purple-600 border-slate-300 rounded-sm focus:ring-purple-500 cursor-pointer"
                                                />
                                                <div className="flex-1">
                                                    <span className={`text-xs font-bold ${task.done ? "line-through text-slate-450 dark:text-slate-500" : "text-slate-800 dark:text-white"}`}>
                                                        {task.text}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-md">
                                                    {task.points} pts
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* INTERNSHIP FINDER PANEL */}
                            {activeTab === "internships" && (
                                <div className="space-y-6 animate-fade-in-up h-full flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold text-xl text-slate-800 dark:text-white flex items-center gap-2">
                                            <FaBriefcase className="text-purple-500" /> Matched Internship Openings
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                            Jobs recommended based on your current resume score and skills.
                                        </p>
                                    </div>

                                    {/* Intern list */}
                                    <div className="flex-1 overflow-y-auto max-h-[300px] space-y-3">
                                        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-4 rounded-2xl flex justify-between items-center hover:border-purple-500/40 transition-colors duration-300">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-sm text-slate-800 dark:text-white">Junior React Developer</h4>
                                                    <span className="text-[9px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded">92% Match</span>
                                                </div>
                                                <p className="text-xs text-slate-500">TechCorp Inc. • Remote • Paid</p>
                                                <div className="flex gap-1.5 pt-1">
                                                    <span className="text-[9px] bg-slate-100 dark:bg-slate-850 text-slate-605 dark:text-slate-400 px-2 py-0.5 rounded-md font-bold">React</span>
                                                    <span className="text-[9px] bg-slate-100 dark:bg-slate-850 text-slate-605 dark:text-slate-400 px-2 py-0.5 rounded-md font-bold">Tailwind CSS</span>
                                                </div>
                                            </div>
                                            <button className="px-3.5 py-1.5 bg-purple-600 text-white text-[10px] font-bold rounded-lg cursor-pointer">Quick Apply</button>
                                        </div>

                                        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-4 rounded-2xl flex justify-between items-center hover:border-purple-500/40 transition-colors duration-300">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-sm text-slate-800 dark:text-white">Full Stack Engineering Intern</h4>
                                                    <span className="text-[9px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded">88% Match</span>
                                                </div>
                                                <p className="text-xs text-slate-500">AppStart Studios • Hybrid (SF) • Paid</p>
                                                <div className="flex gap-1.5 pt-1">
                                                    <span className="text-[9px] bg-slate-100 dark:bg-slate-850 text-slate-605 dark:text-slate-400 px-2 py-0.5 rounded-md font-bold">Node.js</span>
                                                    <span className="text-[9px] bg-slate-100 dark:bg-slate-850 text-slate-605 dark:text-slate-400 px-2 py-0.5 rounded-md font-bold">MongoDB</span>
                                                </div>
                                            </div>
                                            <button className="px-3.5 py-1.5 bg-purple-600 text-white text-[10px] font-bold rounded-lg cursor-pointer">Quick Apply</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* INTERVIEW PREP PANEL */}
                            {activeTab === "interview" && (
                                <div className="space-y-6 animate-fade-in-up h-full flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold text-xl text-slate-800 dark:text-white flex items-center gap-2">
                                            <FaMicrophone className="text-purple-500" /> Interactive Mock Interviews
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                            History of mock assessments evaluated by AI grading models.
                                        </p>
                                    </div>

                                    {/* Mock List */}
                                    <div className="flex-1 overflow-y-auto max-h-[300px] space-y-3">
                                        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-4 rounded-2xl flex justify-between items-center hover:border-purple-500/40 transition-colors duration-300">
                                            <div className="space-y-1">
                                                <h4 className="font-bold text-sm text-slate-800 dark:text-white">JavaScript Closure & Scope Round</h4>
                                                <p className="text-xs text-slate-500">Completed 1 day ago • 15 questions</p>
                                                <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                                                    <FaStar /><FaStar /><FaStar /><FaStar />
                                                    <span className="text-slate-450 dark:text-slate-500 ml-1">Excellent performance</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-lg font-black text-purple-600 dark:text-purple-400">8.8<span className="text-[10px] text-slate-400 font-light">/10</span></span>
                                                <button className="block text-[9px] text-purple-500 dark:text-purple-400 hover:underline mt-1 font-bold cursor-pointer">View Details</button>
                                            </div>
                                        </div>

                                        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-4 rounded-2xl flex justify-between items-center hover:border-purple-500/40 transition-colors duration-300">
                                            <div className="space-y-1">
                                                <h4 className="font-bold text-sm text-slate-800 dark:text-white">Basic System Architecture Design</h4>
                                                <p className="text-xs text-slate-500">Completed 4 days ago • 8 questions</p>
                                                <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                                                    <FaStar /><FaStar /><FaStar />
                                                    <span className="text-slate-450 dark:text-slate-500 ml-1">Needs minor work</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-lg font-black text-purple-600 dark:text-purple-400">7.2<span className="text-[10px] text-slate-400 font-light">/10</span></span>
                                                <button className="block text-[9px] text-purple-500 dark:text-purple-400 hover:underline mt-1 font-bold cursor-pointer">View Details</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default DashboardPreview;