import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { slotAPI, userAPI, bookingsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { addMyBooking, decodeToken } from "@/lib/utils";

const BookSlot = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [slotNumber, setSlotNumber] = useState("");
  const [form, setForm] = useState({ name: "", vehicleNumber: "", durationMinutes: "60" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSlot = async () => {
      try {
        const data = await slotAPI.getAll();
        const slot = (data?.slots ?? []).find((s: any) => s._id === id);
        if (slot) setSlotNumber(slot.slotNumber);
      } catch {}
    };
    fetchSlot();
    const tokenPayload = decodeToken(localStorage.getItem("token"));
    // Pre-fill from profile if available
    userAPI
      .getProfile()
      .then((res) => {
        const user = res?.user;
        if (user) {
          setForm((f) => ({ ...f, name: user.name ?? f.name, vehicleNumber: user.vehicleNumber ?? f.vehicleNumber }));
        }
      })
      .catch(() => {});
  }, [id]);

  const setField = (key: keyof typeof form, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!form.name || !form.vehicleNumber || !form.durationMinutes) {
      toast({ title: "Missing fields", description: "Please complete the form." });
      return;
    }
    setLoading(true);
    try {
      await bookingsAPI.create(id, Number(form.durationMinutes));
      const payload = decodeToken(localStorage.getItem("token"));
      if (payload?.id) addMyBooking(payload.id, id);
      toast({ title: "Slot booked", description: `Booked slot ${slotNumber}.` });
      navigate("/my-bookings", { replace: true });
    } catch (err: any) {
      toast({ title: "Booking failed", description: err.message || "Try another slot." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md border border-border rounded-xl p-6 md:p-8 shadow-[var(--shadow-smooth)] bg-card">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Book Slot {slotNumber ? `(${slotNumber})` : ""}</h1>
          <p className="text-sm text-muted-foreground">Fill details to confirm your booking</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={form.name} onChange={(e) => setField("name", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vehicleNumber">Vehicle Number</Label>
            <Input id="vehicleNumber" value={form.vehicleNumber} onChange={(e) => setField("vehicleNumber", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input id="duration" type="number" min={15} step={15} value={form.durationMinutes} onChange={(e) => setField("durationMinutes", e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Booking..." : "Confirm Booking"}</Button>
        </form>
        <div className="mt-4 flex justify-between">
          <Button asChild variant="secondary"><Link to="/dashboard">Back</Link></Button>
          <Button asChild variant="outline"><Link to="/my-bookings">My Bookings</Link></Button>
        </div>
      </div>
    </div>
  );
};

export default BookSlot;
