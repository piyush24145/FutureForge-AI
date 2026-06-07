import { useState, useEffect, useRef } from "react";
import { 
    FaRobot, FaTrashAlt, FaPaperPlane, FaFileAlt, FaBriefcase, 
    FaRoad, FaLightbulb, FaExclamationCircle 
} from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ChatBubble from "../components/ChatBubble";
import SuggestedPrompt from "../components/SuggestedPrompt";
import { askMentor } from "../services/mentorService";

function AIMentor() {
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState(() => {
        const saved = sessionStorage.getItem("mentor_chat");
        return saved ? JSON.parse(saved) : [
            {
                sender: "ai",
                message: "Hello 👋 I am your AI Career Mentor. How can I help you today? Ask me about your roadmap, resume improvements, internships, or interview preparation!",
            },
        ];
    });

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    useEffect(() => {
        sessionStorage.setItem("mentor_chat", JSON.stringify(messages));
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userText = input.trim();
        setInput("");

        const userMessage = {
            sender: "user",
            message: userText,
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setIsLoading(true);

        try {
            const historyPayload = updatedMessages.map(msg => ({
                sender: msg.sender,
                message: msg.message
            }));

            const data = await askMentor(userText, historyPayload);

            if (data.success) {
                setMessages((prev) => [
                    ...prev,
                    {
                        sender: "ai",
                        message: data.message,
                    },
                ]);
            } else {
                setMessages((prev) => [
                    ...prev,
                    {
                        sender: "ai",
                        message: data.message || "I'm sorry, I could not generate a response. Please try again.",
                    },
                ]);
            }
        } catch (err) {
            console.error("Error communicating with AI Mentor:", err);
            setMessages((prev) => [
                ...prev,
                {
                    sender: "ai",
                    message: "Unable to reach the AI Mentor. Please ensure your backend server is running and try again.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePrompt = (text) => {
        setInput(text);
    };

    const handleClearChat = () => {
        if (window.confirm("Are you sure you want to clear this conversation?")) {
            setMessages([
                {
                    sender: "ai",
                    message: "Hello 👋 I am your AI Career Mentor. How can I help you today? Ask me about your roadmap, resume improvements, internships, or interview preparation!",
                },
            ]);
            sessionStorage.removeItem("mentor_chat");
        }
    };

    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1 bg-gray-100 dark:bg-slate-950 min-h-screen flex flex-col relative bg-grid-pattern transition-colors duration-300">
                <Topbar />

                <div className="p-4 md:p-8 flex-1 flex flex-col max-w-7xl mx-auto w-full space-y-6">
                    {/* Header Banner */}
                    <div className="glass-panel p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
                        <div className="space-y-2">
                            <h1 className="text-3xl md:text-5xl font-black text-slate-855 dark:text-white flex items-center gap-3 tracking-tight">
                                <span className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-650 to-indigo-555 text-white shadow-lg shadow-purple-500/20 animate-float block">
                                    <FaRobot className="text-2xl md:text-3xl" />
                                </span>
                                AI Career Mentor
                            </h1>
                            <p className="text-slate-500 dark:text-slate-450 text-sm md:text-base max-w-2xl leading-relaxed">
                                Get instant, customized advice regarding job vacancies, career paths, resume critique, and interview simulations.
                            </p>
                        </div>
                    </div>

                    {/* Suggested Prompts Cards Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <SuggestedPrompt
                            title="Improve My Resume"
                            icon={<FaFileAlt className="text-emerald-500 text-sm" />}
                            description="Review target skills and gaps."
                            onClick={() =>
                                handlePrompt(
                                    "Based on my profile, how can I improve my resume? What missing skills should I focus on first?"
                                )
                            }
                        />

                        <SuggestedPrompt
                            title="Find Internship"
                            icon={<FaBriefcase className="text-indigo-500 text-sm" />}
                            description="Explore best-match tech vacancies."
                            onClick={() =>
                                handlePrompt(
                                    "Which internship roles match my current skill set, and where should I apply?"
                                )
                            }
                        />

                        <SuggestedPrompt
                            title="Career Roadmap"
                            icon={<FaRoad className="text-purple-500 text-sm" />}
                            description="Create a step-by-step career path."
                            onClick={() =>
                                handlePrompt(
                                    "Can you suggest a customized step-by-step career roadmap for my goals?"
                                )
                            }
                        />

                        <SuggestedPrompt
                            title="Interview Tips"
                            icon={<FaLightbulb className="text-amber-500 text-sm" />}
                            description="Learn core code test preparation."
                            onClick={() =>
                                handlePrompt(
                                    "What are some key technical and behavioral interview preparation tips for developer roles?"
                                )
                            }
                        />
                    </div>

                    {/* Glassmorphic Chat Area Panel */}
                    <div className="glass-panel rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 p-5 flex-1 flex flex-col min-h-[460px] relative overflow-hidden bg-white/70 dark:bg-slate-900/60 backdrop-blur-md">
                        {/* Chat header bar */}
                        <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-850 mb-5 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/45 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-lg shadow-inner">
                                    <FaRobot />
                                </div>
                                <div>
                                    <h4 className="font-extrabold text-slate-850 dark:text-white text-sm tracking-tight leading-tight">Career Mentor</h4>
                                    <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1.5 mt-0.5 select-none">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        Active Online
                                    </span>
                                </div>
                            </div>
                            
                            <button
                                onClick={handleClearChat}
                                className="flex items-center gap-1.5 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 text-red-500 px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer active:scale-95 duration-200"
                            >
                                <FaTrashAlt className="text-[10px]" /> Clear Conversation
                            </button>
                        </div>

                        {/* Messages display stream */}
                        <div className="space-y-5.5 overflow-y-auto flex-1 max-h-[440px] pr-2 scrollbar-thin">
                            {messages.map((msg, index) => (
                                <ChatBubble
                                    key={index}
                                    sender={msg.sender}
                                    message={msg.message}
                                />
                            ))}

                            {isLoading && (
                                <div className="flex gap-3 items-end mr-auto max-w-lg animate-fade-in">
                                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-850 text-purple-600 dark:text-purple-400 flex items-center justify-center text-sm shadow-inner shrink-0">
                                        <FaRobot className="animate-bounce" />
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-855 text-slate-800 dark:text-slate-350 rounded-bl-none shadow-xs flex items-center gap-1.5">
                                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 animate-pulse">Mentor is compiling</span>
                                        <div className="flex gap-1 items-center ml-0.5">
                                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Interactive Message Input */}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                sendMessage();
                            }}
                            className="flex gap-3 mt-6 border-t border-slate-100 dark:border-slate-850 pt-4 shrink-0"
                        >
                            <input
                                type="text"
                                placeholder={isLoading ? "Compiling response..." : "Type your career question..."}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={isLoading}
                                className="flex-1 bg-slate-900/5 dark:bg-slate-950/60 border border-slate-200/50 dark:border-slate-850 text-slate-800 dark:text-slate-200 rounded-xl px-4 py-3 text-xs md:text-sm focus:outline-none focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/20 disabled:bg-slate-100 dark:disabled:bg-slate-950 placeholder-slate-450 transition-all font-medium shadow-inner"
                            />

                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="bg-gradient-to-r from-purple-600 to-indigo-650 hover:from-purple-500 hover:to-indigo-500 text-white px-5 rounded-xl font-extrabold transition-all border border-transparent disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95 flex items-center justify-center text-xs shrink-0"
                            >
                                <FaPaperPlane className="mr-1.5 text-[10px]" /> Send
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AIMentor;