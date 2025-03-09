"use client";

import { useState, useEffect } from "react";
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
import { Trash2 } from "lucide-react";
import { format } from "date-fns";

interface IpWhitelistModalProps {
  apiKeyId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface WhitelistedIp {
  id: string;
  ipAddress: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export function IpWhitelistModal({
  apiKeyId,
  isOpen,
  onClose,
}: IpWhitelistModalProps) {
  const { getWhitelistedIps, addIpToWhitelist, removeIpFromWhitelist } =
    useApiKey();
  const [ipAddress, setIpAddress] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [whitelistedIps, setWhitelistedIps] = useState<WhitelistedIp[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadWhitelistedIps();
    }
  }, [isOpen]);

  const loadWhitelistedIps = async () => {
    try {
      setIsLoading(true);
      const ips = await getWhitelistedIps(apiKeyId);
      setWhitelistedIps(ips);
    } catch (error) {
      console.error("Failed to load whitelisted IPs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await addIpToWhitelist(apiKeyId, ipAddress, description);
      await loadWhitelistedIps();
      setIpAddress("");
      setDescription("");
    } catch (error) {
      console.error("Failed to add IP to whitelist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveIp = async (whitelistId: string) => {
    try {
      setIsLoading(true);
      await removeIpFromWhitelist(apiKeyId, whitelistId);
      await loadWhitelistedIps();
    } catch (error) {
      console.error("Failed to remove IP from whitelist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>IP Whitelist</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ipAddress" className="text-right">
                IP Address
              </Label>
              <Input
                id="ipAddress"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                className="col-span-3"
                placeholder="192.168.1.1"
                pattern="^(\d{1,3}\.){3}\d{1,3}$"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                placeholder="Office IP"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add IP"}
              </Button>
            </div>
          </form>

          <div className="border rounded-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Added
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : whitelistedIps.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center">
                      No IPs whitelisted.
                    </td>
                  </tr>
                ) : (
                  whitelistedIps.map((ip) => (
                    <tr key={ip.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {ip.ipAddress}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {ip.description || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {format(new Date(ip.createdAt), "MMM d, yyyy")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveIp(ip.id)}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
