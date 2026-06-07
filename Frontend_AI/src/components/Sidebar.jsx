import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
    FaThLarge,
    FaFileAlt,
    FaRoad,
    FaTrophy,
    FaBriefcase,
    FaMicrophone,
    FaRobot,
    FaUser,
    FaCog,
} from "react-icons/fa";

function Sidebar() {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleToggle = () => setIsOpen(prev => !prev);
        const handleClose = () => setIsOpen(false);

        window.addEventListener("toggle-sidebar", handleToggle);
        window.addEventListener("close-sidebar", handleClose);

        return () => {
            window.removeEventListener("toggle-sidebar", handleToggle);
            window.removeEventListener("close-sidebar", handleClose);
        };
    }, []);
    
    const menuItems = [
        { icon: <FaThLarge />, text: "Dashboard", path: "/dashboard" },
        { icon: <FaFileAlt />, text: "Resume Analysis", path: "/resume-analysis" },
        { icon: <FaRoad />, text: "Career Roadmap", path: "/career-roadmap" },
        { icon: <FaTrophy />, text: "Rewards", path: "/rewards" },
        { icon: <FaBriefcase />, text: "Internship Finder", path: "/internship-finder" },
        { icon: <FaMicrophone />, text: "Interview Prep", path: "/interview-prep" },
        { icon: <FaRobot />, text: "AI Mentor", path: "/ai-mentor" },
        { icon: <FaUser />, text: "Profile", path: "/profile" },
        { icon: <FaCog />, text: "Settings", path: "/settings" },
    ];

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-955/60 backdrop-blur-xs z-45 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
            <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-slate-955 text-white p-6 border-r border-slate-900 flex flex-col justify-between shrink-0 transition-transform duration-300 ease-in-out ${
                isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            }`}>
                <div>
                    {/* Brand Logo matching the reference */}
                    <div className="flex items-center justify-between gap-3.5 mb-10 mt-2">
                        <div className="flex items-center gap-3.5">
                            <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-500 flex items-center justify-center text-white font-black shadow-md shadow-purple-500/20">
                                F
                            </span>
                            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-300 to-indigo-300 tracking-tight">
                                FutureForge <span className="font-light">AI</span>
                            </h1>
                        </div>
                        {/* Close button for mobile screen accessibility */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Navigation Links list */}
                    <ul className="space-y-2.5">
                        {menuItems.map((item, index) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <li key={index}>
                                    <Link
                                        to={item.path || "#"}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 cursor-pointer text-sm font-semibold select-none ${
                                            isActive
                                                ? "bg-slate-900 border-l-4 border-purple-500 text-white shadow-lg shadow-purple-500/10"
                                                : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/50 hover:translate-x-1"
                                        }`}
                                    >
                                        <span className={`text-base transition-colors ${isActive ? "text-purple-400" : "text-slate-400"}`}>
                                            {item.icon}
                                        </span>
                                        {item.text}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Bottom Signature */}
                <div className="pt-6 border-t border-slate-900 text-slate-500 text-xs font-medium text-center">
                    Empowered by Gemini AI
                </div>
            </aside>
        </>
    );
}

export default Sidebar;