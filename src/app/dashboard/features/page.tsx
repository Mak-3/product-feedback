"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/dashboard/Sidebar";
import { motion } from "framer-motion";

export default function FeaturesPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [features, setFeatures] = useState<any[]>([]);
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
      <div className="flex-1 lg:ml-64 bg-surface">
        <div className="pt-4 sm:pt-6 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
          <h1 className="text-2xl sm:text-3xl font-medium text-foreground mb-6 sm:mb-8 lg:pl-0 pl-14">Features</h1>

          <div className="bg-background border border-border rounded-lg p-6">
            {features.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-foreground font-medium mb-2">No features yet</p>
                <p className="text-sm text-muted">
                  Feature requests from your users will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 border border-border rounded-md hover:bg-surface transition-colors"
                  >
                    <h3 className="font-medium text-foreground mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

