import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminAPI, slotAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { decodeToken } from "@/lib/utils";

type Slot = { _id: string; slotNumber: string; status: string; description?: string };

const LOCATIONS = [
  { id: "mbd", name: "MBD Mall", prefix: "A" },
  { id: "city-center", name: "City Center", prefix: "B" },
  { id: "railway", name: "Railway Station", prefix: "C" },
];

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ locationId: LOCATIONS[0].id, number: "", status: "available", description: "" });

  useEffect(() => {
    const payload = decodeToken(localStorage.getItem("token"));
    if (!payload || payload.role !== "admin") {
      toast({ title: "Access denied", description: "Admin only. Please log in as admin." });
      navigate("/login", { replace: true });
      return;
    }
    refreshSlots();
  }, []);

  const refreshSlots = async () => {
    setLoading(true);
    try {
      const data = await slotAPI.getAll();
      setSlots(data?.slots ?? []);
    } catch (err: any) {
      toast({ title: "Failed to load slots", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const setField = (key: keyof typeof form, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const onAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.number) {
      toast({ title: "Missing number", description: "Enter a slot number." });
      return;
    }
    const loc = LOCATIONS.find((l) => l.id === form.locationId)!;
    const slotNumber = `${loc.prefix}${form.number}`.toUpperCase();
    try {
      await adminAPI.addSlot({ slotNumber, status: form.status as any, description: form.description });
      toast({ title: "Slot added", description: `${slotNumber} created successfully.` });
      setForm((f) => ({ ...f, number: "", description: "" }));
      refreshSlots();
    } catch (err: any) {
      toast({ title: "Add failed", description: err.message || "Could not add slot." });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <div className="flex gap-3">
            <Button asChild variant="outline"><Link to="/dashboard">User Dashboard</Link></Button>
            <Button asChild variant="accent"><Link to="/">Home</Link></Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-8">
        <section className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h2 className="text-xl font-semibold">Add Parking Slot</h2>
              <form onSubmit={onAddSlot} className="space-y-4">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select value={form.locationId} onValueChange={(v) => setField("locationId", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                    <SelectContent>
                      {LOCATIONS.map((l) => (
                        <SelectItem key={l.id} value={l.id}>{l.name} ({l.prefix}*)</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Slots are grouped by prefix (A/B/C) on user dashboard.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number">Slot Number</Label>
                  <Input id="number" placeholder="e.g. 12" value={form.number} onChange={(e) => setField("number", e.target.value)} />
                  <p className="text-xs text-muted-foreground">Final slot ID becomes e.g. A12 for MBD Mall.</p>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => setField("status", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="occupied">Occupied</SelectItem>
                      <SelectItem value="reserved">Reserved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="desc">Description (optional)</Label>
                  <Input id="desc" value={form.description} onChange={(e) => setField("description", e.target.value)} />
                </div>
                <Button type="submit" variant="accent">Add Slot</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Existing Slots</h2>
                <Button onClick={refreshSlots} disabled={loading}>{loading ? "Refreshing..." : "Refresh"}</Button>
              </div>
              {slots.length === 0 ? (
                <p className="text-muted-foreground">No slots yet. Add some on the left.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {slots.map((s) => (
                    <div key={s._id} className="border rounded-md p-3 text-sm">
                      <div className="font-semibold">{s.slotNumber}</div>
                      <div className="text-xs text-muted-foreground">{s.status}</div>
                      {s.description ? <div className="text-xs mt-1">{s.description}</div> : null}
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground">Newly added slots appear in the user dashboard automatically.</p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
