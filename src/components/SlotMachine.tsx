import React, { useState, useEffect, useCallback, useRef } from 'react';

type Symbol = '🐒' | '🍌' | '👑' | '🌴' | '🥥' | '🦍';

interface SymbolConfig {
  weight: number;
  value: number;
}

type SymbolConfigMap = {
  [key in Symbol]: SymbolConfig;
};

interface ReelState {
  symbols: Symbol[];
  position: number;
  spinning: boolean;
  glowing: boolean;
}

const SUSPENSE_EXTRA_TIME = 2000;
const SYMBOLS_PER_REEL = 20;
const SYMBOL_HEIGHT = 128;
const REEL_STOP_INTERVALS = [3000, 4000, 5000];

const symbolConfig: SymbolConfigMap = {
  '🍌': { weight: 45, value: 10 },
  '🌴': { weight: 25, value: 20 },
  '🥥': { weight: 15, value: 30 },
  '🐒': { weight: 8, value: 50 },
  '👑': { weight: 5, value: 75 },
  '🦍': { weight: 2, value: 100 }
};

const SlotMachine = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [lever, setLever] = useState(false);
  const [reels, setReels] = useState<ReelState[]>([]);
  const [showWinForm, setShowWinForm] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [freeSpin, setFreeSpin] = useState(false);
  const [showFreeSpin, setShowFreeSpin] = useState(false);

  const reelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const spinningRef = useRef(false);
  const reelSoundRef = useRef<HTMLAudioElement | null>(null);
  const winSoundRef = useRef<HTMLAudioElement | null>(null);
  const finalSymbolsRef = useRef<Symbol[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      reelSoundRef.current = new Audio('/reel.mp3');
      winSoundRef.current = new Audio('/win.mp3');
      if (reelSoundRef.current) {
        reelSoundRef.current.loop = true;
      }
    }

    const initialReels = Array(3).fill(null).map(() => ({
      symbols: generateReelStrip(),
      position: 0,
      spinning: false,
      glowing: false
    }));
    setReels(initialReels);

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

  const getWeightedSymbol = (): Symbol => {
    if (freeSpin && Math.random() < 0.1) {
      return '🦍';
    }

    const symbols = Object.keys(symbolConfig) as Symbol[];
    const weights = Object.values(symbolConfig).map(config => config.weight);
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < symbols.length; i++) {
      random -= symbolConfig[symbols[i]].weight;
      if (random <= 0) return symbols[i];
    }
    return symbols[0];
  };

  const generateReelStrip = (): Symbol[] => {
    return Array(SYMBOLS_PER_REEL).fill(null).map(() => getWeightedSymbol());
  };

  const playSound = useCallback((soundType: 'spin' | 'win' | 'stop') => {
    if (typeof window === 'undefined') return;

    if (soundType === 'spin') {
      if (winSoundRef.current) {
        winSoundRef.current.pause();
        winSoundRef.current.currentTime = 0;
      }
      if (reelSoundRef.current) {
        reelSoundRef.current.currentTime = 0;
        reelSoundRef.current.play().catch(console.error);
      }
    } else if (soundType === 'win') {
      if (reelSoundRef.current) {
        reelSoundRef.current.pause();
      }
      if (winSoundRef.current) {
        winSoundRef.current.currentTime = 0;
        winSoundRef.current.play().catch(console.error);
      }
    } else if (soundType === 'stop') {
      if (reelSoundRef.current) {
        reelSoundRef.current.pause();
      }
    }
  }, []);

  const checkForMatchingPair = (reels: ReelState[]): boolean => {
    if (reels.length < 2) return false;
    return finalSymbolsRef.current[0] === finalSymbolsRef.current[1];
  };

  const handleWinCondition = (stoppedSymbols: Symbol[]) => {
    const isThreeOfAKind = stoppedSymbols.every(symbol => symbol === stoppedSymbols[0]);
    
    if (isThreeOfAKind) {
      if (stoppedSymbols[0] === '🦍') {
        // Gorilla jackpot
        playSound('win');
        setTimeout(() => {
          setShowWinForm(true);
          setFreeSpin(false);
          setShowFreeSpin(false);
        }, 1000);
      } else if (!freeSpin) {
        // Three non-gorilla symbols trigger free spin
        playSound('win');
        setTimeout(() => {
          setShowFreeSpin(true);
          setFreeSpin(true);
        }, 1000);
      } else {
        // Lost on free spin
        playSound('stop');
        setFreeSpin(false);
        setShowFreeSpin(false);
      }
    } else {
      playSound('stop');
      if (freeSpin) {
        setFreeSpin(false);
        setShowFreeSpin(false);
      }
    }
  };

  const spinReel = (reelIndex: number, duration: number, finalSymbol: Symbol) => {
    const reel = reelRefs.current[reelIndex];
    if (!reel) return;

    const finalPosition = -SYMBOL_HEIGHT * (SYMBOLS_PER_REEL - 3 + Math.floor(Math.random() * 3));

    setReels(prevReels => {
      const newReels = [...prevReels];
      const newSymbols = [...newReels[reelIndex].symbols];
      newSymbols[Math.abs(Math.floor(finalPosition / SYMBOL_HEIGHT)) % SYMBOLS_PER_REEL] = finalSymbol;
      newReels[reelIndex] = {
        ...newReels[reelIndex],
        symbols: newSymbols,
        spinning: true,
        glowing: false
      };
      return newReels;
    });

    // Add suspense effect for matching first two symbols
    if (reelIndex === 1) {
      setTimeout(() => {
        if (checkForMatchingPair(reels)) {
          setReels(prevReels => {
            const newReels = [...prevReels];
            newReels[2] = { ...newReels[2], glowing: true };
            return newReels;
          });
        }
      }, duration);
    }

    reel.style.transition = `transform ${duration}ms cubic-bezier(.45,.05,.55,.95)`;
    reel.style.transform = `translateY(${finalPosition}px)`;

    setTimeout(() => {
      setReels(prevReels => {
        const newReels = [...prevReels];
        newReels[reelIndex] = {
          ...newReels[reelIndex],
          spinning: false,
          position: finalPosition
        };
        return newReels;
      });

      // Check for wins after last reel stops
      if (reelIndex === 2) {
        handleWinCondition(finalSymbolsRef.current);
        setIsSpinning(false);
        spinningRef.current = false;

        // Reset glowing state
        setReels(prevReels => {
          const newReels = [...prevReels];
          newReels[2] = { ...newReels[2], glowing: false };
          return newReels;
        });
      }
    }, duration);
  };

  const spin = () => {
    if (spinningRef.current) return;
    
    spinningRef.current = true;
    setIsSpinning(true);
    setShowWinForm(false);
    setShowFreeSpin(false);
    setLever(true);
    playSound('spin');
    
    setTimeout(() => setLever(false), 500);

    // Reset reels
    reelRefs.current.forEach((reel, index) => {  // <-- 'index' is not used
        if (reel) {
          reel.style.transition = 'none';
          reel.style.transform = 'translateY(0)';
        }
      });
    // Force reflow
    reelRefs.current.forEach(reel => {
      if (reel) void reel.offsetHeight;
    });

    // Generate final symbols
    finalSymbolsRef.current = [
      getWeightedSymbol(),
      getWeightedSymbol(),
      getWeightedSymbol()
    ];

    // Calculate intervals with suspense
    const intervals = [...REEL_STOP_INTERVALS];
    if (finalSymbolsRef.current[0] === finalSymbolsRef.current[1]) {
      intervals[2] += SUSPENSE_EXTRA_TIME;
    }

    // Start spinning reels
    intervals.forEach((stopTime, index) => {
      spinReel(index, stopTime, finalSymbolsRef.current[index]);
    });
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
      
      <div className="relative bg-gradient-to-b from-gray-900 to-black rounded-2xl p-12 shadow-2xl 
        border border-white/10 backdrop-blur-sm w-full overflow-hidden">
        {showFreeSpin && !isSpinning && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-10">
            <div className="text-4xl font-bold text-yellow-400 animate-pulse text-center">
              🎉 FREE SPIN TRIGGERED! 🎉
              <div className="text-xl text-yellow-200 mt-4">
                10% chance for Triple Gorilla Jackpot!
              </div>
              <button
                onClick={spin}
                className="mt-6 px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 
                  text-white rounded-xl hover:from-yellow-500 hover:to-yellow-700
                  transform hover:scale-105 transition-all duration-200"
              >
                Use Free Spin
              </button>
            </div>
          </div>
        )}
        
        <div className="flex gap-6 mb-8 justify-center">
          {reels.map((reel, reelIndex) => (
            <div
              key={reelIndex}
              className={`w-32 h-32 overflow-hidden rounded-xl shadow-inner relative border-2 
                ${reel.glowing 
                  ? 'border-yellow-400 shadow-[0_0_15px_rgba(255,215,0,0.5)] animate-pulse' 
                  : 'border-purple-500/30'}`}
            >
              <div
                ref={el => reelRefs.current[reelIndex] = el}
                className="absolute top-0 left-0 w-full"
              >
                {reel.symbols.map((symbol, symbolIndex) => (
                  <div
                    key={symbolIndex}
                    className="w-32 h-32 flex items-center justify-center text-6xl bg-gradient-to-b from-gray-800 to-gray-900"
                  >
                    {symbol}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div 
          className={`absolute -right-12 top-1/2 w-6 h-32 bg-gradient-to-b from-purple-500 to-pink-500 
            rounded-full cursor-pointer transform origin-top transition-all duration-500 
            hover:brightness-110 shadow-lg
            ${lever ? 'rotate-45' : 'rotate-0'}`}
          onClick={!showFreeSpin ? spin : undefined}
        >
          <div className="absolute -bottom-6 w-8 h-8 -left-1 rounded-full bg-pink-600 shadow-lg" />
        </div>
      </div>
      
      <button
        onClick={spin}
        disabled={isSpinning || showFreeSpin}
        className={`px-12 py-4 bg-gradient-to-r from-purple-500 to-pink-500 
          text-white text-xl font-bold rounded-xl
          transform transition-all duration-200 
          ${(isSpinning || showFreeSpin) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:from-purple-600 hover:to-pink-600'}`}
      >
        {isSpinning ? "Spinning..." : showFreeSpin ? "Free Spin Available!" : "SPIN!"}
      </button>

      {showWinForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl p-8 max-w-md w-full border border-purple-500/30">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent text-center">
              🎉 Jackpot! Triple Gorillas! 🎉
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