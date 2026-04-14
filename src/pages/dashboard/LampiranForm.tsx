import PageTransition from '@/components/PageTransition';
import { usePortfolio, LampiranItem } from '@/contexts/PortfolioContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useRef, useState } from 'react';
import { Upload, FileText, Trash2, Image as ImageIcon, Youtube, Eye, File, Presentation } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const getFileType = (file: File): string => {
  const name = file.name.toLowerCase();
  if (file.type.includes('pdf') || name.endsWith('.pdf')) return 'pdf';
  if (file.type.includes('image') || /\.(jpg|jpeg|png|gif|webp)$/.test(name)) return 'image';
  if (file.type.includes('video') || /\.(mp4|webm|mov)$/.test(name)) return 'video';
  if (/\.(doc|docx)$/.test(name)) return 'doc';
  if (/\.(ppt|pptx)$/.test(name)) return 'ppt';
  return 'other';
};

const getYoutubeEmbedUrl = (url: string): string | null => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

const getYoutubeThumbnail = (url: string): string | null => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  return match ? `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg` : null;
};

const FileIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'image': return <ImageIcon className="w-5 h-5 text-primary" />;
    case 'youtube': return <Youtube className="w-5 h-5 text-red-500" />;
    case 'video': return <Eye className="w-5 h-5 text-primary" />;
    case 'doc': return <File className="w-5 h-5 text-blue-500" />;
    case 'ppt': return <Presentation className="w-5 h-5 text-orange-500" />;
    case 'pdf': return <FileText className="w-5 h-5 text-red-600" />;
    default: return <FileText className="w-5 h-5 text-primary" />;
  }
};

