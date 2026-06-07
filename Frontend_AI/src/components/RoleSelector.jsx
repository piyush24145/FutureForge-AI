function RoleSelector({ selectedRole, setSelectedRole }) {
    const roles = [
        "Frontend Developer",
        "Backend Developer",
        "Full Stack Developer",
        "SDE Intern",
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 perspective-1000">
            {roles.map((role) => {
                const isActive = selectedRole === role;
                return (
                    <div
                        key={role}
                        onClick={() => setSelectedRole(role)}
                        className={`tilt-card p-6 rounded-3xl cursor-pointer text-center transition-all duration-300 relative overflow-hidden border shadow-xl flex flex-col justify-center min-h-[90px] select-none ${
                            isActive
                                ? "bg-purple-50 dark:bg-purple-950/20 border-purple-500 shadow-purple-500/10 text-purple-700 dark:text-white"
                                : "bg-white dark:bg-slate-900/35 border-slate-200 dark:border-slate-900 hover:border-purple-500/25 dark:hover:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-white"
                        }`}
                    >
                        {/* Glow indicator inside card when active */}
                        {isActive && (
                            <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 rounded-full filter blur-[15px] pointer-events-none"></div>
                        )}
                        
                        <h3 className="font-bold text-base tracking-tight z-10">
                            {role}
                        </h3>
                    </div>
                );
            })}
        </div>
    );
}

export default RoleSelector;