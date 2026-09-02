export default function Success({searchParams}:{searchParams:{order?:string}}){
  return (<div className="container-bb py-12 text-center">
    <h1 className="text-2xl font-bold text-green-600">Order Successfully Placed!</h1>
    <p className="mt-2">আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে। আমাদের প্রতিনিধি কিছুক্ষণের মধ্যেই আপনার সাথে যোগাযোগ করবেন।</p>
    {searchParams.order && <p className="mt-4">Order ID: <span className="font-mono font-bold">{searchParams.order}</span></p>}
    <div className="flex gap-4 justify-center mt-6"><a href="/track-order" className="bg-navy text-white px-6 py-2 rounded">Track Order</a><a href="/shop" className="border px-6 py-2 rounded">Continue Shopping</a></div>
  </div>);
}
