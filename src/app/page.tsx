"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpRight, Twitter } from 'lucide-react';
import SlidingBanner from '@/components/SlidingBanner';

const DiscordIcon = () => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

const Home = () => {
  const handleMintClick = () => {
    window.open('https://your-launchpad-url.com', '_blank');
  };

  return (
    <main className="flex flex-col min-h-screen bg-[#030303] relative">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 w-full bg-black/80 backdrop-blur-sm z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex justify-between items-center h-16">
            <div className="text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              LUCID APES
            </div>
            <div className="flex items-center gap-6">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                className="hover:text-purple-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer"
                className="hover:text-purple-400 transition-colors">
                <DiscordIcon />
              </a>
            </div>
          </nav>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-8 gap-8">
        {/* Hero Section */}
        <div className="text-center mb-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Welcome to the Future
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Join the most exclusive NFT collection in the metaverse
          </p>
        </div>

        {/* Banner Section */}
        <div className="w-full">
          <SlidingBanner />
        </div>

        {/* Collection Info Section - Moved closer to banner */}
        <div className="max-w-5xl mx-auto w-full -mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 place-items-center">
            <div className="flex gap-12 items-center justify-center w-full">
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                  10,000
                </p>
                <p className="text-gray-400 text-sm mt-1">Total Supply</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                  3 APE
                </p>
                <p className="text-gray-400 text-sm mt-1">Mint Price</p>
              </div>
            </div>

            <Button 
              onClick={handleMintClick}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-7 rounded-xl flex items-center gap-2 justify-center transform hover:scale-105 transition-all duration-300 text-lg w-full max-w-sm"
            >
              Mint Now
              <ArrowUpRight className="w-6 h-6" />
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-400">
                Powered by Magic Eden
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;