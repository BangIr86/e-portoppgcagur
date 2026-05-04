// 10 tema visual untuk portfolio publik.
// Setiap tema meng-override CSS variables (HSL) pada wrapper showcase.

export interface PortfolioTheme {
  id: string;
  name: string;
  description: string;
  preview: { from: string; via?: string; to: string }; // raw hsl strings for swatch
  fontFamily: string;
  fontImport?: string; // google fonts URL fragment, e.g. "Playfair+Display:wght@600;700"
  vars: Record<string, string>;
  heroStyle?: 'gradient' | 'solid' | 'image' | 'pattern' | 'split';
}

// Helper to build vars
const t = (
  primary: string,
  accent: string,
  bg: string,
  fg: string,
  card: string,
  muted: string,
  heroGradient: string,
): Record<string, string> => ({
  '--background': bg,
  '--foreground': fg,
  '--card': card,
  '--card-foreground': fg,
  '--popover': card,
  '--popover-foreground': fg,
  '--primary': primary,
  '--primary-foreground': '0 0% 100%',
  '--secondary': muted,
  '--secondary-foreground': fg,
  '--muted': muted,
  '--muted-foreground': '215 10% 45%',
  '--accent': accent,
  '--accent-foreground': '0 0% 100%',
  '--border': '214 20% 88%',
  '--input': '214 20% 88%',
  '--ring': primary,
  '--showcase-hero-bg': heroGradient,
});

