import React from 'react';
import { Github, Linkedin, Calendar } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo and Description */}
          <div className="flex items-center gap-2">
            <Calendar className="size-5 text-primary" />
            <div>
              <p className="text-sm">
                Built with React, Node.js, Express & MongoDB
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Deployed on Vercel + Render + MongoDB Atlas
              </p>
            </div>
          </div>

          {/* Tech Stack Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">
              JWT Auth
            </span>
            <span className="px-3 py-1 text-xs rounded-full bg-accent/10 text-accent border border-accent/20">
              Race-Condition Safe
            </span>
            <span className="px-3 py-1 text-xs rounded-full bg-secondary text-secondary-foreground border">
              Protected Routes
            </span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-accent transition-colors"
              aria-label="GitHub"
            >
              <Github className="size-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-accent transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="size-5" />
            </a>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2025 EventHub. Showcasing Full Stack Development Skills.</p>
        </div>
      </div>
    </footer>
  );
}
