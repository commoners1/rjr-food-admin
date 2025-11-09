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
import { useUser } from "@/hooks/use-user";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { usersData } from "@/lib/mock-data";
import { User } from "@/types/user";
import { BarChart3, Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useUser();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Basic validation
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please enter both email and password.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const userToLogin = usersData.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (!userToLogin) {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
        });
        setIsLoading(false);
        return;
      }

      if (userToLogin.password !== password) {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid password. Please try again.",
        });
        setIsLoading(false);
        return;
      }

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
      }
      
      // Set user in context
      login(userData);
      
      // Delay to ensure state is fully updated
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Navigate to dashboard
      router.replace('/');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4 sm:p-6 lg:p-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md shadow-2xl border-0 bg-card/95 backdrop-blur-sm relative z-10">
        <CardHeader className="space-y-6 text-center px-6 pt-8 pb-6 sm:px-8 sm:pt-10 sm:pb-8">
          {/* Logo Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 mb-2">
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold font-headline tracking-tight">RJR Admin</h1>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">Rumah Jajan Rara</p>
            </div>
          </div>

          {/* Welcome Section */}
          <div className="space-y-2 pt-2">
            <CardTitle className="text-2xl sm:text-3xl font-headline font-bold tracking-tight">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-sm sm:text-base leading-relaxed">
              Enter your credentials to access your account
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-6 pb-6 sm:px-8 sm:pb-8">
          <form onSubmit={handleLogin} id="login-form" className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <Label 
                htmlFor="email" 
                className="text-sm font-medium text-foreground flex items-center gap-2"
              >
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@notch.erp"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={isLoading}
                className="h-11 text-base transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label 
                htmlFor="password" 
                className="text-sm font-medium text-foreground flex items-center gap-2"
              >
                <Lock className="h-4 w-4 text-muted-foreground" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                  className="h-11 text-base transition-all focus:ring-2 focus:ring-primary/20 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-sm p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="px-6 pb-8 sm:px-8 sm:pb-10 pt-0">
          <Button 
            className="w-full h-11 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200" 
            onClick={handleLogin}
            type="submit"
            form="login-form"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
