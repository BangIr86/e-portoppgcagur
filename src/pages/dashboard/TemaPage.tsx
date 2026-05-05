import { motion } from 'framer-motion';
import { Check, Palette, RotateCcw } from 'lucide-react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { PORTFOLIO_THEMES, DEFAULT_THEME_ID } from '@/lib/themes';
import PageTransition from '@/components/PageTransition';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const TemaPage = () => {
  const { theme, updateTheme, saving } = usePortfolio();
  const isDefault = theme === DEFAULT_THEME_ID;

  const handleReset = async () => {
    if (isDefault) return;
    await updateTheme(DEFAULT_THEME_ID);
    toast.success('Tema dikembalikan ke default (Classic Blue)');
  };

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
                  className="h-28 relative"
                  style={{ background: `linear-gradient(135deg, ${t.preview.from} 0%, ${t.preview.to} 100%)` }}
                >
                  {active && (
                    <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/95 flex items-center justify-center shadow">
                      <Check className="w-4 h-4 text-primary" strokeWidth={3} />
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 flex gap-1.5">
                    <span className="w-5 h-5 rounded-full border border-white/60" style={{ background: t.preview.from }} />
                    <span className="w-5 h-5 rounded-full border border-white/60" style={{ background: t.preview.to }} />
                  </div>
                </div>
                <div className="p-4 bg-card">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-foreground" style={{ fontFamily: t.headingFont }}>{t.name}</p>
                    {active && <Badge className="text-[10px] h-5">Aktif</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{t.description}</p>
                </div>
              </motion.button>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground">
          Perubahan tema langsung diterapkan pada link publik Anda. Lihat hasilnya di halaman <strong>Preview Portfolio</strong>.
        </p>
      </div>
    </PageTransition>
  );
};

export default TemaPage;
