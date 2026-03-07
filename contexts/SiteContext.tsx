import React, { useMemo } from 'react';
import rawSiteConfigMarkdown from '../content/site-config.md?raw';
import { buildSiteConfigFromMarkdown } from '../siteConfig';
import { SiteConfigContext } from './useSiteConfig';

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const config = useMemo(() => buildSiteConfigFromMarkdown(rawSiteConfigMarkdown), [rawSiteConfigMarkdown]);

  return <SiteConfigContext.Provider value={{ config }}>{children}</SiteConfigContext.Provider>;
};
