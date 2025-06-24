import Head from "next/head";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { supabase } from "../lib/supabaseClient";

export default function Central() {
  const [session, setSession] = useState(null);
  const [trendingIssues, setTrendingIssues] = useState([]);
  const [recentResearch, setRecentResearch] = useState([]);
  const [featuredResearch, setFeaturedResearch] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };
    getSession();
    // Listen to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Fetch trending issues (latest 2)
    const fetchTrending = async () => {
      const { data, error } = await supabase
        .from("planetary_issues")
        .select("id, title, unique_code, description")
        .order("created_at", { ascending: false })
        .limit(2);
      if (error) console.error("Error fetching trending issues:", error);
      else setTrendingIssues(data || []);
    };
    // Fetch recent research (latest 3)
    const fetchRecentResearch = async () => {
      const { data, error } = await supabase
        .from("research_submissions")
        .select("id, title, created_at")
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) console.error("Error fetching recent research:", error);
      else setRecentResearch(data || []);
    };
    // Fetch featured research (latest 1)
    const fetchFeatured = async () => {
      const { data, error } = await supabase
        .from("research_submissions")
        .select("id, title, summary, user_id")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      if (error && error.code !== "PGRST116") console.error("Error fetching featured research:", error);
      else if (data) setFeaturedResearch(data);
    };
    fetchTrending();
    fetchRecentResearch();
    fetchFeatured();
  }, []);

  const handlePublish = () => {
    // If not logged in, redirect to login
    if (!session) router.push("/login");
    else router.push("/launch-pad/new");
  };
  const handleJoin = () => {
    router.push("/planetary-issues");
  };
  const handleShareResource = () => {
    router.push("/resources");
  };
  const handleFindResource = () => {
    router.push("/resources");
  };

  return (
    <>
      <Head>
        <title>Central Hub | The Planet Hub</title>
      </Head>
      <main className="min-h-screen bg-black text-white px-6 py-10 font-sans">
        <section className="max-w-6xl mx-auto space-y-12">

          {/* Hero */}
          <div className="bg-gray-900 p-8 rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {session ? "Welcome back, Commander" : "Welcome, Commander"}
              </h1>
              <p className="text-gray-400 max-w-lg">
                Stay informed and inspired by the latest planetary engineering missions and research breakthroughs.
              </p>
              <div className="mt-4">
                {session ? (
                  <button
                    onClick={() => router.push('/myspace')}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                  >
                    View Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => router.push('/login')}
                      className="mr-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg"
                    >
                      Log In
                    </button>
                    <button
                      onClick={() => router.push('/signup')}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>
            <Image
              src="/Starlord.png"
              alt="Planet Glow"
              width={120}
              height={120}
              className="w-32 h-32 md:w-40 md:h-40 rounded-lg object-cover"
            />
          </div>

          {/* Live Feed (demo) */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Live Activity Feed</h2>
            <div className="space-y-4">
              {[
                {
                  icon: "📄",
                  title: "New Research Paper",
                  detail: "Published a paper on sustainable terraforming for Mars.",
                  author: "Dr. Liam Walker, Planetary Engineer",
                },
                {
                  icon: "🧑‍🚀",
                  title: "New Mission Member",
                  detail: "Joined 'Project Eden' for self-sustaining exoplanet ecosystems.",
                  author: "Dr. Noah Bennett, Astrobiologist",
                },
                {
                  icon: "📚",
                  title: "New Resource Shared",
                  detail: "Shared tools for atmospheric modeling in exoplanets.",
                  author: "Dr. Olivia Hayes, Environmental Scientist",
                },
              ].map((feed, i) => (
                <div key={i} className="bg-gray-900 p-4 rounded-lg flex gap-4 items-start">
                  <div className="text-2xl">{feed.icon}</div>
                  <div>
                    <p className="font-medium">{feed.title}</p>
                    <p className="text-sm text-gray-400">{feed.detail}</p>
                    <p className="text-xs text-gray-500 mt-1">{feed.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Missions */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Trending Planetary Missions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {trendingIssues.length === 0 ? (
                <p className="text-gray-400">No trending issues yet.</p>
              ) : (
                trendingIssues.map((issue) => (
                  <Link key={issue.id} href={`/issues/${issue.id}`}> 
                    <div className="cursor-pointer bg-gray-900 rounded-lg overflow-hidden shadow-md">
                      {/* optional image or icon */}
                      <div className="p-4">
                        <p className="text-sm text-blue-400 uppercase">Trending Issue</p>
                        <h3 className="text-lg font-semibold mb-1">{issue.title}</h3>
                        <p className="text-sm text-gray-400">{issue.description || ''}</p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Recent Contributions */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Contributions</h2>
            {recentResearch.length === 0 ? (
              <p className="text-gray-400">No recent research submissions yet.</p>
            ) : (
              <ul className="space-y-3">
                {recentResearch.map((res) => (
                  <li key={res.id} className="bg-gray-900 p-4 rounded-lg flex justify-between items-center">
                    <Link href={`/research/${res.id}`}>
                      <span className="text-white font-medium hover:underline cursor-pointer">{res.title}</span>
                    </Link>
                    <span className="text-sm text-gray-400">{new Date(res.created_at).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Featured Research Spotlight */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Featured Research Spotlight</h2>
            {featuredResearch ? (
              <Link href={`/research/${featuredResearch.id}`}> 
                <div className="cursor-pointer bg-gray-900 rounded-lg overflow-hidden md:flex shadow-md">
                  {/* optional image if available */}
                  <div className="p-6 flex-1">
                    <h3 className="text-lg font-bold mb-1">{featuredResearch.title}</h3>
                    {/* summary might be long; show excerpt */}
                    <p className="text-sm text-gray-300 mb-2">
                      {featuredResearch.summary?.slice(0, 150) || ""}...
                    </p>
                    <button className="mt-2 text-blue-400 hover:underline text-sm">Read Full Research</button>
                  </div>
                </div>
              </Link>
            ) : (
              <p className="text-gray-400">No featured research at the moment.</p>
            )}
          </div>

          {/* Quick Access */}
          <div className="flex flex-wrap gap-4 justify-between mt-10">
            <button
              onClick={handlePublish}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
            >
              Publish Research
            </button>
            <button
              onClick={handleShareResource}
              className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-2 rounded-lg"
            >
              Share a Resource
            </button>
            <button
              onClick={handleJoin}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
            >
              See Issues
            </button>
            <button
              onClick={handleFindResource}
              className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-2 rounded-lg"
            >
              Find a Resource
            </button>
          </div>

        </section>
      </main>
    </>
  );
}
