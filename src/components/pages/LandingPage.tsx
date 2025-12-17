import React from 'react';
import { Calendar, Shield, Users, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const features = [
    {
      icon: Shield,
      title: 'JWT-based Secure Login',
      description: 'Industry-standard authentication with encrypted tokens and protected routes.',
      color: 'text-primary',
    },
    {
      icon: Users,
      title: 'Capacity-Controlled RSVP',
      description: 'Smart seat management ensures no overbooking with real-time availability.',
      color: 'text-accent',
    },
    {
      icon: Zap,
      title: 'Race-Condition Safe Backend',
      description: 'Atomic operations prevent double-booking even under high concurrent load.',
      color: 'text-warning',
    },
    {
      icon: Calendar,
      title: 'Fully Responsive Design',
      description: 'Seamless experience across desktop, tablet, and mobile devices.',
      color: 'text-info',
    },
  ];

  const benefits = [
    'Create and manage unlimited events',
    'Real-time seat availability tracking',
    'Secure user authentication',
    'Professional event discovery',
    'Comprehensive dashboard analytics',
    'Mobile-first responsive design',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-accent/5 to-background py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
              <Shield className="size-4" />
              <span className="text-sm">Secure • Scalable • Professional</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl tracking-tight">
              Create. Discover. Attend Events — <span className="text-primary">Seamlessly</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              A production-ready event management platform featuring secure authentication,
              capacity-safe RSVP system, and real-time availability.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button size="lg" onClick={() => onNavigate('signup')} className="group">
                Get Started
                <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onNavigate('events')}
              >
                Explore Events
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-success" />
                <span>JWT Secured</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-success" />
                <span>Privacy-First</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-success" />
                <span>Real-time Updates</span>
              </div>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute right-0 bottom-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl mb-4">
              Enterprise-Grade Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built with production-ready architecture and modern best practices
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className={`inline-flex p-3 rounded-lg bg-primary/5 ${feature.color}`}>
                      <Icon className="size-6" />
                    </div>
                    <h3 className="text-lg">{feature.title}</h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-5xl">
                  Everything you need to manage events
                </h2>
                <p className="text-xl text-muted-foreground">
                  A complete platform with all the tools for creating, discovering,
                  and managing events efficiently.
                </p>
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="size-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Button size="lg" onClick={() => onNavigate('signup')} className="mt-4">
                  Start Creating Events
                </Button>
              </div>

              <div className="relative">
                <Card className="p-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Concurrency Protection</span>
                        <CheckCircle2 className="size-4 text-success" />
                      </div>
                      <div className="h-2 bg-success/20 rounded-full overflow-hidden">
                        <div className="h-full w-full bg-success rounded-full" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Security Score</span>
                        <CheckCircle2 className="size-4 text-success" />
                      </div>
                      <div className="h-2 bg-success/20 rounded-full overflow-hidden">
                        <div className="h-full w-[95%] bg-success rounded-full" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Performance</span>
                        <CheckCircle2 className="size-4 text-success" />
                      </div>
                      <div className="h-2 bg-success/20 rounded-full overflow-hidden">
                        <div className="h-full w-[98%] bg-success rounded-full" />
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <p className="text-sm text-center text-muted-foreground">
                        Prevents overbooking using atomic operations
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Floating badge */}
                <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg">
                  <p className="text-sm">Production Ready</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-primary/20">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-3xl md:text-5xl">
                Ready to get started?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands of event organizers using EventHub to create
                amazing experiences.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button size="lg" onClick={() => onNavigate('signup')}>
                  Create Your Account
                </Button>
                <Button size="lg" variant="outline" onClick={() => onNavigate('login')}>
                  Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
