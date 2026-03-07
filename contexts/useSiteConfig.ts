import { createContext, useContext } from 'react';
import { SiteConfig } from '../types';

interface SiteContextProps {
  config: SiteConfig;
}

export const SiteConfigContext = createContext<SiteContextProps | undefined>(undefined);

export const useSiteConfig = () => {
  const context = useContext(SiteConfigContext);

  if (!context) {
    throw new Error('useSiteConfig must be used within a SiteProvider');
  }

  return context;
};
