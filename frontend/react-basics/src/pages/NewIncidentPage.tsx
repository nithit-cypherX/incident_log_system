/* [File: src/pages/NewIncidentPage.tsx] */
import React, { useState, useEffect } from "react";
// 🌟 1. Import useParams to read the URL ID
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
// 🌟 2. Import the component
import IncidentAttachments from "../components/IncidentAttachments";
// 🌟 NEW: Add FaUpload icon
import { FaPaperclip, FaUserPlus, FaTrash, FaUpload } from "react-icons/fa";

// --- Define Types ---
type FormInputProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
};

type FormSelectProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  required?: boolean;
};

// --- Reusable components (No change) ---
const FormInput = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "any",
  required = false,
}: FormInputProps) => (
  <div>
    <label className="block text-sm font-medium text-primary-color mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-3 h-12 form-input rounded-md"
      required={required}
    />
  </div>
);

const FormSelect = ({
  label,
  name,
  value,
  onChange,
  children,
  required = false,
}: FormSelectProps) => (
  <div>
    <label className="block text-sm font-medium text-primary-color mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-3 h-12 form-input rounded-md "
      required={required}
    >
      {children}
    </select>
  </div>
);

// --- Helper function to get current date and time ---
const getCurrentDateTime = () => {
  const now = new Date();
  // Adjust for local timezone
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const date = now.toISOString().split("T")[0];
  const time = now.toTimeString().split(" ")[0].substring(0, 5); // "HH:MM"
  return { date, time };
};

// --- 🌟 NEW: Helper to format ISO string for form ---
const formatISOForInputs = (isoString: string) => {
   if (!isoString) return getCurrentDateTime();
   try {
     const d = new Date(isoString);
     // Adjust for local timezone
     d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
     const date = d.toISOString().split('T')[0];
     const time = d.toTimeString().split(' ')[0].substring(0, 5); // "HH:MM"
     return { date, time };
   } catch (e) {
     console.error("Error formatting date:", e);
     return getCurrentDateTime();
   }
}

// --- Data Types ---
type AvailableCrew = {
  id: number;
  full_name: string;
};

type SelectedCrewMember = {
  userId: number;
  userName: string;
  role: string;
};

// 🌟 3. Add the Attachment type (copied from IncidentDetailsPage)
type Attachment = {
  id: number;
  incident_id: number;
  user_id: number;
  original_file_name: string;
  file_name_on_disk: string;
  file_path_relative: string;
  mime_type: string;
  file_size_bytes: number;
  uploaded_at: string;
};

