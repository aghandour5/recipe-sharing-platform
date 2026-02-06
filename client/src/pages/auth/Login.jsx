import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useLocation } from "wouter";
import { ChefHat, ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (credentials) => {
      const res = await apiRequest("POST", "/api/auth/login", credentials);
      return await res.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      setLocation("/");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Invalid credentials",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    <div className="auth-layout">
      {/* Left: Form */}
      <div className="auth-form-side">
        <div className="auth-form-container space-y-8 animate-in slide-in-from-left-5 duration-500">
          <div className="space-y-2 text-center lg:text-left">
            <Link href="/" className="auth-back-link">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>
            <h1 className="auth-title font-heading">Welcome back</h1>
            <p className="text-muted-foreground">Enter your credentials to access your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="chef@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm font-normal">Remember me for 30 days</Label>
            </div>
            <Button className="w-full h-11 text-base" type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Sign In
            </Button>

            <div className="auth-divider">
              <div className="auth-divider-line">
                <span className="w-full border-t" />
              </div>
              <div className="auth-divider-text">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button variant="outline" type="button" className="w-full h-11" onClick={() => alert("Social login not implemented in mockup")}>
              Google
            </Button>
          </form>

          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* Right: Image */}
      <div className="auth-image-side">
        <img
          src="/images/recipe-thumb_4.jpg"
          alt="Cooking"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="auth-image-overlay" />
        <div className="auth-quote-container">
          <ChefHat className="h-10 w-10 mb-4 text-white/90" />
          <blockquote className="auth-quote">
            "Cooking is like love. It should be entered into with abandon or not at all."
          </blockquote>
          <cite className="not-italic text-white/80">— Julia Child</cite>
        </div>
      </div>
    </div>
  );
}