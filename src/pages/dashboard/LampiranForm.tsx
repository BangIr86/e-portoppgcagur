import PageTransition from '@/components/PageTransition';
import { usePortfolio, LampiranItem } from '@/contexts/PortfolioContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRef, useState } from 'react';
import { Upload, FileText, Trash2, Image as ImageIcon } from 'lucide-react';

const LampiranForm = () => {
  const { data, addLampiran, removeLampiran } = usePortfolio();
  const { user } = useAuth();
  const fileRef7 = useRef<HTMLInputElement>(null);
  const fileRef8 = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File, tipe: 'lampiran_7' | 'lampiran_8') => {
    if (!user) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const id = crypto.randomUUID();
    const path = `${user.id}/${tipe}/${id}.${ext}`;
    const { error } = await supabase.storage.from('portfolio-files').upload(path, file);
    if (error) { toast.error('Gagal upload file'); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from('portfolio-files').getPublicUrl(path);
    const item: LampiranItem = {
      id, nama: file.name, tipe, file_url: urlData.publicUrl,
      file_type: file.type.includes('pdf') ? 'pdf' : file.type.includes('image') ? 'image' : 'other',
    };
    addLampiran(item);
    toast.success('File berhasil diupload');
    setUploading(false);
  };

  const lamp7 = data.lampiran.filter(l => l.tipe === 'lampiran_7');
  const lamp8 = data.lampiran.filter(l => l.tipe === 'lampiran_8');

  const FileList = ({ items, onRemove }: { items: LampiranItem[]; onRemove: (id: string) => void }) => (
    <div className="space-y-2">
      {items.map(item => (
        <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
          {item.file_type === 'image' ? <ImageIcon className="w-5 h-5 text-primary" /> : <FileText className="w-5 h-5 text-primary" />}
          <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="flex-1 text-sm text-foreground hover:text-primary truncate">{item.nama}</a>
          <Button variant="ghost" size="sm" onClick={() => onRemove(item.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
        </div>
      ))}
      {items.length === 0 && <p className="text-sm text-muted-foreground">Belum ada file</p>}
    </div>
  );

  return (
    <PageTransition>
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Lampiran Penilaian</h1>
        <p className="text-muted-foreground">Upload dokumen perangkat dan praktik mengajar.</p>
      </div>

      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="text-base">Lampiran 7 — Perangkat Pembelajaran</CardTitle>
          <CardDescription>RPP, silabus, dan dokumen perangkat lainnya</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <FileList items={lamp7} onRemove={removeLampiran} />
          <input ref={fileRef7} type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" className="hidden" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0], 'lampiran_7')} />
          <Button variant="outline" onClick={() => fileRef7.current?.click()} disabled={uploading}>
            <Upload className="w-4 h-4 mr-2" />{uploading ? 'Mengupload...' : 'Upload File'}
          </Button>
        </CardContent>
      </Card>

      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="text-base">Lampiran 8 — Praktik Mengajar</CardTitle>
          <CardDescription>Dokumentasi video, foto, dan evaluasi praktik</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <FileList items={lamp8} onRemove={removeLampiran} />
          <input ref={fileRef8} type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.mp4" className="hidden" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0], 'lampiran_8')} />
          <Button variant="outline" onClick={() => fileRef8.current?.click()} disabled={uploading}>
            <Upload className="w-4 h-4 mr-2" />{uploading ? 'Mengupload...' : 'Upload File'}
          </Button>
        </CardContent>
      </Card>
    </div>
    </PageTransition>
  );
};

export default LampiranForm;
