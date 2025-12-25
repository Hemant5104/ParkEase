import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { authAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    vehicleNumber: "",
    vehicleType: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  const setField = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.vehicleNumber || !form.vehicleType || !form.phone) {
      toast({ title: "Missing fields", description: "Please fill all required fields." });
      return;
    }
    setLoading(true);
    try {
      await authAPI.register(form);
      toast({ title: "Account created", description: "You can now sign in." });
      navigate("/login", { replace: true });
    } catch (err: any) {
      toast({ title: "Registration failed", description: err.message || "Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-xl border border-border rounded-xl p-6 md:p-8 shadow-[var(--shadow-smooth)] bg-card">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-foreground">Create account</h1>
          <p className="text-sm text-muted-foreground mt-1">Join PARKEASE in a minute</p>
        </div>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" placeholder="Alex Rider" value={form.name} onChange={(e) => setField("name", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setField("email", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" value={form.password} onChange={(e) => setField("password", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" placeholder="9876543210" value={form.phone} onChange={(e) => setField("phone", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vehicleNumber">Vehicle number</Label>
            <Input id="vehicleNumber" placeholder="MH12 AB 1234" value={form.vehicleNumber} onChange={(e) => setField("vehicleNumber", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Vehicle type</Label>
            <Select value={form.vehicleType} onValueChange={(v) => setField("vehicleType", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Car">Car</SelectItem>
                <SelectItem value="Bike">Bike</SelectItem>
                <SelectItem value="Truck">Truck</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2 pt-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </div>
        </form>
        <p className="text-sm text-muted-foreground mt-6 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-primary underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
