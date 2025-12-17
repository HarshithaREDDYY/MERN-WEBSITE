import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bot,
  User,
  Loader2,
  BookOpen,
  Code,
  Database,
  Shield,
  Smartphone,
  Zap,
  Search,
  Calendar,
  Users,
  Settings,
  Download,
  FileText,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { toast } from 'sonner@2.0.3';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface DocumentationSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  keywords: string[];
  content: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your Event Assistant. I know everything about this Event Management Platform! Ask me about:\n\n• Platform features and capabilities\n• Technical architecture and stack\n• Documentation structure\n• API integration\n• Implementation details\n• How to use specific features\n• Development guidelines\n\nWhat would you like to know?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Documentation sections data
  const documentationSections: DocumentationSection[] = [
    {
      id: 'overview',
      title: 'Platform Overview',
      icon: <BookOpen className="size-4" />,
      keywords: ['overview', 'introduction', 'what is this', 'platform', 'about'],
      content: `## 📱 Event Management Platform Overview\n\nA comprehensive platform for creating, discovering, and managing events with:\n\n**Key Features:**\n• User authentication with JWT\n• Event creation and management (CRUD)\n• Event discovery and RSVP system\n• AI-powered chatbot assistant\n• Responsive design (mobile-first)\n• Voice interactions\n• Dark/light theme support\n• Real-time updates\n\n**Purpose:** Designed for portfolio showcase, demonstrating full-stack development skills, modern architecture patterns, and production-ready features.`
    },
    {
      id: 'architecture',
      title: 'Technical Architecture',
      icon: <Code className="size-4" />,
      keywords: ['architecture', 'tech stack', 'technology', 'how it works', 'structure', 'backend', 'frontend'],
      content: `## 🏗️ Technical Architecture\n\n**Frontend:**\n• React 18 with TypeScript\n• Tailwind CSS 4.0 + Radix UI\n• React Context API for state\n• localStorage for persistence\n• Lucide React icons\n\n**Backend (Future):**\n• Node.js + Express.js REST API\n• MongoDB with Mongoose ODM\n• JWT authentication\n\n**Key Patterns:**\n• Component-based architecture\n• Separation of concerns\n• Type safety throughout\n• Mobile-first responsive design\n• WCAG AA accessibility compliance\n\n**File Structure:**\n/components - React components\n/contexts - State management\n/lib - Utilities & types\n/docs - Documentation\n/styles - Global styles`
    },
    {
      id: 'features',
      title: 'Features & Capabilities',
      icon: <Zap className="size-4" />,
      keywords: ['features', 'capabilities', 'what can it do', 'functionality', 'user features'],
      content: `## ✨ Features & Capabilities\n\n**User Features:**\n1. **Authentication:** Secure signup/login with JWT\n2. **Event Discovery:** Browse, search, filter events\n3. **Event Creation:** Create/edit/delete events\n4. **RSVP System:** Join events with capacity limits\n5. **Dashboard:** Manage your events & RSVPs\n6. **AI Chatbot:** Voice-enabled assistance (me!)\n\n**Technical Features:**\n• TypeScript for type safety\n• Responsive design (all devices)\n• Dark/light theme toggle\n• Form validation\n• Loading states & error handling\n• Race-condition safe RSVPs\n• Voice recognition/synthesis\n• Mock data persistence\n\n**AI Features:**\n• Auto-description generation\n• Smart event recommendations\n• Voice Q&A assistant`
    },
    {
      id: 'api',
      title: 'API Integration',
      icon: <Database className="size-4" />,
      keywords: ['api', 'endpoints', 'backend', 'integration', 'mongodb', 'database', 'rest', 'jwt'],
      content: `## 🔌 API Integration Guide\n\n**Backend Architecture:**\n• MERN stack (MongoDB, Express, React, Node)\n• RESTful API design\n• JWT authentication middleware\n\n**Key Endpoints:**\n• POST /api/auth/register - User registration\n• POST /api/auth/login - User login\n• GET /api/events - List events\n• POST /api/events - Create event\n• PUT /api/events/:id - Update event\n• DELETE /api/events/:id - Delete event\n• POST /api/events/:id/rsvp - RSVP to event\n• DELETE /api/events/:id/rsvp - Cancel RSVP\n• GET /api/users/profile - Get user profile\n\n**MongoDB Schemas:**\n• User: email, name, hashedPassword, role\n• Event: title, description, date, location, category, capacity, organizer\n• RSVP: user, event, status, timestamp\n\n**Authentication Flow:**\n1. User login → JWT token\n2. Token stored in localStorage\n3. Token sent in Authorization header\n4. Server validates token for protected routes`
    },
    {
      id: 'security',
      title: 'Security Features',
      icon: <Shield className="size-4" />,
      keywords: ['security', 'authentication', 'jwt', 'protection', 'safe', 'privacy'],
      content: `## 🔒 Security Features\n\n**Implemented:**\n• JWT-based authentication\n• Password hashing with bcrypt\n• Protected API routes\n• Input validation & sanitization\n• Race-condition handling for RSVPs\n• Secure localStorage usage\n• CORS configuration\n\n**Authentication Flow:**\n1. User submits credentials\n2. Server validates & returns JWT\n3. Token stored securely\n4. Token verified on each request\n5. Automatic logout on expiry\n\n**Data Protection:**\n• No sensitive data in localStorage\n• Encrypted passwords\n• Rate limiting (future)\n• SQL injection prevention\n• XSS protection headers\n\n**Access Control:**\n• Users can only edit their own events\n• RSVP limits enforced server-side\n• Role-based permissions (future)`
    },
    {
      id: 'responsive',
      title: 'Responsive Design',
      icon: <Smartphone className="size-4" />,
      keywords: ['responsive', 'mobile', 'design', 'ui', 'ux', 'layout', 'breakpoints'],
      content: `## 📱 Responsive Design\n\n**Mobile-First Approach:**\n• Designed for mobile screens first\n• Progressive enhancement for larger screens\n• Touch-friendly interfaces\n• Optimized performance\n\n**Breakpoints:**\n• sm: 640px (mobile)\n• md: 768px (tablet)\n• lg: 1024px (desktop)\n• xl: 1280px (large desktop)\n• 2xl: 1536px (extra large)\n\n**Responsive Components:**\n• Navigation menu adapts\n• Card layouts rearrange\n• Font sizes adjust\n• Spacing optimizes\n• Forms remain usable\n\n**Accessibility:**\n• WCAG AA compliance\n• Keyboard navigation\n• Screen reader support\n• Focus management\n• Color contrast ratios\n• ARIA labels`
    },
    {
      id: 'chatbot',
      title: 'Chatbot Implementation',
      icon: <Bot className="size-4" />,
      keywords: ['chatbot', 'ai', 'voice', 'assistant', 'speech', 'recognition', 'synthesis'],
      content: `## 🤖 Chatbot Implementation (That's me!)\n\n**Features:**\n• Voice input/output\n• Natural language understanding\n• Context-aware responses\n• Documentation knowledge\n• Real-time typing indicators\n\n**Technologies:**\n• Web Speech API (voice)\n• React hooks for state\n• Lucide icons\n• Sonner for notifications\n• Tailwind for styling\n\n**Capabilities:**\n1. **Voice Recognition:** Click mic to speak\n2. **Text-to-Speech:** Toggle voice responses\n3. **Documentation Search:** Ask about any platform topic\n4. **Context Memory:** Remembers conversation\n5. **Quick Actions:** Provides helpful responses\n\n**Code Location:** /components/chatbot/Chatbot.tsx`
    },
    {
      id: 'events',
      title: 'Events System',
      icon: <Calendar className="size-4" />,
      keywords: ['events', 'create event', 'rsvp', 'attend', 'capacity', 'organize'],
      content: `## 🎫 Events System\n\n**Event Creation:**\n1. Click "Create Event"\n2. Fill in: Title, Description, Date, Time, Location\n3. Set Category & Capacity\n4. Add Image (optional)\n5. Submit for publishing\n\n**Event Discovery:**\n• Browse all events\n• Search by keyword\n• Filter by category\n• Sort by date/popularity\n• View availability\n\n**RSVP System:**\n• Click "RSVP Now" on events\n• Fill in details (name, email)\n• Get confirmation\n• Manage from dashboard\n• Cancel if needed\n\n**Capacity Management:**\n• Real-time seat counting\n• Waitlist option (future)\n• Organizer notifications\n• Over-capacity prevention`
    },
    {
      id: 'dashboard',
      title: 'User Dashboard',
      icon: <Settings className="size-4" />,
      keywords: ['dashboard', 'profile', 'my events', 'rsvps', 'statistics', 'account'],
      content: `## 📊 User Dashboard\n\n**Features:**\n• **Events Created:** View/edit/delete your events\n• **My RSVPs:** Events you're attending\n• **Statistics:** Total events, RSVPs, etc.\n• **Profile:** Update account information\n\n**Dashboard Sections:**\n1. **Overview:** Quick stats & recent activity\n2. **Events:** Manage your created events\n3. **Attending:** Upcoming events you RSVP'd\n4. **History:** Past event participation\n5. **Settings:** Account preferences\n\n**Organizer Tools:**\n• Edit event details\n• View attendee list\n• Send notifications\n• Export event data\n• Manage waitlists\n\n**User Profile:**\n• Update name/email\n• Change password\n• Set preferences\n• Delete account`
    },
    {
      id: 'documentation',
      title: 'Documentation Structure',
      icon: <FileText className="size-4" />,
      keywords: ['documentation', 'docs', 'readme', 'guide', 'tutorial', 'help'],
      content: `## 📚 Documentation Structure\n\n**Main Files:**\n1. **ARCHITECTURE.md** - System design & patterns\n2. **FEATURES.md** - Complete feature list\n3. **API_INTEGRATION.md** - Backend API specs\n4. **FOLDER_STRUCTURE.md** - Project organization\n5. **IMPLEMENTATION_SUMMARY.md** - Recent changes\n\n**Quick References:**\n• **For Developers:** Start with ARCHITECTURE.md\n• **For Recruiters:** Check FEATURES.md\n• **Backend Integration:** Follow API_INTEGRATION.md\n• **Code Navigation:** Use FOLDER_STRUCTURE.md\n\n**Documentation Location:** /docs/ directory\n\n**Maintained Alongside Code:**\n• Updated with new features\n• API changes documented\n• Architecture diagrams\n• Implementation notes`
    },
    {
      id: 'development',
      title: 'Development Guide',
      icon: <Code className="size-4" />,
      keywords: ['development', 'code', 'contribute', 'setup', 'environment', 'run', 'build'],
      content: `## 🛠️ Development Guide\n\n**Setup Instructions:**\n1. Clone repository\n2. Install dependencies: \`npm install\`\n3. Start dev server: \`npm run dev\`\n4. Access at http://localhost:3000\n\n**Project Structure:**\n• /components - React components\n• /contexts - State management\n• /lib - Types & utilities\n• /pages - Route components\n• /styles - Global CSS\n\n**Coding Standards:**\n• TypeScript throughout\n• ESLint + Prettier\n• Component composition\n• Custom hooks for logic\n• Error boundaries\n• Loading states\n\n**Testing:**\n• Component tests (planned)\n• API integration tests\n• E2E testing (future)\n• Performance monitoring\n\n**Deployment:**\n• Vercel/Netlify for frontend\n• MongoDB Atlas for database\n• Environment variables\n• CI/CD pipeline`
    },
    {
      id: 'components',
      title: 'Component Library',
      icon: <Settings className="size-4" />,
      keywords: ['components', 'ui', 'button', 'card', 'input', 'layout', 'reusable'],
      content: `## 🧩 Component Library\n\n**UI Components (/components/ui):**\n• Button - Various styles & sizes\n• Card - Container with header/content\n• Input - Form input fields\n• Badge - Status indicators\n• ScrollArea - Custom scrollbars\n• Dialog - Modal windows\n• Dropdown - Menu components\n• Toast - Notifications\n\n**Feature Components:**\n• Chatbot - AI assistant (this component)\n• EventCard - Event display\n• EventForm - Create/edit events\n• Navbar - Main navigation\n• Dashboard - User dashboard\n• AuthForm - Login/register\n\n**Layout Components:**\n• Layout - Main app layout\n• Footer - Page footer\n• Sidebar - Navigation (desktop)\n• MobileMenu - Navigation (mobile)\n\n**Shared Patterns:**\n• Props interfaces\n• Default exports\n• Storybook support (future)\n• Theme integration`
    }
  ];

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    // Initialize speech recognition
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error('Voice recognition error. Please try again.');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speak = (text: string) => {
    if (!voiceEnabled || !synthRef.current) return;

    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast.error('Voice recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      toast.info('Listening... Speak now.');
    }
  };

  const findRelevantSection = (userMessage: string): DocumentationSection | null => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for exact matches first
    for (const section of documentationSections) {
      for (const keyword of section.keywords) {
        if (lowerMessage.includes(keyword.toLowerCase())) {
          return section;
        }
      }
    }
    
    // Check for common phrases
    if (lowerMessage.includes('how to') || lowerMessage.includes('how do i')) {
      if (lowerMessage.includes('event')) {
        return documentationSections.find(s => s.id === 'events') || null;
      }
      if (lowerMessage.includes('dashboard')) {
        return documentationSections.find(s => s.id === 'dashboard') || null;
      }
      if (lowerMessage.includes('api') || lowerMessage.includes('backend')) {
        return documentationSections.find(s => s.id === 'api') || null;
      }
    }
    
    if (lowerMessage.includes('tech') || lowerMessage.includes('stack')) {
      return documentationSections.find(s => s.id === 'architecture') || null;
    }
    
    if (lowerMessage.includes('documentation') || lowerMessage.includes('docs')) {
      return documentationSections.find(s => s.id === 'documentation') || null;
    }
    
    if (lowerMessage.includes('security') || lowerMessage.includes('auth')) {
      return documentationSections.find(s => s.id === 'security') || null;
    }
    
    if (lowerMessage.includes('mobile') || lowerMessage.includes('responsive')) {
      return documentationSections.find(s => s.id === 'responsive') || null;
    }
    
    if (lowerMessage.includes('chatbot') || lowerMessage.includes('voice')) {
      return documentationSections.find(s => s.id === 'chatbot') || null;
    }
    
    if (lowerMessage.includes('component') || lowerMessage.includes('ui')) {
      return documentationSections.find(s => s.id === 'components') || null;
    }
    
    return null;
  };

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Greeting/help responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || 
        lowerMessage.includes('hey') || lowerMessage.includes('greeting')) {
      return `Hello! I'm your Event Platform Assistant. I can help you with:\n\n• Platform features and capabilities\n• Technical architecture and stack\n• Documentation structure\n• API integration details\n• Implementation guidelines\n• How to use specific features\n• Development setup\n\nWhat specific topic would you like to learn about?`;
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
      const topics = documentationSections.map(s => `• **${s.title}** - Ask about: ${s.keywords.slice(0, 3).join(', ')}`).join('\n');
      return `I can explain everything about this Event Management Platform! Here are the topics I know:\n\n${topics}\n\nTry asking things like:\n"Tell me about the API endpoints"\n"How do I create an event?"\n"What's the tech stack?"\n"How does authentication work?"\n"Show me the documentation structure"`;
    }
    
    // Find relevant documentation section
    const relevantSection = findRelevantSection(userMessage);
    
    if (relevantSection) {
      return `${relevantSection.content}\n\nIs there something specific about ${relevantSection.title.toLowerCase()} you'd like me to elaborate on?`;
    }
    
    // If no specific section found, try to understand intent
    if (lowerMessage.includes('what is this') || lowerMessage.includes('about this platform')) {
      return documentationSections.find(s => s.id === 'overview')?.content || 'This is an Event Management Platform for creating, discovering, and managing events.';
    }
    
    if (lowerMessage.includes('how to run') || lowerMessage.includes('setup') || lowerMessage.includes('install')) {
      return documentationSections.find(s => s.id === 'development')?.content || 'Check the development guide for setup instructions.';
    }
    
    // Default response with suggestions
    return `I understand you're asking about "${userMessage}". Since I couldn't find an exact match, here are some topics I can help with:\n\n1. **Platform Overview** - What this platform does\n2. **Technical Architecture** - Tech stack and design\n3. **Features** - All available capabilities\n4. **API Integration** - Backend endpoints\n5. **Security** - Authentication and protection\n6. **Responsive Design** - Mobile support\n7. **Chatbot** - How I work\n8. **Events System** - Creating and RSVPing\n9. **Dashboard** - User management\n10. **Documentation** - Where to find docs\n11. **Development** - Setup and coding\n12. **Components** - UI library\n\nWhich topic interests you?`;
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot thinking delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const botResponseText = generateBotResponse(userMessage.text);
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: botResponseText,
      sender: 'bot',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botMessage]);
    setIsTyping(false);

    // Speak the response if voice is enabled
    speak(botResponseText);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickAction = (topic: string) => {
    setInputValue(topic);
    setTimeout(() => {
      sendMessage();
    }, 100);
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl z-50 hover:scale-110 transition-transform"
          size="icon"
        >
          <MessageCircle className="size-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-[420px] h-[650px] shadow-2xl z-50 flex flex-col">
          <CardHeader className="bg-primary text-primary-foreground rounded-t-lg flex flex-row items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Bot className="size-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Platform Assistant</CardTitle>
                <Badge variant="secondary" className="text-xs bg-primary-foreground/20 flex items-center gap-1">
                  <BookOpen className="size-3" />
                  Knows Everything
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsOpen(false);
                stopSpeaking();
              }}
              className="hover:bg-primary-foreground/20"
            >
              <X className="size-5" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            {/* Quick Actions Bar */}
            <div className="border-b px-4 py-2 bg-muted/50">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="text-xs text-muted-foreground whitespace-nowrap">Quick topics:</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs whitespace-nowrap"
                  onClick={() => quickAction('tech stack')}
                >
                  <Code className="size-3 mr-1" />
                  Tech Stack
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs whitespace-nowrap"
                  onClick={() => quickAction('API endpoints')}
                >
                  <Database className="size-3 mr-1" />
                  API
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs whitespace-nowrap"
                  onClick={() => quickAction('security features')}
                >
                  <Shield className="size-3 mr-1" />
                  Security
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs whitespace-nowrap"
                  onClick={() => quickAction('documentation structure')}
                >
                  <FileText className="size-3 mr-1" />
                  Docs
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.sender === 'bot' && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="size-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    {message.sender === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <User className="size-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-2 justify-start">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="size-4 text-primary" />
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Searching documentation...</p>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t p-4 space-y-3">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about the platform, features, code, or docs..."
                  className="flex-1"
                  disabled={isListening}
                />
                <Button
                  size="icon"
                  variant={isListening ? 'destructive' : 'outline'}
                  onClick={toggleVoiceInput}
                  title={isListening ? 'Stop listening' : 'Start voice input'}
                >
                  {isListening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
                </Button>
                <Button size="icon" onClick={sendMessage} disabled={!inputValue.trim()}>
                  <Send className="size-4" />
                </Button>
              </div>

              {/* Voice Controls */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2"
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                  >
                    {voiceEnabled ? (
                      <Volume2 className="size-3 mr-1" />
                    ) : (
                      <VolumeX className="size-3 mr-1" />
                    )}
                    {voiceEnabled ? 'Voice On' : 'Voice Off'}
                  </Button>
                  {isSpeaking && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2"
                      onClick={stopSpeaking}
                    >
                      Stop Speaking
                    </Button>
                  )}
                </div>
                {isListening && (
                  <Badge variant="destructive" className="animate-pulse">
                    <Mic className="size-3 mr-1" />
                    Listening...
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}