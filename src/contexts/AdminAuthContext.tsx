import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export type AdminRole = "super_admin" | "business_admin" | "support";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
}

interface AdminAuthContextType {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (roles: AdminRole[]) => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const API_BASE = "https://core.nova-player.fr";

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth on mount
    const storedAuth = localStorage.getItem("admin_auth");
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        setUser(parsed.user);
        setToken(parsed.token);
      } catch {
        localStorage.removeItem("admin_auth");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // For now, using mock authentication until backend is connected
      // In production, this would call the API
      const mockUsers: Record<string, AdminUser & { password: string }> = {
        "admin@nova-player.fr": {
          id: "1",
          email: "admin@nova-player.fr",
          name: "Super Admin",
          role: "super_admin",
          password: "admin123"
        },
        "business@nova-player.fr": {
          id: "2",
          email: "business@nova-player.fr",
          name: "Business Admin",
          role: "business_admin",
          password: "business123"
        },
        "support@nova-player.fr": {
          id: "3",
          email: "support@nova-player.fr",
          name: "Support Agent",
          role: "support",
          password: "support123"
        }
      };

      const mockUser = mockUsers[email];
      if (mockUser && mockUser.password === password) {
        const { password: _, ...userWithoutPassword } = mockUser;
        const mockToken = `mock_jwt_${Date.now()}`;
        
        setUser(userWithoutPassword);
        setToken(mockToken);
        localStorage.setItem("admin_auth", JSON.stringify({ 
          user: userWithoutPassword, 
          token: mockToken 
        }));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("admin_auth");
  };

  const hasRole = (roles: AdminRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AdminAuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!user && !!token,
      isLoading,
      login,
      logout,
      hasRole
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}

// Protected route component
export function RequireAdminAuth({ 
  children, 
  allowedRoles 
}: { 
  children: ReactNode; 
  allowedRoles?: AdminRole[];
}) {
  const { isAuthenticated, isLoading, hasRole } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate("/admin/login");
      } else if (allowedRoles && !hasRole(allowedRoles)) {
        navigate("/admin");
      }
    }
  }, [isAuthenticated, isLoading, allowedRoles, hasRole, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    return null;
  }

  return <>{children}</>;
}
