"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Play,
  Square,
  RefreshCw,
  LogOut,
  Activity,
  Eye,
  EyeOff,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  type VMAction,
  type VMActionRequest,
  type VMStatusResponse,
} from "@/types/vm";

export default function VMDashboard() {
  const [vmId, setVmId] = useState("");
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [fetchingStatus, setFetchingStatus] = useState(false);
  const [showToken, setShowToken] = useState(false);

  useEffect(() => {
    const savedVmId = localStorage.getItem("vmId");
    if (savedVmId) {
      setVmId(savedVmId);
    }
    const savedToken = localStorage.getItem("bearerToken");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const handleVmIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newId = e.target.value;
    setVmId(newId);
    localStorage.setItem("vmId", newId);
  };

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newToken = e.target.value;
    setToken(newToken);
    localStorage.setItem("bearerToken", newToken);
  };

  const fetchStatus = useCallback(async () => {
    if (!vmId || !token) return;

    setFetchingStatus(true);
    try {
      const response = await fetch(
        `https://compute.excloud.in/compute/${vmId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = (await response.json()) as VMStatusResponse;
        // Handle potential different response structures
        const newStatus = data.status ?? data.data?.status ?? "Unknown";
        setStatus(newStatus);
      } else {
        setStatus("Error");
      }
    } catch {
      setStatus("Offline");
    } finally {
      setFetchingStatus(false);
    }
  }, [vmId, token]);

  // Fetch status on load if we have credentials
  useEffect(() => {
    if (vmId && token) {
      void fetchStatus();
    }
  }, [vmId, token, fetchStatus]);

  const performAction = async (action: VMAction) => {
    if (!vmId) {
      toast.error("Please enter a VM ID");
      return;
    }

    if (!token) {
      toast.error("Please enter your Bearer Token");
      return;
    }

    setLoading(action);
    try {
      // Using direct fetch. Note: Real production apps might need API keys or proxy through server to avoid CORS
      const body: VMActionRequest = { vm_id: parseInt(vmId) || vmId };
      const response = await fetch(
        `https://compute.excloud.in/compute/${action}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        },
      );

      if (response.ok) {
        toast.success(`VM ${action}ed successfully`);
        // Refresh status after a short delay to allow transition
        setTimeout(() => void fetchStatus(), 2000);
      } else {
        const errorData = (await response.json().catch(() => ({}))) as {
          message?: string;
        };
        toast.error(errorData.message ?? `Failed to ${action} VM`);
      }
    } catch {
      toast.error(`Error connecting to compute service`);
    } finally {
      setLoading(null);
    }
  };

  const logout = async () => {
    // Call the logout API to clear the httpOnly cookie
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <div>
            <CardTitle className="text-2xl font-bold text-blue-600">
              Virtual Machine runner
            </CardTitle>
            <CardDescription>Manage your VM instances securely</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={logout} title="Logout">
            <LogOut className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between rounded-lg border bg-blue-50/50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">VM Status</p>
                <div className="flex items-center gap-2">
                  {status ? (
                    <Badge
                      variant={
                        status.toLowerCase() === "running" ||
                        status.toLowerCase() === "active"
                          ? "default"
                          : status.toLowerCase() === "stopped" ||
                              status.toLowerCase() === "off"
                            ? "destructive"
                            : "outline"
                      }
                      className={
                        status.toLowerCase() === "running" ||
                        status.toLowerCase() === "active"
                          ? "bg-emerald-500 hover:bg-emerald-500"
                          : status.toLowerCase() === "stopped" ||
                              status.toLowerCase() === "off"
                            ? "bg-rose-500 hover:bg-rose-500"
                            : ""
                      }
                    >
                      {status.toUpperCase()}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      Enter credentials to see status
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void fetchStatus()}
              disabled={fetchingStatus || !vmId || !token}
              className="gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${fetchingStatus ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="vmId">VM ID</Label>
              <Input
                id="vmId"
                placeholder="vm-123456"
                value={vmId}
                onChange={handleVmIdChange}
                className="py-6 text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="token">Bearer Token</Label>
              <div className="relative">
                <Input
                  id="token"
                  type={showToken ? "text" : "password"}
                  placeholder="Enter your token"
                  value={token}
                  onChange={handleTokenChange}
                  className="py-6 pr-12 text-lg"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-0 right-0 h-full w-12 hover:bg-transparent"
                  onClick={() => setShowToken(!showToken)}
                >
                  {showToken ? (
                    <EyeOff className="text-muted-foreground h-5 w-5" />
                  ) : (
                    <Eye className="text-muted-foreground h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground text-xs">
            Your credentials are saved automatically in your browser.
          </p>

          <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-3">
            <Button
              size="lg"
              className="h-24 gap-2 bg-emerald-500 text-lg text-white hover:bg-emerald-600"
              onClick={() => performAction("start")}
              disabled={loading !== null}
            >
              <Play className="h-6 w-6 fill-current" />
              {loading === "start" ? "Starting..." : "Start"}
            </Button>
            <Button
              size="lg"
              className="h-24 gap-2 bg-rose-500 text-lg text-white hover:bg-rose-600"
              onClick={() => performAction("stop")}
              disabled={loading !== null}
            >
              <Square className="h-6 w-6 fill-current" />
              {loading === "stop" ? "Stopping..." : "Stop"}
            </Button>
            <Button
              size="lg"
              className="h-24 gap-2 bg-slate-900 text-lg text-white hover:bg-slate-800"
              onClick={() => performAction("restart")}
              disabled={loading !== null}
            >
              <RefreshCw
                className={`h-6 w-6 ${loading === "restart" ? "animate-spin" : ""}`}
              />
              {loading === "restart" ? "Restarting..." : "Restart"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
