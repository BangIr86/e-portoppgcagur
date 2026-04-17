import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Check, Loader2, X, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { slugify } from '@/lib/slug';
import { toast } from 'sonner';

type Status = 'idle' | 'checking' | 'available' | 'taken' | 'invalid' | 'current';

const SlugEditor = () => {
  const { slug, updateSlug, checkSlugAvailable } = usePortfolio();
  const [value, setValue] = useState(slug ?? '');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const debounceRef = useRef<number | null>(null);

  // Sync from context when slug loads/changes externally
  useEffect(() => {
    if (slug && !value) setValue(slug);
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const cleaned = useMemo(() => slugify(value), [value]);
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const previewUrl = cleaned ? `${origin}/portfolio/${cleaned}` : `${origin}/portfolio/...`;

  // Debounced availability check
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    setErrorMsg('');

    if (!value) {
      setStatus('idle');
      return;
    }
    if (cleaned.length < 3) {
      setStatus('invalid');
      setErrorMsg('Minimal 3 karakter (huruf, angka, tanda hubung).');
      return;
    }
    if (cleaned === slug) {
      setStatus('current');
      return;
    }

    setStatus('checking');
    debounceRef.current = window.setTimeout(async () => {
      const ok = await checkSlugAvailable(cleaned);
      setStatus(ok ? 'available' : 'taken');
      if (!ok) setErrorMsg('Slug ini sudah digunakan oleh user lain.');
    }, 400);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [cleaned, value, slug, checkSlugAvailable]);

  const handleSave = async () => {
    if (status !== 'available') return;
    setSaving(true);
    const res = await updateSlug(cleaned);
    setSaving(false);
    if (res.ok) {
      toast.success('URL portfolio berhasil diperbarui');
      setStatus('current');
    } else {
      toast.error(res.error || 'Gagal menyimpan');
    }
  };

  const StatusIcon = () => {
    if (status === 'checking') return <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />;
    if (status === 'available') return <Check className="w-4 h-4 text-primary" />;
    if (status === 'current') return <Check className="w-4 h-4 text-muted-foreground" />;
    if (status === 'taken' || status === 'invalid') return <X className="w-4 h-4 text-destructive" />;
    return <LinkIcon className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <LinkIcon className="w-4 h-4" />
          URL Portfolio Publik
        </CardTitle>
        <CardDescription>
          Atur alamat unik portfolio Anda. Hanya huruf, angka, dan tanda hubung (-).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="slug-input">Slug</Label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Input
                id="slug-input"
                value={value}
                onChange={(e) => setValue(e.target.value.slice(0, 60))}
                placeholder="contoh: budi-santoso"
                maxLength={60}
                className="pr-9 font-mono text-sm"
                aria-invalid={status === 'taken' || status === 'invalid'}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <StatusIcon />
              </div>
            </div>
            <Button
              type="button"
              onClick={handleSave}
              disabled={status !== 'available' || saving}
              className="sm:w-auto w-full"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan Slug'}
            </Button>
          </div>
          {errorMsg && (
            <p className="text-xs text-destructive">{errorMsg}</p>
          )}
          {status === 'available' && (
            <p className="text-xs text-primary">Tersedia! Klik "Simpan Slug" untuk menggunakan.</p>
          )}
          {status === 'current' && slug && (
            <p className="text-xs text-muted-foreground">Ini adalah slug Anda saat ini.</p>
          )}
        </div>

        <div className="rounded-lg border bg-muted/40 p-3 space-y-1">
          <p className="text-xs text-muted-foreground">Preview URL:</p>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <code className="text-sm font-mono text-foreground break-all">
              {previewUrl}
            </code>
            {cleaned && status === 'current' && (
              <a
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-primary hover:underline inline-flex items-center gap-1 shrink-0"
              >
                Buka <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SlugEditor;
