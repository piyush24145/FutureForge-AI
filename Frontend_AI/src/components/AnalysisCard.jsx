function AnalysisCard({ title, items }) {
    // Determine card icon & border styling based on title
    let accentClass = "text-purple-650 dark:text-purple-400 text-glow-purple";
    let borderHover = "hover:border-purple-500/30";
    let icon = <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>;

    if (title.toLowerCase().includes("detected")) {
        accentClass = "text-emerald-600 dark:text-emerald-400";
        borderHover = "hover:border-emerald-500/35";
        icon = (
            <svg className="w-3.5 h-3.5 text-emerald-605 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
        );
    } else if (title.toLowerCase().includes("missing")) {
        accentClass = "text-red-600 dark:text-red-400";
        borderHover = "hover:border-red-500/35";
        icon = (
            <svg className="w-3.5 h-3.5 text-red-605 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        );
    } else if (title.toLowerCase().includes("recommended")) {
        accentClass = "text-blue-600 dark:text-blue-400";
        borderHover = "hover:border-blue-500/35";
        icon = (
            <svg className="w-3.5 h-3.5 text-blue-605 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
        );
    }

    return (
        <div className={`tilt-card p-6 rounded-3xl bg-white dark:bg-slate-900/35 backdrop-blur-xl border border-slate-200 dark:border-slate-900 ${borderHover} transition-all duration-500 shadow-md dark:shadow-2xl flex flex-col gap-4 text-left`}>
            <h3 className={`font-extrabold text-lg tracking-tight ${accentClass}`}>
                {title}
            </h3>

            <ul className="space-y-3 pt-1">
                {items.map((item, index) => {
                    if (typeof item === "object" && item !== null) {
                        return (
                            <li key={index} className="flex gap-3 items-start group">
                                <span className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/45 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                                    {icon}
                                </span>
                                <span className="text-slate-700 dark:text-slate-200 text-sm font-semibold leading-snug group-hover:text-slate-950 dark:group-hover:text-white transition-colors">
                                    {item.course} <span className="text-xs text-slate-400 dark:text-slate-500 font-medium block mt-0.5">({item.platform})</span>
                                </span>
                            </li>
                        );
                    }
                    return (
                        <li key={index} className="flex gap-3 items-center group">
                            <span className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform ${
                                title.toLowerCase().includes("detected") 
                                    ? "bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900/60" 
                                    : "bg-red-50 dark:bg-red-950/50 border border-red-100 dark:border-red-800/60"
                            }`}>
                                {icon}
                            </span>
                            <span className="text-slate-700 dark:text-slate-200 text-sm font-semibold group-hover:text-slate-950 dark:group-hover:text-white transition-colors">
                                {item}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default AnalysisCard;