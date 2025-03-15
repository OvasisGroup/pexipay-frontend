import { endPoints } from "@/lib/endpoints";
import { useState, useCallback } from "react";
import axios from "@/lib/axios";
import { toast } from "@/components/ui/use-toast";
import { Document } from "@/types/models";
import { useLoading } from "@/providers/LoadingProvider";

interface DocumentResponse {
  items: Document[];
  total: number;
}

interface DocumentCreateResponse {
  data: Document;
}

interface DocumentType {
  type: string;
  label: string;
}

export const DOCUMENT_TYPES: DocumentType[] = [
  { type: "ID_CARD", label: "ID Card" },
  { type: "PASSPORT", label: "Passport" },
  { type: "BUSINESS_LICENSE", label: "Business License" },
  { type: "BANK_STATEMENT", label: "Bank Statement" },
  { type: "UTILITY_BILL", label: "Utility Bill" },
  { type: "OTHER", label: "Other" },
];

export function useMerchantDocument() {
  const [documents, setDocuments] = useState<DocumentResponse | null>(null);
  const { isLoading, setLoading } = useLoading();
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async (merchantId: string) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get<DocumentResponse>(
        `${endPoints.documents.get(merchantId)}`
      );
      setDocuments(data);
      return data;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to fetch documents";
      toast({
        title: "Error fetching documents",
        description: message,
        variant: "destructive",
      });
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadDocument = async (
    merchantId: string,
    formData: FormData
  ): Promise<Document> => {
    try {
      setLoading(true);
      const { data } = await axios.post<DocumentCreateResponse>(
        endPoints.documents.create(merchantId),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast({
        title: "Document uploaded successfully",
        description: "The document has been uploaded successfully",
      });
      await fetchDocuments(merchantId);
      return data.data;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to upload document";
      toast({
        title: "Error uploading document",
        description: message,
        variant: "destructive",
      });
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const getDocumentTypes = async (merchantId: string) => {
    try {
      const { data } = await axios.get(endPoints.documents.types(merchantId));
      return data;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to fetch document types";
      toast({
        title: "Error fetching document types",
        description: message,
        variant: "destructive",
      });
      throw new Error(message);
    }
  };

  return {
    documents: documents?.items ?? [],
    total: documents?.total ?? 0,
    isLoading,
    error,
    fetchDocuments,
    uploadDocument,
    getDocumentTypes,
    documentTypes: DOCUMENT_TYPES,
  };
}