const FilePreview = ({ item }: { item: LampiranItem }) => {
  const [previewOpen, setPreviewOpen] = useState(false);

  const canPreview = ['pdf', 'image', 'video', 'youtube'].includes(item.file_type);

  const thumbnail = item.file_type === 'youtube' && item.youtube_url
    ? getYoutubeThumbnail(item.youtube_url)
    : item.file_type === 'image' ? item.file_url : null;

  return (
    <>
      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 group">
        {thumbnail ? (
          <img src={thumbnail} alt={item.judul || item.nama} className="w-16 h-12 object-cover rounded shrink-0" />
        ) : (
          <div className="w-16 h-12 rounded bg-muted flex items-center justify-center shrink-0">
            <FileIcon type={item.file_type} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{item.judul || item.nama}</p>
          <p className="text-xs text-muted-foreground truncate">{item.nama}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {canPreview && (
            <Button variant="ghost" size="sm" onClick={() => setPreviewOpen(true)}>
              <Eye className="w-4 h-4 text-primary" />
            </Button>
          )}
          {!canPreview && item.file_url && (
            <Button variant="ghost" size="sm" asChild>
              <a href={item.file_url} target="_blank" rel="noopener noreferrer">
                <Eye className="w-4 h-4 text-primary" />
              </a>
            </Button>
          )}
        </div>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="truncate">{item.judul || item.nama}</DialogTitle>
          </DialogHeader>
          <div className="overflow-auto max-h-[70vh]">
            {item.file_type === 'youtube' && item.youtube_url && (
              <div className="aspect-video w-full">
                <iframe
                  src={getYoutubeEmbedUrl(item.youtube_url) || ''}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            )}
            {item.file_type === 'image' && (
              <img src={item.file_url} alt={item.judul || item.nama} className="w-full rounded-lg" />
            )}
            {item.file_type === 'pdf' && (
              <iframe src={item.file_url} className="w-full h-[65vh] rounded-lg" />
            )}
            {item.file_type === 'video' && (
              <video src={item.file_url} controls className="w-full rounded-lg" />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const LampiranForm = () => {
  const { data, addLampiran, removeLampiran } = usePortfolio();
  const { user } = useAuth();
  const fileRef7 = useRef<HTMLInputElement>(null);
  const fileRef8 = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [judul7, setJudul7] = useState('');
  const [judul8, setJudul8] = useState('');
  const [youtubeUrl7, setYoutubeUrl7] = useState('');
  const [youtubeUrl8, setYoutubeUrl8] = useState('');

  const handleUpload = async (file: File, tipe: 'lampiran_7' | 'lampiran_8', judul: string) => {
    if (!user) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const id = crypto.randomUUID();
    const path = `${user.id}/${tipe}/${id}.${ext}`;
    const { error } = await supabase.storage.from('portfolio-files').upload(path, file);
    if (error) { toast.error('Gagal upload file'); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from('portfolio-files').getPublicUrl(path);
    const item: LampiranItem = {
      id,
      nama: file.name,
      judul: judul || file.name,
      tipe,
      file_url: urlData.publicUrl,
      file_type: getFileType(file),
    };
    addLampiran(item);
    toast.success('File berhasil diupload');
    setUploading(false);
    if (tipe === 'lampiran_7') setJudul7('');
    else setJudul8('');
  };

  const handleYoutubeAdd = (tipe: 'lampiran_7' | 'lampiran_8', judul: string, url: string) => {
    if (!getYoutubeEmbedUrl(url)) {
      toast.error('URL YouTube tidak valid');
      return;
    }
    const item: LampiranItem = {
      id: crypto.randomUUID(),
      nama: judul || 'Video YouTube',
      judul: judul || 'Video YouTube',
      tipe,
      file_url: url,
      file_type: 'youtube',
      youtube_url: url,
    };
    addLampiran(item);
    toast.success('Link YouTube berhasil ditambahkan');
    if (tipe === 'lampiran_7') { setJudul7(''); setYoutubeUrl7(''); }
    else { setJudul8(''); setYoutubeUrl8(''); }
  };

  const lamp7 = data.lampiran.filter(l => l.tipe === 'lampiran_7');
  const lamp8 = data.lampiran.filter(l => l.tipe === 'lampiran_8');

  const LampiranSection = ({
    tipe, items, judul, setJudul, youtubeUrl, setYoutubeUrl, fileRef, title, description,
  }: {
    tipe: 'lampiran_7' | 'lampiran_8';
    items: LampiranItem[];
    judul: string; setJudul: (v: string) => void;
    youtubeUrl: string; setYoutubeUrl: (v: string) => void;
    fileRef: React.RefObject<HTMLInputElement>;
    title: string; description: string;
  }) => (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing items */}
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="relative">
              <FilePreview item={item} />
              <Button
                variant="ghost" size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                onClick={() => removeLampiran(item.id)}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-muted-foreground">Belum ada file</p>}
        </div>

        {/* Add new */}
        <div className="border-t pt-4 space-y-3">
          <div>
            <Label className="text-sm">Judul Lampiran</Label>
            <Input
              placeholder="Masukkan judul lampiran..."
              value={judul}
              onChange={e => setJudul(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.ppt,.pptx,.mp4,.webm"
              className="hidden"
              onChange={e => {
                if (e.target.files?.[0]) handleUpload(e.target.files[0], tipe, judul);
                e.target.value = '';
              }}
            />
            <Button variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading} className="flex-1">
              <Upload className="w-4 h-4 mr-2" />{uploading ? 'Mengupload...' : 'Upload File'}
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Paste link YouTube..."
              value={youtubeUrl}
              onChange={e => setYoutubeUrl(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={() => handleYoutubeAdd(tipe, judul, youtubeUrl)}
              disabled={!youtubeUrl}
            >
              <Youtube className="w-4 h-4 mr-2" />Tambah Video
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lampiran Penilaian</h1>
          <p className="text-muted-foreground">Upload dokumen, foto, video, atau link YouTube.</p>
        </div>

        <LampiranSection
          tipe="lampiran_7" items={lamp7}
          judul={judul7} setJudul={setJudul7}
          youtubeUrl={youtubeUrl7} setYoutubeUrl={setYoutubeUrl7}
          fileRef={fileRef7 as React.RefObject<HTMLInputElement>}
          title="Lampiran 7 — Perangkat Pembelajaran"
          description="RPP, silabus, dan dokumen perangkat lainnya"
        />

        <LampiranSection
          tipe="lampiran_8" items={lamp8}
          judul={judul8} setJudul={setJudul8}
          youtubeUrl={youtubeUrl8} setYoutubeUrl={setYoutubeUrl8}
          fileRef={fileRef8 as React.RefObject<HTMLInputElement>}
          title="Lampiran 8 — Praktik Mengajar"
          description="Dokumentasi video, foto, dan evaluasi praktik"
        />
      </div>
    </PageTransition>
  );
};

export default LampiranForm;
