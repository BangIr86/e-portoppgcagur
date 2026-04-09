import { usePortfolio } from '@/contexts/PortfolioContext';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useRef } from 'react';
import { Camera } from 'lucide-react';

const ProfilForm = () => {
  const { data, updateProfile } = usePortfolio();
  const { user } = useAuth();
  const p = data.profile;
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const ext = file.name.split('.').pop();
    const path = `${user.id}/foto.${ext}`;
    const { error } = await supabase.storage.from('portfolio-files').upload(path, file, { upsert: true });
    if (error) { toast.error('Gagal upload foto'); return; }
    const { data: urlData } = supabase.storage.from('portfolio-files').getPublicUrl(path);
    updateProfile({ foto_url: urlData.publicUrl });
    toast.success('Foto berhasil diupload');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profil Mahasiswa</h1>
        <p className="text-muted-foreground">Data diri dan cerita inspirasi Anda. Perubahan tersimpan otomatis.</p>
      </div>

      <Card className="card-shadow">
        <CardHeader><CardTitle className="text-base">Data Diri</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden cursor-pointer" onClick={() => fileRef.current?.click()}>
              {p.foto_url ? <img src={p.foto_url} alt="Foto" className="w-full h-full object-cover" /> : <Camera className="w-6 h-6 text-muted-foreground" />}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFoto} />
            <div className="flex-1 space-y-2">
              <Label>Nama Lengkap</Label>
              <Input value={p.full_name} onChange={e => updateProfile({ full_name: e.target.value })} placeholder="Nama lengkap Anda" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Asal Daerah</Label><Input value={p.asal_daerah} onChange={e => updateProfile({ asal_daerah: e.target.value })} placeholder="Kota/Kabupaten" /></div>
            <div className="space-y-2"><Label>Asal Kampus</Label><Input value={p.asal_kampus} onChange={e => updateProfile({ asal_kampus: e.target.value })} placeholder="Universitas" /></div>
            <div className="space-y-2"><Label>Bidang Studi</Label><Input value={p.bidang_studi} onChange={e => updateProfile({ bidang_studi: e.target.value })} placeholder="Pendidikan..." /></div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="text-base">Kutipan Motivasi</CardTitle>
          <CardDescription>Akan ditampilkan di hero section portfolio Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea value={p.kutipan_motivasi} onChange={e => updateProfile({ kutipan_motivasi: e.target.value })} placeholder="Tuliskan kutipan atau motivasi Anda..." rows={3} />
        </CardContent>
      </Card>

      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="text-base">Cerita & Inspirasi</CardTitle>
          <CardDescription>Tampil sebagai narasi storytelling di portfolio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Keunikan Daerah Asal</Label>
            <Textarea value={p.keunikan_daerah} onChange={e => updateProfile({ keunikan_daerah: e.target.value })} placeholder="Ceritakan keunikan daerah Anda..." rows={4} />
          </div>
          <div className="space-y-2">
            <Label>Inspirasi Menjadi Guru</Label>
            <Textarea value={p.inspirasi_guru} onChange={e => updateProfile({ inspirasi_guru: e.target.value })} placeholder="Apa yang menginspirasi Anda menjadi guru?" rows={4} />
          </div>
          <div className="space-y-2">
            <Label>Tujuan Menjadi Guru Profesional</Label>
            <Textarea value={p.tujuan_profesional} onChange={e => updateProfile({ tujuan_profesional: e.target.value })} placeholder="Apa tujuan profesional Anda?" rows={4} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilForm;
