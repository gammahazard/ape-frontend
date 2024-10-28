import { Button } from "@/components/ui/button";
import { ArrowUpRight } from 'lucide-react';
import SlidingBanner from '@/components/SlidingBanner';

const HomeTab = () => {
  const handleMintClick = () => {
    window.open('https://your-launchpad-url.com', '_blank');
  };

  return (
    <>
      <div className="text-center mb-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Welcome to the Future
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
          Join the most exclusive NFT collection in the metaverse
        </p>
      </div>

      <div className="w-full">
        <SlidingBanner />
      </div>

      <div className="max-w-5xl mx-auto w-full">
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
    </>
  );
};

export default HomeTab;