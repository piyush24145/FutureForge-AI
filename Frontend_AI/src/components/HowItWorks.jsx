import { useState } from "react";
import {
    FaUpload,
    FaBrain,
    FaRoad,
    FaBriefcase,
    FaMicrophone,
} from "react-icons/fa";

function HowItWorks() {
    const [hoverIndex, setHoverIndex] = useState(null);

    const steps = [
        {
            number: "01",
            icon: <FaUpload />,
            title: "Upload Resume",
            desc: "Drag and drop your resume in PDF format to import your capabilities.",
            color: "from-purple-500 to-indigo-500",
            glow: "shadow-purple-500/10 hover:shadow-purple-500/20"
        },
        {
            number: "02",
            icon: <FaBrain />,
            title: "AI Analysis",
            desc: "AI inspects your profile strengths and identifies skill deficits.",
            color: "from-indigo-500 to-purple-600",
            glow: "shadow-indigo-500/10 hover:shadow-indigo-500/20"
        },
        {
            number: "03",
            icon: <FaRoad />,
            title: "Career Roadmap",
            desc: "Receive an step-by-step roadmap tailored to bridge your gaps.",
            color: "from-purple-600 to-indigo-600",
            glow: "shadow-purple-650/10 hover:shadow-purple-650/20"
        },
        {
            number: "04",
            icon: <FaBriefcase />,
            title: "Internship Match",
            desc: "Search matching listings compatible with your skill level.",
            color: "from-indigo-600 to-purple-500",
            glow: "shadow-indigo-650/10 hover:shadow-indigo-650/20"
        },
        {
            number: "05",
            icon: <FaMicrophone />,
            title: "Interview Prep",
            desc: "Practice vocal and coding mocks evaluated by AI grading models.",
            color: "from-purple-500 to-indigo-500",
            glow: "shadow-purple-500/10 hover:shadow-purple-500/20"
        },
    ];

    return (
        <section
            id="how-it-works"
            className="max-w-7xl mx-auto px-6 md:px-8 py-24 relative overflow-hidden transition-colors duration-300"
        >
            {/* Background lighting */}
            <div className="absolute top-10 right-[-100px] w-96 h-96 bg-purple-600/5 rounded-full filter blur-[120px] -z-10 pointer-events-none"></div>

            <div className="text-center space-y-4 max-w-2xl mx-auto mb-20 animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100/70 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider select-none border border-purple-200/40 dark:border-purple-900/30">
                    Product Workflow
                </div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                    Five Steps to Accelerate Your Career
                </h2>
                <p className="text-slate-505 dark:text-slate-400 text-base md:text-lg">
                    See how FutureForge guides you from parsing resume gaps to cracking your target interviews.
                </p>
            </div>

            {/* Timeline container */}
            <div className="relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden lg:block absolute top-[54px] left-[10%] right-[10%] h-[2px] bg-slate-200 dark:bg-slate-800 -z-10">
                    <div 
                        className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 transition-all duration-700 ease-out"
                        style={{ 
                            width: hoverIndex !== null ? `${(hoverIndex / 4) * 100}%` : '0%',
                            opacity: hoverIndex !== null ? 1 : 0
                        }}
                    ></div>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 relative z-10">
                    {steps.map((step, index) => {
                        const isHovered = hoverIndex === index;
                        const isAnyHovered = hoverIndex !== null;
                        
                        return (
                            <div
                                key={index}
                                onMouseEnter={() => setHoverIndex(index)}
                                onMouseLeave={() => setHoverIndex(null)}
                                className={`group p-6 bg-white dark:bg-slate-900 border rounded-3xl transition-all duration-500 text-left flex flex-col justify-between min-h-[260px] cursor-pointer ${
                                    isHovered 
                                        ? "border-purple-500/60 scale-[1.03] -translate-y-2 shadow-2xl " + step.glow
                                        : isAnyHovered 
                                            ? "border-slate-200/40 dark:border-slate-850 opacity-60 scale-[0.98]" 
                                            : "border-slate-200/50 dark:border-slate-800 shadow-md hover:border-purple-500/30"
                                }`}
                            >
                                <div className="space-y-4">
                                    {/* Icon & Badge Row */}
                                    <div className="flex justify-between items-center">
                                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${step.color} text-white flex items-center justify-center text-xl shadow-lg transition-transform duration-500 ${isHovered ? 'rotate-12 scale-110' : 'group-hover:rotate-6'}`}>
                                            {step.icon}
                                        </div>
                                        <span className={`text-4xl font-black font-mono transition-colors duration-500 ${
                                            isHovered 
                                                ? "text-purple-500/20 dark:text-purple-400/25" 
                                                : "text-slate-100 dark:text-slate-950"
                                        }`}>
                                            {step.number}
                                        </span>
                                    </div>

                                    {/* Text Content */}
                                    <div className="space-y-2">
                                        <h3 className={`font-black text-lg transition-colors duration-300 ${
                                            isHovered ? "text-purple-600 dark:text-purple-400" : "text-slate-850 dark:text-slate-100"
                                        }`}>
                                            {step.title}
                                        </h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-[12.5px] leading-relaxed transition-colors duration-300">
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>

                                {/* Bottom Interactive Pill */}
                                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-850/60 flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-purple-500 transition-colors">
                                        {isHovered ? "Exploring module..." : "Click to view"}
                                    </span>
                                    <span className={`w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 transition-all duration-300 ${
                                        isHovered ? 'bg-purple-500 scale-150 animate-ping' : ''
                                    }`}></span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default HowItWorks;