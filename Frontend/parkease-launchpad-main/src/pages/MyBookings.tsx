import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { bookingsAPI } from "@/lib/api";
import { decodeToken } from "@/lib/utils";
import { Link } from "react-router-dom";

type Slot = { _id: string; slotNumber: string; status: string; updatedAt?: string };

const MyBookings = () => {
  const [bookings, setBookings] = useState<Array<{ _id: string; slot: Slot; startTime?: string; endTime?: string }>>([]);

  useEffect(() => {
    const fetch = async () => {
      const data = await bookingsAPI.myList();
      setBookings(data?.bookings ?? []);
    };
    fetch();
  }, []);

  const mySlots = useMemo(() => bookings.map((b) => b.slot).filter(Boolean) as Slot[], [bookings]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">My Bookings</h1>
          <div className="flex gap-3">
            <Button asChild variant="outline"><Link to="/dashboard">Dashboard</Link></Button>
            <Button asChild variant="accent"><Link to="/">Home</Link></Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {mySlots.length === 0 ? (
          <p className="text-muted-foreground">You have no bookings yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mySlots.map((slot) => (
              <Card key={slot._id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className={`h-24 bg-blue-600 text-white flex flex-col items-center justify-center`}>
                    <div className="text-lg font-bold">{slot.slotNumber}</div>
                    <div className="text-xs opacity-90">Booked • {slot.updatedAt ? new Date(slot.updatedAt).toLocaleTimeString() : ""}</div>
                  </div>
                  <div className="p-3">
                    <Button disabled className="w-full" variant="secondary">Booked</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-3">Your bookings appear in blue here, while others see them as red in the dashboard.</p>
      </main>
    </div>
  );
};

export default MyBookings;
