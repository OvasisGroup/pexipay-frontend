import * as React from "react";
import axios from "axios"; // Import axios
import { useRouter } from "next/navigation"; // Import useRouter

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { CountrySelect } from "@/components/CountrySelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Stepper, Step } from "@/components/ui/stepper";

// Extend the form schema for merchant onboarding
const merchantSchema = z.object({
  businessName: z
    .string()
    .min(2, { message: "Business name must be at least 2 characters." }),
  businessType: z.string().default("retail"),
  registrationNo: z
    .string()
    .min(1, { message: "Registration number is required" }),
  countryId: z.string().min(1, { message: "Country is required" }),
  supportEmail: z.string().email({ message: "Invalid support email" }),
  supportPhone: z.string().min(1, { message: "Support phone is required" }),
  webhookEndpoint: z
    .string()
    .url({ message: "Invalid webhook URL" })
    .optional()
    .or(z.literal("")),
});

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Enter a valid email address." }),
  password: z
    .string()
    .min(12, { message: "Password must be at least 12 characters long." })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    }),
  phoneNumber: z.string().optional().nullable(),
  merchant: merchantSchema,
});

type RegisterFormValues = z.infer<typeof formSchema>;

interface RegisterFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function RegisterForm({ className, ...props }: RegisterFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [step, setStep] = React.useState(0);
  const router = useRouter();

  const steps: Step[] = [
    { label: "User Info" },
    { label: "Merchant Info" },
    { label: "Review" },
  ];

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
      merchant: {
        businessName: "",
        businessType: "retail",
        registrationNo: "",
        countryId: "",
        supportEmail: "",
        supportPhone: "",
        webhookEndpoint: "",
      },
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    setIsLoading(true);
    try {
      const payload = { ...values };
      await axios.post("/api/auth/register", payload);
      router.push("/auth/login");
    } catch (error) {
      console.error("Registration failed:", error);
      // TODO: Handle registration error, e.g., display error message to user
    } finally {
      setIsLoading(false);
    }
  }

  function handleNext() {
    setStep((s) => Math.min(s + 1, 2));
  }
  function handleBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Stepper steps={steps} currentStep={step} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 mt-6"
        >
          {step === 0 && (
            <>
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+1 123 456 7890"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          {step === 1 && (
            <div className="grid gap-4 border rounded-md p-4 bg-muted/30">
              <FormField
                control={form.control}
                name="merchant.businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Business Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="merchant.businessType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="wholesale">Wholesale</SelectItem>
                        <SelectItem value="service">Service</SelectItem>
                        <SelectItem value="manufacturing">
                          Manufacturing
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="merchant.registrationNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Registration Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="merchant.countryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <CountrySelect
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select a country"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="merchant.supportEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Support Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="support@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="merchant.supportPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Support Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Support Phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-card p-4 rounded-md border">
                <h3 className="font-semibold mb-2">Review your details</h3>
                <div className="text-sm">
                  <div>
                    <b>Name:</b> {form.getValues("firstName")}{" "}
                    {form.getValues("lastName")}
                  </div>
                  <div>
                    <b>Email:</b> {form.getValues("email")}
                  </div>
                  <div>
                    <b>Phone:</b> {form.getValues("phoneNumber")}
                  </div>
                  <div className="mt-2 font-semibold">Merchant Info</div>
                  <div>
                    <b>Business Name:</b>{" "}
                    {form.getValues("merchant.businessName")}
                  </div>
                  <div>
                    <b>Type:</b> {form.getValues("merchant.businessType")}
                  </div>
                  <div>
                    <b>Reg No:</b> {form.getValues("merchant.registrationNo")}
                  </div>
                  <div>
                    <b>Country:</b>{" "}
                    {
                      // Assuming countries is available in the form context
                      // Replace with actual implementation
                      "Country Name"
                    }
                  </div>
                  <div>
                    <b>Support Email:</b>{" "}
                    {form.getValues("merchant.supportEmail")}
                  </div>
                  <div>
                    <b>Support Phone:</b>{" "}
                    {form.getValues("merchant.supportPhone")}
                  </div>
                  <div>
                    <b>Webhook:</b> {form.getValues("merchant.webhookEndpoint")}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-between mt-6">
            {step > 0 && (
              <Button type="button" variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
            {step < 2 && (
              <Button type="button" onClick={handleNext}>
                Next
              </Button>
            )}
            {step === 2 && (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Loading..." : "Sign Up"}
              </Button>
            )}
          </div>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        {/* <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div> */}
      </div>
      {/* Social login buttons can be added here if needed */}
    </div>
  );
}
