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

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const calculateStrength = (pass) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const mutation = useMutation({
    mutationFn: async (credentials) => {
      const res = await apiRequest("POST", "/api/auth/register", credentials);
      return await res.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast({
        title: "Account created!",
        description: "Welcome to the community.",
      });
      setLocation("/");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "Could not create account",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ username, email, password });
  };

  return (
    <div className="auth-layout">
      {/* Right: Image (Swapped for variety) */}
      <div className="auth-image-side" style={{ order: 2 }}>
        <img
          src="/images/recipe-thumb_1.jpg"
          alt="Baking"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="auth-image-overlay" />
        <div className="auth-quote-container">
          <ChefHat className="h-10 w-10 mb-4 text-white/90" />
          <blockquote className="auth-quote">
            "Join our community of 50,000+ passionate home cooks and share your journey."
          </blockquote>
        </div>
      </div>

      {/* Left: Form */}
      <div className="auth-form-side" style={{ order: 1 }}>
        <div className="auth-form-container space-y-8 animate-in slide-in-from-right-5 duration-500">
          <div className="space-y-2 text-center lg:text-left">
            <Link href="/" className="auth-back-link">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>
            <h1 className="auth-title font-heading">Create an account</h1>
            <p className="text-muted-foreground">Start sharing your recipes with the world.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="chef_master"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordStrength(calculateStrength(e.target.value));
                }}
                required
              />
              <div className="flex gap-2 mt-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < passwordStrength
                      ? (passwordStrength <= 2 ? "bg-red-500" : passwordStrength === 3 ? "bg-yellow-500" : "bg-green-500")
                      : "bg-muted"
                      }`}
                  ></div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Password strength: {
                  ["Very Weak", "Weak", "Fair", "Good", "Strong"][passwordStrength]
                }
              </p>
            </div>

            <div className="flex items-start space-x-2 pt-2">
              <Checkbox id="terms" className="mt-1" />
              <Label htmlFor="terms" className="text-sm font-normal leading-tight">
                I agree to the <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
              </Label>
            </div>

            <Button className="w-full h-11 text-base" type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Create Account
            </Button>
          </form>

          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}