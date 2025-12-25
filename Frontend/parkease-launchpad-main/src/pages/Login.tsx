import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Missing fields", description: "Please enter email and password." });
      return;
    }
    setLoading(true);
    try {
      const data = await authAPI.login(email, password);
      const role = data?.token ? JSON.parse(atob(data.token.split(".")[1]))?.role : undefined;
      toast({ title: "Welcome back!", description: "Login successful." });
      if (isAdmin) {
        if (role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          toast({ title: "Not an admin", description: "Your account is not admin. Redirecting to dashboard." });
          navigate("/dashboard", { replace: true });
        }
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err: any) {
      toast({ title: "Login failed", description: err.message || "Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md border border-border rounded-xl p-6 md:p-8 shadow-[var(--shadow-smooth)] bg-card">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-foreground">Login</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to continue to PARKEASE</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <div className="mt-3 flex items-center gap-2">
          <input id="isAdmin" type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />
          <Label htmlFor="isAdmin">Login as admin</Label>
        </div>
        <p className="text-sm text-muted-foreground mt-6 text-center">
          Don’t have an account?{" "}
          <Link to="/register" className="text-primary underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
