import React from "react";
import { FaBook, FaPlus } from "react-icons/fa";

const IncidentLogNotes = () => {
  // Mock data for display
  const notes = [
    {
      id: 1,
      user: "S. Johnson (Captain)",
      note: "Scene secured. Initial assessment complete. Requesting additional engine.",
      time: "10:32 AM",
    },
    {
      id: 2,
      user: "J. Miller (Firefighter)",
      note: "Primary search of first floor complete. All clear.",
      time: "10:45 AM",
    },
  ];

  return (
    <div className="bg-[#2C3034] p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-[#F8F9FA] flex items-center">
          <FaBook className="mr-3" /> Log & Notes
        </h3>
        <button className="btn-main-gray py-2 px-4 rounded-md text-sm">
          <FaPlus className="mr-2" /> Add Note
        </button>
      </div>

      <div className="space-y-4">
        {/* New Note Input (Placeholder) */}
        <textarea
          className="w-full p-3 form-input rounded-md bg-[#343A40] placeholder-[#ADB5BD]"
          rows={3}
          placeholder="Type a new log entry or note..."
        ></textarea>

        {/* List of existing notes */}
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {notes.map((note) => (
            <div key={note.id} className="p-3 bg-[#343A40] rounded-md">
              <p className="text-sm text-[#F8F9FA]">{note.note}</p>
              <p className="text-xs text-[#ADB5BD] mt-1">
                — {note.user} at {note.time}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IncidentLogNotes;