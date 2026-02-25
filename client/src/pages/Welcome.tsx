import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "wouter";
import { Car, Lightbulb, AlertTriangle, MapPin, ShieldAlert } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const features = [
  {
    title: "Road Analyser",
    description: "AI-powered analysis of road conditions and traffic flow.",
    icon: Car,
    href: "/road-analyser",
    color: "text-blue-500",
  },
  {
    title: "Smart Traffic Light",
    description: "Intelligent traffic management system for optimized flow.",
    icon: Lightbulb,
    href: "/smart-traffic",
    color: "text-green-500",
  },
  {
    title: "Pothole Detection",
    description: "Automated identification and reporting of road damage.",
    icon: AlertTriangle,
    href: "/potholes",
    color: "text-yellow-500",
  },
  {
    title: "Parking System",
    description: "Multi-floor parking management and smart rerouting.",
    icon: MapPin,
    href: "/parking",
    color: "text-primary",
  },
  {
    title: "Illegal Parking Detection",
    description: "Monitoring and alerting for parking violations.",
    icon: ShieldAlert,
    href: "/illegal-parking",
    color: "text-destructive",
  },
];

const slides = [
  {
    title: "Smart City Infrastructure",
    description: "Building the future of urban mobility with AI.",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1200&h=400",
  },
  {
    title: "Intelligent Parking",
    description: "Real-time occupancy tracking and smart rerouting.",
    image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=1200&h=400",
  },
];

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Car className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight font-display">SmartTraffic AI</span>
        </div>
        <div className="flex gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
          <Link href="/parking" className="text-sm font-medium hover:text-primary transition-colors">Parking Map</Link>
        </div>
      </nav>

      <main className="container mx-auto py-10 px-6 space-y-12">
        <section className="relative rounded-xl overflow-hidden shadow-lg">
          <Carousel className="w-full">
            <CarouselContent>
              {slides.map((slide, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-[400px] w-full">
                    <img 
                      src={slide.image} 
                      alt={slide.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-12 text-white">
                      <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
                      <p className="text-lg opacity-90 max-w-lg">{slide.description}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </section>

        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Urban Mobility Suite</h1>
            <p className="text-muted-foreground text-lg">
              Explore our range of intelligent traffic and infrastructure management solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Link key={feature.title} href={feature.href}>
                <Card className="hover-elevate cursor-pointer h-full transition-all border-border/50">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className={`p-2 rounded-lg bg-card border ${feature.color}`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
