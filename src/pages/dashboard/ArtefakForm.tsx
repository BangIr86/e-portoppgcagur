import PageTransition from '@/components/PageTransition';
import LampiranForm from './LampiranForm';
import { usePortfolio, ArtefakItem, ArtefakKategori, ArtefakFile, KATEGORI_LABEL } from '@/contexts/PortfolioContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useRef, useState } from 'react';
import { Plus, Upload, Trash2, FileText, Image as ImageIcon, Youtube, BookOpen, CheckCircle2, AlertCircle } from 'lucide-react';

const getFileType = (file: File): string => {
  const name = file.name.toLowerCase();
  if (file.type.includes('pdf') || name.endsWith('.pdf')) return 'pdf';
  if (file.type.includes('image') || /\.(jpg|jpeg|png|gif|webp)$/.test(name)) return 'image';
  if (file.type.includes('video') || /\.(mp4|webm|mov)$/.test(name)) return 'video';
  if (/\.(doc|docx)$/.test(name)) return 'doc';
  if (/\.(ppt|pptx)$/.test(name)) return 'ppt';
  return 'other';
};

const getYoutubeId = (url: string): string | null => {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
};

const KATEGORI_OPTIONS: ArtefakKategori[] = [
  'modul_ajar', 'media_pembelajaran', 'dokumentasi_mengajar', 'hasil_kerja_siswa',
  'penilaian_pamong_dpl', 'instrumen_perangkat_pembelajaran', 'instrumen_praktik_mengajar',
];

const ANALISIS_FIELDS: { key: keyof ArtefakItem; label: string; placeholder: string }[] = [
  { key: 'konteks', label: 'Konteks', placeholder: 'Latar belakang situasi pembelajaran...' },
  { key: 'tujuan', label: 'Tujuan', placeholder: 'Tujuan pembelajaran yang ingin dicapai...' },
  { key: 'kelebihan', label: 'Kelebihan', placeholder: 'Kekuatan dan hal positif dari artefak ini...' },
  { key: 'kekurangan', label: 'Kekurangan', placeholder: 'Keterbatasan atau hambatan...' },
  { key: 'teori_pedagogi', label: 'Teori Pedagogi', placeholder: 'Landasan teori pedagogi...' },
  { key: 'faktor_keberhasilan', label: 'Faktor Keberhasilan', placeholder: 'Faktor pendukung keberhasilan...' },
  { key: 'adaptasi_pembelajaran', label: 'Adaptasi Pembelajaran', placeholder: 'Penyesuaian ke depan...' },
];

const isComplete = (a: ArtefakItem) =>
  Boolean(a.judul && a.deskripsi && a.files.length > 0 && a.files.every(f => f.kategori) && ANALISIS_FIELDS.every(f => (a as any)[f.key]));

