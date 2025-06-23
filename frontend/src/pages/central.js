import Head from "next/head";

export default function Central() {
  return (
    <>
      <Head>
        <title>Central Hub | The Planet Hub</title>
      </Head>

      <main className="min-h-screen bg-black text-white px-6 py-10 font-sans">
        <section className="max-w-6xl mx-auto space-y-12">

          {/* Hero */}
          <div className="bg-[#0d0d0d] p-8 rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, Commander</h1>
              <p className="text-gray-400 max-w-lg">
                Stay informed and inspired by the latest planetary engineering missions and research breakthroughs.
              </p>
              <button className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg">
                View Profile
              </button>
            </div>
            <img
              src="/planet-glow.jpg"
              alt="Planet Glow"
              className="w-full md:w-80 rounded-lg object-cover"
            />
          </div>

          {/* Live Feed */}
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
                  detail: "Joined &apos;Project Eden&apos; for self-sustaining exoplanet ecosystems.",
                  author: "Dr. Noah Bennett, Astrobiologist",
                },
                {
                  icon: "📚",
                  title: "New Resource Shared",
                  detail: "Shared tools for atmospheric modeling in exoplanets.",
                  author: "Dr. Olivia Hayes, Environmental Scientist",
                },
              ].map((feed, i) => (
                <div key={i} className="bg-[#0d0d0d] p-4 rounded-lg flex gap-4 items-start">
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
              {[
                {
                  title: "The Global Water Crisis",
                  desc: "Explore research on water scarcity solutions on Earth and beyond.",
                  img: "/planet-card1.jpg",
                },
                {
                  title: "Advanced Materials for Space Habitats",
                  desc: "Cutting-edge materials for durable, sustainable extraterrestrial habitats.",
                  img: "/planet-card2.jpg",
                },
              ].map((mission, i) => (
                <div key={i} className="bg-[#0d0d0d] rounded-lg overflow-hidden shadow-md">
                  <img src={mission.img} alt={mission.title} className="h-40 w-full object-cover" />
                  <div className="p-4">
                    <p className="text-sm text-blue-400 uppercase">Featured Mission</p>
                    <h3 className="text-lg font-semibold mb-1">{mission.title}</h3>
                    <p className="text-sm text-gray-400">{mission.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Contributions */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Contributions</h2>
            <ul className="space-y-3">
              <li className="bg-[#0d0d0d] p-4 rounded-lg">
                <p className="text-white font-medium">
                  Martian Soil Data <span className="text-sm text-blue-400 ml-2">View Dataset</span>
                </p>
                <p className="text-sm text-gray-400">Uploaded a new dataset on Martian soil composition.</p>
              </li>
              <li className="bg-[#0d0d0d] p-4 rounded-lg">
                <p className="text-white font-medium">
                  Project Nova <span className="text-sm text-blue-400 ml-2">View Mission</span>
                </p>
                <p className="text-sm text-gray-400">Contributed to the &apos;Project Nova&apos; mission.</p>
              </li>
            </ul>
          </div>

          {/* Featured Research */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Featured Research Spotlight</h2>
            <div className="bg-[#0d0d0d] rounded-lg overflow-hidden md:flex shadow-md">
              <img src="/planet-spotlight.jpg" alt="Spotlight" className="w-full md:w-1/2 object-cover" />
              <div className="p-6">
                <h3 className="text-lg font-bold mb-1">Terraforming Strategies for Exoplanets</h3>
                <p className="text-sm text-gray-400 mb-2">Dr. Evelyn Reed</p>
                <p className="text-sm text-gray-300">
                  A groundbreaking study on terraforming techniques for habitable exoplanets.
                </p>
                <button className="mt-4 text-blue-400 hover:underline text-sm">Read Full Research</button>
              </div>
            </div>
          </div>

          {/* Quick Access */}
          <div className="flex flex-wrap gap-4 justify-between mt-10">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg">
              Start a Mission
            </button>
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-2 rounded-lg">
              Share a Resource
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg">
              Join a Mission
            </button>
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-2 rounded-lg">
              Find a Resource
            </button>
          </div>

          {/* Mission Updates */}
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Mission Updates</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-[#0d0d0d] p-4 rounded-lg">
                <p className="text-sm text-gray-400">🚀 Mission Status</p>
                <p className="text-white font-medium">Project Nova progress at 75%</p>
              </div>
              <div className="bg-[#0d0d0d] p-4 rounded-lg">
                <p className="text-sm text-gray-400">🧭 Mission Planning</p>
                <p className="text-white font-medium">Next phase scheduled: Project Eden</p>
              </div>
            </div>
          </div>

        </section>
      </main>
    </>
  );
}
