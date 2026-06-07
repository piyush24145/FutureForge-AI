function SuggestedPrompt({
    title,
    description,
    icon,
    onClick,
}) {
    return (
        <div
            onClick={onClick}
            className="tilt-card bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 rounded-2xl p-4.5 cursor-pointer shadow-xs hover:shadow-md hover:border-purple-500/40 transition-all duration-300 flex items-start gap-3.5 group"
        >
            {icon && (
                <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-950 text-purple-600 dark:text-purple-400 text-lg flex items-center justify-center shadow-inner shrink-0 group-hover:scale-105 transition-transform">
                    {icon}
                </div>
            )}
            <div className="space-y-1">
                <h3 className="font-extrabold text-slate-850 dark:text-white text-xs md:text-sm tracking-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {title}
                </h3>
                {description && (
                    <p className="text-[11px] font-normal leading-normal text-slate-500 dark:text-slate-450">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}

export default SuggestedPrompt;