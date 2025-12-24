// File: src/features/incident/pages/IncidentDetailsPage.tsx
/**
 * 🌟 --- UPDATED --- 🌟
 * - Imported 'PDFDownloadLink' and 'IncidentReportPDF'.
 * - Added the "Export Report" button in the header.
 */

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaExclamationTriangle,
  FaFilePdf, // 🌟 Added icon
} from "react-icons/fa";
// 🌟 Import PDF tools
import { PDFDownloadLink } from "@react-pdf/renderer";
import IncidentReportPDF from "../components/IncidentReportPDF";
// --------------------
import { incidentService } from "../services/incidentService";
import type { Incident } from "../../../types/common.types";
import { formatDate } from "../../../lib/utils";
import CurrentCrew from "../components/CurrentCrew";
import IncidentOverview from "../components/IncidentOverview";
import MapDisplay from "../../../components/ui/MapDisplay";
import IncidentAttachments from "../components/IncidentAttachments";
import StatusBadge from "../../../components/ui/StatusBadge";

const IncidentDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIncidentDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await incidentService.getIncidentById(id);
        setIncident(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidentDetails();
  }, [id]);

  const handleEdit = () => {
    navigate(`/incident/edit/${id}`);
  };

  const handleDelete = async () => {
    if (
      !id ||
      !window.confirm(
        "Are you sure you want to permanently delete this incident?"
      )
    ) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);
    try {
      await incidentService.deleteIncident(id);
      navigate("/incident-dashboard");
    } catch (e: any) {
      setDeleteError(e.message);
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        Loading incident details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 flex justify-center items-center">
        Error: {error}
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="text-yellow-400 flex justify-center items-center">
        Incident not found.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Title Area */}
      <div className="mb-6">
        <Link
          to="/incident-dashboard"
          className="text-sm text-[#0D6EFD] hover:underline mb-2 block"
        >
          &larr; Back to Incident Log
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          {/* Left side: Title */}
          <div>
            <h2 className="text-3xl font-bold flex items-center">
              {`Incident ${incident.incident_code}`}
              <div className="ml-3">
                <StatusBadge
                  text={
                    incident.status.charAt(0).toUpperCase() +
                    incident.status.slice(1)
                  }
                  type={incident.status}
                />
              </div>
            </h2>
            <p className="text-lg text-[#ADB5BD] mt-1">
              {incident.title}
            </p>
          </div>

          {/* Right side: Action Buttons */}
          <div className="flex gap-3 mt-4 md:mt-0">
            {/* 🌟 --- NEW EXPORT BUTTON --- 🌟 */}
            <PDFDownloadLink
              document={<IncidentReportPDF incident={incident} />}
              fileName={`incident-${incident.incident_code}.pdf`}
              className="btn-main-gray py-2 px-4 rounded-md justify-center"
            >
              {/* PDFDownloadLink provides a loading state for the generation process */}
              {({ loading }) =>
                loading ? (
                  "Generating..."
                ) : (
                  <span className="flex items-center">
                    <FaFilePdf className="mr-2" /> Export Report
                  </span>
                )
              }
            </PDFDownloadLink>
            {/* 🌟 --- END NEW BUTTON --- 🌟 */}

            <button
              onClick={handleEdit}
              className="btn-main-gray py-2 px-4 rounded-md justify-center"
              disabled={isDeleting}
            >
              <FaEdit className="mr-2" /> Edit
            </button>
            <button
              onClick={handleDelete}
              className="btn-main-red py-2 px-4 rounded-md justify-center"
              disabled={isDeleting}
            >
              {isDeleting ? (
                "Deleting..."
              ) : (
                <>
                  <FaTrash className="mr-2" /> Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {deleteError && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-md text-red-200 flex items-center gap-3">
          <FaExclamationTriangle />
          <div>
            <strong>Error Deleting Incident:</strong> {deleteError}
          </div>
        </div>
      )}

      {/* --- 2-Column Grid Layout --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Wider) */}
        <div className="lg:col-span-2 space-y-8">
          <IncidentOverview
            incidentType={incident.incident_type}
            location={`${incident.address}, ${incident.city}, ${incident.state}`}
            reportedAt={formatDate(incident.reported_at)}
            status={incident.status}
            priority={incident.priority}
            description={incident.description}
          />

          <MapDisplay
            lat={incident.latitude}
            lon={incident.longitude}
            isInteractive={false}
          />

          <IncidentAttachments
            incidentId={incident.id}
            initialAttachments={incident.assigned_attachments}
            isReadOnly={true}
          />
        </div>

        {/* Right Column (Narrower) */}
        <div className="lg:col-span-1 space-y-8">
          <CurrentCrew 
            crew={incident.assigned_personnel}
            equipment={incident.assigned_equipment}
          />
        </div>
      </div>
    </div>
  );
};

export default IncidentDetailsPage;