import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { EventsProvider } from './contexts/EventsContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileNav } from './components/layout/MobileNav';
import { LandingPage } from './components/pages/LandingPage';
import { LoginPage } from './components/pages/LoginPage';
import { SignupPage } from './components/pages/SignupPage';
import { EventsPage } from './components/pages/EventsPage';
import { EventDetailsPage } from './components/pages/EventDetailsPage';
import { CreateEventPage } from './components/pages/CreateEventPage';
import { UserDashboard } from './components/pages/UserDashboard';
import { Chatbot } from './components/chatbot/Chatbot';
import { Toaster } from './components/ui/sonner';
import './styles/globals.css';

type Page = 'landing' | 'login' | 'signup' | 'events' | 'event-details' | 'create-event' | 'dashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const handleNavigate = (page: string, eventId?: string) => {
    setCurrentPage(page as Page);
    if (eventId) {
      setSelectedEventId(eventId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <EventsProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
            
            <main className="flex-1 pb-16 md:pb-0">
              {currentPage === 'landing' && <LandingPage onNavigate={handleNavigate} />}
              {currentPage === 'login' && <LoginPage onNavigate={handleNavigate} />}
              {currentPage === 'signup' && <SignupPage onNavigate={handleNavigate} />}
              {currentPage === 'events' && <EventsPage onNavigate={handleNavigate} />}
              {currentPage === 'event-details' && selectedEventId && (
                <EventDetailsPage eventId={selectedEventId} onNavigate={handleNavigate} />
              )}
              {currentPage === 'create-event' && <CreateEventPage onNavigate={handleNavigate} />}
              {currentPage === 'dashboard' && <UserDashboard onNavigate={handleNavigate} />}
            </main>

            <Footer />
            <MobileNav onNavigate={handleNavigate} currentPage={currentPage} />
            <Chatbot />
            <Toaster position="top-right" richColors />
          </div>
        </EventsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}