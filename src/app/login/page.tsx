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
import { usersData } from "@/lib/mock-data";
import { User } from "@/types/user";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useUser();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    console.log('Login attempt:', { email, passwordLength: password.length });

    // Basic validation
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please enter both email and password.",
      });
      return;
    }

    try {
      const userToLogin = usersData.find((u) => u.email.toLowerCase() === email.toLowerCase());
      console.log('User found:', userToLogin ? 'Yes' : 'No');

      if (!userToLogin) {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: `User not found. Available emails: ${usersData.map(u => u.email).join(', ')}`,
        });
        return;
      }

      if (userToLogin.password !== password) {
        console.log('Password mismatch:', { expected: userToLogin.password, received: password });
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid password. Please try again.",
        });
        return;
      }

      console.log('Login successful, setting user data');

      // Extract only User type properties (exclude password, jobPosition, birthDate)
      const userData: User = {
        id: userToLogin.id,
        name: userToLogin.name,
        email: userToLogin.email,
        role: userToLogin.role,
        isActive: userToLogin.isActive,
        division: userToLogin.division,
        avatar: userToLogin.avatar,
        managerId: userToLogin.managerId,
      };
      
      // Store user ID in localStorage for profile endpoint
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentUserId', userToLogin.id);
        localStorage.setItem('accessToken', 'mock-access-token');
        console.log('Stored in localStorage:', { userId: userToLogin.id });
      }
      
      // Set user in context
      login(userData);
      console.log('User set in context');
      
      // Longer delay to ensure state is fully updated and persisted
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Navigate to dashboard using replace to prevent back navigation to login
      console.log('Navigating to dashboard');
      router.replace('/');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
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
          <form onSubmit={handleLogin} id="login-form">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@notch.erp"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleLogin}
            type="submit"
            form="login-form"
          >
            Sign In
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
