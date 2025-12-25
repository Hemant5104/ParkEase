import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { slotAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

type Slot = { _id: string; slotNumber: string; status: string; description?: string; updatedAt?: string };

const LOCATIONS = [
  { id: "mbd", name: "MBD Mall", prefix: "A" },
  { id: "city-center", name: "City Center", prefix: "B" },
  { id: "railway", name: "Railway Station", prefix: "C" },
];

const Dashboard = () => {
  const { toast } = useToast();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeLoc, setActiveLoc] = useState(LOCATIONS[0]);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const data = await slotAPI.getAll();
      setSlots((data?.slots ?? []) as Slot[]);
    } catch (err: any) {
      toast({ title: "Failed to load slots", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const filteredSlots = useMemo(() => {
    // Simple grouping by slotNumber prefix to simulate locations
    return slots.filter((s) => s.slotNumber?.startsWith(activeLoc.prefix));
  }, [slots, activeLoc]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Parking Dashboard</h1>
          <div className="flex gap-3">
            <Button asChild variant="outline"><Link to="/">Home</Link></Button>
            <Button asChild variant="accent"><Link to="/my-bookings">My Bookings</Link></Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-8">
        <section>
          <h2 className="text-lg font-semibold mb-3">Locations</h2>
          <div className="flex flex-wrap gap-3">
            {LOCATIONS.map((loc) => (
              <Button
                key={loc.id}
                variant={activeLoc.id === loc.id ? "accent" : "secondary"}
                onClick={() => setActiveLoc(loc)}
              >
                {loc.name}
              </Button>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Slots at {activeLoc.name}</h3>
            <Button onClick={fetchSlots} disabled={loading}>{loading ? "Refreshing..." : "Refresh"}</Button>
          </div>
          {filteredSlots.length === 0 ? (
            <p className="text-muted-foreground">No slots found for this location.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredSlots.map((slot) => {
                const isAvailable = slot.status === "available";
                const color = isAvailable ? "bg-green-500" : "bg-red-500";
                const timeLabel = slot.updatedAt ? new Date(slot.updatedAt).toLocaleTimeString() : "";
                return (
                  <Card key={slot._id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className={`h-24 ${color} text-white flex flex-col items-center justify-center`}>
                        <div className="text-lg font-bold">{slot.slotNumber}</div>
                        <div className="text-xs opacity-90">{slot.status}{timeLabel ? ` • ${timeLabel}` : ""}</div>
                      </div>
                      <div className="p-3">
                        {isAvailable ? (
                          <Button asChild className="w-full" variant="accent">
                            <Link to={`/book/${slot._id}`}>Book</Link>
                          </Button>
                        ) : (
                          <Button disabled className="w-full" variant="secondary">Not Available</Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-3">Green = available • Red = occupied</p>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
