"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Service = {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
};

type Booking = {
  id: string;
  date: string;
  start_time: string;
  status: string;
  notes?: string;
  services: { name: string; price: number };
};

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"book" | "bookings">("book");
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
      } else {
        setUser(data.user);
        setLoading(false);
      }
    });
  }, [router]);

  useEffect(() => {
    if (user) {
      fetchServices();
      fetchBookings();
    }
  }, [user]);

  const fetchServices = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("services").select("*").eq("active", true);
    if (data) setServices(data);
  };

  const fetchBookings = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("bookings")
      .select("*, services(name, price)")
      .order("date", { ascending: false });
    if (data) setBookings(data);
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let h = 9; h <= 18; h++) {
      slots.push(`${h.toString().padStart(2, "0")}:00`);
      slots.push(`${h.toString().padStart(2, "0")}:30`);
    }
    return slots;
  };

  useEffect(() => {
    if (selectedDate) {
      setAvailableTimes(generateTimeSlots());
    }
  }, [selectedDate]);

  const handleBook = async () => {
    if (!selectedService || !selectedDate || !selectedTime) return;
    setBookingLoading(true);

    const supabase = createClient();
    const { error } = await supabase.from("bookings").insert({
      customer_id: user.id,
      customer_email: user.email,
      customer_name: user.user_metadata?.full_name || user.email,
      service_id: selectedService.id,
      date: selectedDate,
      start_time: selectedTime,
      status: "pending",
      notes,
    });

    if (!error) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSelectedService(null);
        setSelectedDate("");
        setSelectedTime("");
        setNotes("");
        fetchBookings();
        setTab("bookings");
      }, 2000);
    }
    setBookingLoading(false);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-pink-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    completed: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-serif">Bokbok</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-sm">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-800"
            >
              Logga ut
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setTab("book")}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              tab === "book"
                ? "bg-pink-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            Boka tid
          </button>
          <button
            onClick={() => setTab("bookings")}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              tab === "bookings"
                ? "bg-pink-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            Mina bokningar
          </button>
        </div>

        {/* Success message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg mb-6 flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <span className="font-medium">Tid bokad! Vi hör av oss snart för bekräftelse.</span>
          </div>
        )}

        {/* Booking tab */}
        {tab === "book" && (
          <div className="space-y-8">
            {/* Step 1: Select service */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-medium mb-4">1. Välj tjänst</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`p-4 rounded-lg border-2 text-left transition ${
                      selectedService?.id === service.id
                        ? "border-pink-500 bg-pink-50"
                        : "border-gray-100 hover:border-pink-200"
                    }`}
                  >
                    <div className="font-medium">{service.name}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {service.duration_minutes} min •{" "}
                      <span className="text-pink-600 font-medium">
                        {service.price} kr
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Select date */}
            {selectedService && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-medium mb-4">2. Välj datum</h2>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedTime("");
                  }}
                  min={new Date().toISOString().split("T")[0]}
                  className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                />
              </div>
            )}

            {/* Step 3: Select time */}
            {selectedDate && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-medium mb-4">3. Välj tid</h2>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition ${
                        selectedTime === time
                          ? "bg-pink-600 text-white"
                          : "bg-gray-100 hover:bg-pink-100"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Notes & Confirm */}
            {selectedTime && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-medium mb-4">4. Bekräfta</h2>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Några anteckningar? (valfritt)"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none mb-4"
                  rows={3}
                />
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="font-medium">{selectedService?.name}</div>
                  <div className="text-sm text-gray-500">
                    {selectedDate} • {selectedTime} • {selectedService?.duration_minutes} min
                  </div>
                  <div className="text-pink-600 font-medium mt-1">
                    {selectedService?.price} kr
                  </div>
                </div>
                <button
                  onClick={handleBook}
                  disabled={bookingLoading}
                  className="w-full py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition disabled:opacity-50"
                >
                  {bookingLoading ? "Bokningen skickas..." : "Boka tid"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Bookings tab */}
        {tab === "bookings" && (
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                <div className="text-5xl mb-4">📅</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Inga bokningar än</h3>
                <p className="text-gray-500 mb-4">Boka din första tid så kommer den upp här!</p>
                <button
                  onClick={() => setTab("book")}
                  className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                >
                  Boka tid
                </button>
              </div>
            ) : (
              bookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-lg">
                        {booking.services?.name || "Tjänst"}
                      </div>
                      <div className="text-gray-500 mt-1">
                        📅 {booking.date} • ⏰ {booking.start_time}
                      </div>
                      {booking.notes && (
                        <div className="text-gray-400 text-sm mt-2">💬 {booking.notes}</div>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        statusColors[booking.status] || statusColors.completed
                      }`}
                    >
                      {booking.status === "pending"
                        ? "Väntar"
                        : booking.status === "confirmed"
                        ? "Bekräftad"
                        : booking.status === "completed"
                        ? "Avklarad"
                        : "Avbokad"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
