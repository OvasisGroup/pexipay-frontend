"use client";

import { useMerchant } from "@/hooks/useMerchant";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import { Merchant } from "@/types/models";
import { useLoading } from "@/providers/LoadingProvider";
export default function MerchantList() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { setLoading } = useLoading();
  const {
    merchants,
    isLoading,
    fetchMerchants,
    currentPage,
    totalPages,
    nextPage,
    previousPage,
  } = useMerchant();

  useEffect(() => {
    fetchMerchants();
    setLoading(false);
  }, [fetchMerchants]);

  const filteredMerchants = merchants.filter((merchant) =>
    merchant.businessName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      accessorKey: "businessName",
      header: "Business Name",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "businessType",
      header: "Business Type",
    },
    {
      accessorKey: "registrationNo",
      header: "Registration No",
    },
    {
      accessorKey: "supportEmail",
      header: "Support Email",
    },
    {
      accessorKey: "supportPhone",
      header: "Support Phone",
    },
    {
      accessorKey: "commissionRate",
      header: "Commission Rate",
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }: { row: any }) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              router.push(`/dashboard/merchants/${row.original.id}`)
            }
          >
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-blue-500 text-white"
            onClick={() =>
              router.push(`/dashboard/merchants/${row.original.id}/edit`)
            }
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Merchant Management
        </h1>
        <p className="text-muted-foreground mt-2">
          View and manage all merchant accounts in one place
        </p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="relative w-[300px]">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search merchants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={() => router.push("/dashboard/merchants/create")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Merchant
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.accessorKey}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredMerchants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No merchants found.
                </TableCell>
              </TableRow>
            ) : (
              filteredMerchants.map((merchant) => (
                <TableRow key={merchant.id}>
                  {columns.map((column) => (
                    <TableCell key={`${merchant.id}-${column.accessorKey}`}>
                      {column.cell
                        ? column.cell({ row: { original: merchant } })
                        : String(
                            merchant[column.accessorKey as keyof Merchant]
                          )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={previousPage}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={nextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
