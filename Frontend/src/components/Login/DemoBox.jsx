export default function DemoBox({ email, password }) {
  return (
    <div className="bg-yellow-50 border border-yellow-300 text-gray-700 p-4 rounded-xl text-sm mb-6">
      <p className="font-semibold mb-1">🍒 Demo Credentials:</p>
      <p>Email: <span className="font-medium text-red-600">{email}</span></p>
      <p>Password: <span className="font-medium text-red-600">{password}</span></p>
    </div>
  );
}