// File: src/features/incident/pages/IncidentFormPage.tsx
/**
 * What it does:
 * The "smart" page for CREATE and EDIT incident.
 *
 * How it works:
 * - Follows the "Smart Component" pattern (Guide Part 2).
 * - Gets 'id' from 'useParams' to know if it's 'edit' mode.
 * - Uses 'React Hook Form' (useForm) with 'zodResolver'.
 * - 'useEffect' to fetch data in 'edit' mode:
 * - 'incidentService.getIncidentById'
 * - 'incidentService.getAvailableCrew'
 * - 'reset(formData)' to populate the form with fetched data.
 * - Manages 'filesToUpload' state for 'create' mode.
 * - 'onFormSubmit' is the "smart" function that decides to
 * call 'createIncident' or 'updateIncident'.
 * - It renders the "dumb" <IncidentForm> component and provides
 * all logic and data as props, wrapped in <FormProvider>.
 *
 * How it connects:
 * - 'App.tsx' routes '/incident/new' and '/incident/edit/:id' here.
 */

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { incidentService } from "../services/incidentService";
import { incidentSchema } from "../validators/incidentSchema";
import type { IncidentFormData } from "../types/incident.types";
// 🌟 FIX: Import Attachment type
import type { AvailableCrew, Attachment } from "../../../types/common.types"; 
import {
  getCurrentDateTime,
  formatISOForInputs,
} from "../../../lib/utils";
import IncidentForm from "../components/IncidentForm";

const IncidentFormPage = () => {
  const navigate = useNavigate();
  const { id: incidentId } = useParams<{ id: string }>(); // This is a string or undefined
  const isEditMode = Boolean(incidentId);

  // --- State ---
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableCrew, setAvailableCrew] = useState<AvailableCrew[]>([]);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  // 🌟 FIX: Add state for initial attachments
  const [initialAttachments, setInitialAttachments] = useState<Attachment[]>([]);

  // --- React Hook Form ---
  const { date: defaultDate, time: defaultTime } = getCurrentDateTime();
  
  // 1. Setup 'useForm'
  const methods = useForm<IncidentFormData>({
    resolver: zodResolver(incidentSchema),
    defaultValues: {
      title: "",
      incident_type: "",
      priority: "",
      status: "active",
      date: defaultDate,
      time: defaultTime,
      address: "",
      city: "",
      state: "",
      zip_code: "",
      description: "",
      selectedCrew: [],
      reported_at: "", // Ensure all schema fields are present
      initial_crew: [], // Ensure all schema fields are present
    },
  });

  // 2. Fetch data on 'edit' mode
  useEffect(() => {
    // Fetch all available crew for the dropdown
    const fetchCrew = async () => {
      try {
        const data = await incidentService.getAvailableCrew();
        setAvailableCrew(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    // Fetch existing incident data if we are in EDIT mode
    const fetchIncidentData = async () => {
      if (!incidentId) return;

      setLoading(true);
      try {
        const data = await incidentService.getIncidentById(incidentId);
        const { date, time } = formatISOForInputs(data.reported_at);

        // 🌟 FIX: Separate form data from other data
        // Only include fields that are in the Zod schema
        const formData: IncidentFormData = {
          title: data.title,
          incident_type: data.incident_type,
          priority: data.priority,
          status: data.status,
          date: date,
          time: time,
          address: data.address,
          city: data.city,
          state: data.state,
          zip_code: data.zip_code,
          description: data.description,
          selectedCrew: data.assigned_personnel.map((p: any) => ({
            userId: p.user_id,
            userName: p.user_name,
            role: p.role_on_incident,
          })),
          reported_at: data.reported_at, // This is in the schema
          initial_crew: [], // This is in the schema
        };

        // 3. Populate the form with fetched data
        methods.reset(formData);

        // 🌟 FIX: Set the attachments in their own state
        setInitialAttachments(data.assigned_attachments || []);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCrew();
    fetchIncidentData();
  }, [incidentId, methods]);

  // --- File Handlers (for 'create' mode) ---
  const onFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFilesToUpload((prevFiles) => [...prevFiles, ...newFiles]);
      e.target.value = ""; // Allow re-selecting same file
    }
  };

  const onRemoveFile = (fileName: string) => {
    setFilesToUpload((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
  };

  // --- Cancel Handler ---
  const onCancel = () => {
    isEditMode
      ? navigate(`/incident/${incidentId}`)
      : navigate("/incident-dashboard");
  };

  // 4. Main "Smart" Submit Function
  const onFormSubmit = async (formData: IncidentFormData) => {
    // Use the 'loading' state from the page, not just RHF's 'isSubmitting'
    setLoading(true); 
    setError(null);

    // Format data for the API
    const apiPayload = {
      ...formData,
      reported_at: `${formData.date} ${formData.time}:00`,
      initial_crew: formData.selectedCrew.map((c) => ({
        user_id: c.userId,
        role_on_incident: c.role,
      })),
      created_by_user_id: 1, // Placeholder
    };

    try {
      let newOrExistingId = incidentId;

      if (isEditMode) {
        // --- UPDATE LOGIC ---
        if (!incidentId) throw new Error("Incident ID is missing for update.");
        await incidentService.updateIncident(incidentId, apiPayload);
      } else {
        // --- CREATE LOGIC ---
        const result = await incidentService.createIncident(apiPayload);
        newOrExistingId = String(result.incident_id);

        // Upload files
        if (filesToUpload.length > 0) {
          const uploadPromises = filesToUpload.map((file) =>
            incidentService.uploadAttachment(newOrExistingId!, file)
          );
          await Promise.all(uploadPromises);
        }
      }

      // On success, navigate to the details page
      navigate(`/incident/${newOrExistingId}`);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 5. Render the "dumb" form
  return (
    // 'FormProvider' makes all RHF methods available to <IncidentForm>
    <FormProvider {...methods}>
      <IncidentForm
        isEditMode={isEditMode}
        // 🌟 FIX: Pass the ID and attachments as props
        incidentId={incidentId ? Number(incidentId) : undefined}
        initialAttachments={initialAttachments} 
        availableCrew={availableCrew}
        filesToUpload={filesToUpload}
        onFilesSelected={onFilesSelected}
        onRemoveFile={onRemoveFile}
        // Pass the RHF handleSubmit wrapper
        onSubmit={methods.handleSubmit(onFormSubmit)}
        onCancel={onCancel}
        isSubmitting={loading || methods.formState.isSubmitting} // Check both
      />
    </FormProvider>
  );
};

export default IncidentFormPage;