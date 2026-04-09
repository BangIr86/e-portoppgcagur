import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import PortfolioShowcase from '@/components/PortfolioShowcase';
import { PortfolioData } from '@/contexts/PortfolioContext';

const defaultPortfolio: PortfolioData = {
  profile: { full_name: '', asal_daerah: '', asal_kampus: '', bidang_studi: '', foto_url: '', kutipan_motivasi: '', keunikan_daerah: '', inspirasi_guru: '', tujuan_profesional: '' },
  artefak: { kendala: '', teori_pedagogi: '', faktor_keberhasilan: '', adaptasi_pembelajaran: '' },
  model_guru: { visi: '', misi: '', kompetensi: [], karakter: [] },
  lampiran: [],
};

const PublicPortfolio = () => {
  const { userId } = useParams<{ userId: string }>();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!userId) return;
      const { data: row } = await supabase.from('portfolios').select('*').eq('user_id', userId).maybeSingle();
      if (row) {
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
  }, [userId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Memuat portfolio...</div>;
  if (!data) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Portfolio tidak ditemukan.</div>;

  return <PortfolioShowcase data={data} />;
};

export default PublicPortfolio;
