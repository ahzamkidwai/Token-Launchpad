const CustomInput = ({ label, type, placeholder, value, onChange, error }) => {
  const handleInputChange = (e) => {
    const val = e.target.value;
    if (type === "number") {
      if (val === "" || Number(val) >= 0) {
        onChange(e);
      }
    } else {
      onChange(e);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div
        className={`flex items-center border rounded-lg px-3 py-2 bg-white focus-within:ring-2 transition-all ${
          error
            ? "border-red-500 focus-within:ring-red-400"
            : "border-gray-300 focus-within:ring-indigo-400"
        }`}
      >
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          min={type === "number" ? 0 : undefined}
          className="flex-1 outline-none text-gray-800 text-sm bg-transparent placeholder-gray-400"
        />
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>
      )}
    </div>
  );
};

export default CustomInput;
