"use client";

import Link from "next/link";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8F3ED] text-[#333333]">
      <main className="mx-auto flex max-w-4xl flex-col gap-16 px-6 py-20">
        {/* Hero Section */}
        <div className="flex flex-col items-center gap-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#CFE5D6]">
              Labor Counter
            </p>
            <h1 className="text-5xl font-semibold text-[#333333] leading-tight">
              Gentle support for tracking contractions
            </h1>
            <p className="text-lg text-[#666666] max-w-2xl leading-relaxed">
              A simple, intuitive app designed to help you track contractions
              during labor. No complicated features, just what you need when you
              need it most.
            </p>
          </div>

          <Link
            href="/app"
            className="bg-[#CFE5D6] hover:bg-[#B8D4C1] text-[#333333] font-semibold px-8 py-4 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            Start Tracking
          </Link>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-[#CFE5D6] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-[#333333]"
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
            <h3 className="text-xl font-semibold mb-3">Simple Timing</h3>
            <p className="text-[#666666]">
              Just tap once to start timing and again to log each contraction.
              No complex setup required.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-[#CFE5D6] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-[#333333]"
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
            <h3 className="text-xl font-semibold mb-3">Always Available</h3>
            <p className="text-[#666666]">
              Works offline and saves everything automatically. Your data stays
              private and secure on your device.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-[#CFE5D6] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-[#333333]"
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
            <h3 className="text-xl font-semibold mb-3">Track Progress</h3>
            <p className="text-[#666666]">
              View your contraction history and patterns to help you and your
              healthcare provider understand your labor progress.
            </p>
          </div>
        </div>

        {/* How it Works Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-center mb-8">
            How it works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#CFE5D6] rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold text-[#333333]">
                1
              </div>
              <p className="text-sm text-[#666666]">
                Tap to start timing your contraction
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#CFE5D6] rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold text-[#333333]">
                2
              </div>
              <p className="text-sm text-[#666666]">
                Tap again when contraction ends
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#CFE5D6] rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold text-[#333333]">
                3
              </div>
              <p className="text-sm text-[#666666]">
                Track time between contractions
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#CFE5D6] rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold text-[#333333]">
                4
              </div>
              <p className="text-sm text-[#666666]">
                View your progress and history
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Ready to start tracking?
          </h2>
          <p className="text-[#666666] mb-8">
            Join thousands of families who have used this simple tool during
            their labor journey.
          </p>
          <Link
            href="/app"
            className="bg-[#333333] hover:bg-[#444444] text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            Get Started Now
          </Link>
        </div>
      </main>
    </div>
  );
}
