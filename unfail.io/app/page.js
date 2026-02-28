// File: app/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { User, Newspaper, Lightbulb, Youtube, Search, Award, Wand2 } from 'lucide-react';

const initialSarcasticQuotes = [
  "The first step to failure is trying.",
  "It could be worse. You could also be on fire.",
  "Embrace the glorious mess that you are. And we do mean mess.",
  "If at first you don't succeed, maybe skydiving isn't for you.",
  "The difference between genius and stupidity is that genius has its limits.",
  "The light at the end of the tunnel has been turned off due to budget cuts.",
  "If you think nobody cares if you’re alive, try missing a couple of payments.",
  "Don't give up on your dreams. Keep sleeping.",
  "An expert is a person who has made all the mistakes which can be made in a very narrow field.",
  "If at first you don't succeed, destroy all evidence that you tried.",
  "The road to success is dotted with many tempting parking spaces.",
  "I'm not saying it was your fault, I'm just saying I'm blaming you."
];

const HUD_COLOR = "#c6c1b9"; // slightly darker than background

const DoodleBackground = () => (
  <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
    {/* Base grid pattern (always visible) */}
    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {Array.from({ length: 50 }).map((_, i) => (
        <line
          key={`v-${i}`}
          x1={i * 40}
          y1="0"
          x2={i * 40}
          y2="10000"
          stroke={HUD_COLOR}
          strokeWidth="0.5"
          opacity="0.25"
        />
      ))}
      {Array.from({ length: 50 }).map((_, i) => (
        <line
          key={`h-${i}`}
          x1="0"
          y1={i * 40}
          x2="10000"
          y2={i * 40}
          stroke={HUD_COLOR}
          strokeWidth="0.5"
          opacity="0.25"
        />
      ))}
    </svg>

    {/* Always visible: Main circle + rectangle */}
    <svg className="absolute top-20 left-10 w-72 h-72" viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="90" fill="none" stroke={HUD_COLOR} strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
      <circle cx="100" cy="100" r="60" fill="none" stroke={HUD_COLOR} strokeWidth="0.8" strokeDasharray="2 6" opacity="0.4" />
      <rect x="60" y="60" width="80" height="80" fill="none" stroke={HUD_COLOR} strokeWidth="1" opacity="0.4" />
    </svg>

    {/* Desktop-only extra elements */}
    <div className="hidden md:block">
      {/* Crosshair target */}
      <svg className="absolute top-1/4 right-16 w-56 h-56" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="80" fill="none" stroke={HUD_COLOR} strokeWidth="1" opacity="0.35" />
        <circle cx="100" cy="100" r="40" fill="none" stroke={HUD_COLOR} strokeWidth="1" opacity="0.35" />
        <line x1="100" y1="0" x2="100" y2="200" stroke={HUD_COLOR} strokeWidth="0.5" opacity="0.3" />
        <line x1="0" y1="100" x2="200" y2="100" stroke={HUD_COLOR} strokeWidth="0.5" opacity="0.3" />
      </svg>

      {/* Broken arc rings */}
      <svg className="absolute bottom-24 left-1/4 w-72 h-72" viewBox="0 0 200 200">
        <path d="M20,100 A80,80 0 0,1 180,100" stroke={HUD_COLOR} strokeWidth="2" fill="none" opacity="0.3" />
        <path d="M40,100 A60,60 0 0,1 160,100" stroke={HUD_COLOR} strokeWidth="1" fill="none" strokeDasharray="6 8" opacity="0.3" />
      </svg>

      {/* Stacked angled lines */}
      <svg className="absolute top-1/3 left-1/3 w-64 h-64" viewBox="0 0 200 200">
        <line x1="20" y1="200" x2="200" y2="20" stroke={HUD_COLOR} strokeWidth="1" opacity="0.3" />
        <line x1="0" y1="180" x2="180" y2="0" stroke={HUD_COLOR} strokeWidth="1" opacity="0.2" />
        <line x1="40" y1="200" x2="200" y2="40" stroke={HUD_COLOR} strokeWidth="0.5" strokeDasharray="4 6" opacity="0.25" />
      </svg>

      {/* Concentric small circles */}
      <svg className="absolute bottom-10 right-1/3 w-48 h-48" viewBox="0 0 200 200">
        {[...Array(5)].map((_, i) => (
          <circle
            key={i}
            cx="100"
            cy="100"
            r={20 + i * 15}
            fill="none"
            stroke={HUD_COLOR}
            strokeWidth="0.5"
            opacity="0.3"
          />
        ))}
      </svg>

      {/* Rectangle frame with offset lines */}
      <svg className="absolute top-10 right-1/2 w-52 h-52" viewBox="0 0 200 200">
        <rect x="20" y="20" width="160" height="160" fill="none" stroke={HUD_COLOR} strokeWidth="1" opacity="0.35" />
        <line x1="20" y1="50" x2="180" y2="50" stroke={HUD_COLOR} strokeWidth="0.5" opacity="0.3" />
        <line x1="20" y1="150" x2="180" y2="150" stroke={HUD_COLOR} strokeWidth="0.5" opacity="0.3" />
      </svg>
    </div>
  </div>
);

