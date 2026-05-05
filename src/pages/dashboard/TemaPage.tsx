import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Palette, RotateCcw, Type, Sliders } from 'lucide-react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { PORTFOLIO_THEMES, DEFAULT_THEME_ID, injectThemeFont, getTheme, resolveUppercase } from '@/lib/themes';
import PageTransition from '@/components/PageTransition';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const TemaPage = () => {
  const { theme, themeOverrides, updateTheme, updateThemeOverrides, resetThemeOverrides, saving } = usePortfolio();
  const isDefault = theme === DEFAULT_THEME_ID;
  const activeTheme = getTheme(theme);
  const uppercaseOn = resolveUppercase(activeTheme, themeOverrides);

  // Letter spacing dalam em (×100 agar Slider integer). Default ambil dari override → tema → 0.
  const parseEm = (v?: string) => v ? parseFloat(v.replace('em', '')) : 0;
  const currentTracking = themeOverrides.letterSpacingHeading !== undefined
    ? parseEm(themeOverrides.letterSpacingHeading)
    : parseEm(activeTheme.letterSpacingHeading);
  const trackingValue = Math.round(currentTracking * 100);

  // Preload semua font tema agar setiap kartu menampilkan tipografi aslinya
  useEffect(() => {
    PORTFOLIO_THEMES.forEach(injectThemeFont);
  }, []);

  const handleReset = async () => {
    if (isDefault) return;
    await updateTheme(DEFAULT_THEME_ID);
    toast.success('Tema dikembalikan ke default (Classic Blue)');
  };

  const fontLabel = (font: string) => font.split(',')[0].replace(/['"]/g, '');

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
              <Palette className="w-6 h-6 text-primary" /> Tema Portfolio
            </h1>
            <p className="text-sm text-muted-foreground">Pilih salah satu dari 10 tema visual untuk halaman portfolio publik Anda.</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={isDefault || saving}
            title={isDefault ? 'Sudah menggunakan tema default' : 'Kembalikan ke Classic Blue'}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Kembalikan ke default
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PORTFOLIO_THEMES.map((t, i) => {
            const active = theme === t.id;
            return (
              <motion.button
                key={t.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => updateTheme(t.id)}
                disabled={saving}
                className={`text-left rounded-xl border-2 overflow-hidden transition-all hover:shadow-md ${
                  active ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/40'
                }`}
              >
                <div
                  className="h-32 relative flex items-center justify-center px-4"
                  style={{ background: `linear-gradient(135deg, ${t.preview.from} 0%, ${t.preview.to} 100%)` }}
                >
                  {active && (
                    <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/95 flex items-center justify-center shadow">
                      <Check className="w-4 h-4 text-primary" strokeWidth={3} />
                    </div>
                  )}
                  <span
                    className="text-white text-2xl font-bold drop-shadow text-center"
                    style={{ fontFamily: t.headingFont, letterSpacing: t.letterSpacingHeading, textTransform: t.uppercaseHeadings ? 'uppercase' : 'none' }}
                  >
                    Aa Bb Cc
                  </span>
                  <div className="absolute bottom-2 left-2 flex gap-1.5">
                    <span className="w-5 h-5 rounded-full border border-white/60" style={{ background: t.preview.from }} />
                    <span className="w-5 h-5 rounded-full border border-white/60" style={{ background: t.preview.to }} />
                  </div>
                </div>
                <div className="p-4 bg-card">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-foreground" style={{ fontFamily: t.headingFont, letterSpacing: t.letterSpacingHeading, textTransform: t.uppercaseHeadings ? 'uppercase' : 'none' }}>{t.name}</p>
                    {active && <Badge className="text-[10px] h-5">Aktif</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-2" style={{ fontFamily: t.bodyFont }}>{t.description}</p>
                  <p className="text-[10px] text-muted-foreground/80 flex items-center gap-1">
                    <Type className="w-3 h-3" />
                    <span>{fontLabel(t.headingFont)} <span className="opacity-50">+</span> {fontLabel(t.bodyFont)}</span>
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Kustomisasi tipografi heading */}
        <div className="rounded-xl border bg-card p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <Sliders className="w-4 h-4 text-primary" /> Kustomisasi Heading
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Sesuaikan tampilan judul untuk tema <strong>{activeTheme.name}</strong>.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => { await resetThemeOverrides(); toast.success('Kustomisasi direset'); }}
              disabled={saving || (themeOverrides.uppercaseHeadings === undefined && themeOverrides.letterSpacingHeading === undefined)}
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Reset kustomisasi
            </Button>
          </div>

          <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-muted/40">
            <div className="min-w-0">
              <Label htmlFor="uppercase-toggle" className="font-medium text-foreground">UPPERCASE Headings</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Tampilkan semua judul dengan huruf kapital.</p>
            </div>
            <Switch
              id="uppercase-toggle"
              checked={uppercaseOn}
              onCheckedChange={(v) => updateThemeOverrides({ uppercaseHeadings: v })}
              disabled={saving}
            />
          </div>

          <div className="p-4 rounded-lg bg-muted/40 space-y-3">
            <div className="flex items-center justify-between">
              <Label className="font-medium text-foreground">Letter spacing heading</Label>
              <span className="text-xs font-mono text-muted-foreground">{currentTracking.toFixed(2)}em</span>
            </div>
            <Slider
              min={-5}
              max={20}
              step={1}
              value={[trackingValue]}
              onValueChange={(v) => updateThemeOverrides({ letterSpacingHeading: `${(v[0] / 100).toFixed(2)}em` })}
              disabled={saving}
            />
            <p className="text-xs text-muted-foreground">Geser ke kiri untuk lebih rapat, ke kanan untuk lebih renggang.</p>
          </div>

          {/* Preview live */}
          <div
            className="p-5 rounded-lg border bg-background"
            style={{
              fontFamily: activeTheme.headingFont,
              letterSpacing: `${currentTracking}em`,
              textTransform: uppercaseOn ? 'uppercase' : 'none',
            }}
          >
            <p className="text-2xl font-bold text-foreground">Contoh Judul Heading</p>
            <p className="text-sm text-muted-foreground mt-1" style={{ textTransform: 'none', letterSpacing: 'normal', fontFamily: activeTheme.bodyFont }}>
              Body text contoh menggunakan font {fontLabel(activeTheme.bodyFont)}.
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Perubahan tema langsung diterapkan pada link publik Anda. Lihat hasilnya di halaman <strong>Preview Portfolio</strong>.
        </p>
      </div>
    </PageTransition>
  );
};

export default TemaPage;
