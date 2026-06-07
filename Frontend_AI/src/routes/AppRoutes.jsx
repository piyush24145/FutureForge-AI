import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import ResumeAnalysis from "../pages/ResumeAnalysis";
import CareerRoadmap from "../pages/CareerRoadmap";
import Rewards from "../pages/Rewards";
import InternshipFinder from "../pages/InternshipFinder";
import InterviewPrep from "../pages/InterviewPrep";
import AIMentor from "../pages/AIMentor";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import NotFound from "../pages/NotFound";
function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/resume-analysis" element={<ResumeAnalysis />} />
                <Route path="/career-roadmap" element={<CareerRoadmap />} />
                <Route path="/rewards" element={<Rewards />} />
                <Route path="/internship-finder" element={<InternshipFinder />} />
                <Route path="/interview-prep" element={<InterviewPrep />} />
                <Route path="/ai-mentor" element={<AIMentor />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;