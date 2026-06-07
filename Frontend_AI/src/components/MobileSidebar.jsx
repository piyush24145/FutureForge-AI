import { Link } from "react-router-dom";

function MobileSidebar({
    isOpen,
    setIsOpen,
}) {
    return (
        <div
            className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transition-all duration-300

      ${isOpen
                    ? "translate-x-0"
                    : "-translate-x-full"
                }
      
      `}
        >

            <div className="p-5 flex justify-between">

                <h2 className="font-bold text-xl">
                    AI Mentor
                </h2>

                <button
                    onClick={() =>
                        setIsOpen(false)
                    }
                >
                    ✕
                </button>

            </div>

            <div className="flex flex-col p-5 gap-4">

                <Link to="/dashboard">
                    Dashboard
                </Link>

                <Link to="/resume-analysis">
                    Resume Analysis
                </Link>

                <Link to="/career-roadmap">
                    Career Roadmap
                </Link>

                <Link to="/rewards">
                    Rewards
                </Link>

                <Link to="/internship-finder">
                    Internship Finder
                </Link>

                <Link to="/interview-prep">
                    Interview Prep
                </Link>

                <Link to="/ai-mentor">
                    AI Mentor
                </Link>

                <Link to="/profile">
                    Profile
                </Link>

                <Link to="/settings">
                    Settings
                </Link>

            </div>

        </div>
    );
}

export default MobileSidebar;