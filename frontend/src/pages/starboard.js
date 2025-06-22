import Head from "next/head";

export default function Starboard() {
  const theories = [
    {
      title: "Quantum Cooling for Urban Heat Islands",
      author: "Ayesha Rao",
      summary:
        "Uses nanomaterials to passively cool rooftops in dense Indian cities using quantum tunneling.",
      stars: 92,
    },
    {
      title: "BioLight: Trees That Emit Light",
      author: "Ritik Sharma",
      summary:
        "Gene-edited banyan trees that glow in the dark using bioluminescence to reduce streetlight power demand.",
      stars: 78,
    },
    {
      title: "Atmospheric Carbon Vacuum Tower",
      author: "Dr. Meenakshi Iyer",
      summary:
        "Ionic towers designed to extract CO₂ and convert it into bricks, tested in Delhi smog zones.",
      stars: 108,
    },
  ];

  const missions = [
    {
      name: "WaterZero",
      tag: "#Climate #Funded",
      status: "In Pilot Phase",
      description:
        "A low-cost graphene membrane that filters 99% of microplastics — tested in 3 Indian districts.",
    },
    {
      name: "SkyCell",
      tag: "#Space #Deployed",
      status: "Active Satellite",
      description:
        "An open-source nanosatellite monitoring Himalayan glacier melt. Data feeds into ML climate models.",
    },
  ];

  const leaders = [
    { name: "Zara Mehta", points: 1230 },
    { name: "Ayaan Khan", points: 1175 },
    { name: "Aryan Patel", points: 1102 },
  ];

  return (
    <>
      <Head>
        <title>Starboard | The Planet Hub</title>
      </Head>

      <section className="min-h-screen bg-gradient-to-b from-black to-blue-950 text-white px-6 py-20">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
          ⭐ Starboard
        </h1>
        <p className="text-lg text-center max-w-3xl mx-auto mb-12">
          The brightest ideas and boldest missions from across the galaxy of minds on The Planet Hub.
        </p>

        {/* Theories Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">🧠 Top-Rated Theories</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {theories.map((t, i) => (
              <div
                key={i}
                className="bg-blue-900/30 border border-blue-700 p-6 rounded-xl shadow hover:bg-blue-800/30 transition"
              >
                <h3 className="text-lg font-bold">{t.title}</h3>
                <p className="text-sm text-gray-300 mt-2">{t.summary}</p>
                <div className="mt-4 flex justify-between text-sm text-gray-400">
                  <span>👩‍🔬 {t.author}</span>
                  <span>⭐ {t.stars} stars</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Missions Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">🚀 Breakthrough Missions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {missions.map((m, i) => (
              <div
                key={i}
                className="bg-blue-900/30 border border-green-600 p-6 rounded-xl hover:bg-blue-800/30 transition"
              >
                <h3 className="text-lg font-bold">{m.name}</h3>
                <span className="text-xs text-green-400">{m.tag}</span>
                <p className="text-sm text-gray-300 mt-2">{m.description}</p>
                <p className="text-xs text-gray-400 mt-2">Status: {m.status}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">🏅 Leader Hall</h2>
          <ul className="space-y-3">
            {leaders.map((user, i) => (
              <li
                key={i}
                className="bg-blue-900/30 p-4 rounded-xl flex justify-between items-center border border-yellow-500"
              >
                <span>{i + 1}. {user.name}</span>
                <span className="text-sm text-yellow-300">Impact Score: {user.points}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
