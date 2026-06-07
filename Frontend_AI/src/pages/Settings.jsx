import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import SettingCard from "../components/SettingCard";
import ToggleSwitch from "../components/ToggleSwitch";
import { logoutUser } from "../services/authService";
import { getUserSettings, updateUserSettings, changePassword } from "../services/settingService";

function Settings() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saveStatus, setSaveStatus] = useState("");

    // Settings States
    const [darkMode, setDarkMode] = useState(false);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [interviewReminders, setInterviewReminders] = useState(true);
    const [internshipAlerts, setInternshipAlerts] = useState(false);
    const [language, setLanguage] = useState("English");

    // Modal States
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [is2faModalOpen, setIs2faModalOpen] = useState(false);

    // Password Form State
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);

    // 2FA State
    const [is2faEnabled, setIs2faEnabled] = useState(false);
    const [twoFactorCode, setTwoFactorCode] = useState("");
    const [twoFactorStep, setTwoFactorStep] = useState(1); // 1: Info, 2: Scan QR, 3: Verify

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const res = await getUserSettings();
            if (res.success && res.settings) {
                const s = res.settings;
                setDarkMode(!!s.darkMode);
                setEmailNotifications(!!s.emailNotifications);
                setInterviewReminders(!!s.interviewReminders);
                setInternshipAlerts(!!s.internshipAlerts);
                setLanguage(s.language || "English");

                // Save to localStorage for global instant application
                localStorage.setItem("darkMode", s.darkMode ? "true" : "false");

                // Toggle html element dark class on load
                if (s.darkMode) {
                    document.documentElement.classList.add("dark");
                } else {
                    document.documentElement.classList.remove("dark");
                }
            }
        } catch (err) {
            console.error("Failed to load settings from server:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSetting = async (updatedFields) => {
        setSaveStatus("Saving changes...");
        try {
            const res = await updateUserSettings({
                darkMode,
                emailNotifications,
                interviewReminders,
                internshipAlerts,
                language,
                ...updatedFields
            });

            if (res.success) {
                setSaveStatus("Saved to account");
                setTimeout(() => setSaveStatus(""), 2000);
            }
        } catch (err) {
            console.error("Failed to update preferences:", err);
            setSaveStatus("Error saving changes");
            setTimeout(() => setSaveStatus(""), 3000);
        }
    };

    const handleToggleDarkMode = () => {
        const nextVal = !darkMode;
        setDarkMode(nextVal);
        localStorage.setItem("darkMode", nextVal ? "true" : "false");
        if (nextVal) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        handleSaveSetting({ darkMode: nextVal });
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("New password and confirm password do not match!");
            return;
        }

        setPasswordLoading(true);
        try {
            const res = await changePassword(currentPassword, newPassword);
            if (res.success) {
                alert("Password Changed Successfully!");
                setIsPasswordModalOpen(false);
                // Clear fields
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            }
        } catch (err) {
            console.error("Password change error:", err);
            alert(err.response?.data?.message || "Failed to change password. Ensure your current password is correct.");
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleVerify2FA = (e) => {
        e.preventDefault();
        if (twoFactorCode.length === 6) {
            setIs2faEnabled(true);
            setTwoFactorStep(1);
            setIs2faModalOpen(false);
            alert("Two-Factor Authentication Enabled Successfully!");
        } else {
            alert("Please enter a valid 6-digit verification code.");
        }
    };

    const handleDisable2FA = () => {
        if (window.confirm("Are you sure you want to disable Two-Factor Authentication?")) {
            setIs2faEnabled(false);
            alert("2FA Disabled.");
        }
    };

    const handleLogout = () => {
        logoutUser();
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="flex">
                <Sidebar />
                <div className="flex-1 bg-gray-100 min-h-screen flex flex-col">
                    <Topbar />
                    <div className="p-8 flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin h-12 w-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
                            <p className="text-gray-500 mt-4 font-medium">Loading preferences...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1 bg-gray-100 min-h-screen flex flex-col">
                <Topbar />

                <div className="p-8 flex-1">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold">Settings</h1>
                            <p className="text-gray-600 mt-2">Manage your account preferences.</p>
                        </div>
                        {saveStatus && (
                            <span className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all duration-300 ${
                                saveStatus.includes("Error") 
                                    ? "bg-red-50 text-red-600 border border-red-200" 
                                    : "bg-green-50 text-green-700 border border-green-200"
                            }`}>
                                {saveStatus}
                            </span>
                        )}
                    </div>

                    {/* Appearance */}
                    <div className="mt-8">
                        <SettingCard title="Appearance">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-semibold text-slate-800">Dark Mode</h3>
                                    <p className="text-gray-500 text-sm">Enable dark mode interface</p>
                                </div>
                                <ToggleSwitch
                                    checked={darkMode}
                                    onChange={handleToggleDarkMode}
                                />
                            </div>
                        </SettingCard>
                    </div>

                    {/* Notifications */}
                    <div className="mt-8">
                        <SettingCard title="Notifications">
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-slate-800">Email Notifications</span>
                                    <ToggleSwitch
                                        checked={emailNotifications}
                                        onChange={() => {
                                            const nextVal = !emailNotifications;
                                            setEmailNotifications(nextVal);
                                            handleSaveSetting({ emailNotifications: nextVal });
                                        }}
                                    />
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-slate-800">Interview Reminders</span>
                                    <ToggleSwitch
                                        checked={interviewReminders}
                                        onChange={() => {
                                            const nextVal = !interviewReminders;
                                            setInterviewReminders(nextVal);
                                            handleSaveSetting({ interviewReminders: nextVal });
                                        }}
                                    />
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-slate-800">Internship Alerts</span>
                                    <ToggleSwitch
                                        checked={internshipAlerts}
                                        onChange={() => {
                                            const nextVal = !internshipAlerts;
                                            setInternshipAlerts(nextVal);
                                            handleSaveSetting({ internshipAlerts: nextVal });
                                        }}
                                    />
                                </div>
                            </div>
                        </SettingCard>
                    </div>

                    {/* Account Preferences */}
                    <div className="mt-8">
                        <SettingCard title="Account Preferences">
                            <div className="space-y-6">
                                <div>
                                    <label className="block mb-2 font-medium text-slate-800">Language</label>
                                    <select
                                        value={language}
                                        onChange={(e) => {
                                            const nextLang = e.target.value;
                                            setLanguage(nextLang);
                                            handleSaveSetting({ language: nextLang });
                                        }}
                                        className="w-full border rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm font-medium"
                                    >
                                        <option value="English">English</option>
                                        <option value="Hindi">Hindi</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-2 font-medium text-slate-800">Timezone</label>
                                    <input
                                        type="text"
                                        value="Asia/Kolkata"
                                        readOnly
                                        className="w-full border rounded-xl px-4 py-3 bg-gray-50 text-gray-500 text-sm font-medium cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </SettingCard>
                    </div>

                    {/* Security */}
                    <div className="mt-8 mb-10">
                        <SettingCard title="Security">
                            <div className="flex flex-wrap gap-4">
                                <button 
                                    onClick={() => setIsPasswordModalOpen(true)}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                                >
                                    Change Password
                                </button>

                                {is2faEnabled ? (
                                    <button 
                                        onClick={handleDisable2FA}
                                        className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-6 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                                    >
                                        Disable 2FA
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => {
                                            setTwoFactorStep(1);
                                            setIs2faModalOpen(true);
                                        }}
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                                    >
                                        Enable 2FA
                                    </button>
                                )}

                                <button 
                                    onClick={handleLogout}
                                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                                >
                                    Logout
                                </button>
                            </div>
                        </SettingCard>
                    </div>
                </div>
            </div>

            {/* Change Password Modal */}
            {isPasswordModalOpen && (
                <div className="fixed inset-0 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scale-up border border-slate-100">
                        <div className="flex justify-between items-center border-b pb-4 mb-5">
                            <h3 className="text-xl font-bold text-slate-800">Change Password</h3>
                            <button 
                                onClick={() => setIsPasswordModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 text-2xl font-bold p-1"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Current Password</label>
                                <input 
                                    type="password" 
                                    required
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full border rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-purple-600 focus:outline-none text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">New Password</label>
                                <input 
                                    type="password" 
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full border rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-purple-600 focus:outline-none text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Confirm New Password</label>
                                <input 
                                    type="password" 
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full border rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-purple-600 focus:outline-none text-sm"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                                <button 
                                    type="button" 
                                    onClick={() => setIsPasswordModalOpen(false)}
                                    className="bg-gray-150 text-gray-700 hover:bg-gray-200 px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={passwordLoading}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer disabled:bg-purple-300"
                                >
                                    {passwordLoading ? "Changing..." : "Change Password"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 2FA Setup Modal */}
            {is2faModalOpen && (
                <div className="fixed inset-0 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scale-up border border-slate-100">
                        <div className="flex justify-between items-center border-b pb-4 mb-5">
                            <h3 className="text-xl font-bold text-slate-800">Two-Factor Authentication (2FA)</h3>
                            <button 
                                onClick={() => setIs2faModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 text-2xl font-bold p-1"
                            >
                                &times;
                            </button>
                        </div>

                        {twoFactorStep === 1 && (
                            <div className="space-y-4">
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Secure your FutureForge AI account by adding an extra layer of security. We will generate a QR code for you to scan in an authenticator app (Google Authenticator, Authy, etc.).
                                </p>
                                <div className="flex justify-end pt-4 border-t">
                                    <button 
                                        onClick={() => setTwoFactorStep(2)}
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
                                    >
                                        Get Started
                                    </button>
                                </div>
                            </div>
                        )}

                        {twoFactorStep === 2 && (
                            <div className="space-y-4 text-center">
                                <p className="text-sm text-gray-600 text-left">
                                    Scan this QR code using your mobile authenticator app:
                                </p>
                                
                                {/* Mock QR Code Container */}
                                <div className="w-48 h-48 bg-slate-100 border border-dashed border-slate-350 mx-auto flex flex-col items-center justify-center p-4 rounded-xl gap-2 select-none shadow-inner">
                                    <div className="w-36 h-36 bg-slate-900 rounded flex items-center justify-center relative overflow-hidden border border-slate-800">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-blue-500/20"></div>
                                        {/* Mock QR dots grid pattern using clean CSS */}
                                        <div className="grid grid-cols-4 gap-1 p-2 w-full h-full opacity-90">
                                            {[...Array(16)].map((_, i) => (
                                                <div 
                                                    key={i} 
                                                    className={`rounded-xs ${
                                                        (i % 2 === 0 && i % 3 !== 0) || i === 0 || i === 3 || i === 12 || i === 15 
                                                            ? "bg-white" 
                                                            : "bg-transparent"
                                                    }`}
                                                ></div>
                                            ))}
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-mono tracking-widest">KEY: PILOT-MOCK-2FA</span>
                                </div>

                                <div className="flex justify-between pt-4 border-t mt-6">
                                    <button 
                                        onClick={() => setTwoFactorStep(1)}
                                        className="bg-gray-150 text-gray-700 hover:bg-gray-200 px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
                                    >
                                        Back
                                    </button>
                                    <button 
                                        onClick={() => setTwoFactorStep(3)}
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}

                        {twoFactorStep === 3 && (
                            <form onSubmit={handleVerify2FA} className="space-y-4">
                                <p className="text-sm text-gray-600">
                                    Enter the 6-digit verification code generated by your authenticator app to complete setup:
                                </p>
                                
                                <div>
                                    <input 
                                        type="text" 
                                        required 
                                        maxLength="6"
                                        placeholder="123456"
                                        value={twoFactorCode}
                                        onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ""))}
                                        className="w-full border rounded-xl px-4 py-3 text-center text-lg font-mono tracking-[0.5em] focus:ring-2 focus:ring-purple-600 focus:outline-none"
                                    />
                                </div>

                                <div className="flex justify-between pt-4 border-t mt-6">
                                    <button 
                                        type="button"
                                        onClick={() => setTwoFactorStep(2)}
                                        className="bg-gray-150 text-gray-700 hover:bg-gray-200 px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
                                    >
                                        Back
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
                                    >
                                        Verify & Enable
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Settings;