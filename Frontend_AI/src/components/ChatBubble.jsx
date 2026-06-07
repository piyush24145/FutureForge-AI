import { FaRobot } from "react-icons/fa";

function ChatBubble({ message, sender }) {
    const isUser = sender === "user";

    return (
        <div className={`flex gap-3 items-end max-w-2xl ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
            {/* Sender Avatar */}
            {isUser ? (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-650 text-white flex items-center justify-center text-xs font-black shadow-xs shrink-0 select-none">
                    U
                </div>
            ) : (
                <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-850 text-purple-600 dark:text-purple-400 flex items-center justify-center text-sm shadow-inner shrink-0 select-none">
                    <FaRobot />
                </div>
            )}

            {/* Bubble content */}
            <div
                className={`p-4 rounded-2xl text-xs md:text-sm font-medium leading-relaxed whitespace-pre-wrap ${
                    isUser
                        ? "bg-gradient-to-r from-purple-600 to-indigo-650 text-white rounded-br-none shadow-sm shadow-purple-950/10"
                        : "bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 text-slate-800 dark:text-slate-350 rounded-bl-none shadow-xs"
                }`}
            >
                {message}
            </div>
        </div>
    );
}

export default ChatBubble;