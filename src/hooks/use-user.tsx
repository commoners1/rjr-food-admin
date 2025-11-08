"use client";
import * as React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthAPIs } from "@/lib/apis/auth/auth.apis";
import { User } from "@/types/user";

interface UserContextType {
  user: (User & { managerId?: string; password?: string }) | null;
  login: (data: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<
    (User & { managerId?: string; password?: string }) | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const logout = () => {
    try {
      AuthAPIs.logout();
      setUser(null);
      // Clear stored user data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('currentUserId');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
      router.push("/login");
    } catch (e) {
      console.error("Failed to logout", e);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      // Don't fetch user if we're on the login page
      if (pathname === '/login') {
        setIsLoading(false);
        return;
      }

      // If user is already set in context, don't refetch (prevents clearing after login)
      if (user) {
        setIsLoading(false);
        return;
      }

      // Check localStorage first - if we have a userId, try to get user from mock data
      if (typeof window !== 'undefined') {
        const storedUserId = localStorage.getItem('currentUserId');
        if (storedUserId) {
          try {
            // Import usersData dynamically to avoid circular dependency
            const { usersData } = await import('@/lib/mock-data');
            const storedUser = usersData.find((u) => u.id === storedUserId);
            if (storedUser) {
              const userData: User = {
                id: storedUser.id,
                name: storedUser.name,
                email: storedUser.email,
                role: storedUser.role,
                isActive: storedUser.isActive,
                division: storedUser.division,
                avatar: storedUser.avatar,
                managerId: storedUser.managerId,
              };
              setUser(userData);
              setIsLoading(false);
              return;
            }
          } catch (importError) {
            console.error('Error importing mock data:', importError);
            // Continue to API call as fallback
          }
        }
      }

      try {
        const res = await AuthAPIs.profile();
        // Handle both direct response and axios response structure
        const user = res?.data?.user || res?.user || res?.data || res;
        
        if (user && user.id) {
          const { id, name, email, role, isActive, division, avatar, managerId } = user;
          const userData: User = {
            id,
            name,
            email,
            role: typeof role === 'object' && role !== null 
              ? { id: role.id, name: role.name } 
              : { id: '1', name: 'Admin' },
            isActive: isActive ?? true,
            division: typeof division === 'object' && division !== null
              ? { id: division.id, name: division.name }
              : { id: '1', name: 'Management' },
            avatar: avatar || null,
            managerId,
          };
          setUser(userData);
        } else {
          // No user found, but don't redirect if already on login page
          if (pathname !== '/login') {
            setUser(null);
            if (typeof window !== 'undefined') {
              localStorage.removeItem('currentUserId');
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
            }
          }
        }
      } catch (e) {
        // Error fetching user, but don't redirect if already on login page
        // Only clear if we don't have a stored user ID
        if (pathname !== '/login') {
          if (typeof window !== 'undefined') {
            const storedUserId = localStorage.getItem('currentUserId');
            if (!storedUserId) {
              setUser(null);
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
            }
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    // Only redirect to login if not already there and user is not set
    // But don't redirect if we're in the process of logging in
    if (!isLoading && !user && pathname !== "/login" && pathname !== "/") {
      router.push("/login");
    }
  }, [user, isLoading, pathname, router]);

  const login = (data: User) => {
    setUser(data);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, isLoading }}>
      {isLoading ? null : children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
