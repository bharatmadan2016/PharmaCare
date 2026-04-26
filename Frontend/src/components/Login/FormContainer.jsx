export default function FormContainer({ children }) {
  return (
    <div className="max-w-md w-full mx-auto bg-white rounded-3xl shadow-xl p-10 mt-12 border border-gray-100">
      {children}
    </div>
  );
}