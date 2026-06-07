import { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";

function ResumeUpload({ onFileSelect }) {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type === "application/pdf") {
                setSelectedFile(file);
                onFileSelect(file);
            } else {
                alert("Please select a PDF file.");
            }
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            onFileSelect(e.target.files[0]);
        }
    };

    return (
        <div className="bg-slate-900/35 backdrop-blur-xl border border-slate-900 rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col items-center select-none">
            {/* Ambient background blur */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full filter blur-[40px] pointer-events-none"></div>

            <h2 className="text-2xl font-black text-white tracking-tight mb-2 self-start">
                Upload Resume
            </h2>
            <p className="text-slate-455 text-xs mb-6 self-start">We support PDF formats for skills auditing and career roadmapping.</p>

            <label 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`w-full h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                    dragActive 
                        ? "border-purple-500 bg-purple-950/10 shadow-lg shadow-purple-500/5" 
                        : "border-slate-850 bg-slate-950/45 hover:border-slate-800 hover:bg-slate-900/20"
                }`}
            >
                <input
                    type="file"
                    accept=".pdf"
                    onChange={handleChange}
                    className="hidden"
                />
                
                <div className="w-14 h-14 rounded-2xl bg-purple-950/50 text-purple-400 flex items-center justify-center text-3xl shadow-inner mb-1">
                    <FaCloudUploadAlt />
                </div>

                <div className="text-center px-4">
                    <p className="text-sm font-bold text-slate-200 truncate max-w-xs md:max-w-md">
                        {selectedFile ? selectedFile.name : "Click to upload or drag & drop"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                        Only PDF format is supported (Max size 10MB)
                    </p>
                </div>
            </label>
        </div>
    );
}

export default ResumeUpload;
