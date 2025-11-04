// File: src/features/incident/components/IncidentForm.tsx
/**
 * What it does:
 * Renders the "dumb" form for creating or editing an incident.
 *
 * How it works:
 * - It's a "dumb" component that receives all logic and
 * state as props.
 * - It receives all React Hook Form (RHF) methods
 * ('register', 'control', 'formState', etc.).
 * - It uses RHF's 'useFieldArray' to manage the 'selectedCrew' list.
 * - It uses RHF's 'watch' to get the current value of 'userId' and 'role'.
 *
 * How it connects:
 * - 'IncidentFormPage.tsx' renders this and provides all props.
 */

import {
  useFormContext,
  useFieldArray,
  // 🌟 FIX: Controller is no longer needed here
} from "react-hook-form";
import {
  FaPaperclip,
  FaUserPlus,
  FaTrash,
  FaUpload,
} from "react-icons/fa";
import type { AvailableCrew, Attachment } from "../../../types/common.types";
import type { IncidentFormData } from "../types/incident.types";
import FormInput from "../../../components/ui/FormInput";
import FormSelect from "../../../components/ui/FormSelect";
import MapDisplay from "../../../components/ui/MapDisplay";
import IncidentAttachments from "./IncidentAttachments";

// Props this dumb form needs
type IncidentFormProps = {
  isEditMode: boolean;
  incidentId?: number; // 🌟 FIX: Changed type to number
  initialAttachments: Attachment[]; // 🌟 FIX: Added prop
  availableCrew: AvailableCrew[];
  // File upload state (for 'create' mode)
  filesToUpload: File[];
  onFilesSelected: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (fileName: string) => void;
  // Submit/Cancel handlers
  onSubmit: (e: React.FormEvent) => void; // This is 'handleSubmit(onFormSubmit)'
  onCancel: () => void;
  isSubmitting: boolean;
};

