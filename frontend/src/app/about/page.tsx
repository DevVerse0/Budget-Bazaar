export default function About(){
  return (<div className="container-bb py-12">
    <div className="max-w-3xl mx-auto bg-white border rounded-2xl p-8 shadow-sm">
      <h1 className="font-black text-2xl">About Budget Bazar Service</h1>
      <p className="text-gray-600 mt-3 leading-relaxed">Budget Bazar Service — Best Gadgets, Best Prices. We bring authentic gadgets across Bangladesh with fast delivery, warranty & 24/7 support. Inside Dhaka ৳60, Outside ৳120 delivery.</p>
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <div className="border rounded-xl p-4 text-center"><p className="font-bold">50k+</p><p className="text-xs text-gray-500">Happy Customers</p></div>
        <div className="border rounded-xl p-4 text-center"><p className="font-bold">100% Authentic</p><p className="text-xs text-gray-500">Warranty</p></div>
        <div className="border rounded-xl p-4 text-center"><p className="font-bold">24/7</p><p className="text-xs text-gray-500">Support</p></div>
      </div>
    </div>
  </div>);
}
