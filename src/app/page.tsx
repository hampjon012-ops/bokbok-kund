import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-serif text-gray-900">Bokbok</h1>
          <div className="flex gap-4">
            <Link href="/login" className="px-4 py-2 text-gray-600 hover:text-gray-900">
              Logga in
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
            >
              Boka nu
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-24 text-center">
        <h2 className="text-5xl font-serif text-gray-900 mb-6">
          Boka din tid online
        </h2>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Enkelt och smidigt. Välj tjänst, stylist och tid - klart på några sekunder.
        </p>
        <Link
          href="/login"
          className="inline-block px-8 py-4 bg-pink-600 text-white text-lg rounded-full hover:bg-pink-700 transition shadow-lg"
        >
          Boka tid →
        </Link>
      </section>

      {/* Services preview */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h3 className="text-2xl font-serif text-center text-gray-900 mb-12">Populära tjänster</h3>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: "Klippning", price: " från 450 kr", icon: "✂️" },
            { name: "Färgning", price: " från 800 kr", icon: "🎨" },
            { name: "Bokning", price: " från 300 kr", icon: "💇" },
          ].map((service) => (
            <div key={service.name} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition text-center">
              <div className="text-4xl mb-4">{service.icon}</div>
              <h4 className="text-lg font-medium text-gray-900">{service.name}</h4>
              <p className="text-pink-600 mt-2">{service.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 mt-24">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-lg font-serif text-white mb-2">Bokbok</p>
          <p className="text-sm">Online-bokning för frisörer och skönhetssalonger</p>
        </div>
      </footer>
    </div>
  );
}
