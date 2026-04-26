export default function PageHeader({ icon, title, subtitle }) {
  return (
    <div className="text-center mb-6">
      <div className="flex justify-center mb-4">
        <img src={icon} className="w-16 h-16 rounded-2xl shadow-sm" />
      </div>

      <h1 className="text-3xl font-bold text-green-700">{title}</h1>
      <p className="text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
}