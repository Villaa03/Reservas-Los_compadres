import React from 'react';
import { RESTAURANT_SETTINGS } from '../constants/settings';

export const Header = () => {
  return (
    <header className="w-full py-6 px-4 flex flex-col items-center justify-center border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <span className="text-2xl md:text-3xl">🌌</span>
        <h1 className="text-xl md:text-2xl font-outfit font-bold tracking-wider gold-gradient-text uppercase m-0 p-0 select-none">
          {RESTAURANT_SETTINGS.name}
        </h1>
        <span className="text-2xl md:text-3xl">🍷</span>
      </div>
      <p className="text-[10px] md:text-xs text-neutral-400 font-sans tracking-widest mt-1 flex items-center gap-1 select-none">
        <span>📍</span> {RESTAURANT_SETTINGS.location.toUpperCase()}
      </p>
    </header>
  );
};

export default Header;
