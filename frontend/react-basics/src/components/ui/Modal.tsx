// File: src/components/ui/Modal.tsx
/**
 * What it does:
 * A reusable "dumb" modal component.
 *
 * How it works:
 * - Shows a dark overlay and a content box.
 * - Uses 'React.ReactNode' to render any children inside it.
 * - 'onClose' prop allows the parent to close it.
 *
 * How it connects:
 * - 'CrewManagementPage.tsx' will use this to wrap
 * the 'PersonnelForm' and 'EquipmentForm'.
 */
import { FaTimes } from "react-icons/fa";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    // 1. Full-screen overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      {/* 2. Modal content box */}
      <div className="bg-[#2C3034] w-full max-w-2xl rounded-lg shadow-lg mx-4">
        {/* 3. Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#495057]">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-secondary-color hover:text-white"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* 4. Modal Body (where the form will go) */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;