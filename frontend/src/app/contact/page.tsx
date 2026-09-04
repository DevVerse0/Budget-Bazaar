'use client';
import { useState } from 'react';
export default function Contact(){
  const [msg,setMsg]=useState('');
  return (<div className="container-bb py-12">
    <div className="max-w-2xl mx-auto bg-white border rounded-2xl p-6 shadow-sm">
      <h1 className="font-black text-xl">Contact Us</h1>
      <p className="text-sm text-gray-500">Budget Bazar Service — Ask anything, we reply in 30 minutes.</p>
      <form onSubmit={e=>{e.preventDefault(); setMsg('✅ Message sent! We will contact soon.');}} className="space-y-3 mt-4">
        <input placeholder="Your Name" required className="w-full border rounded-xl px-3 py-3"/>
        <input placeholder="Mobile / Email" required className="w-full border rounded-xl px-3 py-3"/>
        <textarea placeholder="Message" rows={4} required className="w-full border rounded-xl px-3 py-3"/>
        <button className="w-full bg-gold py-3 rounded-xl font-black">Send Message</button>
        {msg && <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-xl p-2">{msg}</p>}
      </form>
      <div className="mt-6 text-sm text-gray-600">
        <p>📞 01922-896103</p>
        <p>📧 budgetbazaarservicebd@gmail.com</p>
        <p>📍 Dhaka, Bangladesh — Fast Delivery Across Bangladesh</p>
      </div>
    </div>
  </div>);
}
