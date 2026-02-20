"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import DashboardContent from "@/components/dashboard/DashboardContent";
import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          router.push("/login");
          return;
        }
        
        if (!user.email_confirmed_at) {
          await supabase.auth.signOut();
          router.push(`/confirm-email?email=${encodeURIComponent(user.email || "")}`);
          return;
        }
        
        setUser(user);
      } catch (err) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar />
      <DashboardContent />
    </div>
  );
}

