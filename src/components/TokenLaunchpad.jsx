import { useState } from "react";
import CustomInput from "./CustomInput";
import { formFields } from "../constants/tokeFields";

const TokenLaunchpad = () => {
  const [formData, setFormData] = useState({
    tokenName: "",
    tokenSymbol: "",
    tokenSupply: "",
    imageUrl: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateForm = () => {
    let newErrors = {};

    formFields.forEach((field) => {
      const value = formData[field.value];
      if (!value || value.toString().trim() === "") {
        newErrors[field.name] = `${field.name} is required`;
      } else if (field.type === "number" && Number(value) < 0) {
        newErrors[field.name] = `${field.name} cannot be negative`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nameOfToken = formData.tokenName;
    const symbolOfToken = formData.tokenSymbol;
    const supplyOfToken = formData.tokenSupply;
    const imageOfToken = formData.imageUrl;

    console.log("Token Details:");
    console.log("Name:", nameOfToken);
    console.log("Symbol:", symbolOfToken);
    console.log("Supply:", supplyOfToken);
    console.log("Image URL:", imageOfToken);
    if (validateForm()) {
      alert("✅ Token Created Successfully!");
      console.log("Form Data:", formData);
      setFormData({
        tokenName: "",
        tokenSymbol: "",
        tokenSupply: "",
        imageUrl: "",
      });
      setErrors({});
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 font-[Poppins]">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/40">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-full shadow-md"></div>
          <h2 className="text-3xl font-semibold mt-4 text-gray-800 text-center">
            Create Your Token
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Fill in the details below to launch your token.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {formFields.map((field, index) => (
            <CustomInput
              key={index}
              label={field.name}
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.value] || ""}
              onChange={(e) => handleChange(field.value, e.target.value)}
              error={errors[field.name]}
            />
          ))}

          <button
            type="submit"
            className="w-full py-3 mt-4 text-white font-semibold rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
          >
            🚀 Create Token
          </button>
        </form>
      </div>
    </div>
  );
};

export default TokenLaunchpad;
