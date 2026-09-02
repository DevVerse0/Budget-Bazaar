export default function Dashboard(){
  return (<div className="p-6">
    <h1 className="font-bold text-lg">Dashboard</h1>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
      <div className="bg-white rounded p-4 border"><p className="text-sm text-gray-500">Total Products</p><p className="text-2xl font-bold">256</p></div>
      <div className="bg-white rounded p-4 border"><p className="text-sm text-gray-500">Total Orders</p><p className="text-2xl font-bold">125</p></div>
      <div className="bg-white rounded p-4 border"><p className="text-sm text-gray-500">Pending Orders</p><p className="text-2xl font-bold text-red-500">12</p></div>
      <div className="bg-white rounded p-4 border"><p className="text-sm text-gray-500">Total Customers</p><p className="text-2xl font-bold">342</p></div>
    </div>
    <div className="grid md:grid-cols-3 gap-4 mt-6">
      <div className="md:col-span-2 bg-white rounded p-4 border"><h3 className="font-semibold">Recent Orders</h3><p className="text-sm text-gray-400 mt-4">Orders table - connect to /api/orders</p></div>
      <div className="bg-white rounded p-4 border"><h3 className="font-semibold">Sales Overview</h3><div className="h-32 bg-gray-50 mt-4 flex items-center justify-center text-gray-400">Chart</div></div>
    </div>
  </div>);
}
