import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaMoneyBillWave, FaCheck, FaBuilding, FaStar } from "react-icons/fa";

function InternshipCard({
    company,
    role,
    location,
    stipend,
    match,
    skills,
    applyUrl,
}) {
    const [isApplied, setIsApplied] = useState(false);

    useEffect(() => {
        try {
            const appliedList = JSON.parse(localStorage.getItem("applied_internships")) || [];
            const key = `${company}-${role}`;
            if (appliedList.includes(key)) {
                setIsApplied(true);
            }
        } catch (e) {
            console.error("Error reading applied state:", e);
        }
    }, [company, role]);

    const handleApply = () => {
        try {
            const appliedList = JSON.parse(localStorage.getItem("applied_internships")) || [];
            const key = `${company}-${role}`;
            if (!appliedList.includes(key)) {
                const newList = [...appliedList, key];
                localStorage.setItem("applied_internships", JSON.stringify(newList));
                setIsApplied(true);
            }
            
            // Open real application search page in new tab (Google Jobs search widget to show live postings)
            const targetUrl = applyUrl || `https://www.google.com/search?q=${encodeURIComponent(company + ' ' + role + ' internship')}&ibp=htl;jobs`;
            window.open(targetUrl, "_blank", "noopener,noreferrer");
        } catch (e) {
            console.error("Error setting applied state:", e);
        }
    };

    // Calculate numeric value of match (e.g. "95%" -> 95)
    const matchVal = parseInt(match) || 85;

    // Theme color classes based on match score
    const getMatchStyle = (score) => {
        if (score >= 92) return {
            badge: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
            glow: "hover:shadow-emerald-500/15 border-emerald-500/25",
            dot: "bg-emerald-500"
        };
        if (score >= 87) return {
            badge: "bg-purple-500/10 text-purple-500 border border-purple-500/20",
            glow: "hover:shadow-purple-500/15 border-purple-500/25",
            dot: "bg-purple-500"
        };
        return {
            badge: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
            glow: "hover:shadow-blue-500/15 border-blue-500/25",
            dot: "bg-blue-500"
        };
    };

    const styleClasses = getMatchStyle(matchVal);

    // Initial letters avatar styling
    const companyInitial = company ? company.substring(0, 1).toUpperCase() : "I";
    
    // Choose beautiful gradient based on first character of name
    const getAvatarGradient = (char) => {
        const charCode = char.charCodeAt(0) || 0;
        if (charCode % 4 === 0) return "from-purple-600 via-indigo-650 to-purple-500";
        if (charCode % 4 === 1) return "from-emerald-600 via-teal-650 to-emerald-500";
        if (charCode % 4 === 2) return "from-blue-600 via-sky-650 to-indigo-500";
        return "from-pink-650 via-rose-600 to-amber-500";
    };

    return (
        <div
            className={`tilt-card rounded-3xl p-6 shadow-sm bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${styleClasses.glow}`}
        >
            <div className="space-y-4.5">
                {/* Card Header Row */}
                <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${getAvatarGradient(companyInitial)} text-white flex items-center justify-center font-black text-lg shadow-sm`}>
                            {companyInitial}
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-850 dark:text-white leading-tight flex items-center gap-1.5">
                                {company}
                            </h2>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                                {role}
                            </p>
                        </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1 shrink-0 ${styleClasses.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${styleClasses.dot} animate-pulse`}></span>
                        {matchVal}% Match
                    </span>
                </div>

                {/* Metadata Fields (Location, Stipend) */}
                <div className="flex items-center gap-4 text-xs font-medium text-slate-550 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                        <FaMapMarkerAlt className="text-slate-400" />
                        {location}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-250 dark:bg-slate-800"></span>
                    <span className="flex items-center gap-1.5">
                        <FaMoneyBillWave className="text-slate-450" />
                        {stipend}
                    </span>
                </div>

                {/* Required Skills list */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5">
                        Required Skills
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                        {skills.map((skill, index) => (
                            <span
                                key={index}
                                className="bg-slate-50 dark:bg-slate-950 text-slate-650 dark:text-slate-350 border border-slate-200/50 dark:border-slate-850 px-2.5 py-1 rounded-lg text-xs font-bold transition-all hover:bg-slate-100 dark:hover:bg-slate-900/50"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6.5 pt-2">
                {isApplied ? (
                    <span className="w-full flex items-center justify-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-black py-3 rounded-xl select-none animate-fade-in">
                        <FaCheck /> Applied Position
                    </span>
                ) : (
                    <button
                        onClick={handleApply}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-650 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold py-3 rounded-xl transition-all cursor-pointer shadow-sm active:scale-[0.98] text-xs"
                    >
                        Apply Now
                    </button>
                )}
            </div>
        </div>
    );
}

export default InternshipCard;