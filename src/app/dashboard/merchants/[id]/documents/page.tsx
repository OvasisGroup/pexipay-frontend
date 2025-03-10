"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/providers/LoadingProvider";
import axios from "@/lib/axios";
import { endPoints } from "@/lib/endpoints";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, Upload, FileText, Download } from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  status: string;
  uploadedAt: string;
  category: string;
  url: string;
}

interface ApiResponse {
  data: Document[];
}

export default function DocumentsPage({ params }: { params: { id: string } }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { setLoading } = useLoading();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ApiResponse>(
          `${endPoints.merchants.get}/${params.id}/documents`
        );
        setDocuments(response.data.data);
      } catch (error: any) {
        toast({
          title: "Error fetching documents",
          description:
            error?.response?.data?.message || "Could not fetch documents",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [params.id]);

  const filteredDocuments = documents.filter((document) =>
    document.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-4 w-full mb-4" />
            <Skeleton className="h-4 w-[80%]" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Documents</h1>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {filteredDocuments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No documents found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map((document) => (
                <Card key={document.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <h3 className="font-medium">{document.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(document.size)}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          document.status === "verified"
                            ? "bg-green-100 text-green-800"
                            : document.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {document.status}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(document.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
