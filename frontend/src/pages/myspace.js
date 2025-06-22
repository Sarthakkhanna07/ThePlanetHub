import Head from "next/head";

export default function MySpace() {
  const user = {
    name: "Sarthak",
    missions: [
      {
        title: "EcoSolar Village Grid",
        status: "In Progress",
        summary: "Building microgrid-based solar infrastructure in rural areas using blockchain-based metering.",
      },
      {
        title: "SkyReclaim Carbon",
        status: "Submitted",
        summary: "Uses airborne drones to trap and bind carbon particles in polluted urban air zones.",
      },
    ],
    savedTheories: [
      {
        title: "AI Ocean Current Simulator",
        author: "Zoya K.",
      },
      {
        title: "Nano-fog for Smart Agriculture",
        author: "Kabir Das",
      },
    ],
    stats: {
      missions: 2,
      theoriesRated: 5,
      pledgesMade: 1,
      impactScore: 1240,
    },
  };

  return (
    <>
      <Head>
        <title>My Space | The Planet Hub</title>
      </Head>

      <section className="min-h-screen bg-gradient-to-b from-black to-blue-950 text-white px-6 py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">🌌 Welcome, {user.name}</h1>
          <p className="text-lg text-gray-300">Here’s your mission control dashboard.</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 text-center mb-16">
          <div className="bg-blue-900/30 border border-gray-700 rounded-xl p-6">
            <p className="text-3xl font-bold">{user.stats.missions}</p>
            <p className="text-sm text-gray-300 mt-1">Missions</p>
          </div>
          <div className="bg-blue-900/30 border border-gray-700 rounded-xl p-6">
            <p className="text-3xl font-bold">{user.stats.theoriesRated}</p>
            <p className="text-sm text-gray-300 mt-1">Theories Rated</p>
          </div>
          <div className="bg-blue-900/30 border border-gray-700 rounded-xl p-6">
            <p className="text-3xl font-bold">{user.stats.pledgesMade}</p>
            <p className="text-sm text-gray-300 mt-1">Pledges Made</p>
          </div>
          <div className="bg-blue-900/30 border border-yellow-400 rounded-xl p-6">
            <p className="text-3xl font-bold text-yellow-300">{user.stats.impactScore}</p>
            <p className="text-sm text-yellow-200 mt-1">Impact Score</p>
          </div>
        </div>

        {/* Missions */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">🚀 My Missions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {user.missions.map((m, i) => (
              <div
                key={i}
                className="bg-blue-900/30 border border-blue-700 p-6 rounded-xl hover:bg-blue-800/30 transition"
              >
                <h3 className="text-lg font-bold">{m.title}</h3>
                <p className="text-sm text-gray-300 mt-2">{m.summary}</p>
                <p className="text-xs text-gray-400 mt-2">Status: {m.status}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Theories */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">🌟 Saved Theories</h2>
          <ul className="space-y-3">
            {user.savedTheories.map((t, i) => (
              <li
                key={i}
                className="bg-blue-900/30 border border-purple-600 p-4 rounded-xl flex justify-between items-center"
              >
                <span className="font-medium">{t.title}</span>
                <span className="text-sm text-gray-400">👩‍🔬 {t.author}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
