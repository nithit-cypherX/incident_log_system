// File: src/features/incident/components/IncidentAttachments.tsx
/**
 * What it does:
 * Manages the full attachment lifecycle (view, upload, delete).
 *
 * How it works:
 * - It's "smart" because it handles its own API calls
 * for uploading and deleting files.
 * - 'handleFileSelect' calls 'incidentService.uploadAttachment'.
 * - 'handleDelete' calls 'incidentService.deleteAttachment'.
 * - 'useEffect' is used to update its internal state
 * if the 'initialAttachments' prop changes (the fix from before).
 *
 * How it connects:
 * - 'IncidentDetailsPage.tsx' renders this.
 * - 'IncidentFormPage.tsx' renders this (in edit mode).
 */

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
import type { Attachment } from "../../../types/common.types";
import { incidentService } from "../services/incidentService";

// --- Props ---
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

// The API serves files from the root
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

  // This hook updates the state if the prop changes
  useEffect(() => {
    setAttachments(initialAttachments);
  }, [initialAttachments]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Upload logic
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      // Use the service!
      const newAttachment = await incidentService.uploadAttachment(
        String(incidentId),
        file
      );
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

  // Delete logic
  const handleDelete = async (attachmentId: number) => {
    if (
      !window.confirm("Are you sure you want to delete this attachment?")
    ) {
      return;
    }

    setError(null);
    try {
      // Use the service!
      await incidentService.deleteAttachment(attachmentId);
      setAttachments((prev: Attachment[]) =>
        prev.filter((att: Attachment) => att.id !== attachmentId)
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  // --- JSX / Render ---
  return (
    <div className="bg-[#2C3034] p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-[#F8F9FA] flex items-center">
          <FaPaperclip className="mr-3" /> Attachments
        </h3>
        {!isReadOnly && (
          <button
            type="button"
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
                  type="button"
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