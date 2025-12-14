import { Card, CardContent } from "@/components/ui/card";
import { ParkingCircle, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { slotAPI } from "@/lib/api";

const SlotStatistics = () => {
  const [slotStats, setSlotStats] = useState({
    total: 0,
    available: 0,
    loading: true,
    error: null as string | null,
  });

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setSlotStats((prev) => ({ ...prev, loading: true, error: null }));
        const data = await slotAPI.getAll();
        const slots = data.slots || [];
        const available = slots.filter(
          (slot: { status: string }) => slot.status === "available"
        ).length;
        setSlotStats({
          total: slots.length,
          available,
          loading: false,
          error: null,
        });
      } catch (error) {
        setSlotStats({
          total: 0,
          available: 0,
          loading: false,
          error: error instanceof Error ? error.message : "Failed to load slots",
        });
      }
    };

    fetchSlots();
  }, []);

  return (
    <section className="py-16 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-border bg-card shadow-[var(--shadow-smooth)]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Total Parking Slots</p>
                  {slotStats.loading ? (
                    <div className="h-12 w-24 bg-muted animate-pulse rounded" />
                  ) : slotStats.error ? (
                    <p className="text-lg text-destructive">{slotStats.error}</p>
                  ) : (
                    <h3 className="text-4xl font-bold text-foreground">{slotStats.total}</h3>
                  )}
                </div>
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <ParkingCircle className="h-8 w-8 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-[var(--shadow-smooth)]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Available Slots</p>
                  {slotStats.loading ? (
                    <div className="h-12 w-24 bg-muted animate-pulse rounded" />
                  ) : slotStats.error ? (
                    <p className="text-lg text-destructive">{slotStats.error}</p>
                  ) : (
                    <h3 className="text-4xl font-bold text-accent">{slotStats.available}</h3>
                  )}
                </div>
                <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-accent" />
                </div>
              </div>
              {!slotStats.loading && !slotStats.error && slotStats.total > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Availability</span>
                    <span className="text-foreground font-semibold">
                      {Math.round((slotStats.available / slotStats.total) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-accent h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${(slotStats.available / slotStats.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SlotStatistics;