export const PORTFOLIO_THEMES: PortfolioTheme[] = [
  {
    id: 'classic-blue',
    name: 'Classic Blue',
    description: 'Akademik profesional, biru klasik (default)',
    preview: { from: 'hsl(215,80%,45%)', to: 'hsl(200,70%,50%)' },
    fontFamily: "'Inter', system-ui, sans-serif",
    vars: t(
      '215 80% 45%', '200 70% 50%',
      '210 20% 98%', '215 25% 15%', '0 0% 100%', '210 15% 95%',
      'linear-gradient(160deg, hsl(215,80%,35%) 0%, hsl(200,70%,45%) 50%, hsl(215,60%,55%) 100%)',
    ),
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    description: 'Tenang & natural, nuansa hijau hutan',
    preview: { from: 'hsl(150,55%,30%)', to: 'hsl(160,50%,45%)' },
    fontFamily: "'Inter', system-ui, sans-serif",
    vars: t(
      '150 55% 32%', '160 50% 42%',
      '90 25% 97%', '150 30% 12%', '0 0% 100%', '120 15% 94%',
      'linear-gradient(160deg, hsl(150,55%,25%) 0%, hsl(160,50%,38%) 50%, hsl(140,45%,48%) 100%)',
    ),
  },
  {
    id: 'sunset-warm',
    name: 'Sunset Warm',
    description: 'Hangat & ramah, gradasi jingga-merah',
    preview: { from: 'hsl(15,80%,55%)', to: 'hsl(40,90%,55%)' },
    fontFamily: "'Inter', system-ui, sans-serif",
    vars: t(
      '15 80% 50%', '40 90% 55%',
      '30 30% 98%', '15 30% 18%', '0 0% 100%', '30 25% 95%',
      'linear-gradient(160deg, hsl(15,80%,45%) 0%, hsl(25,85%,55%) 50%, hsl(40,90%,60%) 100%)',
    ),
  },
  {
    id: 'royal-purple',
    name: 'Royal Purple',
    description: 'Elegan & berani, ungu kerajaan',
    preview: { from: 'hsl(265,60%,45%)', to: 'hsl(285,55%,55%)' },
    fontFamily: "'Playfair Display', Georgia, serif",
    fontImport: 'Playfair+Display:wght@600;700;800',
    vars: t(
      '265 60% 45%', '285 55% 55%',
      '270 30% 98%', '265 30% 15%', '0 0% 100%', '270 20% 95%',
      'linear-gradient(160deg, hsl(265,60%,35%) 0%, hsl(275,55%,45%) 50%, hsl(290,50%,55%) 100%)',
    ),
  },
  {
    id: 'minimal-mono',
    name: 'Minimal Mono',
    description: 'Sangat minimalis, hitam-putih bersih',
    preview: { from: 'hsl(0,0%,15%)', to: 'hsl(0,0%,40%)' },
    fontFamily: "'Inter', system-ui, sans-serif",
    vars: t(
      '0 0% 12%', '0 0% 35%',
      '0 0% 99%', '0 0% 10%', '0 0% 100%', '0 0% 96%',
      'linear-gradient(160deg, hsl(0,0%,8%) 0%, hsl(0,0%,20%) 50%, hsl(0,0%,35%) 100%)',
    ),
  },
  {
    id: 'rose-feminine',
    name: 'Rose Soft',
    description: 'Lembut & feminin, nuansa rose-pink',
    preview: { from: 'hsl(340,70%,55%)', to: 'hsl(355,75%,65%)' },
    fontFamily: "'Playfair Display', Georgia, serif",
    fontImport: 'Playfair+Display:wght@600;700',
    vars: t(
      '340 65% 50%', '355 70% 60%',
      '350 40% 98%', '340 25% 18%', '0 0% 100%', '350 30% 95%',
      'linear-gradient(160deg, hsl(340,65%,45%) 0%, hsl(350,70%,55%) 50%, hsl(15,75%,65%) 100%)',
    ),
  },
  {
    id: 'midnight-dark',
    name: 'Midnight Dark',
    description: 'Gelap modern dengan aksen cyan',
    preview: { from: 'hsl(220,50%,15%)', to: 'hsl(190,80%,50%)' },
    fontFamily: "'Inter', system-ui, sans-serif",
    vars: {
      ...t(
        '190 80% 50%', '170 70% 45%',
        '220 30% 10%', '210 15% 92%', '220 25% 14%', '220 25% 18%',
        'linear-gradient(160deg, hsl(220,50%,10%) 0%, hsl(220,40%,18%) 50%, hsl(190,60%,25%) 100%)',
      ),
      '--border': '220 25% 22%',
      '--input': '220 25% 22%',
      '--muted-foreground': '210 15% 65%',
    },
  },
  {
    id: 'earth-terra',
    name: 'Earth Terra',
    description: 'Earthy tone, coklat-terracotta hangat',
    preview: { from: 'hsl(20,55%,40%)', to: 'hsl(35,50%,55%)' },
    fontFamily: "'Playfair Display', Georgia, serif",
    fontImport: 'Playfair+Display:wght@600;700',
    vars: t(
      '20 55% 38%', '35 50% 50%',
      '35 30% 96%', '20 30% 18%', '0 0% 100%', '35 25% 92%',
      'linear-gradient(160deg, hsl(20,55%,32%) 0%, hsl(28,50%,42%) 50%, hsl(35,50%,52%) 100%)',
    ),
  },
  {
    id: 'ocean-teal',
    name: 'Ocean Teal',
    description: 'Segar & tenang seperti laut tropis',
    preview: { from: 'hsl(185,70%,35%)', to: 'hsl(195,65%,50%)' },
    fontFamily: "'Inter', system-ui, sans-serif",
    vars: t(
      '185 70% 35%', '195 65% 48%',
      '190 30% 97%', '195 35% 15%', '0 0% 100%', '190 25% 94%',
      'linear-gradient(160deg, hsl(185,70%,28%) 0%, hsl(190,65%,40%) 50%, hsl(200,60%,52%) 100%)',
    ),
  },
  {
    id: 'gold-luxe',
    name: 'Gold Luxe',
    description: 'Mewah & berkelas, emas dengan navy',
    preview: { from: 'hsl(220,40%,20%)', to: 'hsl(43,75%,55%)' },
    fontFamily: "'Playfair Display', Georgia, serif",
    fontImport: 'Playfair+Display:wght@600;700;800',
    vars: t(
      '43 70% 45%', '220 40% 25%',
      '40 30% 97%', '220 35% 15%', '0 0% 100%', '40 20% 94%',
      'linear-gradient(160deg, hsl(220,40%,15%) 0%, hsl(220,35%,25%) 60%, hsl(43,70%,45%) 100%)',
    ),
  },
];

export const DEFAULT_THEME_ID = 'classic-blue';

export const getTheme = (id?: string | null): PortfolioTheme =>
  PORTFOLIO_THEMES.find(t => t.id === id) || PORTFOLIO_THEMES[0];

// Convert theme.vars object to a React style object
export const themeToStyle = (theme: PortfolioTheme): React.CSSProperties =>
  ({ ...theme.vars, fontFamily: theme.fontFamily } as React.CSSProperties);

// Inject Google Font import once per theme (idempotent)
const injected = new Set<string>();
export const injectThemeFont = (theme: PortfolioTheme) => {
  if (typeof document === 'undefined' || !theme.fontImport || injected.has(theme.id)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${theme.fontImport}&display=swap`;
  document.head.appendChild(link);
  injected.add(theme.id);
};
