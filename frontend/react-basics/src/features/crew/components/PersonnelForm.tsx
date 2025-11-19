// File: src/features/crew/components/PersonnelForm.tsx
/**
 * What it does:
 * A "dumb" form for creating or editing personnel.
 *
 * How it works:
 * - Follows the RHF + Zod pattern (Guide Part 4).
 * - Receives 'onSubmit', 'onCancel', 'defaultValues',
 * and 'isEditMode' as props.
 * - 'useEffect' (with 'reset') populates the form
 * when 'defaultValues' change (for editing).
 * - Conditionally shows the Password field for 'create' mode only.
 *
 * How it connects:
 * - 'CrewManagementPage.tsx' will render this inside a Modal.
 */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  personnelSchema,
  type PersonnelFormData,
} from "../types/crew.types";
import FormInput from "../../../components/ui/FormInput";
import FormSelect from "../../../components/ui/FormSelect";
import { useEffect } from "react";

type PersonnelFormProps = {
  onSubmit: (data: PersonnelFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  isEditMode: boolean;
  defaultValues: PersonnelFormData;
};

const PersonnelForm = ({
  onSubmit,
  onCancel,
  isSubmitting,
  isEditMode,
  defaultValues,
}: PersonnelFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PersonnelFormData>({
    resolver: zodResolver(personnelSchema),
    defaultValues: defaultValues,
  });

  // Populate form when defaultValues (the user to edit) are loaded
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Row 1: Name & Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Full Name"
          required
          {...register("full_name")}
          error={errors.full_name?.message}
        />
        <FormInput
          label="Email"
          type="email"
          required
          {...register("email")}
          error={errors.email?.message}
        />
      </div>

      {/* Row 2: Role & Ranks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormSelect label="Role" required {...register("role")}>
          <option value="Firefighter">Firefighter</option>
          <option value="Captain">Captain</option>
          <option value="Admin">Admin</option>
        </FormSelect>
        <FormInput label="Ranks" {...register("ranks")} />
      </div>

      {/* Row 3: Statuses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormSelect
          label="Availability Status"
          required
          {...register("availability_status")}
        >
          <option value="Available">Available</option>
          <option value="On_Duty">On Duty</option>
          <option value="Off_Duty">Off Duty</option>
          <option value="Assigned_to_Incident">Assigned to Incident</option>
        </FormSelect>
        <FormSelect label="System Status" required {...register("status")}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </FormSelect>
      </div>

      {/* Row 4: Password (Create Mode Only) */}
      {!isEditMode && (
        <FormInput
          label="Password"
          type="password"
          required
          {...register("password_hash", {
            required: "Password is required for new users",
          })}
          error={errors.password_hash?.message}
        />
      )}

      {/* Row 5: Action Buttons */}
      <div className="flex justify-end gap-4 pt-4 border-t border-[#495057]">
        <button
          type="button"
          onClick={onCancel}
          className="btn-main-gray py-2 px-6 rounded-md"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-main-red py-2 px-6 rounded-md"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default PersonnelForm;