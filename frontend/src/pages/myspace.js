import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

export default function MySpace() {
  const [user, setUser] = useState(null);
  const [missions, setMissions] = useState([]);
  const [savedTheories, setSavedTheories] = useState([]);
  const [stats, setStats] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session || !session.user) {
        router.push("/login");
        return;
      }

      const { user } = session;
      setUser(user);

      // Fetch missions (research submissions by the user)
      const { data: missionsData, error: missionsError } = await supabase
        .from("research_submissions")
        .select("id, title, summary, status")
        .eq("user_id", user.id);
      if (missionsError) console.error("Error fetching missions:", missionsError);
      setMissions(missionsData || []);

      // Fetch saved theories (assuming saved_theories table)
      const { data: saved, error: savedErr } = await supabase
        .from("saved_theories")
        .select("id, title, author")
        .eq("user_id", user.id);
      if (savedErr) console.error("Error fetching saved theories:", savedErr);
      setSavedTheories(saved || []);

      // Generate stats counts
      const { count: missionsCount, error: countErr1 } = await supabase
        .from("research_submissions")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);
      if (countErr1) console.error("Error counting missions:", countErr1);

      const { count: ratedCount, error: countErr2 } = await supabase
        .from("ratings")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);
      if (countErr2) console.error("Error counting ratings:", countErr2);

      const { count: pledgesCount, error: countErr3 } = await supabase
        .from("pledges")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);
      if (countErr3) console.error("Error counting pledges:", countErr3);

      const impactScore = (missionsCount || 0) * 500 + (ratedCount || 0) * 10 + (pledgesCount || 0) * 100;

      setStats({
        missions: missionsCount || 0,
        theoriesRated: ratedCount || 0,
        pledgesMade: pledgesCount || 0,
        impactScore,
      });
    };

    fetchUserData();
  }, []);

  if (!user || !stats) return <div className="text-white p-8">Loading My Space...</div>;

  return (
    <>
      <Head>
        <title>My Space | The Planet Hub</title>
      </Head>

      <section className="min-h-screen bg-black text-white px-6 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">🌌 Welcome, {user.user_metadata?.full_name || user.email}</h1>
          <p className="text-lg text-gray-300">Here’s Your Space</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 text-center mb-16">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
            <p className="text-3xl font-bold">{stats.missions}</p>
            <p className="text-sm text-gray-300 mt-1">Research Papers</p>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
            <p className="text-3xl font-bold">{stats.theoriesRated}</p>
            <p className="text-sm text-gray-300 mt-1">Theories Rated</p>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
            <p className="text-3xl font-bold">{stats.pledgesMade}</p>
            <p className="text-sm text-gray-300 mt-1">Pledges Made</p>
          </div>
          <div className="bg-gray-900 border border-yellow-400 rounded-xl p-6">
            <p className="text-3xl font-bold text-yellow-300">{stats.impactScore}</p>
            <p className="text-sm text-yellow-200 mt-1">Impact Score</p>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">🚀 My Researches Paper</h2>
          {missions.length === 0 ? (
            <p className="text-gray-400">No research submissions yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {missions.map((m) => (
                <Link key={m.id} href={`/research/${m.id}`}> 
                  <div className="cursor-pointer bg-gray-900 border border-gray-700 p-6 rounded-xl hover:bg-gray-800 transition">
                    <h3 className="text-lg font-bold">{m.title}</h3>
                    <p className="text-sm text-gray-300 mt-2">{m.summary}</p>
                    <p className="text-xs text-gray-400 mt-2">Status: {m.status || "Submitted"}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">🌟 Saved Theories</h2>
          {savedTheories.length === 0 ? (
            <p className="text-gray-400">No saved theories yet.</p>
          ) : (
            <ul className="space-y-3">
              {savedTheories.map((t) => (
                <li key={t.id} className="bg-gray-900 border border-purple-600 p-4 rounded-xl flex justify-between items-center">
                  <span className="font-medium">{t.title}</span>
                  <span className="text-sm text-gray-400">👩‍🔬 {t.author}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
