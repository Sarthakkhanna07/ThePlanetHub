import Head from "next/head";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";

export default function Home() {
  const titleRef = useRef(null);
  const taglineRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(titleRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1 });
    gsap.fromTo(taglineRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, delay: 0.5, duration: 1 });
  }, []);

  return (
    <>
      <Head>
        <title>The Planet HUB</title>
        <meta name="description" content="Research to Startup | Made in India, for India | For Planetary Engineers" />
      </Head>

      <main className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <section className="h-screen bg-cover bg-center flex flex-col justify-center items-center text-center px-6" style={{ backgroundImage: "url('/earth-bg.jpg')" }}>
          <h1 ref={titleRef} className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-xl">The Planet HUB</h1>
          <p ref={taglineRef} className="text-lg md:text-xl text-gray-300 max-w-2xl mb-6">🌍 For Planetary Engineers | 🚀 Research to Startups | Made in India, for India</p>
          <Link href="/planetary-issues" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-all">Explore Initiatives</Link>
        </section>

        {/* About Section */}
        <section className="px-6 py-16 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">About The Planet HUB</h2>
          <p className="text-gray-400 text-lg mb-10">The Planet HUB is a next-generation Indian platform built to unite planetary engineers, researchers, and scientists around solving real planetary issues. Our vision is to turn breakthrough research into startups, and ignite a culture of funding, collaboration, and scientific progress—Made in India, for India, and beyond.</p>

          <h3 className="text-2xl font-semibold mb-4">Core Modules</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-900 p-6 rounded-lg">
              <h4 className="text-xl font-semibold mb-2">🚀 Launch Pad</h4>
              <p className="text-gray-400">Submit and validate research with AI-powered scoring, then take it forward to funding and startup acceleration.</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <h4 className="text-xl font-semibold mb-2">⭐ Starboard</h4>
              <p className="text-gray-400">View top-rated papers, community-voted innovations, and trending projects across planetary science.</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <h4 className="text-xl font-semibold mb-2">👤 My Space</h4>
              <p className="text-gray-400">Build your profile, track submissions, contribute to discussions, and rise through the research leaderboard.</p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-gray-950 py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6">How It Works</h3>
            <ul className="space-y-4 text-gray-300">
              <li>🔬 Submit Research: Upload your ideas and let our AI engine validate them for novelty and impact.</li>
              <li>⭐ Rate and Star: Engage with the community by rating promising submissions and starring ideas.</li>
              <li>🤝 Take Pledges: Commit your time or resources to solve planetary issues and drive real-world change.</li>
              <li>📊 Gain Scores: Boost your credibility with AI scores, peer ratings, and impact metrics.</li>
            </ul>
          </div>
        </section>

        {/* Why Join Section */}
        <section className="py-16 px-6 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-6">Why Join The Planet HUB?</h3>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>🎯 Convert research into startups through our AI and funding channels</li>
            <li>📢 Get visibility on a national leaderboard for planetary contributions</li>
            <li>💡 Collaborate on open planetary issues with real-world impact</li>
            <li>🌐 Connect with researchers across India and beyond</li>
            <li>💸 Receive funding, grants, and platform-led hackathon rewards</li>
          </ul>
        </section>

        {/* Featured Issue */}
        <section className="bg-gray-950 py-16 px-6 text-center">
          <h3 className="text-xl font-bold text-white mb-2">🌌 Featured Issue</h3>
          <p className="text-gray-400 text-lg">Advancing Space Exploration — Explore the latest research on propulsion systems, robotics, and habitat design for interstellar travel.</p>
        </section>

        {/* Join CTA */}
        <section className="text-center py-20 px-6">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-gray-400 text-lg mb-6">Become a member of The Planet HUB and help reshape the future of planetary engineering, made in India.</p>
          <Link href="/signup" className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-semibold text-white">Join the Hub</Link>
        </section>

        {/* Footer */}
        <footer className="bg-black border-t border-gray-800 py-6 text-center text-gray-500 text-sm">
          <p>&copy; 2025 The Planet HUB. All rights reserved.</p>
        </footer>
      </main>
    </>
  );
}
