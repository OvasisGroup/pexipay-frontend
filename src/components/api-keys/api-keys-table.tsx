"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Power, Shield } from "lucide-react";
import { useApiKey } from "@/hooks/useApiKey";
import { ApiKeyCreateModal } from "./api-key-create-modal";
import { IpWhitelistModal } from "./ip-whitelist-modal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";

export function ApiKeysTable() {
  const {
    apiKeys,
    isLoading,
    error,
    fetchApiKeys,
    deactivateApiKey,
    deleteApiKey,
  } = useApiKey();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isWhitelistModalOpen, setIsWhitelistModalOpen] = useState(false);
  const [selectedApiKey, setSelectedApiKey] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);

  useEffect(() => {
    fetchApiKeys();
  }, [fetchApiKeys]);

  const handleDelete = async () => {
    if (selectedApiKey) {
      await deleteApiKey(selectedApiKey);
      setIsDeleteDialogOpen(false);
      setSelectedApiKey(null);
    }
  };

  const handleDeactivate = async () => {
    if (selectedApiKey) {
      await deactivateApiKey(selectedApiKey);
      setIsDeactivateDialogOpen(false);
      setSelectedApiKey(null);
    }
  };

  return (
    <div className="space-y-4">
      <ApiKeyCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      {selectedApiKey && (
        <IpWhitelistModal
          apiKeyId={selectedApiKey}
          isOpen={isWhitelistModalOpen}
          onClose={() => {
            setIsWhitelistModalOpen(false);
            setSelectedApiKey(null);
          }}
        />
      )}

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the API
              key.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isDeactivateDialogOpen}
        onOpenChange={setIsDeactivateDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will deactivate the API key. All requests using this key will
              be rejected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeactivate}>
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex justify-end">
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create API Key
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Used</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-red-500">
                  {error}
                </TableCell>
              </TableRow>
            ) : apiKeys.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No API keys found.
                </TableCell>
              </TableRow>
            ) : (
              apiKeys.map((key, index: number) => (
                <TableRow key={key.id}>
                  <TableCell>{index + 1}.</TableCell>
                  <TableCell>{key.name}</TableCell>
                  <TableCell>
                    {format(new Date(key.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    {key.lastUsedAt
                      ? format(new Date(key.lastUsedAt), "MMM d, yyyy")
                      : "Never"}
                  </TableCell>
                  <TableCell>
                    {key.expiresAt
                      ? format(new Date(key.expiresAt), "MMM d, yyyy")
                      : "Never"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        key.isActive
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {key.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        className="flex items-center gap-2 text-muted-foreground border border-muted-foreground/20"
                        size="sm"
                        onClick={() => {
                          setSelectedApiKey(key.id);
                          setIsWhitelistModalOpen(true);
                        }}
                      >
                        <Shield className="h-4 w-4" />
                        <span>Whitelist IP</span>
                      </Button>
                      {key.isActive && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-2 text-muted-foreground bg-yellow-500 text-white border border-muted-foreground/20"
                          onClick={() => {
                            setSelectedApiKey(key.id);
                            setIsDeactivateDialogOpen(true);
                          }}
                        >
                          <Power className="h-4 w-4" />
                          <span>Deactivate</span>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2 text-muted-foreground bg-red-500 text-white border border-muted-foreground/20"
                        onClick={() => {
                          setSelectedApiKey(key.id);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
