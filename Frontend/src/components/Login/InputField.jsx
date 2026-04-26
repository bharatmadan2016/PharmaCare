import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";

const iconMap = {
  Lock,
  Mail,
  User,
};

export default function InputField({
  label,
  type = "text",
  placeholder,
  icon,
  value,
  onChange,
  name,
  autoComplete,
}) {
  const [show, setShow] = useState(false);
  const actualType = type === "password" && show ? "text" : type;
  const IconComponent = iconMap[icon];

  return (
    <div className="mb-5 w-full text-left">
      <label className="mb-2 block font-medium text-gray-700">{label}</label>

      <div className="flex items-center rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 shadow-sm transition focus-within:border-green-500">
        <span className="mr-3 text-gray-400">
          {IconComponent ? <IconComponent size={18} /> : icon}
        </span>

        <input
          type={actualType}
          name={name}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="w-full bg-transparent text-gray-700 outline-none"
        />

        {type === "password" && (
          <button
            type="button"
            className="text-gray-400"
            onClick={() => setShow(!show)}
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}
