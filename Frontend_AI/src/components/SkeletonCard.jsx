function SkeletonCard() {
    return (
        <div className="bg-slate-900/45 backdrop-blur-xl border border-slate-900 rounded-3xl p-6.5 shadow-2xl animate-pulse">
            <div className="h-6 bg-slate-800 rounded w-3/4 mb-5"></div>
            <div className="h-4 bg-slate-850 rounded mb-3"></div>
            <div className="h-4 bg-slate-850 rounded mb-3"></div>
            <div className="h-4 bg-slate-850 rounded w-2/3"></div>
        </div>
    );
}

export default SkeletonCard;