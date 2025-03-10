import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BankAccountForm } from "@/components/forms/BankAccountForm";
import { BankAccount } from "@/types/models";

interface BankAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    swiftCode?: string;
  }) => Promise<void>;
  initialData?: Partial<BankAccount> | null;
  isLoading?: boolean;
  isEdit?: boolean;
}

export function BankAccountModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
  isEdit = false,
}: BankAccountModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Bank Account" : "Add Bank Account"}
          </DialogTitle>
        </DialogHeader>
        <BankAccountForm
          initialData={initialData}
          onSubmit={onSubmit}
          isLoading={isLoading}
          isEdit={isEdit}
        />
      </DialogContent>
    </Dialog>
  );
}
