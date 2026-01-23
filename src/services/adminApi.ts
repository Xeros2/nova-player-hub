const API_BASE = "https://core.nova-player.fr";

// Types
export interface Device {
  id: string;
  deviceId: string;
  pin?: string;
  status: "ACTIVE" | "EXPIRED" | "TRIAL" | "OPEN" | "LIFETIME";
  reseller: string | null;
  resellerId: string | null;
  licenseId: string | null;
  activationDate: string | null;
  expiryDate: string | null;
  trialDays: number;
  createdAt: string;
}

export interface License {
  id: string;
  licenseKey: string;
  type: "lifetime";
  status: "available" | "activated" | "revoked";
  origin: "direct_sale" | "reseller";
  deviceId: string | null;
  deviceCode: string | null;
  resellerId: string | null;
  resellerName: string | null;
  activatedAt: string | null;
  createdAt: string;
}

export interface Payment {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  source: "stripe" | "paypal" | "manual" | "reseller_credit";
  licenseId: string | null;
  licenseKey: string | null;
  resellerId: string | null;
  resellerName: string | null;
  createdAt: string;
}

export interface Reseller {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseStock: number;
  licenseQuota: number;
  totalActivations: number;
  status: "active" | "blocked";
  createdAt: string;
}

export interface ActivationHistoryItem {
  id: string;
  deviceId: string;
  action: "trial_started" | "activated" | "expired" | "license_linked" | "license_unlinked" | "status_changed";
  performedBy: string;
  performerType: "admin" | "reseller" | "system";
  details: string;
  createdAt: string;
}

export interface AdminStats {
  totalDevices: number;
  activeDevices: number;
  trialDevices: number;
  expiredDevices: number;
  lifetimeDevices: number;
  totalResellers: number;
  activeResellers: number;
  totalLicenses: number;
  availableLicenses: number;
  activatedLicenses: number;
  totalRevenue: number;
  monthlyRevenue: number;
  conversionRate: number;
}

// Helper to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const auth = localStorage.getItem("admin_auth");
  if (auth) {
    const { token } = JSON.parse(auth);
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
  }
  return { "Content-Type": "application/json" };
};

