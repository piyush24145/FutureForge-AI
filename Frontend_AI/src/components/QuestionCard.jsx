import { useState } from "react";

function QuestionCard({ question, answer }) {
    const [showAnswer, setShowAnswer] = useState(false);

    return (
        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all">

            <h3 className="font-bold text-lg">
                Question
            </h3>

            <p className="mt-3 text-gray-700">
                {question}
            </p>

            <button
                onClick={() => setShowAnswer(!showAnswer)}
                className="mt-5 bg-purple-600 text-white px-5 py-2 rounded-xl"
            >
                {showAnswer ? "Hide Answer" : "Show Answer"}
            </button>

            {showAnswer && (
                <div className="mt-5 p-4 bg-purple-50 rounded-xl">
                    <p>{answer}</p>
                </div>
            )}

        </div>
    );
}

export default QuestionCard;