import React from "react";
import { Download } from "lucide-react";

export default function ContactSubmission() {
  return (
    <section className="w-full bg-primary py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
        {/* Left Column: Get in Touch Form */}
        <div className="flex flex-col gap-6 text-white">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold">Get in Touch</h2>
            <p className="text-white/80 text-sm">
              Have questions about submission or subscription? Send us a
              message.
            </p>
          </div>

          <form className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full bg-white/10 border border-white/20 rounded-md px-4 py-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-white/50 transition-colors"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-white/10 border border-white/20 rounded-md px-4 py-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-white/50 transition-colors"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full bg-white/10 border border-white/20 rounded-md px-4 py-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-white/50 transition-colors"
              />
            </div>

            <textarea
              rows={5}
              placeholder="Message"
              className="w-full bg-white/10 border border-white/20 rounded-md px-4 py-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-white/50 transition-colors resize-none"
            ></textarea>

            <div className="flex justify-end items-center gap-4 mt-2">
              <button
                type="button"
                className="px-6 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors border border-white/20 hover:border-white/50 rounded-md"
              >
                Clear
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-sm font-bold text-primary bg-secondary hover:bg-secondary/90 transition-colors rounded-md shadow-lg"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Article Submission Card */}
        <div className="bg-white rounded-lg p-8 md:p-10 shadow-xl">
          <h3 className="text-2xl font-bold text-primary mb-6">
            Article Submission
          </h3>

          <div className="flex flex-col gap-6">
            <p className="text-muted-foreground text-sm leading-relaxed">
              Articles of theoretical and empirical nature are welcomed in the
              areas of Social Science. To submit an article, please register to
              the website and submit the article online.
            </p>

            <div className="flex gap-4">
              <button className="flex-1 bg-primary text-primary-foreground font-bold py-3 rounded-md hover:bg-primary/90 transition-colors shadow-sm">
                Register
              </button>
              <button className="flex-1 bg-background text-foreground border border-border font-bold py-3 rounded-md hover:bg-muted transition-colors shadow-sm">
                Login
              </button>
            </div>

            <div className="h-px bg-border my-2"></div>

            <a
              href="#"
              className="flex items-center justify-center gap-2 text-primary font-semibold text-sm hover:underline"
            >
              <Download size={16} />
              Download Author Guidelines
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
