import Head from "next/head";
import Link from "next/link";

export default function Resources() {
  // Demo static data
  const demoResources = [
    {
      id: 1,
      title: "Atmospheric Modeling Toolkit",
      description: "A suite of simulation scripts for modeling planetary atmospheres.",
      link: "#"
    },
    {
      id: 2,
      title: "Sustainable Habitat Materials",
      description: "Research papers and datasets on next-gen materials for space habitats.",
      link: "#"
    },
    {
      id: 3,
      title: "Renewable Energy Systems",
      description: "Whitepapers on solar, wind, and hybrid systems for remote environments.",
      link: "#"
    },
    {
      id: 4,
      title: "Water Recycling Methods",
      description: "Guides and case studies on efficient water recycling for closed systems.",
      link: "#"
    },
  ];

  return (
    <>
      <Head>
        <title>Resources | The Planet Hub</title>
      </Head>
      <main className="min-h-screen bg-black text-white px-6 py-10">
        <section className="max-w-4xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold">Resources (Coming Soon)</h1>
            <p className="text-gray-400 mt-2">
              This feature will be released after our startup launch when our community of researchers is established.
              Below is a demo preview of how the Resources section will look.
            </p>
          </div>

          {/* Search bar - disabled for demo */}
          <div className="flex justify-center mb-6">
            <input
              type="text"
              placeholder="Search resources..."
              disabled
              className="w-full max-w-lg bg-gray-900 text-gray-400 p-3 rounded-lg cursor-not-allowed"
            />
          </div>

          {/* Resource list demo */}
          <div className="grid md:grid-cols-2 gap-6">
            {demoResources.map((res) => (
              <div key={res.id} className="bg-gray-900 border border-gray-700 rounded-xl p-6 hover:bg-gray-800 transition">
                <h3 className="text-xl font-semibold mb-2">{res.title}</h3>
                <p className="text-gray-400 mb-4">{res.description}</p>
                <button
                  disabled
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-not-allowed"
                >
                  View Resource
                </button>
              </div>
            ))}
          </div>

          {/* Pagination demo */}
          <div className="flex justify-center mt-8">
            <button disabled className="mx-2 px-4 py-2 bg-gray-800 text-gray-500 rounded-lg cursor-not-allowed">Previous</button>
            <button disabled className="mx-2 px-4 py-2 bg-gray-800 text-gray-500 rounded-lg cursor-not-allowed">Next</button>
          </div>

          {/* Back to Central Hub */}
          <div className="text-center mt-12">
            <Link href="/central" className="text-blue-400 hover:underline">
              Back to Central Hub
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
