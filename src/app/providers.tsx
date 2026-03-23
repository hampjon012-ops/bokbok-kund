"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(() => setLoading(false));
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return <>{children}</>;
}
