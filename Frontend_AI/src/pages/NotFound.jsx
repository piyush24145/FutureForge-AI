import { Link } from "react-router-dom";

function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="text-center">

                <h1 className="text-7xl font-bold text-purple-600">
                    404
                </h1>

                <h2 className="text-3xl font-bold mt-4">
                    Oops!
                </h2>

                <p className="text-gray-600 mt-3">
                    Page Not Found
                </p>

                <Link
                    to="/dashboard"
                    className="inline-block mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl transition-all"
                >
                    Go To Dashboard
                </Link>

            </div>

        </div>
    );
}

export default NotFound;