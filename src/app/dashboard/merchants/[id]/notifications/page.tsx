"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/providers/LoadingProvider";
import axios from "@/lib/axios";
import { endPoints } from "@/lib/endpoints";
import { toast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, Download } from "lucide-react";
import { Notification, NotificationStatus } from "@/types/models";

interface ApiResponse {
  data: Notification[];
}

export default function NotificationsPage({
  params,
}: {
  params: { id: string };
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { setLoading } = useLoading();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ApiResponse>(
          `${endPoints.merchants.get}/${params.id}/transactions`
        );
        setNotifications(response.data.data);
      } catch (error: any) {
        toast({
          title: "Error fetching transactions",
          description:
            error?.response?.data?.message || "Could not fetch transactions",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [params.id]);

  const filteredNotifications = notifications.filter((notification) =>
    notification.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <h1 className="text-3xl font-bold">Notifications</h1>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notification History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by reference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No notifications found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotifications.map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell>{notification.title}</TableCell>
                    <TableCell>{notification.message}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          notification.status === NotificationStatus.READ
                            ? "bg-green-100 text-green-800"
                            : notification.status === NotificationStatus.UNREAD
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {notification.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
