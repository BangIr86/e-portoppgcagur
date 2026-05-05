import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import PortfolioShowcase from '@/components/PortfolioShowcase';
import { PortfolioData, ArtefakItem } from '@/contexts/PortfolioContext';

const defaultPortfolio: PortfolioData = {
  profile: {
    full_name: '', asal_daerah: '', asal_kampus: '', bidang_studi: '', foto_url: '',
    kutipan_motivasi: '', pengantar: '', keunikan_daerah: '', inspirasi_guru: '',
    tujuan_profesional: '', narasi_storytelling: '',
  },
  artefak: [],
  reflection: {
    pengalaman_mengajar: '', kekuatan_diri: '', kelemahan_diri: '',
    rencana_tindak_lanjut: '', filosofi_mengajar: '',
  },
  model_guru: { visi: '', misi: '', kompetensi: [], karakter: [] },
  lampiran: [],
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const normalizeArtefak = (raw: any): ArtefakItem[] => {
  if (Array.isArray(raw)) {
    return raw.map((item: any) => ({
      id: item?.id || crypto.randomUUID(),
      judul: item?.judul || '',
      deskripsi: item?.deskripsi || '',
      kategori: item?.kategori || 'dokumentasi_mengajar',
      file_url: item?.file_url || '',
      file_type: item?.file_type || '',
      youtube_url: item?.youtube_url,
      konteks: item?.konteks || '',
      tujuan: item?.tujuan || '',
      kelebihan: item?.kelebihan || '',
      kekurangan: item?.kekurangan || '',
      teori_pedagogi: item?.teori_pedagogi || '',
      faktor_keberhasilan: item?.faktor_keberhasilan || '',
      adaptasi_pembelajaran: item?.adaptasi_pembelajaran || '',
    }));
  }
  // legacy single object
  if (raw && typeof raw === 'object' && (raw.kendala || raw.teori_pedagogi)) {
    return [{
      id: crypto.randomUUID(),
      judul: 'Artefak Pembelajaran',
      deskripsi: '',
      kategori: 'dokumentasi_mengajar',
      file_url: '', file_type: '',
      konteks: raw.kendala || '',
      tujuan: '', kelebihan: '', kekurangan: '',
      teori_pedagogi: raw.teori_pedagogi || '',
      faktor_keberhasilan: raw.faktor_keberhasilan || '',
      adaptasi_pembelajaran: raw.adaptasi_pembelajaran || '',
    }];
  }
  return [];
};

const applyRow = (
  r: any,
  setData: (d: PortfolioData) => void,
  setTheme: (t: string) => void,
  setOverrides: (o: any) => void,
) => {
  setData({
    profile: { ...defaultPortfolio.profile, ...((r.profile_data as any) || {}) },
    artefak: normalizeArtefak(r.artefak_data),
    reflection: { ...defaultPortfolio.reflection, ...((r.reflection_data as any) || {}) },
    model_guru: (r.model_guru_data as any) || defaultPortfolio.model_guru,
    lampiran: (r.lampiran_data as any) || defaultPortfolio.lampiran,
  });
  setTheme(r.theme || 'classic-blue');
  setOverrides((r.theme_overrides as any) || {});
};

const PublicPortfolio = () => {
  const { identifier } = useParams<{ identifier: string }>();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [theme, setTheme] = useState<string>('classic-blue');
  const [themeOverrides, setThemeOverrides] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [redirectSlug, setRedirectSlug] = useState<string | null>(null);
  const [ownerId, setOwnerId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!identifier) { setLoading(false); return; }
      const isUuid = UUID_RE.test(identifier);

      if (isUuid) {
        const { data: row } = await supabase.from('portfolios').select('slug').eq('user_id', identifier).maybeSingle();
        const rowSlug = (row as any)?.slug as string | null | undefined;
        if (rowSlug) { setRedirectSlug(rowSlug); return; }
        setLoading(false);
        return;
      }

      const { data: row } = await supabase.from('portfolios').select('*').eq('slug', identifier).maybeSingle();
      if (row) {
        applyRow(row, setData, setTheme, setThemeOverrides);
        setOwnerId((row as any).user_id);
      }
      setLoading(false);
    };
    load();
  }, [identifier]);

  useEffect(() => {
    if (!ownerId) return;
    const channel = supabase
      .channel(`public-portfolio-${ownerId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'portfolios', filter: `user_id=eq.${ownerId}` },
        (payload) => {
          if (payload.new) applyRow(payload.new, setData, setTheme, setThemeOverrides);
        },
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [ownerId]);

  if (redirectSlug) return <Navigate to={`/portfolio/${redirectSlug}`} replace />;
  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Memuat portfolio...</div>;
  if (!data) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Portfolio tidak ditemukan.</div>;

  return <PortfolioShowcase data={data} themeId={theme} themeOverrides={themeOverrides} />;
};

export default PublicPortfolio;
