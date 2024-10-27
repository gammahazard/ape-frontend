import React, { useState, useEffect, useCallback, useRef } from 'react';

type Symbol = '🍒' | '💎' | '7' | '🍀' | '⭐' | '🎰';

interface SymbolConfig {
  weight: number;
  value: number;
}

type SymbolConfigMap = {
  [key in Symbol]: SymbolConfig;
};

const SlotMachine = () => {
  const [spinning, setSpinning] = useState(false);
  const [slots, setSlots] = useState<Symbol[]>(['7', '7', '7']);
  const [lever, setLever] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [showWinForm, setShowWinForm] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  
  // Use refs for audio elements
  const reelSoundRef = useRef<HTMLAudioElement | null>(null);
  const winSoundRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio elements on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      reelSoundRef.current = new Audio('/reel.mp3');
      winSoundRef.current = new Audio('/win.mp3');
      
      if (reelSoundRef.current) {
        reelSoundRef.current.loop = true;
      }
    }

    return () => {
      if (reelSoundRef.current) {
        reelSoundRef.current.pause();
        reelSoundRef.current = null;
      }
      if (winSoundRef.current) {
        winSoundRef.current.pause();
        winSoundRef.current = null;
      }
    };
  }, []);

  const symbolConfig: SymbolConfigMap = {
    '🍒': { weight: 35, value: 10 },
    '💎': { weight: 20, value: 50 },
    '7': { weight: 10, value: 100 },
    '🍀': { weight: 25, value: 25 },
    '⭐': { weight: 30, value: 15 },
    '🎰': { weight: 15, value: 75 }
  };
  
  const symbols: Symbol[] = Object.keys(symbolConfig) as Symbol[];

  const playSound = useCallback((soundType: 'spin' | 'win' | 'stop') => {
    if (typeof window === 'undefined') return;

    if (soundType === 'spin') {
      if (winSoundRef.current) {
        winSoundRef.current.pause();
        winSoundRef.current.currentTime = 0;
      }
      if (reelSoundRef.current) {
        reelSoundRef.current.currentTime = 0;
        reelSoundRef.current.play().catch(e => console.log('Audio playback failed:', e));
      }
    } else if (soundType === 'win') {
      if (reelSoundRef.current) {
        reelSoundRef.current.pause();
        reelSoundRef.current.currentTime = 0;
      }
      if (winSoundRef.current) {
        winSoundRef.current.currentTime = 0;
        winSoundRef.current.play().catch(e => console.log('Audio playback failed:', e));
      }
    } else if (soundType === 'stop') {
      if (reelSoundRef.current) {
        reelSoundRef.current.pause();
        reelSoundRef.current.currentTime = 0;
      }
    }
  }, []);

  const checkWin = (finalSlots: Symbol[]): number => {
    if (finalSlots[0] === finalSlots[1] && finalSlots[1] === finalSlots[2]) {
      return symbolConfig[finalSlots[0]].value * 3;
    }
    if (finalSlots[0] === finalSlots[1] || finalSlots[1] === finalSlots[2]) {
      return symbolConfig[finalSlots[1]].value;
    }
    return 0;
  };

  const getWeightedSymbol = (): Symbol => {
    const weights = Object.values(symbolConfig).map(config => config.weight);
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < symbols.length; i++) {
      random -= symbolConfig[symbols[i]].weight;
      if (random <= 0) return symbols[i];
    }
    return symbols[0];
  };

  const spin = () => {
    if (spinning) return;
    
    setLever(true);
    setSpinning(true);
    setIsWin(false);
    setShowWinForm(false);
    playSound('spin');
    
    setTimeout(() => setLever(false), 500);
    
    let spins = 0;
    const maxSpins = 20;
    const spinInterval = setInterval(() => {
      setSlots(prevSlots => 
        prevSlots.map(() => getWeightedSymbol())
      );
      spins++;
      
      if (spins >= maxSpins) {
        clearInterval(spinInterval);
        const finalSlots: Symbol[] = [getWeightedSymbol(), getWeightedSymbol(), getWeightedSymbol()];
        setSlots(finalSlots);
        const winAmount = checkWin(finalSlots);
        
        if (winAmount > 0) {
          playSound('win');
          setIsWin(true);
          setTimeout(() => setShowWinForm(true), 1000);
        } else {
          playSound('stop');
        }
        setSpinning(false);
      }
    }, 100);
  };

  const handleWinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Winner wallet address:', walletAddress);
    setShowWinForm(false);
    setWalletAddress('');
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8 w-full max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
        Try Your Luck
      </h2>
      
      <div className={`relative bg-gradient-to-b from-gray-900 to-black rounded-2xl p-12 shadow-2xl 
        border border-white/10 backdrop-blur-sm w-full
        ${isWin ? 'animate-pulse' : ''}`}>
        <div className="flex gap-6 mb-8 justify-center">
          {slots.map((symbol, index) => (
            <div
              key={index}
              className={`w-32 h-32 flex items-center justify-center text-6xl 
                bg-gradient-to-b from-gray-800 to-gray-900
                rounded-xl shadow-inner border-2 border-purple-500/30
                ${spinning ? 'animate-bounce' : ''} 
                ${isWin ? 'bg-gradient-to-r from-purple-400/20 to-pink-600/20 border-purple-400' : ''}`}
              style={{
                transition: 'all 0.1s ease-in-out',
                animationDelay: `${index * 0.1}s`
              }}
            >
              {symbol}
            </div>
          ))}
        </div>
        
        <div 
          className={`absolute -right-12 top-1/2 w-6 h-32 bg-gradient-to-b from-purple-500 to-pink-500 
            rounded-full cursor-pointer transform origin-top transition-all duration-500 
            hover:brightness-110 shadow-lg
            ${lever ? 'rotate-45' : 'rotate-0'}`}
          onClick={spin}
        >
          <div className="absolute -bottom-6 w-8 h-8 -left-1 rounded-full bg-pink-600 shadow-lg" />
        </div>
      </div>
      
      <button
        onClick={spin}
        disabled={spinning}
        className={`px-12 py-4 bg-gradient-to-r from-purple-500 to-pink-500 
          text-white text-xl font-bold rounded-xl
          transform transition-all duration-200 
          ${spinning ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:from-purple-600 hover:to-pink-600'}`}
      >
        {spinning ? 'Spinning...' : 'SPIN!'}
      </button>

      {showWinForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl p-8 max-w-md w-full border border-purple-500/30">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent text-center">
              🎉 Congratulations! You've Won! 🎉
            </h2>
            <form onSubmit={handleWinSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2">
                  Enter your wallet address to claim your prize:
                </label>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="w-full p-3 bg-gray-900 border border-purple-500/30 rounded-xl 
                    focus:ring-2 focus:ring-purple-500 focus:border-transparent
                    text-white"
                  placeholder="0x..."
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 
                    text-white rounded-xl hover:from-purple-600 hover:to-pink-600 
                    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50
                    transform hover:scale-105 transition-all duration-200"
                >
                  Claim Prize
                </button>
                <button
                  type="button"
                  onClick={() => setShowWinForm(false)}
                  className="px-6 py-3 bg-gray-800 text-white rounded-xl 
                    hover:bg-gray-700 focus:outline-none focus:ring-2 
                    focus:ring-gray-500 focus:ring-opacity-50"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotMachine;