function ProfileCard({ title, children }) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="text-xl font-bold mb-4">
                {title}
            </h2>

            {children}
        </div>
    );
}

export default ProfileCard;