import React from "react";

const RoleCard = ({ image, title, description, btnText, btnColor, onClick }) => {
    return (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 transition-all duration-500 flex flex-col h-full transform hover:-translate-y-2 hover:shadow-2xl group">

            {/* Image Container with subtle animation */}
            <div className="flex justify-center mb-6 relative">
                <div className="absolute inset-0 bg-blue-100 rounded-full scale-0 group-hover:scale-110 transition-transform duration-500 opacity-20"></div>
                <img src={image} alt={title} className="w-28 h-28 rounded-2xl object-cover shadow-lg relative z-10" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-3 group-hover:text-primary transition-colors duration-300">
                {title}
            </h2>

            {/* Description */}
            <div className="flex-grow">
                <p className="text-gray-500 text-sm leading-relaxed text-center whitespace-pre-line px-2">
                    {description}
                </p>
            </div>

            {/* Action Button */}
            <button
                onClick={onClick}
                className={`mt-8 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 w-full ${btnColor} shadow-lg hover:shadow-2xl hover:scale-[1.02] active:scale-95`}
            >
                {btnText}
            </button>
        </div>
    );
};

export default RoleCard;