const ArtefakCard = ({ item }: { item: ArtefakItem }) => {
  const { updateArtefak, removeArtefak } = usePortfolio();
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [pendingKategori, setPendingKategori] = useState<ArtefakKategori>('modul_ajar');
  const complete = isComplete(item);

  const syncFiles = (files: ArtefakFile[]) => {
    const kats = Array.from(new Set(files.map(f => f.kategori).filter(Boolean) as ArtefakKategori[]));
    const primary = files[0];
    updateArtefak(item.id, {
      files,
      kategoris: kats,
      kategori: kats[0] || item.kategori,
      file_url: primary?.file_url || '',
      file_type: primary?.file_type || '',
      youtube_url: primary?.youtube_url,
    });
  };

  const addFile = (f: ArtefakFile) => syncFiles([...item.files, f]);
  const removeFile = (id: string) => syncFiles(item.files.filter(f => f.id !== id));
  const setFileKategori = (id: string, kategori: ArtefakKategori) =>
    syncFiles(item.files.map(f => f.id === id ? { ...f, kategori } : f));

  const handleUpload = async (file: File) => {
    if (!user) return;
    setUploading(true);
    const fileId = crypto.randomUUID();
    const ext = file.name.split('.').pop();
    const path = `${user.id}/artefak/${item.id}-${fileId}.${ext}`;
    const { error } = await supabase.storage.from('portfolio-files').upload(path, file, { upsert: true });
    if (error) { toast.error('Gagal upload file'); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from('portfolio-files').getPublicUrl(path);
    addFile({
      id: fileId,
      file_url: urlData.publicUrl,
      file_type: getFileType(file),
      label: file.name,
      kategori: pendingKategori,
    });
    toast.success('File berhasil diupload');
    setUploading(false);
  };

  const handleAddYoutube = () => {
    if (!getYoutubeId(youtubeUrl)) { toast.error('URL YouTube tidak valid'); return; }
    addFile({
      id: crypto.randomUUID(),
      file_url: youtubeUrl,
      file_type: 'youtube',
      youtube_url: youtubeUrl,
      label: 'Video YouTube',
      kategori: pendingKategori,
    });
    setYoutubeUrl('');
    toast.success('Link YouTube ditambahkan');
  };

  return (
    <AccordionItem value={item.id} className="border rounded-lg bg-card card-shadow data-[state=open]:shadow-md">
      <AccordionTrigger className="px-4 py-3 hover:no-underline">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {complete
            ? <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
            : <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0" />}
          <div className="flex-1 min-w-0 text-left">
            <p className="font-medium text-foreground truncate">{item.judul || 'Artefak tanpa judul'}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {item.kategoris.map(k => (
                <Badge key={k} variant="secondary" className="text-[10px] font-normal">{KATEGORI_LABEL[k]}</Badge>
              ))}
              {item.files.length > 0 && (
                <Badge variant="outline" className="text-[10px] font-normal">{item.files.length} file</Badge>
              )}
            </div>
          </div>
          {!complete && <Badge variant="outline" className="text-xs shrink-0">Belum lengkap</Badge>}
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        <Tabs defaultValue="detail" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="detail">Detail & File</TabsTrigger>
            <TabsTrigger value="analisis">Analisis Mendalam</TabsTrigger>
          </TabsList>

          <TabsContent value="detail" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Judul Artefak</Label>
              <Input value={item.judul} onChange={e => updateArtefak(item.id, { judul: e.target.value })} placeholder="Mis. Modul Ajar Algoritma Pertemuan 1" />
            </div>

            <div className="space-y-2">
              <Label>Deskripsi Singkat</Label>
              <Textarea value={item.deskripsi} onChange={e => updateArtefak(item.id, { deskripsi: e.target.value })} placeholder="Deskripsi singkat tentang artefak ini..." rows={3} />
            </div>

            <div className="space-y-3">
              <Label>File / Media (boleh banyak, masing-masing punya kategori sendiri)</Label>

              {item.files.length > 0 && (
                <div className="space-y-2">
                  {item.files.map(f => (
                    <div key={f.id} className="flex flex-col sm:flex-row sm:items-center gap-2 p-2 rounded border bg-muted/30 text-sm">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {f.file_type === 'image' && <ImageIcon className="w-4 h-4 text-primary shrink-0" />}
                        {f.file_type === 'youtube' && <Youtube className="w-4 h-4 text-red-500 shrink-0" />}
                        {!['image', 'youtube'].includes(f.file_type) && <FileText className="w-4 h-4 text-primary shrink-0" />}
                        <a href={f.file_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate flex-1">
                          {f.label || (f.file_type === 'youtube' ? 'Video YouTube' : 'File')}
                        </a>
                      </div>
                      <Select value={f.kategori || ''} onValueChange={(v) => setFileKategori(f.id, v as ArtefakKategori)}>
                        <SelectTrigger className="h-8 w-full sm:w-[260px]"><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                        <SelectContent>
                          {KATEGORI_OPTIONS.map(k => (
                            <SelectItem key={k} value={k}>{KATEGORI_LABEL[k]}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="sm" onClick={() => removeFile(f.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2 p-3 rounded-lg border border-dashed">
                <Label className="text-xs text-muted-foreground">Tambah file/link baru — pilih kategori dulu</Label>
                <Select value={pendingKategori} onValueChange={(v) => setPendingKategori(v as ArtefakKategori)}>
                  <SelectTrigger><SelectValue placeholder="Pilih kategori untuk file baru" /></SelectTrigger>
                  <SelectContent>
                    {KATEGORI_OPTIONS.map(k => (
                      <SelectItem key={k} value={k}>{KATEGORI_LABEL[k]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.ppt,.pptx,.mp4,.webm" className="hidden"
                    onChange={e => { if (e.target.files?.[0]) handleUpload(e.target.files[0]); e.target.value = ''; }} />
                  <Button variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading} className="flex-1">
                    <Upload className="w-4 h-4 mr-2" />{uploading ? 'Mengupload...' : 'Upload File'}
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input placeholder="Atau paste link YouTube..." value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} />
                  <Button variant="outline" onClick={handleAddYoutube} disabled={!youtubeUrl}>
                    <Youtube className="w-4 h-4 mr-2" />Tambah Link
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analisis" className="space-y-4 pt-4">
            <p className="text-xs text-muted-foreground">Lengkapi 7 bagian analisis untuk memenuhi kriteria rubrik &ldquo;Sangat Baik&rdquo;.</p>
            {ANALISIS_FIELDS.map(f => (
              <div key={f.key} className="space-y-2">
                <Label className="flex items-center gap-2">
                  {f.label}
                  {(item as any)[f.key] ? <CheckCircle2 className="w-3 h-3 text-primary" /> : null}
                </Label>
                <Textarea
                  value={(item as any)[f.key] || ''}
                  onChange={e => updateArtefak(item.id, { [f.key]: e.target.value } as any)}
                  placeholder={f.placeholder}
                  rows={4}
                />
              </div>
            ))}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-4">
          <Button variant="ghost" size="sm" onClick={() => { if (confirm('Hapus artefak ini?')) removeArtefak(item.id); }}>
            <Trash2 className="w-4 h-4 mr-2 text-destructive" /> Hapus Artefak
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

const ArtefakForm = () => {
  const { data, addArtefak } = usePortfolio();

  const handleAdd = () => {
    addArtefak({
      judul: '', deskripsi: '',
      kategoris: [], files: [],
      kategori: 'modul_ajar', file_url: '', file_type: '',
      konteks: '', tujuan: '', kelebihan: '', kekurangan: '',
      teori_pedagogi: '', faktor_keberhasilan: '', adaptasi_pembelajaran: '',
    });
  };

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Artefak Mengajar</h1>
            <p className="text-muted-foreground">Setiap artefak memiliki satu kategori dan satu file atau link.</p>
          </div>
          <Button onClick={handleAdd}><Plus className="w-4 h-4 mr-2" /> Tambah Artefak</Button>
        </div>

        <Card className="card-shadow border-primary/20 bg-primary/5">
          <CardContent className="pt-4 flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-primary mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground">5 Kategori Artefak</p>
              <p className="text-muted-foreground">Modul Ajar/RPP • Media Pembelajaran • Dokumentasi Mengajar • Hasil Kerja Siswa • Penilaian Guru Pamong & DPL</p>
            </div>
          </CardContent>
        </Card>

        {data.artefak.length === 0 ? (
          <Card className="card-shadow">
            <CardContent className="py-10 text-center text-muted-foreground">
              <p className="mb-4">Belum ada artefak. Tambahkan artefak pertama Anda.</p>
              <Button onClick={handleAdd}><Plus className="w-4 h-4 mr-2" /> Tambah Artefak Pertama</Button>
            </CardContent>
          </Card>
        ) : (
          <Accordion type="multiple" className="space-y-3">
            {data.artefak.map(item => <ArtefakCard key={item.id} item={item} />)}
          </Accordion>
        )}

        <div className="pt-6 border-t">
          <LampiranForm />
        </div>
      </div>
    </PageTransition>
  );
};

export default ArtefakForm;