// --- Main Page Component ---
const NewIncidentPage = () => {
  const navigate = useNavigate();
  // 🌟 4. Get 'id' from URL. It will be 'undefined' if on /incident/new
  const { id: incidentId } = useParams<{ id: string }>();
  const isEditMode = Boolean(incidentId);

  const { date: defaultDate, time: defaultTime } = getCurrentDateTime();

  // State for the main form data
  const [formData, setFormData] = useState({
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
  });

  // State for crew management
  const [availableCrew, setAvailableCrew] = useState<AvailableCrew[]>([]);
  const [selectedCrew, setSelectedCrew] = useState<SelectedCrewMember[]>([]);
  const [crewSelection, setCrewSelection] = useState({ userId: "", role: "" });

  // 🌟 5. Add state for attachments
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  
  // 🌟🌟 NEW: State to hold files for upload in CREATE mode
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);

  // State for loading and errors
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🌟 6. Fetch available crew AND existing incident data (if in edit mode)
  useEffect(() => {
    // Fetch all available crew for the dropdown
    const fetchCrew = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/personnel", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch crew");
        }
        const data: AvailableCrew[] = await response.json();
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
        const res = await fetch(`http://localhost:3000/api/v1/incidents/${incidentId}`, {
          credentials: "include"
        });
        if (!res.ok) {
          throw new Error("Failed to fetch incident data");
        }
        const data = await res.json();
        
        // Format the date/time from the DB for our inputs
        const { date, time } = formatISOForInputs(data.reported_at);

        // Set the form data state
        setFormData({
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
        });
        
        // Set the selected crew state
        const assignedCrew = data.assigned_personnel.map((p: any) => ({
          userId: p.user_id,
          userName: p.user_name, // Use full name
          role: p.role_on_incident,
        }));
        setSelectedCrew(assignedCrew);
        
        // 🌟 7. NEW: Set the attachments state
        setAttachments(data.assigned_attachments || []);
        
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCrew();
    fetchIncidentData();
  }, [incidentId]); // Re-run if incidentId changes

  // Handle changes for all form inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle changes for the temporary crew selection dropdowns
  const handleCrewSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCrewSelection((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add a selected crew member to the list
  const handleAddCrew = () => {
    const { userId, role } = crewSelection;
    if (!userId || !role) {
      alert("Please select a crew member and a role.");
      return;
    }

    if (selectedCrew.find((c) => c.userId === parseInt(userId))) {
      alert("This crew member is already added.");
      return;
    }

    const user = availableCrew.find((u) => u.id === parseInt(userId));
    if (user) {
      setSelectedCrew((prev) => [
        ...prev,
        {
          userId: user.id,
          userName: user.full_name, // Use full name
          role: role,
        },
      ]);
      setCrewSelection({ userId: "", role: "" });
    }
  };

  // Remove a crew member from the list
  const handleRemoveCrew = (userId: number) => {
    setSelectedCrew((prev) => prev.filter((c) => c.userId !== userId));
  };
  
  // 🌟🌟 NEW: Handlers for file selection in CREATE mode
  const onFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Add new files to the list, avoiding duplicates
      const newFiles = Array.from(e.target.files);
      setFilesToUpload((prevFiles) => {
        const existingFileNames = prevFiles.map(f => f.name);
        const uniqueNewFiles = newFiles.filter(f => !existingFileNames.includes(f.name));
        return [...prevFiles, ...uniqueNewFiles];
      });
      // Clear the input value to allow selecting the same file again if removed
       e.target.value = "";
    }
  };

  const onRemoveFile = (fileName: string) => {
    setFilesToUpload((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
  };
  // 🌟🌟 END NEW HANDLERS

  // 🌟 8. Main submit handler decides to CREATE or UPDATE
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Combine date and time into the MySQL-friendly format
    const reported_at = `${formData.date} ${formData.time}:00`;

    // Format the crew data for the API
    const initial_crew = selectedCrew.map((c) => ({
      user_id: c.userId,
      role_on_incident: c.role,
    }));

    // This is the full data payload for both Create and Update
    const incidentData = {
      ...formData,
      reported_at,
      initial_crew,
      created_by_user_id: 1, // Placeholder
    };
    
    delete (incidentData as any).date;
    delete (incidentData as any).time;
    
    try {
      let response;
      let newOrExistingId = incidentId; // Start with existing ID if in edit mode
      
      if (isEditMode) {
        // --- UPDATE LOGIC (PUT) ---
        response = await fetch(`http://localhost:3000/api/v1/incidents/${incidentId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(incidentData),
        });
        
        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.error || "Failed to update incident");
        }

      } else {
        // --- CREATE LOGIC (POST) ---
        response = await fetch("http://localhost:3000/api/v1/incidents/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(incidentData),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to create incident");
        }
        
        newOrExistingId = result.incident_id; // Get the NEWLY created ID
        
        // 🌟🌟 NEW: UPLOAD FILES after creating
        if (filesToUpload.length > 0) {
          
          const uploadPromises = filesToUpload.map(file => {
            const formData = new FormData();
            formData.append("file", file);
            return fetch(`http://localhost:3000/api/v1/incidents/${newOrExistingId}/attachments`, {
              method: "POST",
              credentials: "include",
              body: formData,
            });
          });
          
          // Wait for all uploads to finish
          const uploadResults = await Promise.all(uploadPromises);

          // Check if any uploads failed
          const failedUploads = uploadResults.filter(res => !res.ok);
          if (failedUploads.length > 0) {
             // Don't stop the navigation, but warn the user in the console
             console.error(`${failedUploads.length} files failed to upload.`);
             // A "toast" notification would be better here, but this works
          }
        }
        // 🌟🌟 END NEW UPLOAD LOGIC
      }

      // On success, navigate to the details page
      navigate(`/incident/${newOrExistingId}`);


    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#212529] text-primary-color font-primary flex flex-col">
      <NavBar />

      <main className="flex-grow p-8 overflow-y-auto">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto bg-[#2C3034] p-6 rounded-lg shadow-lg"
        >
          {/* 🌟 9. Dynamic Title */}
          <h2 className="text-2xl font-bold mb-6">
            {isEditMode ? "Edit Incident" : "New Incident Log"}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-md text-red-200">
              <strong>Error:</strong> {error}
            </div>
          )}
          
          {/* Show loading overlay if fetching data for edit mode */}
          {loading && isEditMode && !error && (
             <div className="mb-4 p-3 bg-blue-900/50 border border-blue-500 rounded-md text-blue-200">
              Loading incident data...
            </div>
          )}

          {/* Basic Incident Details */}
          <section className="mb-8">
            <h3 className="text-lg font-semibold border-b border-[#495057] pb-2 mb-4">
              Basic Incident Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <FormInput
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Two-vehicle accident on Rama IX"
                  required
                />
              </div>

              <FormSelect
                label="Incident Type"
                name="incident_type"
                value={formData.incident_type}
                onChange={handleChange}
                required
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
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  type="date"
                  required
                />
                <FormInput
                  label="Time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  type="time"
                  required
                />
              </div>
              <FormSelect
                label="Priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
              >
                <option value="">Select Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </FormSelect>
              <FormSelect
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
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
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-3 form-input rounded-md "
                  rows={5}
                  placeholder="Enter a brief description of the incident..."
                ></textarea>
              </div>
            </div>
          </section>

          {/* Incident Location (No change) */}
          <section className="mb-8">
            <h3 className="text-lg font-semibold border-b border-[#495057] pb-2 mb-4">
              Incident Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-3">
                <FormInput
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter Address"
                  required
                />
              </div>
              <FormInput
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
              />
              <FormInput
                label="State / Province"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State / Province"
              />
              <FormInput
                label="ZIP / Postal code"
                name="zip_code"
                value={formData.zip_code}
                onChange={handleChange}
                placeholder="ZIP / Postal code"
              />
              <div className="md:col-span-3 h-64 bg-[#343A40] rounded-md flex flex-col items-center justify-center text-[#6C757D] border border-[#495057]">
                <span>Map Placeholder</span>
                <span className="text-sm mt-2">(Coordinates removed)</span>
              </div>
            </div>
          </section>

          {/* Initial Crew Assignment (No change in logic) */}
          <section className="mb-8">
            <h3 className="text-lg font-semibold border-b border-[#495057] pb-2 mb-4">
              {isEditMode ? "Update Crew Assignment" : "Initial Crew Assignment"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <FormSelect
                label="Select Crew Member"
                name="userId"
                value={crewSelection.userId}
                onChange={handleCrewSelectionChange}
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
                name="role"
                value={crewSelection.role}
                onChange={handleCrewSelectionChange}
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
              {selectedCrew.length === 0 ? (
                <p className="text-secondary-color text-sm">No crew assigned yet.</p>
              ) : (
                selectedCrew.map(c => (
                  <div key={c.userId} className="flex items-center justify-between p-3 bg-[#343A40] rounded-md">
                    <div>
                      <span className="font-semibold text-white">{c.userName}</span>
                      <span className="ml-2 text-sm text-secondary-color">({c.role})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCrew(c.userId)}
                      className="text-red-500 hover:text-red-400"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* 🌟 10. UPDATED ATTACHMENTS SECTION */}
          <section className="mb-8">
            <h3 className="text-lg font-semibold border-b border-[#495057] pb-2 mb-4">
              Attachments
            </h3>

            {isEditMode ? (
              // --- EDIT MODE ---
              // Show the full-featured component
              <IncidentAttachments
                incidentId={parseInt(incidentId!)} // We know it's safe!
                initialAttachments={attachments}
                isReadOnly={false} // Allow upload and delete
              />
            ) : (
              // 🌟🌟 UPDATED: CREATE MODE 🌟🌟
              // Show a simple file selector
              <div>
                {/* The hidden file input */}
                <input
                  type="file"
                  id="file-upload"
                  multiple // Allow selecting multiple files
                  onChange={onFilesSelected}
                  className="hidden"
                />
                {/* The "Upload" button */}
                <label
                  htmlFor="file-upload"
                  className="btn-main-gray py-2 px-4 rounded-md text-sm cursor-pointer inline-flex items-center"
                >
                  <FaUpload className="mr-2" />
                  Select Files to Upload...
                </label>
                
                {/* List of selected files */}
                <div className="mt-4 space-y-2">
                  {filesToUpload.length === 0 ? (
                    <p className="text-sm text-[#ADB5BD]">No files selected.</p>
                  ) : (
                    filesToUpload.map(file => (
                      <div key={file.name} className="flex items-center justify-between p-2 bg-[#343A40] rounded-md">
                        <div className="flex items-center gap-2">
                           <FaPaperclip className="text-secondary-color"/>
                           <span className="text-sm text-[#F8F9FA]">{file.name}</span>
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
              // 🌟🌟 END UPDATED CREATE MODE 🌟🌟
            )}
          </section>

          {/* 🌟 11. Dynamic Action Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => isEditMode ? navigate(`/incident/${incidentId}`) : navigate("/incident-dashboard")}
              className="btn-main-gray py-2 px-6 rounded-md"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-main-red py-2 px-6 rounded-md"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : isEditMode
                ? "Update Incident"
                : "Save & Activate Incident"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default NewIncidentPage;