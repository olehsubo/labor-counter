"use client";

import Link from "next/link";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-theme-bg text-theme-text">
      <main className="mx-auto flex max-w-4xl flex-col gap-16 px-6 py-20">
        {/* Hero Section */}
        <div className="flex flex-col items-center gap-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-theme-accent">
              Labor Counter
            </p>
            <h1 className="text-5xl font-semibold text-theme-text leading-tight">
              Gentle support for tracking contractions
            </h1>
            <p className="text-lg text-theme-text-secondary max-w-2xl leading-relaxed">
              A simple, intuitive app designed to help you track contractions
              during labor. No complicated features, just what you need when you
              need it most.
            </p>
          </div>

          <Link
            href="/app"
            className="bg-theme-accent hover:bg-theme-accent-hover text-theme-text font-semibold px-8 py-4 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            Start Tracking
          </Link>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-theme-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-theme-text"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-theme-text">
              Simple Timing
            </h3>
            <p className="text-theme-text-secondary">
              Just tap once to start timing and again to log each contraction.
              No complex setup required.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-theme-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-theme-text"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-theme-text">
              Always Available
            </h3>
            <p className="text-theme-text-secondary">
              Works offline and saves everything automatically. Your data stays
              private and secure on your device.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-theme-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-theme-text"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-theme-text">
              Track Progress
            </h3>
            <p className="text-theme-text-secondary">
              View your contraction history and patterns to help you and your
              healthcare provider understand your labor progress.
            </p>
          </div>
        </div>

        {/* How it Works Section */}
        <div className="bg-theme-surface rounded-2xl p-8 shadow-sm border border-theme-border">
          <h2 className="text-2xl font-semibold text-center mb-8 text-theme-text">
            How it works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-theme-accent rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold text-theme-text">
                1
              </div>
              <p className="text-sm text-theme-text-secondary">
                Tap to start timing your contraction
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-theme-accent rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold text-theme-text">
                2
              </div>
              <p className="text-sm text-theme-text-secondary">
                Tap again when contraction ends
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-theme-accent rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold text-theme-text">
                3
              </div>
              <p className="text-sm text-theme-text-secondary">
                Track time between contractions
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-theme-accent rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold text-theme-text">
                4
              </div>
              <p className="text-sm text-theme-text-secondary">
                View your progress and history
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-theme-text">
            Ready to start tracking?
          </h2>
          <p className="text-theme-text-secondary mb-8">
            Join thousands of families who have used this simple tool during
            their labor journey.
          </p>
          <Link
            href="/app"
            className="bg-theme-text hover:bg-theme-text/90 text-theme-bg font-semibold px-8 py-4 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            Get Started Now
          </Link>
        </div>
      </main>
    </div>
  );
}
