"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApiKey } from "@/hooks/useApiKey";
import { format, addMonths } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ApiKeyCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ApiKeyCreateModal({ isOpen, onClose }: ApiKeyCreateModalProps) {
  const { createApiKey, fetchApiKeys } = useApiKey();
  const [name, setName] = useState("");
  const [expiration, setExpiration] = useState("never");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const expiresAt =
        expiration === "never"
          ? undefined
          : format(addMonths(new Date(), parseInt(expiration)), "yyyy-MM-dd");

      const result = await createApiKey({
        name,
        expiresAt,
      });

      if (result.rawKey) {
        setGeneratedKey(result.rawKey);
      }
    } catch (error) {
      console.error("Failed to create API key:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!hasCopied && generatedKey) {
      toast({
        title: "Error",
        description: "Please copy the API key before closing",
        variant: "destructive",
      });
      return;
    }
    setName("");
    setExpiration("never");
    setGeneratedKey(null);
    setHasCopied(false);
    fetchApiKeys();
    onClose();
  };

  const copyToClipboard = async () => {
    if (generatedKey) {
      try {
        await navigator.clipboard.writeText(generatedKey);
        setHasCopied(true);
        toast({
          title: "Success",
          description: "API key copied to clipboard",
        });
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to copy API key",
        });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create API Key</DialogTitle>
        </DialogHeader>

        {generatedKey ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">
                Your API key has been generated:
              </p>
              <div className="relative">
                <div className="bg-muted p-6 rounded-lg border border-border">
                  <code className="text-sm break-all block mb-2">
                    {generatedKey}
                  </code>
                  <Button
                    className="w-full mt-2 gap-2 bg-primary/10 hover:bg-primary/20 text-primary"
                    variant="secondary"
                    onClick={copyToClipboard}
                  >
                    {hasCopied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy API Key
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-950/50 border border-yellow-200 dark:border-yellow-900 p-3 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                    clipRule="evenodd"
                  />
                </svg>
                Make sure to copy your API key now. You won't be able to see it
                again!
              </p>
            </div>
            <DialogFooter>
              <Button
                onClick={handleClose}
                disabled={!hasCopied}
                className="w-full"
              >
                Done
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                  placeholder="My API Key"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expiration" className="text-right">
                  Expires In
                </Label>
                <Select value={expiration} onValueChange={setExpiration}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select expiration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="1">1 Month</SelectItem>
                    <SelectItem value="3">3 Months</SelectItem>
                    <SelectItem value="6">6 Months</SelectItem>
                    <SelectItem value="12">12 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
