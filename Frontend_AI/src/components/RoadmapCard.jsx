import { FaCheck } from "react-icons/fa";

function RoadmapCard({
    month,
    skills,
    completedSkills = {},
    onToggleSkill,
}) {
    return (
        <div className="tilt-card p-6.5 rounded-3xl bg-white dark:bg-slate-900/35 backdrop-blur-xl border border-slate-200 dark:border-slate-900 hover:border-purple-500/25 transition-all duration-500 flex flex-col gap-4 text-left shadow-md dark:shadow-xl hover:shadow-lg dark:hover:shadow-2xl">
            {/* Header month identifier */}
            <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-650 to-indigo-600 dark:from-purple-450 dark:to-indigo-300 tracking-tight">
                {month}
            </h2>

            <ul className="space-y-3 pt-1">
                {skills.map((skill, index) => {
                    const skillKey = `${month}-${skill}`;
                    const isCompleted = !!completedSkills[skillKey];
                    return (
                        <li
                            key={index}
                            className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-slate-100/70 dark:hover:bg-slate-900/40 transition-colors select-none group"
                            onClick={() => onToggleSkill && onToggleSkill(skillKey)}
                        >
                            {/* Custom checkbox styled element */}
                            <span className={`w-5 h-5 rounded-lg border flex items-center justify-center text-xs transition-all shrink-0 ${
                                isCompleted 
                                    ? "bg-purple-650 border-purple-500 text-white shadow-md shadow-purple-500/15" 
                                    : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-transparent group-hover:border-purple-500"
                            }`}>
                                <FaCheck size={8} className={`${isCompleted ? "opacity-100" : "opacity-0"}`} />
                            </span>
                            
                            <span className={`font-semibold text-sm transition-colors ${
                                isCompleted 
                                    ? "line-through text-slate-400 dark:text-slate-550" 
                                    : "text-slate-700 dark:text-slate-250 group-hover:text-slate-950 dark:group-hover:text-slate-100"
                            }`}>
                                {skill}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default RoadmapCard;