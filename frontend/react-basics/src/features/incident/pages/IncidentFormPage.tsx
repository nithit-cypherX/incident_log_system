// File: src/features/incident/pages/IncidentFormPage.tsx
/**
 * 🌟 --- UPDATED --- 🌟
 * - Added 'availableEquipment' state.
 * - 'useEffect' now also fetches 'incidentService.getAvailableEquipment'.
 * - In 'edit' mode, it now populates the form with 'assigned_equipment'.
 * - 'onFormSubmit' now includes 'initial_equipment' in the API payload.
 * - Passes 'availableEquipment' as a prop to <IncidentForm>.
 */

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { incidentService } from "../services/incidentService";
import { incidentSchema } from "../validators/incidentSchema";
import type { IncidentFormData } from "../types/incident.types";
// 🌟 Import new type
import type {
  AvailableCrew,
  Attachment,
  AvailableEquipment, // 🌟 Added
} from "../../../types/common.types";
import {
  getCurrentDateTime,
  formatISOForInputs,
} from "../../../lib/utils";
import IncidentForm from "../components/IncidentForm";
import { useDebounce } from "../../../hooks/useDebounce";
import { geocodingService, } from "../../../services/geocodingService";
import type {Coordinates} from "../../../services/geocodingService";

const IncidentFormPage = () => {
  const navigate = useNavigate();
  const { id: incidentId } = useParams<{ id: string }>(); // This is a string or undefined
  const isEditMode = Boolean(incidentId);

  // --- State ---
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableCrew, setAvailableCrew] = useState<AvailableCrew[]>([]);
  // 🌟 --- NEW STATE --- 🌟
  const [availableEquipment, setAvailableEquipment] = useState<
    AvailableEquipment[]
  >([]);
  // 🌟 --- END NEW STATE --- 🌟
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [initialAttachments, setInitialAttachments] = useState<Attachment[]>([]);
  const [mapCoords, setMapCoords] = useState<Coordinates | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

  // --- React Hook Form ---
  const { date: defaultDate, time: defaultTime } = getCurrentDateTime();

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
      selectedEquipment: [], // 🌟 Added
      reported_at: "",
      initial_crew: [],
      initial_equipment: [], // 🌟 Added
      latitude: null,
      longitude: null,
    },
  });

  // --- Address Debouncing (no changes) ---
  const watchedAddress = methods.watch("address");
  const watchedCity = methods.watch("city");
  const watchedState = methods.watch("state");
  const debouncedAddress = useDebounce(
    `${watchedAddress} ${watchedCity} ${watchedState}`,
    1000 // Wait 1 second after user stops typing
  );

  // 2. Fetch data
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

    // 🌟 --- NEW: Fetch all available equipment --- 🌟
    const fetchEquipment = async () => {
      try {
        const data = await incidentService.getAvailableEquipment();
        // Filter out any equipment that is 'In_Use' or 'Maintenance', etc.
        const available = data.filter(e => e.status === 'Available');
        setAvailableEquipment(available);
      } catch (err: any) {
        setError(err.message);
      }
    };
    // 🌟 --- END NEW --- 🌟

    // Fetch existing incident data if we are in EDIT mode
    const fetchIncidentData = async () => {
      if (!incidentId) return;

      setLoading(true);
      try {
        const data = await incidentService.getIncidentById(incidentId);
        const { date, time } = formatISOForInputs(data.reported_at);

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
          // Populate crew
          selectedCrew: data.assigned_personnel.map((p: any) => ({
            userId: p.user_id,
            userName: p.user_name,
            role: p.role_on_incident,
          })),
          // 🌟 --- NEW: Populate equipment --- 🌟
          selectedEquipment: data.assigned_equipment.map((e: any) => ({
            equipmentId: e.equipment_id,
            assetId: e.asset_id,
          })),
          // 🌟 --- END NEW --- 🌟
          reported_at: data.reported_at,
          initial_crew: [],
          initial_equipment: [], // 🌟 Added
          latitude: data.latitude,
          longitude: data.longitude,
        };

        // 3. Populate the form with fetched data
        methods.reset(formData);

        setInitialAttachments(data.assigned_attachments || []);

        if (data.latitude && data.longitude) {
          setMapCoords({ lat: data.latitude, lon: data.longitude });
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCrew();
    fetchEquipment(); // 🌟 Call new function
    fetchIncidentData();
  }, [incidentId, methods]);

  // --- Geocoding effect (no changes) ---
  useEffect(() => {
    // Only run if the debounced address is not empty
    if (debouncedAddress && debouncedAddress.trim().length > 5) {
      const fetchCoords = async () => {
        setGeoError(null); // Clear old errors
        try {
          // Use our new service!
          const coords = await geocodingService.getCoordsFromAddress(
            debouncedAddress
          );
          setMapCoords(coords);
          // Set the coordinates in the form data
          methods.setValue("latitude", coords.lat);
          methods.setValue("longitude", coords.lon);
        } catch (err: any) {
          setGeoError(err.message); // Show error on the map
          setMapCoords(null); // Clear old coords
        }
      };
      fetchCoords();
    }
  }, [debouncedAddress, methods]);
  
  // --- File Handlers (no changes) ---
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

  // --- Cancel Handler (no changes) ---
  const onCancel = () => {
    isEditMode
      ? navigate(`/incident/${incidentId}`)
      : navigate("/incident-dashboard");
  };

  // 4. Main "Smart" Submit Function
  const onFormSubmit = async (formData: IncidentFormData) => {
    setLoading(true);
    setError(null);

    // Format data for the API
    const apiPayload = {
      ...formData,
      reported_at: `${formData.date} ${formData.time}:00`,
      // Format crew
      initial_crew: formData.selectedCrew.map((c) => ({
        user_id: c.userId,
        role_on_incident: c.role,
      })),
      // 🌟 --- NEW: Format equipment --- 🌟
      // We just need an array of the equipment IDs
      initial_equipment: formData.selectedEquipment.map((e) => e.equipmentId),
      // 🌟 --- END NEW --- 🌟
      created_by_user_id: 1, // Placeholder
      latitude: mapCoords?.lat,
      longitude: mapCoords?.lon,
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
    } catch (err: any)
      {
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
        incidentId={incidentId ? Number(incidentId) : undefined}
        initialAttachments={initialAttachments}
        availableCrew={availableCrew}
        availableEquipment={availableEquipment} // 🌟 Pass new prop
        filesToUpload={filesToUpload}
        onFilesSelected={onFilesSelected}
        onRemoveFile={onRemoveFile}
        onSubmit={methods.handleSubmit(onFormSubmit)}
        onCancel={onCancel}
        isSubmitting={loading || methods.formState.isSubmitting}
        mapCoords={mapCoords}
        mapGeoError={geoError}
      />
    </FormProvider>
  );
};

export default IncidentFormPage;