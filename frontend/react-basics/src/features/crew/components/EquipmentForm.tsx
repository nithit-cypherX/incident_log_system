// File: src/features/crew/components/EquipmentForm.tsx
/**
 * What it does:
 * A "dumb" form for creating or editing equipment.
 *
 * How it works:
 * - Follows the RHF + Zod pattern (Guide Part 4).
 * - Receives 'onSubmit', 'onCancel', 'defaultValues'.
 * - 'useEffect' (with 'reset') populates the form
 * when 'defaultValues' change (for editing).
 *
 * How it connects:
 * - 'CrewManagementPage.tsx' will render this inside a Modal.
 */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  equipmentSchema,
  type EquipmentFormData,
} from "../types/crew.types";
import FormInput from "../../../components/ui/FormInput";
import FormSelect from "../../../components/ui/FormSelect";
import { useEffect } from "react";

type EquipmentFormProps = {
  onSubmit: (data: EquipmentFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  defaultValues: EquipmentFormData;
};

const EquipmentForm = ({
  onSubmit,
  onCancel,
  isSubmitting,
  defaultValues,
}: EquipmentFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: defaultValues,
  });

  // Populate form when defaultValues change
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Row 1: Asset ID & Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Asset ID"
          required
          {...register("asset_id")}
          error={errors.asset_id?.message}
        />
        <FormSelect label="Type" required {...register("type")}>
          <option value="Engine">Engine</option>
          <option value="Ladder">Ladder</option>
          <option value="Ambulance">Ambulance</option>
          <option value="Specialty_Vehicle">Specialty Vehicle</option>
          <option value="Tool">Tool</option>
        </FormSelect>
      </div>

      {/* Row 2: Status & Maintenance Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormSelect label="Status" required {...register("status")}>
          <option value="Available">Available</option>
          <option value="In_Use">In Use</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Out_of_Service">Out of Service</option>
        </FormSelect>
        <FormInput
          label="Last Maintenance Date"
          type="date"
          {...register("last_maintenance_date")}
        />
      </div>

      {/* Row 3: Action Buttons */}
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

export default EquipmentForm;