import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi, Device, License, Payment, Reseller, AdminStats, ActivationHistoryItem } from "@/services/adminApi";
import { toast } from "sonner";

// ==========================================
// STATS
// ==========================================
export function useAdminStats() {
  return useQuery<AdminStats>({
    queryKey: ["admin", "stats"],
    queryFn: adminApi.getStats,
    staleTime: 30000, // 30 seconds
  });
}

// ==========================================
// DEVICES
// ==========================================
export function useDevices(filters?: { status?: string; search?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["admin", "devices", filters],
    queryFn: () => adminApi.getDevices(filters),
  });
}

export function useDeviceHistory(deviceId: string) {
  return useQuery<ActivationHistoryItem[]>({
    queryKey: ["admin", "device-history", deviceId],
    queryFn: () => adminApi.getDeviceHistory(deviceId),
    enabled: !!deviceId,
  });
}

export function useSearchDeviceByPin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (pin: string) => adminApi.searchDeviceByPin(pin),
    onSuccess: (data) => {
      if (data) {
        toast.success("Device found!");
      } else {
        toast.error("No device found with this PIN");
      }
    },
    onError: () => {
      toast.error("Error searching for device");
    }
  });
}

export function useLinkLicense() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ deviceId, licenseId }: { deviceId: string; licenseId: string }) => 
      adminApi.linkLicense(deviceId, licenseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "devices"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "licenses"] });
      toast.success("License linked successfully!");
    },
    onError: () => {
      toast.error("Failed to link license");
    }
  });
}

export function useUnlinkLicense() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (deviceId: string) => adminApi.unlinkLicense(deviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "devices"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "licenses"] });
      toast.success("License unlinked successfully!");
    },
    onError: () => {
      toast.error("Failed to unlink license");
    }
  });
}

export function useStartDeviceTrial() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (deviceId: string) => adminApi.startDeviceTrial(deviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "devices"] });
      toast.success("Trial started!");
    },
    onError: () => {
      toast.error("Failed to start trial");
    }
  });
}

export function useExpireDevice() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (deviceId: string) => adminApi.expireDevice(deviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "devices"] });
      toast.success("Device expired!");
    },
    onError: () => {
      toast.error("Failed to expire device");
    }
  });
}

// ==========================================
// LICENSES
// ==========================================
export function useLicenses(filters?: { status?: string; origin?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["admin", "licenses", filters],
    queryFn: () => adminApi.getLicenses(filters),
  });
}

export function useCreateLicenses() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (quantity: number) => adminApi.createLicense(quantity),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "licenses"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      toast.success(`${data.length} license(s) created!`);
    },
    onError: () => {
      toast.error("Failed to create licenses");
    }
  });
}

export function useActivateLicense() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ licenseId, deviceCode }: { licenseId: string; deviceCode: string }) => 
      adminApi.activateLicense(licenseId, deviceCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "licenses"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "devices"] });
      toast.success("License activated on device!");
    },
    onError: () => {
      toast.error("Failed to activate license");
    }
  });
}

export function useRevokeLicense() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (licenseId: string) => adminApi.revokeLicense(licenseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "licenses"] });
      toast.success("License revoked!");
    },
    onError: () => {
      toast.error("Failed to revoke license");
    }
  });
}

// ==========================================
// PAYMENTS
// ==========================================
export function usePayments(filters?: { status?: string; source?: string; startDate?: string; endDate?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["admin", "payments", filters],
    queryFn: () => adminApi.getPayments(filters),
  });
}

// ==========================================
// RESELLERS
// ==========================================
export function useResellers(filters?: { status?: string; search?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["admin", "resellers", filters],
    queryFn: () => adminApi.getResellers(filters),
  });
}

export function useCreateReseller() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { name: string; email: string; phone: string; password: string; licenseQuota: number }) => 
      adminApi.createReseller(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "resellers"] });
      toast.success("Reseller created!");
    },
    onError: () => {
      toast.error("Failed to create reseller");
    }
  });
}

export function useAssignLicensesToReseller() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ resellerId, quantity }: { resellerId: string; quantity: number }) => 
      adminApi.assignLicensesToReseller(resellerId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "resellers"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "licenses"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      toast.success("Licenses assigned!");
    },
    onError: () => {
      toast.error("Failed to assign licenses");
    }
  });
}

export function useToggleResellerStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (resellerId: string) => adminApi.toggleResellerStatus(resellerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "resellers"] });
      toast.success("Reseller status updated!");
    },
    onError: () => {
      toast.error("Failed to update reseller status");
    }
  });
}

export function useResellerHistory(resellerId: string) {
  return useQuery<ActivationHistoryItem[]>({
    queryKey: ["admin", "reseller-history", resellerId],
    queryFn: () => adminApi.getResellerHistory(resellerId),
    enabled: !!resellerId,
  });
}
