function ToggleSwitch({
    checked,
    onChange,
}) {
    return (
        <button
            onClick={onChange}
            className={`w-14 h-8 rounded-full flex items-center px-1 transition-all

      ${checked
                    ? "bg-purple-600 justify-end"
                    : "bg-gray-300 justify-start"
                }
      
      `}
        >
            <div className="w-6 h-6 bg-white rounded-full"></div>
        </button>
    );
}

export default ToggleSwitch;