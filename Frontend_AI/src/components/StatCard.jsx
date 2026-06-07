function StatCard({ title, value, color }) {
    return (
        <div
            className={`${color} p-6 rounded-2xl shadow-md hover:shadow-xl transition-all`}
        >
            <h3 className="font-semibold text-gray-700">
                {title}
            </h3>

            <p className="text-4xl font-bold mt-4">
                {value}
            </p>
        </div>
    );
}

export default StatCard;