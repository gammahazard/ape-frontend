import SlotMachine from '@/components/SlotMachine';

const WhitelistTab = () => {
  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Get Whitelisted
        </h2>
        <p className="text-gray-400 text-lg">
          Try your luck with our slot machine to win a whitelist spot!
        </p>
      </div>
      <SlotMachine />
    </div>
  );
};

export default WhitelistTab;