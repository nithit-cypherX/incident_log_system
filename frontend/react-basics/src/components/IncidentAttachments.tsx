
import { FaPaperclip, FaUpload, FaFilePdf, FaImage } from "react-icons/fa";

const IncidentAttachments = () => {
  // Mock data for display
  const attachments = [
    { id: 1, name: "scene-overview.jpg", type: "image", user: "S. Johnson" },
    { id: 2, name: "witness-statement.pdf", type: "pdf", user: "J. Miller" },
  ];

  return (
    <div className="bg-[#2C3034] p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-[#F8F9FA] flex items-center">
          <FaPaperclip className="mr-3" /> Attachments
        </h3>
        <button className="btn-main-gray py-2 px-4 rounded-md text-sm">
          <FaUpload className="mr-2" /> Upload File
        </button>
      </div>

      <div className="space-y-3">
        {attachments.length > 0 ? (
          attachments.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-[#343A40] rounded-md"
            >
              <div className="flex items-center gap-3">
                {file.type === "image" ? (
                  <FaImage className="text-blue-400" />
                ) : (
                  <FaFilePdf className="text-red-400" />
                )}
                <span className="text-sm text-[#F8F9FA]">{file.name}</span>
              </div>
              <span className="text-xs text-[#ADB5BD]">
                Uploaded by {file.user}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-[#ADB5BD] text-center py-4">
            No attachments for this incident.
          </p>
        )}
      </div>
    </div>
  );
};

export default IncidentAttachments;