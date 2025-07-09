import * as React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [community, setCommunity] = React.useState<any[]>([]);
  const [waitlist, setWaitlist] = React.useState<any[]>([]);
  const [newsletter, setNewsletter] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!user) return;
    if (user.email !== "atrvictor@gmail.com") return;
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const { data: communityData, error: communityError } = await supabase
          .from("community")
          .select("name, email, interest, created_at")
          .order("created_at", { ascending: false });
        const { data: waitlistData, error: waitlistError } = await supabase
          .from("waitlist")
          .select("email, created_at")
          .order("created_at", { ascending: false });
        const { data: newsletterData, error: newsletterError } = await supabase
          .from("newsletter")
          .select("email, created_at")
          .order("created_at", { ascending: false });
        if (communityError || waitlistError || newsletterError) {
          setError("Failed to fetch data from Supabase.");
        } else {
          setCommunity(communityData || []);
          setWaitlist(waitlistData || []);
          setNewsletter(newsletterData || []);
        }
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Admin</h1>
        <p>Please log in to access this page.</p>
      </div>
    );
  }
  if (user.email !== "atrvictor@gmail.com") {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Admin</h1>
        <p>You are not authorized to view this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-center">{error}</div>
      ) : (
        <>
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Community Signups</h2>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b text-left">Name</th>
                    <th className="px-4 py-2 border-b text-left">Email</th>
                    <th className="px-4 py-2 border-b text-left">Interest</th>
                    <th className="px-4 py-2 border-b text-left">Signed Up</th>
                  </tr>
                </thead>
                <tbody>
                  {community.length === 0 ? (
                    <tr><td colSpan={4} className="px-4 py-2 text-center text-gray-500">No signups yet.</td></tr>
                  ) : (
                    community.map((c, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="px-4 py-2">{c.name}</td>
                        <td className="px-4 py-2">{c.email}</td>
                        <td className="px-4 py-2">{c.interest}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">{c.created_at ? new Date(c.created_at).toLocaleString() : ""}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Waitlist (Meditation Notify Me)</h2>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b text-left">Email</th>
                    <th className="px-4 py-2 border-b text-left">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {waitlist.length === 0 ? (
                    <tr><td colSpan={2} className="px-4 py-2 text-center text-gray-500">No waitlist signups yet.</td></tr>
                  ) : (
                    waitlist.map((w, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="px-4 py-2">{w.email}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">{w.created_at ? new Date(w.created_at).toLocaleString() : ""}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Newsletter Signups</h2>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b text-left">Email</th>
                    <th className="px-4 py-2 border-b text-left">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {newsletter.length === 0 ? (
                    <tr><td colSpan={2} className="px-4 py-2 text-center text-gray-500">No newsletter signups yet.</td></tr>
                  ) : (
                    newsletter.map((n, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="px-4 py-2">{n.email}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">{n.created_at ? new Date(n.created_at).toLocaleString() : ""}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
} 