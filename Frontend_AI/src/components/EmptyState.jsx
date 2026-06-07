function EmptyState({
    title,
    description,
}) {
    return (
        <div className="bg-white rounded-2xl shadow-md p-10 text-center">

            <h2 className="text-2xl font-bold">
                {title}
            </h2>

            <p className="text-gray-500 mt-3">
                {description}
            </p>

        </div>
    );
}

export default EmptyState;