// API Methods
export const adminApi = {
  // ==========================================
  // AUTHENTICATION
  // ==========================================
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },

  // ==========================================
  // STATS
  // ==========================================
  getStats: async (): Promise<AdminStats> => {
    // Mock data for now
    return {
      totalDevices: 12458,
      activeDevices: 7890,
      trialDevices: 892,
      expiredDevices: 1876,
      lifetimeDevices: 4234,
      totalResellers: 156,
      activeResellers: 142,
      totalLicenses: 5000,
      availableLicenses: 766,
      activatedLicenses: 4234,
      totalRevenue: 125680,
      monthlyRevenue: 15420,
      conversionRate: 67.8
    };
  },

  // ==========================================
  // DEVICES
  // ==========================================
  getDevices: async (filters?: { status?: string; search?: string; page?: number; limit?: number }): Promise<{ devices: Device[]; total: number }> => {
    // Mock data
    const mockDevices: Device[] = [
      { id: "1", deviceId: "NP-2024-ABC123", status: "LIFETIME", reseller: "TechStore Paris", resellerId: "r1", licenseId: "lic1", activationDate: "2024-12-15", expiryDate: null, trialDays: 0, createdAt: "2024-12-01" },
      { id: "2", deviceId: "NP-2024-DEF456", status: "ACTIVE", reseller: "Digital Lyon", resellerId: "r2", licenseId: null, activationDate: "2024-12-18", expiryDate: "2025-12-18", trialDays: 0, createdAt: "2024-12-05" },
      { id: "3", deviceId: "NP-2024-GHI789", status: "TRIAL", reseller: null, resellerId: null, licenseId: null, activationDate: null, expiryDate: "2025-01-28", trialDays: 5, createdAt: "2024-12-28" },
      { id: "4", deviceId: "NP-2024-JKL012", status: "EXPIRED", reseller: "StreamPro", resellerId: "r3", licenseId: null, activationDate: "2024-11-20", expiryDate: "2024-12-20", trialDays: 0, createdAt: "2024-11-01" },
      { id: "5", deviceId: "NP-2024-MNO345", status: "OPEN", reseller: null, resellerId: null, licenseId: null, activationDate: null, expiryDate: null, trialDays: 0, createdAt: "2024-12-30" },
      { id: "6", deviceId: "NP-2024-PQR678", status: "LIFETIME", reseller: "MediaShop", resellerId: "r4", licenseId: "lic2", activationDate: "2024-11-10", expiryDate: null, trialDays: 0, createdAt: "2024-11-01" },
    ];
    return { devices: mockDevices, total: mockDevices.length };
  },

  searchDeviceByPin: async (pin: string): Promise<Device | null> => {
    // Mock implementation
    if (pin === "123456") {
      return { id: "1", deviceId: "NP-2024-ABC123", status: "LIFETIME", reseller: "TechStore Paris", resellerId: "r1", licenseId: "lic1", activationDate: "2024-12-15", expiryDate: null, trialDays: 0, createdAt: "2024-12-01" };
    }
    return null;
  },

  getDeviceHistory: async (deviceId: string): Promise<ActivationHistoryItem[]> => {
    // Mock data
    return [
      { id: "h1", deviceId, action: "license_linked", performedBy: "Admin", performerType: "admin", details: "License LIC-2024-XYZ linked", createdAt: "2024-12-15T14:30:00Z" },
      { id: "h2", deviceId, action: "activated", performedBy: "System", performerType: "system", details: "Device activated with lifetime license", createdAt: "2024-12-15T14:30:00Z" },
      { id: "h3", deviceId, action: "trial_started", performedBy: "TechStore Paris", performerType: "reseller", details: "30-day trial started", createdAt: "2024-12-01T10:00:00Z" },
    ];
  },

  linkLicense: async (deviceId: string, licenseId: string): Promise<boolean> => {
    // Mock implementation
    return true;
  },

  unlinkLicense: async (deviceId: string): Promise<boolean> => {
    // Mock implementation
    return true;
  },

  startDeviceTrial: async (deviceId: string): Promise<boolean> => {
    return true;
  },

  expireDevice: async (deviceId: string): Promise<boolean> => {
    return true;
  },

  activateDeviceLifetime: async (deviceId: string): Promise<boolean> => {
    return true;
  },

  // ==========================================
  // LICENSES
  // ==========================================
  getLicenses: async (filters?: { status?: string; origin?: string; page?: number; limit?: number }): Promise<{ licenses: License[]; total: number }> => {
    const mockLicenses: License[] = [
      { id: "lic1", licenseKey: "LIC-2024-ABC123", type: "lifetime", status: "activated", origin: "direct_sale", deviceId: "1", deviceCode: "NP-2024-ABC123", resellerId: null, resellerName: null, activatedAt: "2024-12-15", createdAt: "2024-12-01" },
      { id: "lic2", licenseKey: "LIC-2024-DEF456", type: "lifetime", status: "activated", origin: "reseller", deviceId: "6", deviceCode: "NP-2024-PQR678", resellerId: "r4", resellerName: "MediaShop", activatedAt: "2024-11-10", createdAt: "2024-11-01" },
      { id: "lic3", licenseKey: "LIC-2024-GHI789", type: "lifetime", status: "available", origin: "direct_sale", deviceId: null, deviceCode: null, resellerId: null, resellerName: null, activatedAt: null, createdAt: "2024-12-20" },
      { id: "lic4", licenseKey: "LIC-2024-JKL012", type: "lifetime", status: "available", origin: "reseller", deviceId: null, deviceCode: null, resellerId: "r1", resellerName: "TechStore Paris", activatedAt: null, createdAt: "2024-12-22" },
      { id: "lic5", licenseKey: "LIC-2024-MNO345", type: "lifetime", status: "revoked", origin: "direct_sale", deviceId: null, deviceCode: null, resellerId: null, resellerName: null, activatedAt: "2024-10-15", createdAt: "2024-10-01" },
    ];
    return { licenses: mockLicenses, total: mockLicenses.length };
  },

  createLicense: async (quantity: number = 1): Promise<License[]> => {
    const newLicenses: License[] = [];
    for (let i = 0; i < quantity; i++) {
      newLicenses.push({
        id: `new-lic-${Date.now()}-${i}`,
        licenseKey: `LIC-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        type: "lifetime",
        status: "available",
        origin: "direct_sale",
        deviceId: null,
        deviceCode: null,
        resellerId: null,
        resellerName: null,
        activatedAt: null,
        createdAt: new Date().toISOString()
      });
    }
    return newLicenses;
  },

  activateLicense: async (licenseId: string, deviceCode: string): Promise<boolean> => {
    return true;
  },

  revokeLicense: async (licenseId: string): Promise<boolean> => {
    return true;
  },

  assignLicenseToReseller: async (licenseId: string, resellerId: string): Promise<boolean> => {
    return true;
  },

  // ==========================================
  // PAYMENTS
  // ==========================================
  getPayments: async (filters?: { status?: string; source?: string; startDate?: string; endDate?: string; page?: number; limit?: number }): Promise<{ payments: Payment[]; total: number }> => {
    const mockPayments: Payment[] = [
      { id: "pay1", reference: "PAY-2024-001", amount: 79.99, currency: "EUR", status: "completed", source: "stripe", licenseId: "lic1", licenseKey: "LIC-2024-ABC123", resellerId: null, resellerName: null, createdAt: "2024-12-15T10:30:00Z" },
      { id: "pay2", reference: "PAY-2024-002", amount: 49.99, currency: "EUR", status: "completed", source: "paypal", licenseId: "lic2", licenseKey: "LIC-2024-DEF456", resellerId: null, resellerName: null, createdAt: "2024-12-14T15:45:00Z" },
      { id: "pay3", reference: "PAY-2024-003", amount: 299.99, currency: "EUR", status: "completed", source: "manual", licenseId: null, licenseKey: null, resellerId: "r1", resellerName: "TechStore Paris", createdAt: "2024-12-12T09:00:00Z" },
      { id: "pay4", reference: "PAY-2024-004", amount: 79.99, currency: "EUR", status: "pending", source: "stripe", licenseId: "lic3", licenseKey: "LIC-2024-GHI789", resellerId: null, resellerName: null, createdAt: "2024-12-16T11:20:00Z" },
      { id: "pay5", reference: "PAY-2024-005", amount: 79.99, currency: "EUR", status: "refunded", source: "stripe", licenseId: "lic5", licenseKey: "LIC-2024-MNO345", resellerId: null, resellerName: null, createdAt: "2024-10-15T14:00:00Z" },
    ];
    return { payments: mockPayments, total: mockPayments.length };
  },

  // ==========================================
  // RESELLERS
  // ==========================================
  getResellers: async (filters?: { status?: string; search?: string; page?: number; limit?: number }): Promise<{ resellers: Reseller[]; total: number }> => {
    const mockResellers: Reseller[] = [
      { id: "r1", name: "TechStore Paris", email: "contact@techstore.fr", phone: "+33 1 23 45 67 89", licenseStock: 45, licenseQuota: 100, totalActivations: 342, status: "active", createdAt: "2024-01-15" },
      { id: "r2", name: "Digital Lyon", email: "info@digital-lyon.fr", phone: "+33 4 78 12 34 56", licenseStock: 12, licenseQuota: 50, totalActivations: 198, status: "active", createdAt: "2024-02-20" },
      { id: "r3", name: "StreamPro Bordeaux", email: "contact@streampro.fr", phone: "+33 5 56 78 90 12", licenseStock: 0, licenseQuota: 30, totalActivations: 89, status: "blocked", createdAt: "2024-03-10" },
      { id: "r4", name: "MediaShop Marseille", email: "ventes@mediashop.fr", phone: "+33 4 91 22 33 44", licenseStock: 78, licenseQuota: 150, totalActivations: 456, status: "active", createdAt: "2024-01-05" },
    ];
    return { resellers: mockResellers, total: mockResellers.length };
  },

  createReseller: async (data: { name: string; email: string; phone: string; password: string; licenseQuota: number }): Promise<Reseller> => {
    return {
      id: `new-res-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      licenseStock: 0,
      licenseQuota: data.licenseQuota,
      totalActivations: 0,
      status: "active",
      createdAt: new Date().toISOString()
    };
  },

  assignLicensesToReseller: async (resellerId: string, quantity: number): Promise<boolean> => {
    return true;
  },

  toggleResellerStatus: async (resellerId: string): Promise<boolean> => {
    return true;
  },

  getResellerHistory: async (resellerId: string): Promise<ActivationHistoryItem[]> => {
    return [
      { id: "rh1", deviceId: "NP-2024-ABC123", action: "activated", performedBy: "TechStore Paris", performerType: "reseller", details: "Lifetime license activated", createdAt: "2024-12-15T14:30:00Z" },
      { id: "rh2", deviceId: "NP-2024-XYZ789", action: "trial_started", performedBy: "TechStore Paris", performerType: "reseller", details: "30-day trial started", createdAt: "2024-12-10T10:00:00Z" },
    ];
  }
};
