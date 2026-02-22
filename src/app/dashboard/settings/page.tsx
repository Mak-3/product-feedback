"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/dashboard/Sidebar";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("test");
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [apiKeyLoading, setApiKeyLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const router = useRouter();

  const getAuthToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  };

  const fetchApiKey = useCallback(async () => {
    setApiKeyLoading(true);
    try {
      const token = await getAuthToken();
      if (!token) return;

      const response = await fetch('/api/api-keys', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch API key');

      const result = await response.json();
      if (result.data?.hasKey) {
        setApiKey(result.data.apiKey); // This will be masked
      } else {
        setApiKey(null);
      }
    } catch (err: any) {
      console.error('Error fetching API key:', err);
    } finally {
      setApiKeyLoading(false);
    }
  }, []);

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
        await fetchApiKey();
      } catch (err) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [router, fetchApiKey]);

  const handleShowApiKey = async () => {
    if (apiKeyVisible) {
      setApiKeyVisible(false);
      await fetchApiKey(); // Reset to masked
      return;
    }

    setApiKeyLoading(true);
    try {
      const token = await getAuthToken();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch('/api/api-keys/show', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch API key');

      const result = await response.json();
      setApiKey(result.data.apiKey);
      setApiKeyVisible(true);
    } catch (err: any) {
      setError(err.message || 'Failed to show API key');
    } finally {
      setApiKeyLoading(false);
    }
  };

  const handleRegenerateApiKey = async () => {
    if (!confirm("Are you sure you want to regenerate your API key? The old key will no longer work.")) {
      return;
    }

    setRegenerating(true);
    setError(null);
    setSuccess(null);

    try {
      const token = await getAuthToken();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch('/api/api-keys/regenerate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to regenerate API key');

      const result = await response.json();
      setApiKey(result.data.apiKey);
      setApiKeyVisible(true);
      setSuccess('API key regenerated successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to regenerate API key');
    } finally {
      setRegenerating(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Failed to logout");
    }
  };

  const handleDeleteProject = async () => {
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      return;
    }

    setDeleting("project");
    setError(null);
    setSuccess(null);

    try {
      setSuccess("Project deleted successfully");
    } catch (err: any) {
      setError(err.message || "Failed to delete project");
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone and will delete all your data.")) {
      return;
    }

    if (!confirm("This is your last chance. Are you absolutely sure?")) {
      return;
    }

    setDeleting("account");
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      if (error) throw error;
      
      await supabase.auth.signOut();
      router.push("/");
    } catch (err: any) {
      if (err.message?.includes("admin")) {
        setError("Account deletion requires admin access. Please contact support.");
      } else {
        setError(err.message || "Failed to delete account");
      }
    } finally {
      setDeleting(null);
    }
  };

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
        <div className="pt-4 sm:pt-6 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8 flex justify-center">
          <div className="w-full max-w-2xl space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-md text-red-600 text-sm"
              >
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-500/10 border border-green-500/20 rounded-md text-green-600 text-sm"
              >
                {success}
              </motion.div>
            )}

            <button
              onClick={() => {
                const newName = prompt("Enter project name:", projectName);
                if (newName) setProjectName(newName);
              }}
              className="w-full bg-background border border-border rounded-lg p-4 flex items-center gap-4 hover:bg-surface transition-colors"
            >
              <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-foreground">Project name</p>
                <p className="text-xs text-muted mt-0.5">{projectName}</p>
              </div>
              <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="w-full bg-background border border-border rounded-lg p-4">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">API Key</p>
                  <p className="text-xs text-muted mt-0.5">Use this key to authenticate API requests</p>
                </div>
              </div>
              
              {apiKeyLoading ? (
                <div className="flex items-center justify-center py-2">
                  <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : apiKey ? (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-surface rounded border border-border">
                    <code className="flex-1 text-xs font-mono text-foreground break-all">
                      {apiKey}
                    </code>
                    <button
                      onClick={handleShowApiKey}
                      disabled={apiKeyLoading}
                      className="p-1.5 hover:bg-background rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title={apiKeyVisible ? 'Hide API key' : 'Show API key'}
                    >
                      {apiKeyVisible ? (
                        <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        if (apiKeyVisible && apiKey) {
                          await navigator.clipboard.writeText(apiKey);
                          setSuccess('API key copied to clipboard');
                          setTimeout(() => setSuccess(null), 2000);
                        }
                      }}
                      disabled={!apiKeyVisible || apiKeyLoading}
                      className="flex-1 px-3 py-1.5 text-xs font-medium bg-surface border border-border rounded hover:bg-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Copy
                    </button>
                    <button
                      onClick={handleRegenerateApiKey}
                      disabled={regenerating || apiKeyLoading}
                      className="flex-1 px-3 py-1.5 text-xs font-medium bg-surface border border-border rounded hover:bg-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {regenerating ? 'Regenerating...' : 'Regenerate'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-3">
                  <button
                    onClick={handleRegenerateApiKey}
                    disabled={regenerating}
                    className="w-full px-3 py-2 text-xs font-medium bg-accent text-white rounded hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {regenerating ? 'Generating...' : 'Generate API Key'}
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="w-full bg-background border border-border rounded-lg p-4 flex items-center gap-4 hover:bg-surface transition-colors"
            >
              <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-red-500">Logout</p>
                <p className="text-xs text-muted mt-0.5">{user?.email}</p>
              </div>
              <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="pt-4">
              <h2 className="text-sm font-medium text-foreground mb-4">Danger Zone</h2>
              <div className="space-y-3">
                <button
                  onClick={handleDeleteProject}
                  disabled={deleting !== null}
                  className="w-full bg-background border border-border rounded-lg p-4 flex items-center gap-4 hover:bg-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-foreground">
                      {deleting === "project" ? "Deleting..." : "Delete Project"}
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting !== null}
                  className="w-full bg-background border border-border rounded-lg p-4 flex items-center gap-4 hover:bg-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-foreground">
                      {deleting === "account" ? "Deleting..." : "Delete Account"}
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

