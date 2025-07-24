"use client";
import { useState } from "react";
import toast from "react-hot-toast";

export default function MentorApplication() {
const [step, setStep] = useState(1);
const [formData, setFormData] = useState({
name: "", address: "", icaiId: "", email: "",
aadhaar: "", pan: "", accountNumber: "", ifsc: "",
bank: "", expertise: "", experience: "", password: "",
phone: "", status: "", earning: "",
});
const [errors, setErrors] = useState({});

const validateStep1 = () => {
const newErrors = {};
if (!formData.name.trim()) newErrors.name = "Name is required.";
if (!formData.address.trim()) newErrors.address = "Address is required.";
if (!formData.icaiId.trim()) newErrors.icaiId = "ICAI ID is required.";
if (!formData.email.trim()) {
  newErrors.email = "Email is required.";
} else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
  newErrors.email = "Enter a valid email.";
}

if (!formData.aadhaar.trim()) {
  newErrors.aadhaar = "Aadhaar is required.";
} else if (!/^\d{12}$/.test(formData.aadhaar)) {
  newErrors.aadhaar = "Aadhaar must be 12 digits.";
}

if (!formData.pan.trim()) newErrors.pan = "PAN is required.";
setErrors(newErrors);
return Object.keys(newErrors).length === 0;
};

const validateStep2 = () => {
const newErrors = {};
const fields = ["accountNumber", "ifsc", "bank", "expertise", "experience", "phone", "password", "status", "earning"];
fields.forEach(field => {
if (!formData[field].trim()) {
const label = field.replace(/([A-Z])/g, " $1");
newErrors[field] =` ${label.charAt(0).toUpperCase() + label.slice(1)}`;
}
});
setErrors(newErrors);
return Object.keys(newErrors).length === 0;
};

const nextStep = () => {
if (validateStep1()) setStep(2);
};

const prevStep = () => setStep(1);

const handleChange = (e) => {
setFormData({ ...formData, [e.target.name]: e.target.value });
setErrors({ ...errors, [e.target.name]: "" });
};

const handleSubmit = (e) => {
e.preventDefault();
if (validateStep2()) {
toast.success("🎉 Application submitted successfully!");
console.log("Form Submitted:", formData);
setFormData({
name: "", address: "", icaiId: "", email: "", aadhaar: "", pan: "",
accountNumber: "", ifsc: "", bank: "", expertise: "", experience: "",
password: "", phone: "", status: "", earning: "",
});
setStep(1);
}
};

const inputClass = "w-full px-4 py-2 bg-[#1f2937] border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-700";
const errorText = (field) => errors[field] && <p className="text-sm text-red-500 mt-1">{errors[field]}</p>;

return (
<div className="min-h-screen bg-black text-white flex justify-center items-center p-6">
<div className="w-full max-w-4xl bg-[#111827] border border-gray-700 rounded-3xl shadow-2xl p-10">
    {/* Progress Indicator */}
    <div className="flex items-center justify-center mb-10">
      <div className="flex items-center w-full max-w-md gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${step >= 1 ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-400"}`}>1</div>
        <div className={`flex-grow h-[2px] transition-all duration-300 ${step >= 2 ? "bg-blue-600" : "bg-gray-600"}`}></div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${step === 2 ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-400"}`}>2</div>
      </div>
    </div>

    {/* Form */}
    <form
      onSubmit={handleSubmit}
      className={`grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 transition-all duration-500`}
    >
      {step === 1 && (
        <>
          {["name", "address", "icaiId", "email", "aadhaar", "pan"].map((field, index) => (
            <div key={index}>
              <input
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")}
                value={formData[field]}
                onChange={handleChange}
                className={inputClass}
              />
              {errorText(field)}
            </div>
          ))}
          <div className="col-span-2 flex justify-end mt-4">
            <button
              type="button"
              onClick={nextStep}
              className="bg-gradient-to-r from-blue-700 to-blue-500 text-white font-semibold rounded px-6 py-2 hover:opacity-90 transition shadow-md"
            >
              Next
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          {["accountNumber", "ifsc", "bank", "experience", "phone", "password", "earning"].map((field, index) => (
            <div key={index}>
              <input
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")}
                type={field === "password" ? "password" : "text"}
                value={formData[field]}
                onChange={handleChange}
                className={inputClass}
              />
              {errorText(field)}
            </div>
          ))}
          <div>
            <select name="expertise" value={formData.expertise} onChange={handleChange} className={inputClass}>
              <option value="">Area of Expertise</option>
              <option value="Income Tax">Income Tax</option>
              <option value="GST">GST</option>
              <option value="Accounting">Accounting</option>
              <option value="Audit">Audit</option>
              <option value="Investment Planning">Investment Planning</option>
            </select>
            {errorText("expertise")}
          </div>
          <div>
            <select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
              <option value="">Status</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
            {errorText("status")}
          </div>
          <div className="col-span-2 flex justify-between mt-6">
            <button
              type="button"
              onClick={prevStep}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded"
            >
              Back
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-700 to-blue-500 hover:opacity-90 px-6 py-2 rounded text-white font-semibold"
            >
              Submit
            </button>
          </div>
        </>
      )}
    </form>
  </div>
</div>
);
}