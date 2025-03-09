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
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Search, Pencil } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CurrencyEditModal } from "./currency-edit-modal";

export function CurrenciesTable() {
  const { toast } = useToast();
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const {
    currencies,
    isLoading,
    search,
    totalPages,
    currentPage,
    fetchCurrencies,
    nextPage,
    previousPage,
    goToPage,
    updateSearch,
    updateCurrency,
  } = useCurrency();

  useEffect(() => {
    fetchCurrencies();
  }, [fetchCurrencies]);

  const renderPaginationItems = () => {
    const items = [];
    const DOTS = "...";
    const siblingCount = 1;
    const totalNumbers = siblingCount + 5;

    if (totalPages <= totalNumbers) {
      return [...Array(totalPages)].map((_, i) => (
        <PaginationItem key={i + 1}>
          <PaginationLink
            onClick={() => goToPage(i + 1)}
            isActive={currentPage === i + 1}
          >
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      ));
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = [...Array(leftItemCount)].map((_, i) => i + 1);

      return [
        ...leftRange.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => goToPage(page)}
              isActive={currentPage === page}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        )),
        <PaginationItem key="dots-1">
          <PaginationEllipsis />
        </PaginationItem>,
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => goToPage(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      ];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = [...Array(rightItemCount)].map(
        (_, i) => totalPages - rightItemCount + i + 1
      );

      return [
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => goToPage(1)}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>,
        <PaginationItem key="dots-1">
          <PaginationEllipsis />
        </PaginationItem>,
        ...rightRange.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => goToPage(page)}
              isActive={currentPage === page}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        )),
      ];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = [
        ...Array(rightSiblingIndex - leftSiblingIndex + 1),
      ].map((_, i) => leftSiblingIndex + i);

      return [
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => goToPage(1)}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>,
        <PaginationItem key="dots-1">
          <PaginationEllipsis />
        </PaginationItem>,
        ...middleRange.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => goToPage(page)}
              isActive={currentPage === page}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        )),
        <PaginationItem key="dots-2">
          <PaginationEllipsis />
        </PaginationItem>,
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => goToPage(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      ];
    }
  };

  const handleEditClick = (currency: any) => {
    setSelectedCurrency(currency);
    setIsEditModalOpen(true);
  };

  const handleUpdateCurrency = async (updatedCurrency: any) => {
    try {
      await updateCurrency(updatedCurrency);
      await fetchCurrencies();
      toast({
        variant: "success",
        title: "Success",
        description: "Currency updated successfully",
        duration: 3000,
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to update currency",
        duration: 3000,
      });
    }
  };

  return (
    <div className="space-y-4">
      <CurrencyEditModal
        currency={selectedCurrency}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={handleUpdateCurrency}
      />
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search currencies..."
            value={search}
            onChange={(e) => updateSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : currencies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No currencies found.
                </TableCell>
              </TableRow>
            ) : (
              currencies.map((currency, index: number) => (
                <TableRow key={currency.id}>
                  <TableCell>{index + 1}.</TableCell>
                  <TableCell>{currency.name}</TableCell>
                  <TableCell>{currency.code}</TableCell>
                  <TableCell>{currency.symbol}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        currency.isActive
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {currency.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(currency)}
                      className="flex items-center gap-2"
                    >
                      <Pencil className="h-4 w-4" />
                      <span>Edit</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={currentPage === 1 ? undefined : previousPage}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
            {renderPaginationItems()}
            <PaginationItem>
              <PaginationNext
                onClick={currentPage === totalPages ? undefined : nextPage}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
