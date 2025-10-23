import React from 'react';
import Header from '../components/Header';
import {FaMapMarkerAlt, FaPaperclip, FaMicrophone } from 'react-icons/fa';

// Define the shape of props for FormInput
type FormInputProps = {
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
};

// Define the shape of props for FormSelect
type FormSelectProps = {
  label: string;
  children: React.ReactNode; // This is the type for child elements like <option>
  required?: boolean;
};

// A reusable styled input component for consistency
const FormInput = ({ label, type = 'text', placeholder = 'any', required = false }: FormInputProps ) => (  
  <div>
    <label className="block text-sm font-medium text-[#F8F9FA] mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full p-3 h-12 bg-[#343A40] rounded-md border border-[#495057] focus:outline-none focus:ring-1 focus:ring-[#DC3545]"
    />
  </div>
);

// A reusable styled select component
const FormSelect = ({ label, children, required = false }: FormSelectProps) => (
  <div>
    <label className="block text-sm font-medium text-[#F8F9FA] mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select className="w-full p-3 h-12 bg-[#343A40] rounded-md border border-[#495057] focus:outline-none focus:ring-1 focus:ring-[#DC3545]">
      {children}
    </select>
  </div>
);


const NewIncidentPage = () => {
  return (
    <div className="min-h-screen bg-[#212529] text-[#F8F9FA] font-sans flex flex-col">
      <Header title="Fire Incident Log" showCancel={true} />
      
      <main className="flex-grow p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto bg-[#2C3034] p-6 rounded-lg shadow-lg">
          
          <h2 className="text-2xl font-bold mb-6">New Incident Log</h2>

          {/* Basic Incident Details */}
          <section className="mb-8">
            <h3 className="text-lg font-semibold border-b border-[#495057] pb-2 mb-4">Basic Incident Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormSelect label="Incident Type" required>
                <option>Select Incident Type</option>
                <option>Fire</option>
                <option>EMS</option>
                <option>Rescue</option>
                <option>HAZMAT</option>
              </FormSelect>
              <div className="grid grid-cols-2 gap-4">
                <FormInput label="Date" type="date" required />
                <FormInput label="Time" type="time" required />
              </div>
              <FormSelect label="Priority" required>
                <option>Select Priority</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </FormSelect>
              <FormSelect label="Status">
                <option>Active</option>
                <option>Pending</option>
                <option>Closed</option>
              </FormSelect>
              <div className="md:col-span-2">
                 <label className="block text-sm font-medium text-[#F8F9FA] mb-2">Brief Description</label>
                 <textarea 
                    className="w-full p-3 bg-[#343A40] rounded-md border border-[#495057] focus:outline-none focus:ring-1 focus:ring-[#DC3545]"
                    rows={5}
                    placeholder="Enter a brief description of the incident..."
                 ></textarea>
              </div>
            </div>
          </section>

          {/* Incident Location */}
          <section className="mb-8">
             <h3 className="text-lg font-semibold border-b border-[#495057] pb-2 mb-4">Incident Location</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3">
                    <FormInput label="Address" placeholder="Enter Address" />
                </div>
                <FormInput label="City" placeholder="City" />
                <FormInput label="State / Province" placeholder="State / Province" />
                <FormInput label="ZIP / Postal code" placeholder="ZIP / Postal code" />
                <div className="md:col-span-3 h-64 bg-[#343A40] rounded-md flex items-center justify-center text-[#6C757D] border border-[#495057]">
                    Map Placeholder
                </div>
                <button className="md:col-span-3 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors flex items-center justify-center">
                    <FaMapMarkerAlt className="mr-2" /> Use Current Location
                </button>
             </div>
          </section>

          {/* Initial Crew Assignment */}
          <section className="mb-8">
            <h3 className="text-lg font-semibold border-b border-[#495057] pb-2 mb-4">Initial Crew Assignment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormSelect label="Select Crews">
                    <option>Engine 1</option>
                    <option>Ladder 2</option>
                    <option>Battalion Chief</option>
                 </FormSelect>
                 <FormSelect label="Assign Roles">
                    <option>Select Roles</option>
                    <option>Select Roles</option>
                    <option>Select Roles</option>
                 </FormSelect>
            </div>
          </section>

          {/* Attachments */}
          <section className="mb-8">
            <h3 className="text-lg font-semibold border-b border-[#495057] pb-2 mb-4">Attachments</h3>
            <div className="p-6 border-2 border-dashed border-[#495057] rounded-md text-center text-[#6C757D]">
                <FaPaperclip className="mx-auto text-3xl mb-2" />
                <p>Drag and drop photos or videos here</p>
                <p className="text-sm">or <span className="text-[#0D6EFD] font-semibold">browse files</span></p>
            </div>
            <button className="mt-4 w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors flex items-center justify-center">
                <FaMicrophone className="mr-2" /> Record Voice Note
            </button>
          </section>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <button className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-md transition-colors">Save as Draft</button>
            <button className="bg-[#DC3545] hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md transition-colors">Save & Activate Incident</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewIncidentPage;