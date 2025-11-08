"use client";

export const dynamic = 'force-dynamic';

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import { useUser } from "@/hooks/use-user";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AuthAPIs } from "@/lib/apis/auth/auth.apis";
import { User } from "@/types/user";
import { loginSchema } from "@/lib/validation/auth_validation";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useUser();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const firstError = result.error.errors[0]?.message || "Invalid input";
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: firstError,
      });
      return;
    }

    try {
      const res = await AuthAPIs.login({ email, password });
      console.log('Login response:', res); // Debug log
      
      // Mock adapter returns: { data: { user: {...}, accessToken: ... } }
      // Response interceptor returns: { user: {...}, accessToken: ... }
      // So res should be { user: {...}, accessToken: ... }
      const user = res?.user;
      
      if (!user || !user.id) {
        console.error('Invalid user data. Response:', res);
        console.error('User object:', user);
        throw new Error('Invalid response structure: user data not found');
      }
      
      const { id, name, role, isActive, division, avatar } = user;
      
      // Store tokens
      if (res?.accessToken && typeof window !== 'undefined') {
        localStorage.setItem('accessToken', res.accessToken);
      }
      
      // Create user data matching User type
      const userData: User = {
        id,
        name,
        email: user.email || email,
        role: typeof role === 'object' && role !== null ? role : { id: '1', name: role?.name || role || 'Admin' },
        isActive: isActive ?? true,
        division: typeof division === 'object' && division !== null ? division : { id: '1', name: division?.name || division || 'Management' },
        avatar: avatar || null,
      };
      
      console.log('Setting user data:', userData);
      login(userData);
      
      toast({
        variant: "default",
        title: "Login Successful",
        description: "You have been logged in successfully.",
      });
      
      // Redirect to dashboard after successful login
      router.push("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description:
          error?.response?.data?.message ||
          "An error occurred during login. Please try again.",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleLogin();
                }
              }}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleLogin();
                }
              }}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleLogin();
            }}
            type="button"
          >
            Sign In
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
