import { useState } from "react";

type SongInputType = "existing" | "upload" | "manual";

interface SectionState {
  type: SongInputType;
  songName?: string;
  file?: File | null;
}

export default function DashboardReperitories() {
  const [title, setTitle] = useState("");
  const [occasion, setOccasion] = useState("");
  const [date, setDate] = useState("");

  const [entrance, setEntrance] = useState<SectionState>({
    type: "existing",
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create Repertoire</h1>

      {/* Repertoire Info */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid md:grid-cols-3 gap-4">
          <input
            className="border rounded px-3 py-2"
            placeholder="Repertoire title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="border rounded px-3 py-2"
            placeholder="Occasion (Mass, Concert...)"
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
          />

          <input
            type="date"
            className="border rounded px-3 py-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      {/* Entrance Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="font-semibold mb-3">Entrance Song</h2>

        {/* Select input type */}
        <div className="flex gap-4 mb-4">
          {["existing", "upload", "manual"].map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="entranceType"
                value={type}
                checked={entrance.type === type}
                onChange={() =>
                  setEntrance({ type: type as SongInputType })
                }
              />
              <span className="capitalize">{type}</span>
            </label>
          ))}
        </div>

        {/* Existing Song */}
        {entrance.type === "existing" && (
          <input
            className="border rounded px-3 py-2 w-full"
            placeholder="Search entrance songs..."
          />
        )}

        {/* Upload Song */}
        {entrance.type === "upload" && (
          <input
            type="file"
            className="border rounded px-3 py-2 w-full"
          />
        )}

        {/* Manual Song */}
        {entrance.type === "manual" && (
          <input
            className="border rounded px-3 py-2 w-full"
            placeholder="Type song name"
            onChange={(e) =>
              setEntrance({ ...entrance, songName: e.target.value })
            }
          />
        )}
      </div>

      {/* Submit */}
      <button className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">
        Save Repertoire
      </button>
    </div>
  );
}
