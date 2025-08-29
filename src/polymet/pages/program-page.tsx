export default function ProgramPage() {
  return (
    <div>
      {/* Program Image Section */}
      <section className="py-8 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-[#E5F0F9]/50 overflow-hidden">
            <img
              src="/Program1.jpg"
              alt="Mind Harmony Program - Song List and Details"
              className="w-full h-auto object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
