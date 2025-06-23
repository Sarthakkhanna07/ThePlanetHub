"use client";
import { useState } from "react";
import Head from "next/head";

export default function Starboard() {
  const [selectedDuration, setSelectedDuration] = useState("All Time");

  const leaderboardData = [
    { rank: 1, name: "Dr. Anya Sharma", score: 95, rating: 4.9 },
    { rank: 2, name: "Team Orion", score: 92, rating: 4.8 },
    { rank: 3, name: "Ethan Carter", score: 90, rating: 4.7 },
    { rank: 4, name: "Dr. Ben Carter", score: 88, rating: 4.6 },
    { rank: 5, name: "Team Nova", score: 85, rating: 4.5 },
    { rank: 6, name: "Olivia Bennett", score: 82, rating: 4.4 },
    { rank: 7, name: "Dr. Liam Walker", score: 80, rating: 4.3 },
    { rank: 8, name: "Team Galaxy", score: 78, rating: 4.2 },
    { rank: 9, name: "Sophia Hayes", score: 75, rating: 4.1 },
    { rank: 10, name: "Dr. Noah Evans", score: 72, rating: 4.0 },
  ];

  return (
    <>
      <Head>
        <title>Starboard - The Planet HUB</title>
        <link rel="icon" href="data:image/x-icon;base64," />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;700;900&family=Space+Grotesk:wght@400;500;700&display=swap"
        />
      </Head>

      <div
        className="min-h-screen bg-black text-white px-6 py-10"
        style={{
          fontFamily: '"Space Grotesk", "Noto Sans", sans-serif',
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">🌟 Starboard Leaderboard</h1>
            <p className="text-gray-400 mt-1 text-sm">
              Recognizing top contributors and researchers accelerating planetary progress.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-gray-700 mb-6">
            <button className="border-b-2 border-blue-500 text-white py-2 text-sm font-semibold">
              Top Performers
            </button>
            <button className="text-gray-500 py-2 text-sm font-medium hover:text-white">
              Top Teams
            </button>
            <button className="text-gray-500 py-2 text-sm font-medium hover:text-white">
              Top Researchers
            </button>
          </div>

          {/* Duration Toggle */}
          <div className="flex bg-[#1a1a1a] rounded-lg p-1 mb-6 text-sm font-medium text-gray-400">
            {["Weekly", "Monthly", "All Time"].map((label) => (
              <label
                key={label}
                className={`flex-1 text-center py-2 rounded-lg cursor-pointer transition-all ${
                  selectedDuration === label
                    ? "bg-[#111b22] text-white shadow-md"
                    : "hover:text-white"
                }`}
              >
                <input
                  type="radio"
                  name="duration"
                  value={label}
                  className="hidden"
                  checked={selectedDuration === label}
                  onChange={() => setSelectedDuration(label)}
                />
                {label}
              </label>
            ))}
          </div>

          {/* Leaderboard Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto bg-[#0f0f0f] border border-gray-700 text-left text-sm text-gray-300">
              <thead className="bg-[#1f1f1f] text-gray-100">
                <tr>
                  <th className="px-4 py-3">Rank</th>
                  <th className="px-4 py-3">Contributor</th>
                  <th className="px-4 py-3">Impact Score</th>
                  <th className="px-4 py-3">Community Rating</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((entry) => (
                  <tr key={entry.rank} className="border-t border-gray-800 hover:bg-[#1a1a1a] transition">
                    <td className="px-4 py-3">{entry.rank}</td>
                    <td className="px-4 py-3 text-white font-medium">{entry.name}</td>
                    <td className="px-4 py-3">{entry.score}</td>
                    <td className="px-4 py-3">{entry.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
