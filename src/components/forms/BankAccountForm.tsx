import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BankAccount } from "@/types/models";

const bankAccountSchema = z.object({
  bankName: z.string().min(1, "Bank name is required"),
  accountName: z.string().min(1, "Account name is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  swiftCode: z.string().optional(),
});

type BankAccountFormValues = z.infer<typeof bankAccountSchema>;

interface BankAccountFormProps {
  initialData?: Partial<BankAccount> | null;
  onSubmit: (data: BankAccountFormValues) => Promise<void>;
  isLoading?: boolean;
  isEdit?: boolean;
}

export function BankAccountForm({
  initialData,
  onSubmit,
  isLoading = false,
  isEdit = false,
}: BankAccountFormProps) {
  const form = useForm<BankAccountFormValues>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: {
      bankName: initialData?.bankName || "",
      accountName: initialData?.accountName || "",
      accountNumber: initialData?.accountNumber || "",
      swiftCode: initialData?.swiftCode || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="bankName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{isEdit ? "Edit" : "Add"} Bank Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter bank name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accountName"
          render={({ field }) => (
            <FormItem>
              <FormLabel> {isEdit ? "Edit" : "Add"} Account Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter account holder name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accountNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel> {isEdit ? "Edit" : "Add"} Account Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter account number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="swiftCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {isEdit ? "Edit" : "Add"} SWIFT Code (Optional)
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter SWIFT code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Bank Account"}
        </Button>
      </form>
    </Form>
  );
}
