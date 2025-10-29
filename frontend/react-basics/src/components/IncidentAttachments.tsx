/* [File: src/components/IncidentAttachments.tsx] */

// 🌟 1. Import 'useEffect'
import { useState, useRef, useEffect } from "react";
import {
  FaPaperclip,
  FaUpload,
  FaFilePdf,
  FaImage,
  FaFileAlt,
  FaTrash,
  FaSpinner,
} from "react-icons/fa";

// --- Types (No change) ---
type Attachment = {
  id: number;
  original_file_name: string;
  file_path_relative: string;
  mime_type: string;
};

type IncidentAttachmentsProps = {
  incidentId: number;
  initialAttachments: Attachment[];
  isReadOnly?: boolean;
};

// --- Helper Functions (No change) ---
const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith("image/")) {
    return <FaImage className="text-blue-400" />;
  }
  if (mimeType === "application/pdf") {
    return <FaFilePdf className="text-red-400" />;
  }
  return <FaFileAlt className="text-gray-400" />;
};

const getFileUrl = (filePath: string) => {
  return `http://localhost:3000/${filePath}`;
};

// --- Main Component ---
const IncidentAttachments = ({
  incidentId,
  initialAttachments,
  isReadOnly = false,
}: IncidentAttachmentsProps) => {
  
  const [attachments, setAttachments] =
    useState<Attachment[]>(initialAttachments);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🌟🌟🌟 START: THE FIX 🌟🌟🌟
  // This hook "watches" the initialAttachments prop.
  // If the prop changes (e.g., from an empty list to the real list),
  // this hook will run and update the component's internal 'attachments' state.
  useEffect(() => {
    setAttachments(initialAttachments);
  }, [initialAttachments]); // Dependency array: run this code when 'initialAttachments' changes
  // 🌟🌟🌟 END: THE FIX 🌟🌟🌟


  // --- All other functions (handleUploadClick, handleFileSelect, handleDelete) remain unchanged ---
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file); 

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/incidents/${incidentId}/attachments`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const newAttachment = await response.json();

      if (!response.ok) {
        throw new Error(newAttachment.error || "Failed to upload file");
      }

      setAttachments((prev: Attachment[]) => [newAttachment, ...prev]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async (attachmentId: number) => {
    if (
      !window.confirm("Are you sure you want to delete this attachment?")
    ) {
      return;
    }

    setError(null);
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/attachments/${attachmentId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to delete file");
      }

      setAttachments((prev: Attachment[]) =>
        prev.filter((att: Attachment) => att.id !== attachmentId)
      );
    } catch (err: any) {
      setError(err.message);
    }
  };


  // --- JSX / Render (No change) ---
  return (
    <div className="bg-[#2C3034] p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-[#F8F9FA] flex items-center">
          <FaPaperclip className="mr-3" /> Attachments
        </h3>
        {!isReadOnly && (
          <button
            type="button" // This 'type' was our previous fix!
            onClick={handleUploadClick}
            className="btn-main-gray py-2 px-4 rounded-md text-sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : (
              <FaUpload className="mr-2" />
            )}
            Upload File
          </button>
        )}
      </div>

      {!isReadOnly && (
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
        />
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-md text-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {attachments.length > 0 ? (
          attachments.map((file: Attachment) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-[#343A40] rounded-md"
            >
              <div className="flex items-center gap-3">
                {getFileIcon(file.mime_type)}
                <a
                  href={getFileUrl(file.file_path_relative)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#F8F9FA] hover:text-blue-400 hover:underline"
                >
                  {file.original_file_name}
                </a>
              </div>
              {!isReadOnly && (
                <button
                  type="button" // This 'type' was our previous fix!
                  onClick={() => handleDelete(file.id)}
                  className="text-red-600 hover:text-red-400"
                  title="Delete attachment"
                >
                  <FaTrash />
                </button>
              )}
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