// Splash Screen Component
const SplashScreen = ({ isFadingOut }) => (
  <div className={`flex justify-center items-center h-screen bg-[#FDFCF8] transition-opacity duration-500 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-800">Unfail.io</h1>
      <p className="text-xl text-gray-600 italic mt-4">Where your plot twists begin</p>
    </div>
  </div>
);


export default function HomePage() {
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isInitialState, setIsInitialState] = useState(true);
  const [randomQuote, setRandomQuote] = useState('');
  const [startAnimation, setStartAnimation] = useState(false);

  const [userInput, setUserInput] = useState('');
  const [apiResponse, setApiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Timer to start the fade-out process
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2000); // Start fading out after 2 seconds

    // Timer to hide the splash screen component completely after fade out
    const hideTimer = setTimeout(() => {
      setShowSplashScreen(false);
    }, 2500); // Remove from DOM after 2.5 seconds (2000ms + 500ms fade)

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    // This effect runs once the splash screen is hidden
    if (!showSplashScreen) {
      setRandomQuote(initialSarcasticQuotes[Math.floor(Math.random() * initialSarcasticQuotes.length)]);
      
      const animationTimer = setTimeout(() => {
        setStartAnimation(true);
      }, 100);

      return () => clearTimeout(animationTimer);
    }
  }, [showSplashScreen]);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userInput) return;

    if (isInitialState) {
      setIsInitialState(false);
    }

    setIsLoading(true);
    setError(null);
    setApiResponse(null);

    try {
      const response = await fetch('/api/get-solution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }
      const data = await response.json();
      setApiResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const sketchyBorderStyle = {
    border: '2px solid #1f2937',
    borderRadius: '15px 225px 15px 255px / 255px 15px 225px 15px',
    boxShadow: 'rgba(0, 0, 0, 0.1) 4px 4px 0 0',
  };

  if (showSplashScreen) {
    return <SplashScreen isFadingOut={isFadingOut} />;
  }

  return (
    <div className="relative flex flex-col min-h-screen p-4 md:p-6 bg-[#FDFCF8] text-gray-800 overflow-hidden">
      <DoodleBackground />
      <header className="w-full max-w-5xl mx-auto z-10">
        <h1 className="text-4xl font-bold text-gray-800">
            Unfail.io
        </h1>
      </header>

      <main className={`flex-grow flex flex-col w-full max-w-3xl mx-auto overflow-y-auto pt-4 transition-all duration-700 ease-in-out ${isInitialState ? 'justify-center' : 'justify-start'} ${!isInitialState ? 'pb-32' : ''}`}>
        {isInitialState && (
            <div className={`text-center space-y-8 ${startAnimation ? 'animate-fade-in' : 'opacity-0'}`}>
                <p className="text-gray-600 text-3xl italic">
                  "{randomQuote}"
                </p>
                <form onSubmit={handleSubmit} className="w-full relative mt-4">
                  <input
                    type="text"
                    value={userInput}
                    onChange={handleInputChange}
                    placeholder="Tell me what went sideways..."
                    className="w-full bg-white rounded-full py-4 pl-6 pr-14 text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    style={{...sketchyBorderStyle, border: '3px solid #1f2937'}}
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-purple-600 rounded-full transition-colors">
                    <Search className="w-6 h-6" />
                  </button>
                </form>
            </div>
        )}

        {!isInitialState && (
            <div className="w-full space-y-8">
                {isLoading && <div className="text-center text-gray-600 text-xl animate-fade-in">Doodling up some ideas...</div>}
                {error && <div className="text-center text-red-600 animate-fade-in">{error}</div>}
                {apiResponse && (
                    <>
                        <p className="text-center text-2xl italic text-gray-700 animate-fade-in">"{apiResponse.motivationalQuote}"</p>
                        
                        <div className="flex flex-col space-y-8">
                            {/* Card 1: Official Title */}
                            <div className="p-6 rounded-lg animate-card-in" style={{...sketchyBorderStyle, backgroundColor: '#F3E8FF', animationDelay: '100ms'}}>
                                <h3 className="font-bold text-2xl mb-3 flex items-center"><Award className="w-6 h-6 mr-2"/> Your Official Title</h3>
                                <p className="text-gray-700 text-xl italic">{apiResponse.failureTitle}</p>
                            </div>

                            {/* Card 2: The Solution */}
                            <div className="p-6 rounded-lg animate-card-in" style={{...sketchyBorderStyle, backgroundColor: '#E0F2FE', animationDelay: '200ms'}}>
                                <h3 className="font-bold text-2xl mb-3 flex items-center"><Lightbulb className="w-6 h-6 mr-2"/> Your Suggested Path</h3>
                                <p className="text-gray-700 text-lg whitespace-pre-wrap">{apiResponse.solution}</p>
                            </div>

                            {/* Card 3: News */}
                            <div className="p-6 rounded-lg animate-card-in" style={{...sketchyBorderStyle, backgroundColor: '#FEE2E2', animationDelay: '300ms'}}>
                                <h3 className="font-bold text-2xl mb-3 flex items-center"><Newspaper className="w-6 h-6 mr-2"/> Latest Opportunities</h3>
                                <ul className="space-y-3">
                                  {apiResponse.articles && apiResponse.articles.length > 0 ? (
                                    apiResponse.articles.map((article, i) => (
                                      <li key={i}>
                                        <a href={article.url} target="_blank" rel="noopener noreferrer" className="font-bold text-lg text-gray-800 hover:text-red-700">
                                          {article.title}
                                        </a>
                                      </li>
                                    ))
                                  ) : (
                                    <p className="text-gray-600">No recent news found for this topic.</p>
                                  )}
                                </ul>
                            </div>
                            
                            {/* Card 4: YouTube Videos */}
                            <div className="p-6 rounded-lg animate-card-in" style={{...sketchyBorderStyle, backgroundColor: '#D1FAE5', animationDelay: '400ms'}}>
                                <h3 className="font-bold text-2xl mb-3 flex items-center"><Youtube className="w-6 h-6 mr-2"/> Video Guides</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                  {apiResponse.youtubeVideos && apiResponse.youtubeVideos.length > 0 ? (
                                    apiResponse.youtubeVideos.map((video) => (
                                      <a key={video.id} href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer" className="group">
                                        <img src={video.thumbnail} alt={video.title} className="w-full mb-2" style={{...sketchyBorderStyle, border: '2px solid #064E3B'}}/>
                                        <p className="text-md font-bold text-gray-800 group-hover:text-green-800 line-clamp-2">{video.title}</p>
                                      </a>
                                    ))
                                  ) : (
                                    <p className="text-gray-600 sm:col-span-3">No relevant videos found.</p>
                                  )}
                                </div>
                            </div>

                            {/* Card 5: Related Personality */}
                            <div className="p-6 rounded-lg animate-card-in" style={{...sketchyBorderStyle, backgroundColor: '#FEF3C7', animationDelay: '500ms'}}>
                                <h3 className="font-bold text-2xl mb-3 flex items-center"><User className="w-6 h-6 mr-2"/> You're in Good Company</h3>
                                <h4 className="font-bold text-2xl text-gray-800">{apiResponse.relatedPersonality?.name}</h4>
                                <p className="text-gray-700 mt-2 text-lg">{apiResponse.relatedPersonality?.story}</p>
                            </div>

                             {/* Card 6: Useless Life Hack */}
                             <div className="p-6 rounded-lg animate-card-in" style={{...sketchyBorderStyle, backgroundColor: '#FCE7F3', animationDelay: '600ms'}}>
                                <h3 className="font-bold text-2xl mb-3 flex items-center"><Wand2 className="w-6 h-6 mr-2"/> A Useless Life Hack</h3>
                                <p className="text-gray-700 text-lg">{apiResponse.uselessLifeHack}</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        )}
      </main>

      {!isInitialState && (
        <footer className="fixed bottom-0 left-0 right-0 z-20 bg-[#FDFCF8] bg-opacity-80 backdrop-blur-sm">
          <div className="w-full max-w-3xl mx-auto p-4 animate-fade-in">
            <form onSubmit={handleSubmit} className="w-full relative">
              <input
                type="text"
                value={userInput}
                onChange={handleInputChange}
                placeholder="Tell me what went sideways..."
                className="w-full bg-white rounded-full py-4 pl-6 pr-14 text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                style={{...sketchyBorderStyle, border: '3px solid #1f2937'}}
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-purple-600 rounded-full transition-colors">
                <Search className="w-6 h-6" />
              </button>
            </form>
          </div>
        </footer>
      )}
    </div>
  );
}
