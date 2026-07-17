// Fixed whitelist of inline icons the CMS can attach to cards/products/
// info items by key. Admin input only ever selects a *key* from this
// list — never raw SVG/HTML — which rules out stored XSS via crafted
// markup in an "icon" field.
import type { JSX, CSSProperties } from 'react';

type IconProps = { className?: string; style?: CSSProperties };

const paths: Record<string, JSX.Element> = {
  ring: (
    <>
      <circle cx="12" cy="15" r="6" />
      <path d="M8.5 9 12 3l3.5 6" />
    </>
  ),
  necklace: (
    <>
      <path d="M4 4c0 5 3 7 8 7s8-2 8-7" />
      <circle cx="12" cy="17" r="3.4" />
    </>
  ),
  earring: (
    <>
      <circle cx="12" cy="6" r="2.2" />
      <path d="M12 8.2v5" />
      <path d="M8.5 13.2h7l-1.4 6.6a2.2 2.2 0 0 1-4.2 0z" />
    </>
  ),
  bangle: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.2" />
    </>
  ),
  bridal: (
    <>
      <path d="M4 10 12 4l8 6-8 10z" />
      <path d="M4 10h16" />
    </>
  ),
  watch: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </>
  ),
  shield: <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" />,
  truck: (
    <>
      <rect x="2" y="7" width="15" height="11" rx="1" />
      <path d="M17 10h3l2 3v5h-5z" />
      <circle cx="7" cy="19" r="1.6" />
      <circle cx="18" cy="19" r="1.6" />
    </>
  ),
  refresh: (
    <>
      <path d="M3 12a9 9 0 1 1 3 6.7" />
      <path d="M3 17v-4h4" />
    </>
  ),
  certificate: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  handcraft: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12h8M12 8v8" />
    </>
  ),
  ethical: <path d="M12 21s-7-4.6-9.5-8.8C.6 8.4 2 5 5.4 4.4 7.7 4 9.9 5.2 12 7.5c2.1-2.3 4.3-3.5 6.6-3.1C22 5 23.4 8.4 21.5 12.2 19 16.4 12 21 12 21z" />,
  location: (
    <>
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.4 2.1L8 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.4c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2.3z" />,
  mail: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 6 10 7 10-7" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </>
  ),
};

export const ICON_KEYS = Object.keys(paths);

export function IconGlyph({ name, className, style }: IconProps & { name: string }) {
  const glyph = paths[name] || paths.ring;
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      {glyph}
    </svg>
  );
}
