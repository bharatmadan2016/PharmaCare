export default function SubmitButton({ text, onClick }) {
  return (
    <button
      type={onClick ? "button" : "submit"}
      onClick={onClick}
      className="w-full bg-linear-to-r from-green-500 via-green-600 to-green-500 text-white font-semibold py-3 rounded-xl mt-4 shadow-md hover:shadow-lg transition"
    >
      {text}
    </button>
  );
}