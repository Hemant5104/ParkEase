import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ParkingCircle, Clock, Shield, Zap } from "lucide-react";
import heroImage from "@/assets/hero-parking.jpg";
import SlotStatistics from "@/components/SlotStatistics";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ParkingCircle className="h-8 w-8 text-accent" />
              <h1 className="text-2xl font-bold tracking-tight text-foreground">PARKEASE</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="default">
                Login
              </Button>
              <Button variant="accent" size="default">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
              <div className="space-y-4">
                <h2 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight text-foreground">
                  Park Smarter,
                  <br />
                  <span className="text-accent">Not Harder</span>
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Find, reserve, and pay for parking in seconds. PARKEASE makes urban parking effortless with real-time availability and seamless booking.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button variant="accent" size="lg" className="shadow-lg">
                  Get Started Free
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative animate-in fade-in slide-in-from-right duration-700 delay-150">
              <div className="rounded-2xl overflow-hidden shadow-[var(--shadow-strong)]">
                <img
                  src={heroImage}
                  alt="Modern parking facility with organized spaces"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-2xl pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Slot Statistics Section */}
      <SlotStatistics />

      {/* Features Section */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 space-y-4">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground">
              Why Choose PARKEASE?
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the future of parking with intelligent features designed for modern urban life
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-border bg-card hover:shadow-[var(--shadow-smooth)] transition-all duration-300 hover:-translate-y-1 animate-in fade-in zoom-in duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="pt-6 space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h4 className="text-xl font-semibold text-foreground">{feature.title}</h4>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-[var(--gradient-primary)] border-none shadow-[var(--shadow-strong)] overflow-hidden">
            <CardContent className="py-16 px-8 text-center space-y-6">
              <h3 className="text-3xl md:text-4xl font-bold text-primary-foreground">
                Ready to Transform Your Parking Experience?
              </h3>
              <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
                Join thousands of drivers who've already discovered stress-free parking
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Button variant="accent" size="lg" className="shadow-xl">
                  Start Parking Smarter
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <ParkingCircle className="h-6 w-6 text-accent" />
              <span className="text-lg font-semibold text-foreground">PARKEASE</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2024 PARKEASE. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const features = [
  {
    icon: Zap,
    title: "Instant Booking",
    description: "Reserve your spot in seconds with real-time availability updates",
  },
  {
    icon: Clock,
    title: "24/7 Access",
    description: "Park anytime, anywhere with round-the-clock access to premium spots",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "Encrypted transactions and protected personal information",
  },
  {
    icon: ParkingCircle,
    title: "Smart Navigation",
    description: "GPS-guided directions straight to your reserved parking space",
  },
];

export default Index;
