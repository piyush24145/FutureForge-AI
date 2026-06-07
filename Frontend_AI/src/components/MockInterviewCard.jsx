function MockInterviewCard() {
    return (
        <div className="bg-white rounded-2xl p-8 shadow-md">

            <h2 className="text-2xl font-bold">
                Mock Interview
            </h2>

            <p className="mt-4">
                10 Questions
            </p>

            <p className="mt-2">
                Estimated Time: 15 Minutes
            </p>

            <button className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-xl">
                Start Interview
            </button>

        </div>
    );
}

export default MockInterviewCard;