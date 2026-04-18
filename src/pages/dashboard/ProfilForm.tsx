import PageTransition from '@/components/PageTransition';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import SlugEditor from '@/components/SlugEditor';

const ProfilForm = () => {
  const { data, updateProfile } = usePortfolio();
  const p = data.profile;
  const [generating, setGenerating] = useState(false);

  const generateNarasi = async () => {
    if (!p.full_name || (!p.keunikan_daerah && !p.inspirasi_guru && !p.tujuan_profesional)) {
      toast.error('Isi minimal nama lengkap dan salah satu field cerita terlebih dahulu.');
      return;
    }
    setGenerating(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('narasi-profil', {
        body: {
          full_name: p.full_name,
          asal_daerah: p.asal_daerah,
          keunikan_daerah: p.keunikan_daerah,
          inspirasi_guru: p.inspirasi_guru,
          tujuan_profesional: p.tujuan_profesional,
        },
      });
      if (error) {
        const msg = (error as any)?.context?.status === 429 ? 'Terlalu banyak permintaan, coba lagi sebentar.'
          : (error as any)?.context?.status === 402 ? 'Kredit AI habis. Silakan top up.'
          : 'Gagal menyusun narasi.';
        toast.error(msg);
        return;
      }
      if (result?.narasi) {
        updateProfile({ narasi_storytelling: result.narasi });
        toast.success('Narasi berhasil disusun');
      }
    } catch {
      toast.error('Gagal menyusun narasi');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profil Mahasiswa</h1>
          <p className="text-muted-foreground">Cerita dan storytelling profesional Anda. Tampilan publik akan dirender sebagai narasi artikel.</p>
        </div>

        <SlugEditor />

        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-base">Cerita Diri</CardTitle>
            <CardDescription>Tiga bagian inti yang akan dirangkai menjadi narasi storytelling</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Keunikan Daerah Asal</Label>
              <Textarea value={p.keunikan_daerah} onChange={e => updateProfile({ keunikan_daerah: e.target.value })} placeholder="Ceritakan keunikan budaya, geografis, atau sosial daerah asal Anda..." rows={4} />
            </div>
            <div className="space-y-2">
              <Label>Inspirasi Menjadi Guru</Label>
              <Textarea value={p.inspirasi_guru} onChange={e => updateProfile({ inspirasi_guru: e.target.value })} placeholder="Apa pengalaman atau sosok yang menginspirasi Anda menjadi guru?" rows={4} />
            </div>
            <div className="space-y-2">
              <Label>Tujuan Menjadi Guru Profesional</Label>
              <Textarea value={p.tujuan_profesional} onChange={e => updateProfile({ tujuan_profesional: e.target.value })} placeholder="Apa tujuan jangka panjang Anda sebagai guru profesional?" rows={4} />
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow border-primary/30">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-base">Narasi Storytelling</CardTitle>
                <CardDescription>Versi artikel yang ditampilkan di portfolio publik. Bisa disusun otomatis dari 3 cerita di atas.</CardDescription>
              </div>
              <Button onClick={generateNarasi} disabled={generating} size="sm" variant="default">
                <Sparkles className="w-4 h-4 mr-2" />
                {generating ? 'Menyusun...' : 'Bantu susun narasi'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={p.narasi_storytelling}
              onChange={e => updateProfile({ narasi_storytelling: e.target.value })}
              placeholder="Narasi akan muncul di sini setelah Anda klik 'Bantu susun narasi'. Anda juga bisa menulis manual dan mengeditnya."
              rows={12}
            />
            <p className="text-xs text-muted-foreground mt-2">Narasi ini yang akan muncul di halaman Profil portfolio publik sebagai artikel storytelling.</p>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
};

export default ProfilForm;
