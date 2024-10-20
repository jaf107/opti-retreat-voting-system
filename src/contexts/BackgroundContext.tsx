import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

interface BackgroundImages {
  voting: string;
  announcement: string;
  default: string;
}

const backgroundImages: BackgroundImages = {
  voting: "/voting_background.png",
  announcement: "/announcement_background.png",
  default: "/default_background.png",
};

type BackgroundType = keyof BackgroundImages;

interface BackgroundContextType {
  currentBackground: string;
  setBackgroundType: (type: BackgroundType) => void;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export const useBackground = () => {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
};

interface BackgroundProviderProps {
  children: ReactNode;
}

export const BackgroundProvider: React.FC<BackgroundProviderProps> = ({ children }) => {
  const [currentBackground, setCurrentBackground] = useState<string>(backgroundImages.default);

  const setBackgroundType = useCallback((type: BackgroundType) => {
    setCurrentBackground(backgroundImages[type]);
  }, []);

  return (
    <BackgroundContext.Provider value={{ currentBackground, setBackgroundType }}>
      {children}
    </BackgroundContext.Provider>
  );
};

export { backgroundImages };