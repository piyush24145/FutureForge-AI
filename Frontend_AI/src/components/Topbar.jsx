import { useEffect, useState } from "react";
import { FaBell, FaSearch } from "react-icons/fa";
import { getCurrentUser } from "../services/authService";

function Topbar() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = getCurrentUser();
        setUser(currentUser);
    }, []);

    const displayName = user ? user.name : "Alex Chen";
    const initial = displayName ? displayName.charAt(0).toUpperCase() : "A";

    return (
        <div className="bg-slate-950 border-b border-slate-900 px-8 py-4.5 flex justify-between items-center z-40">
            {/* Search Input box matching reference */}
            <div className="relative w-64 group">
                <input 
                    type="text" 
                    placeholder="Search..." 
                    className="w-full bg-slate-900/60 border border-slate-800 text-slate-200 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/20 text-sm placeholder-slate-550 transition-all shadow-inner"
                />
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 group-focus-within:text-purple-400 transition-colors">
                    <FaSearch className="w-3.5 h-3.5" />
                </span>
            </div>

            {/* Profile Info & Notification Bell */}
            <div className="flex items-center gap-6">
                {/* Notification Bell with Red/Purple Badge */}
                <button className="relative p-2.5 rounded-xl border border-slate-900 bg-slate-900/40 hover:bg-slate-900 hover:text-purple-400 text-slate-400 cursor-pointer transition-all active:scale-95 duration-200">
                    <FaBell size={16} />
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-full animate-ping"></span>
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-full"></span>
                </button>

                {/* Profile Card */}
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <h4 className="text-sm font-bold text-slate-200 tracking-tight leading-tight">
                            {displayName}
                        </h4>
                        <span className="text-[10px] font-semibold text-slate-450 tracking-wider uppercase">
                            Student
                        </span>
                    </div>

                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-650 to-purple-500 text-white flex items-center justify-center font-bold shadow-md shadow-purple-500/10">
                        {initial}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Topbar;