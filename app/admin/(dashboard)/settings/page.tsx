import { prisma } from '@/lib/prisma';
import SettingsClient from './SettingsClient';

export default async function SettingsPage() {
  const settings = await prisma.siteSettings.upsert({ where: { id: 1 }, create: { id: 1 }, update: {} });
  return (
    <SettingsClient
      initial={{
        siteName: settings.siteName, logoText1: settings.logoText1, logoText2: settings.logoText2,
        logoImage: settings.logoImage, favicon: settings.favicon,
        colorGold: settings.colorGold, colorMaroon: settings.colorMaroon, colorCream: settings.colorCream, colorBlack: settings.colorBlack,
      }}
    />
  );
}
