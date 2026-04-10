import PageTransition from '@/components/PageTransition';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';

const ModelGuruForm = () => {
  const { data, updateModelGuru } = usePortfolio();
  const m = data.model_guru;
  const [newKompetensi, setNewKompetensi] = useState('');
  const [newKarakter, setNewKarakter] = useState('');

  const addKompetensi = () => {
    if (!newKompetensi.trim()) return;
    updateModelGuru({ kompetensi: [...m.kompetensi, { nama: newKompetensi.trim(), level: 50 }] });
    setNewKompetensi('');
  };

  const removeKompetensi = (idx: number) => {
    updateModelGuru({ kompetensi: m.kompetensi.filter((_, i) => i !== idx) });
  };

  const updateKompetensiLevel = (idx: number, level: number) => {
    const updated = [...m.kompetensi];
    updated[idx] = { ...updated[idx], level };
    updateModelGuru({ kompetensi: updated });
  };

  const addKarakter = () => {
    if (!newKarakter.trim()) return;
    updateModelGuru({ karakter: [...m.karakter, newKarakter.trim()] });
    setNewKarakter('');
  };

  const removeKarakter = (idx: number) => {
    updateModelGuru({ karakter: m.karakter.filter((_, i) => i !== idx) });
  };

  return (
    <PageTransition>
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Model Guru yang Dituju</h1>
        <p className="text-muted-foreground">Gambaran guru ideal yang ingin Anda capai.</p>
      </div>

      <Card className="card-shadow">
        <CardHeader><CardTitle className="text-base">Visi</CardTitle><CardDescription>Visi besar Anda sebagai guru</CardDescription></CardHeader>
        <CardContent>
          <Textarea value={m.visi} onChange={e => updateModelGuru({ visi: e.target.value })} placeholder="Tuliskan visi Anda..." rows={3} />
        </CardContent>
      </Card>

      <Card className="card-shadow">
        <CardHeader><CardTitle className="text-base">Misi</CardTitle><CardDescription>Langkah-langkah untuk mencapai visi</CardDescription></CardHeader>
        <CardContent>
          <Textarea value={m.misi} onChange={e => updateModelGuru({ misi: e.target.value })} placeholder="Tuliskan misi Anda (satu per baris)..." rows={5} />
        </CardContent>
      </Card>

      <Card className="card-shadow">
        <CardHeader><CardTitle className="text-base">Kompetensi</CardTitle><CardDescription>Kompetensi yang ingin dikuasai beserta level</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          {m.kompetensi.map((k, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{k.nama}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{k.level}%</span>
                  <Button variant="ghost" size="sm" onClick={() => removeKompetensi(i)}><X className="w-3 h-3" /></Button>
                </div>
              </div>
              <Slider value={[k.level]} onValueChange={([v]) => updateKompetensiLevel(i, v)} max={100} step={5} className="w-full" />
            </div>
          ))}
          <div className="flex gap-2">
            <Input value={newKompetensi} onChange={e => setNewKompetensi(e.target.value)} placeholder="Nama kompetensi..." onKeyDown={e => e.key === 'Enter' && addKompetensi()} />
            <Button variant="outline" onClick={addKompetensi}><Plus className="w-4 h-4" /></Button>
          </div>
        </CardContent>
      </Card>

      <Card className="card-shadow">
        <CardHeader><CardTitle className="text-base">Karakter</CardTitle><CardDescription>Karakter guru yang ingin dimiliki</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {m.karakter.map((k, i) => (
              <Badge key={i} variant="secondary" className="gap-1">
                {k}
                <button onClick={() => removeKarakter(i)}><X className="w-3 h-3" /></button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input value={newKarakter} onChange={e => setNewKarakter(e.target.value)} placeholder="Tambah karakter..." onKeyDown={e => e.key === 'Enter' && addKarakter()} />
            <Button variant="outline" onClick={addKarakter}><Plus className="w-4 h-4" /></Button>
          </div>
        </CardContent>
      </Card>
    </div>
    </PageTransition>
  );
};

export default ModelGuruForm;
