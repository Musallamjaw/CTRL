/* eslint-disable react/prop-types */
const DashboardCard = ({ title, count }) => {
  return (
    <div className="p-6 bg-white rounded-lg border pb-8">
      <p className="text-gray-600 font-medium">{title}</p>
      <p className="text-3xl font-bold text-blue-900">{count.toString().padStart(2, '0')}</p>
    </div>
  );
};

export default DashboardCard;