const IncidentForm = ({
  isEditMode,
  incidentId, // 🌟 FIX: Destructure the new props
  initialAttachments, // 🌟 FIX: Destructure the new props
  availableCrew,
  filesToUpload,
  onFilesSelected,
  onRemoveFile,
  onSubmit,
  onCancel,
  isSubmitting,
}: IncidentFormProps) => {
  // Get RHF methods from the context provided by 'IncidentFormPage'
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<IncidentFormData>();

  // RHF hook for managing the 'selectedCrew' array
  const { fields, append, remove } = useFieldArray({
    control,
    name: "selectedCrew",
  });

  // Watch the values of the temporary crew selection dropdowns
  const currentCrewId = watch("temp_crewId" as any);
  const currentCrewRole = watch("temp_role" as any);

  // Add a selected crew member to the list
  const handleAddCrew = () => {
    if (!currentCrewId || !currentCrewRole) {
      alert("Please select a crew member and a role.");
      return;
    }
    const userId = parseInt(currentCrewId, 10);
    if (fields.find((c) => c.userId === userId)) {
      alert("This crew member is already added.");
      return;
    }

    const user = availableCrew.find((u) => u.id === userId);
    if (user) {
      append({
        userId: user.id,
        userName: user.full_name,
        role: currentCrewRole,
      });
      // Reset dropdowns
      setValue("temp_crewId" as any, "");
      setValue("temp_role" as any, "");
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-4xl mx-auto bg-[#2C3034] p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-6">
        {isEditMode ? "Edit Incident" : "New Incident Log"}
      </h2>

      {/* Basic Incident Details */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold border-b border-[#495057] pb-2 mb-4">
          Basic Incident Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <FormInput
              label="Title"
              placeholder="e.g., Two-vehicle accident on Rama IX"
              required
              {...register("title")}
              error={errors.title?.message}
            />
          </div>

          <FormSelect
            label="Incident Type"
            required
            {...register("incident_type")}
            error={errors.incident_type?.message}
          >
            <option value="">Select Incident Type</option>
            <option value="fire">Fire</option>
            <option value="ems">EMS</option>
            <option value="rescue">Rescue</option>
            <option value="hazmat">HAZMAT</option>
            <option value="public_assist">Public Assist</option>
            <option value="other">Other</option>
          </FormSelect>
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Date"
              type="date"
              required
              {...register("date")}
              error={errors.date?.message}
            />
            <FormInput
              label="Time"
              type="time"
              required
              {...register("time")}
              error={errors.time?.message}
            />
          </div>
          <FormSelect
            label="Priority"
            required
            {...register("priority")}
            error={errors.priority?.message}
          >
            <option value="">Select Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </FormSelect>
          <FormSelect
            label="Status"
            {...register("status")}
            error={errors.status?.message}
          >
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="closed">Closed</option>
          </FormSelect>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-primary-color mb-2">
              Brief Description
            </label>
            <textarea
              {...register("description")}
              className="w-full p-3 form-input rounded-md "
              rows={5}
              placeholder="Enter a brief description of the incident..."
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Incident Location */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold border-b border-[#495057] pb-2 mb-4">
          Incident Location
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-3">
            <FormInput
              label="Address"
              placeholder="Enter Address"
              required
              {...register("address")}
              error={errors.address?.message}
            />
          </div>
          <FormInput
            label="City"
            placeholder="City"
            {...register("city")}
            error={errors.city?.message}
          />
          <FormInput
            label="State / Province"
            placeholder="State / Province"
            {...register("state")}
            error={errors.state?.message}
          />
          <FormInput
            label="ZIP / Postal code"
            placeholder="ZIP / Postal code"
            {...register("zip_code")}
            error={errors.zip_code?.message}
          />
          <div className="md:col-span-3">
            <MapDisplay />
          </div>
        </div>
      </section>

      {/* Initial Crew Assignment */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold border-b border-[#495057] pb-2 mb-4">
          {isEditMode ? "Update Crew Assignment" : "Initial Crew Assignment"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <FormSelect
            label="Select Crew Member"
            {...register("temp_crewId" as any)} // Not part of schema
          >
            <option value="">Select Crew...</option>
            {availableCrew.map((user) => (
              <option key={user.id} value={user.id}>
                {user.full_name}
              </option>
            ))}
          </FormSelect>

          <FormSelect
            label="Assign Role"
            {...register("temp_role" as any)} // Not part of schema
          >
            <option value="">Select Role...</option>
            <option value="Firefighter">Firefighter</option>
            <option value="Captain">Captain</option>
            <option value="Driver">Driver</option>
            <option value="Scene Commander">Scene Commander</option>
          </FormSelect>

          <button
            type="button"
            onClick={handleAddCrew}
            className="btn-main-gray py-2 px-4 h-12 rounded-md justify-center"
          >
            <FaUserPlus className="mr-2" /> Add Crew
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {fields.length === 0 ? (
            <p className="text-secondary-color text-sm">No crew assigned yet.</p>
          ) : (
            fields.map((c, index) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-3 bg-[#343A40] rounded-md"
              >
                <div>
                  <span className="font-semibold text-white">{c.userName}</span>
                  <span className="ml-2 text-sm text-secondary-color">
                    ({c.role})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:text-red-400"
                >
                  <FaTrash />
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Attachments Section */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold border-b border-[#495057] pb-2 mb-4">
          Attachments
        </h3>

        {/* 🌟 --- FIX: Replaced Controller with direct render --- 🌟 */}
        {isEditMode ? (
          // In Edit Mode, we show the full attachment component
          <IncidentAttachments
            // We can safely use '!' because isEditMode is true
            incidentId={incidentId!} 
            initialAttachments={initialAttachments} // Use the new prop
            isReadOnly={false} // Allow upload and delete
          />
        ) : (
          // In Create Mode, show the simple file selector
          <div>
            <input
              type="file"
              id="file-upload"
              multiple
              onChange={onFilesSelected}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="btn-main-gray py-2 px-4 rounded-md text-sm cursor-pointer inline-flex items-center"
            >
              <FaUpload className="mr-2" />
              Select Files to Upload...
            </label>

            <div className="mt-4 space-y-2">
              {filesToUpload.length === 0 ? (
                <p className="text-sm text-[#ADB5BD]">No files selected.</p>
              ) : (
                filesToUpload.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between p-2 bg-[#343A40] rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      <FaPaperclip className="text-secondary-color" />
                      <span className="text-sm text-[#F8F9FA]">
                        {file.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveFile(file.name)}
                      className="text-red-500 hover:text-red-400"
                      title="Remove file"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        {/* 🌟 --- END OF FIX --- 🌟 */}
      </section>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-8">
        <button
          type="button"
          onClick={onCancel}
          className="btn-main-gray py-2 px-6 rounded-md"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-main-red py-2 px-6 rounded-md"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Saving..."
            : isEditMode
            ? "Update Incident"
            : "Save & Activate Incident"}
        </button>
      </div>
    </form>
  );
};

export default IncidentForm;