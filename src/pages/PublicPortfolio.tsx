import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import PortfolioShowcase from '@/components/PortfolioShowcase';
import { PortfolioData } from '@/contexts/PortfolioContext';

const defaultPortfolio: PortfolioData = {
  profile: { full_name: '', asal_daerah: '', asal_kampus: '', bidang_studi: '', foto_url: '', kutipan_motivasi: '', keunikan_daerah: '', inspirasi_guru: '', tujuan_profesional: '' },
  artefak: { kendala: '', teori_pedagogi: '', faktor_keberhasilan: '', adaptasi_pembelajaran: '' },
  model_guru: { visi: '', misi: '', kompetensi: [], karakter: [] },
  lampiran: [],
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const PublicPortfolio = () => {
  const { identifier } = useParams<{ identifier: string }>();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirectSlug, setRedirectSlug] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!identifier) return;
      const isUuid = UUID_RE.test(identifier);
      const query = supabase.from('portfolios').select('*');
      const { data: row } = isUuid
        ? await query.eq('user_id', identifier).maybeSingle()
        : await query.eq('slug', identifier).maybeSingle();

      if (row) {
        // If accessed by UUID but a slug exists, redirect to slug URL
        const rowSlug = (row as any).slug as string | null;
        if (isUuid && rowSlug) {
          setRedirectSlug(rowSlug);
          return;
        }
        setData({
          profile: (row.profile_data as any) || defaultPortfolio.profile,
          artefak: (row.artefak_data as any) || defaultPortfolio.artefak,
          model_guru: (row.model_guru_data as any) || defaultPortfolio.model_guru,
          lampiran: (row.lampiran_data as any) || defaultPortfolio.lampiran,
        });
      }
      setLoading(false);
    };
    load();
  }, [identifier]);

  if (redirectSlug) return <Navigate to={`/portfolio/${redirectSlug}`} replace />;
  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Memuat portfolio...</div>;
  if (!data) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Portfolio tidak ditemukan.</div>;

  return <PortfolioShowcase data={data} />;
};

export default PublicPortfolio;
