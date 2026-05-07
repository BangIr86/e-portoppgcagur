// Lampiran section, embedded inside ArtefakForm
import { usePortfolio, LampiranItem } from '@/contexts/PortfolioContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useRef, useState } from 'react';
import { Upload, FileText, Trash2, Image as ImageIcon, Youtube, Eye, File, Presentation, GripVertical, Paperclip } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Badge } from '@/components/ui/badge';

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

const TIPE_LABEL: Record<string, string> = {
  lampiran7: 'Lampiran 7',
  lampiran8: 'Lampiran 8',
  lampiran: 'Lampiran Umum',
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

const FilePreview = ({ item, onRemove }: { item: LampiranItem; onRemove: () => void }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const canPreview = ['pdf', 'image', 'video', 'youtube'].includes(item.file_type);
  const thumbnail = item.file_type === 'youtube' && item.youtube_url
    ? getYoutubeThumbnail(item.youtube_url)
    : item.file_type === 'image' ? item.file_url : null;

  return (
    <>
      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
        {thumbnail ? (
          <img src={thumbnail} alt={item.judul || item.nama} className="w-16 h-12 object-cover rounded shrink-0" />
        ) : (
          <div className="w-16 h-12 rounded bg-muted flex items-center justify-center shrink-0">
            <FileIcon type={item.file_type} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-medium text-foreground truncate">{item.judul || item.nama}</p>
            {item.tipe !== 'lampiran' && <Badge variant="secondary" className="text-xs">{TIPE_LABEL[item.tipe] || item.tipe}</Badge>}
          </div>
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
          <Button variant="ghost" size="sm" onClick={onRemove}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh]">
          <DialogHeader><DialogTitle className="truncate">{item.judul || item.nama}</DialogTitle></DialogHeader>
          <div className="overflow-auto max-h-[70vh]">
            {item.file_type === 'youtube' && item.youtube_url && (
              <div className="aspect-video w-full">
                <iframe src={getYoutubeEmbedUrl(item.youtube_url) || ''} className="w-full h-full rounded-lg" allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
              </div>
            )}
            {item.file_type === 'image' && <img src={item.file_url} alt={item.judul || item.nama} className="w-full rounded-lg" />}
            {item.file_type === 'pdf' && item.file_url && (
              <div className="flex flex-col gap-2">
                <iframe src={`${item.file_url}#toolbar=1&navpanes=1&scrollbar=1`} title={item.judul || item.nama} className="w-full h-[65vh] rounded-lg border" style={{ minHeight: '500px' }} />
                <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline text-center">
                  Buka di tab baru jika preview tidak muncul
                </a>
              </div>
            )}
            {item.file_type === 'video' && <video src={item.file_url} controls className="w-full rounded-lg" />}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const SortableItem = ({ item, onRemove }: { item: LampiranItem; onRemove: () => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  return (
    <div ref={setNodeRef} style={style} className="flex items-start gap-2">
      <button {...attributes} {...listeners} className="mt-3 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none">
        <GripVertical className="w-5 h-5" />
      </button>
      <div className="flex-1"><FilePreview item={item} onRemove={onRemove} /></div>
    </div>
  );
};

const LampiranForm = () => {
  const { data, addLampiran, removeLampiran, reorderLampiran } = usePortfolio();
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [judul, setJudul] = useState('');
  const [tipe, setTipe] = useState<string>('lampiran');
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = data.lampiran.findIndex(l => l.id === active.id);
      const newIndex = data.lampiran.findIndex(l => l.id === over.id);
      reorderLampiran(arrayMove(data.lampiran, oldIndex, newIndex));
    }
  };

  const handleUpload = async (file: File) => {
    if (!user) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const id = crypto.randomUUID();
    const path = `${user.id}/lampiran/${id}.${ext}`;
    const { error } = await supabase.storage.from('portfolio-files').upload(path, file);
    if (error) { toast.error('Gagal upload file'); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from('portfolio-files').getPublicUrl(path);
    addLampiran({
      id, nama: file.name, judul: judul || file.name, tipe,
      file_url: urlData.publicUrl, file_type: getFileType(file),
    });
    toast.success('File berhasil diupload');
    setUploading(false);
    setJudul('');
  };

  const handleYoutubeAdd = () => {
    if (!getYoutubeEmbedUrl(youtubeUrl)) { toast.error('URL YouTube tidak valid'); return; }
    addLampiran({
      id: crypto.randomUUID(), nama: judul || 'Video YouTube', judul: judul || 'Video YouTube',
      tipe, file_url: youtubeUrl, file_type: 'youtube', youtube_url: youtubeUrl,
    });
    toast.success('Link YouTube berhasil ditambahkan');
    setJudul(''); setYoutubeUrl('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Lampiran Penilaian</h2>
        <p className="text-sm text-muted-foreground">Upload Lampiran 7, Lampiran 8, dan dokumen pendukung lainnya.</p>
      </div>

      <Card className="card-shadow border-primary/20 bg-primary/5">
        <CardContent className="pt-4 flex items-start gap-3">
          <Paperclip className="w-5 h-5 text-primary mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-foreground">Lampiran Wajib</p>
            <p className="text-muted-foreground">Pastikan Lampiran 7 dan Lampiran 8 sudah diupload sesuai ketentuan rubrik penilaian.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="text-base">Tambah Lampiran Baru</CardTitle>
          <CardDescription>Pilih kategori, beri judul, lalu upload file atau tambahkan link YouTube</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-sm">Kategori Lampiran</Label>
              <Select value={tipe} onValueChange={setTipe}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="lampiran7">Lampiran 7</SelectItem>
                  <SelectItem value="lampiran8">Lampiran 8</SelectItem>
                  <SelectItem value="lampiran">Lampiran Pendukung</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm">Judul Lampiran</Label>
              <Input placeholder="Masukkan judul..." value={judul} onChange={e => setJudul(e.target.value)} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.ppt,.pptx,.mp4,.webm" className="hidden"
              onChange={e => { if (e.target.files?.[0]) handleUpload(e.target.files[0]); e.target.value = ''; }} />
            <Button variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading} className="flex-1">
              <Upload className="w-4 h-4 mr-2" />{uploading ? 'Mengupload...' : 'Upload File'}
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Input placeholder="Paste link YouTube..." value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} className="flex-1" />
            <Button variant="outline" onClick={handleYoutubeAdd} disabled={!youtubeUrl}>
              <Youtube className="w-4 h-4 mr-2" />Tambah Video
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="text-base">Daftar Lampiran ({data.lampiran.length})</CardTitle>
          {data.lampiran.length > 1 && <CardDescription>Seret ikon ⠿ untuk mengubah urutan</CardDescription>}
        </CardHeader>
        <CardContent className="space-y-2">
          {data.lampiran.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">Belum ada lampiran. Tambahkan lampiran di atas.</p>
          )}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={data.lampiran.map(l => l.id)} strategy={verticalListSortingStrategy}>
              {data.lampiran.map(item => (
                <SortableItem key={item.id} item={item} onRemove={() => removeLampiran(item.id)} />
              ))}
            </SortableContext>
          </DndContext>
        </CardContent>
      </Card>
    </div>
  );
};

export default LampiranForm;
