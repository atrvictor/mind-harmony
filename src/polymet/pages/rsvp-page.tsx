export default function RsvpPage() {
  console.log('[RSVP] RsvpPage mounted - SIMPLE VERSION');
  
  return (
    <div className="min-h-screen bg-[#F5F0E5]/30 p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">RSVP Page</h1>
        <p className="text-lg">This is the RSVP page - it's working!</p>
        <div className="mt-8 p-4 bg-green-100 rounded">
          <p>✅ Route is functioning</p>
          <p>✅ Component is mounting</p>
          <p>✅ Check console for mount log</p>
        </div>
      </div>
    </div>
  );
}


