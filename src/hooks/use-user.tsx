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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await AuthAPIs.profile();
        const user = res.data?.user || res.data || res;
        const { id, name, email, role, isActive, division, avatar } = user;
        const userData = {
          id,
          name,
          email,
          role: { id: role.id, name: role.name },
          isActive,
          division: { id: division.id, name: division.name },
          avatar,
        };
        setUser(userData as User);
      } catch (e) {
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

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

  const logout = () => {
    try {
      AuthAPIs.logout();
      setUser(null);
      router.push("/login");
    } catch (e) {
      console.error("Failed to logout", e);
    }
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
