import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

export interface ProfileData {
  full_name: string;
  asal_daerah: string;
  asal_kampus: string;
  bidang_studi: string;
  foto_url: string;
  kutipan_motivasi: string;
  keunikan_daerah: string;
  inspirasi_guru: string;
  tujuan_profesional: string;
}

export interface ArtefakData {
  kendala: string;
  teori_pedagogi: string;
  faktor_keberhasilan: string;
  adaptasi_pembelajaran: string;
}

export interface ModelGuruData {
  visi: string;
  misi: string;
  kompetensi: { nama: string; level: number }[];
  karakter: string[];
}

export interface LampiranItem {
  id: string;
  nama: string;
  tipe: 'lampiran_7' | 'lampiran_8';
  file_url: string;
  file_type: string;
}

export interface PortfolioData {
  profile: ProfileData;
  artefak: ArtefakData;
  model_guru: ModelGuruData;
  lampiran: LampiranItem[];
}

const defaultPortfolio: PortfolioData = {
  profile: {
    full_name: '', asal_daerah: '', asal_kampus: '', bidang_studi: '',
    foto_url: '', kutipan_motivasi: '', keunikan_daerah: '', inspirasi_guru: '', tujuan_profesional: '',
  },
  artefak: { kendala: '', teori_pedagogi: '', faktor_keberhasilan: '', adaptasi_pembelajaran: '' },
  model_guru: { visi: '', misi: '', kompetensi: [], karakter: [] },
  lampiran: [],
};

interface PortfolioContextType {
  data: PortfolioData;
  updateProfile: (profile: Partial<ProfileData>) => void;
  updateArtefak: (artefak: Partial<ArtefakData>) => void;
  updateModelGuru: (model: Partial<ModelGuruData>) => void;
  addLampiran: (item: LampiranItem) => void;
  removeLampiran: (id: string) => void;
  saving: boolean;
  completionPercent: number;
  loadPortfolio: (userId?: string) => Promise<PortfolioData | null>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [data, setData] = useState<PortfolioData>(defaultPortfolio);
  const [saving, setSaving] = useState(false);

  const saveToDb = useCallback(async (newData: PortfolioData) => {
    if (!user) return;
    setSaving(true);
    try {
      await supabase.from('portfolios').upsert({
        user_id: user.id,
        profile_data: newData.profile as any,
        artefak_data: newData.artefak as any,
        model_guru_data: newData.model_guru as any,
        lampiran_data: newData.lampiran as any,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
    } catch {
      toast.error('Gagal menyimpan data');
    } finally {
      setSaving(false);
    }
  }, [user]);

  const loadPortfolio = useCallback(async (userId?: string) => {
    const id = userId || user?.id;
    if (!id) return null;
    const { data: row } = await supabase.from('portfolios').select('*').eq('user_id', id).maybeSingle();
    if (row) {
      const loaded: PortfolioData = {
        profile: (row.profile_data as any) || defaultPortfolio.profile,
        artefak: (row.artefak_data as any) || defaultPortfolio.artefak,
        model_guru: (row.model_guru_data as any) || defaultPortfolio.model_guru,
        lampiran: (row.lampiran_data as any) || defaultPortfolio.lampiran,
      };
      if (!userId || userId === user?.id) setData(loaded);
      return loaded;
    }
    return null;
  }, [user]);

  useEffect(() => {
    if (user) loadPortfolio();
  }, [user, loadPortfolio]);

  const autoSave = useCallback((newData: PortfolioData) => {
    setData(newData);
    saveToDb(newData);
  }, [saveToDb]);

  const updateProfile = (profile: Partial<ProfileData>) => {
    const newData = { ...data, profile: { ...data.profile, ...profile } };
    autoSave(newData);
  };

  const updateArtefak = (artefak: Partial<ArtefakData>) => {
    const newData = { ...data, artefak: { ...data.artefak, ...artefak } };
    autoSave(newData);
  };

  const updateModelGuru = (model: Partial<ModelGuruData>) => {
    const newData = { ...data, model_guru: { ...data.model_guru, ...model } };
    autoSave(newData);
  };

  const addLampiran = (item: LampiranItem) => {
    const newData = { ...data, lampiran: [...data.lampiran, item] };
    autoSave(newData);
  };

  const removeLampiran = (id: string) => {
    const newData = { ...data, lampiran: data.lampiran.filter(l => l.id !== id) };
    autoSave(newData);
  };

  const completionPercent = (() => {
    let filled = 0;
    let total = 0;
    const p = data.profile;
    const fields = [p.full_name, p.asal_daerah, p.asal_kampus, p.bidang_studi, p.kutipan_motivasi, p.keunikan_daerah, p.inspirasi_guru, p.tujuan_profesional];
    fields.forEach(f => { total++; if (f) filled++; });
    const a = data.artefak;
    [a.kendala, a.teori_pedagogi, a.faktor_keberhasilan, a.adaptasi_pembelajaran].forEach(f => { total++; if (f) filled++; });
    const m = data.model_guru;
    total += 4;
    if (m.visi) filled++;
    if (m.misi) filled++;
    if (m.kompetensi.length > 0) filled++;
    if (m.karakter.length > 0) filled++;
    total++;
    if (data.lampiran.length > 0) filled++;
    return Math.round((filled / total) * 100);
  })();

  return (
    <PortfolioContext.Provider value={{ data, updateProfile, updateArtefak, updateModelGuru, addLampiran, removeLampiran, saving, completionPercent, loadPortfolio }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error('usePortfolio must be used within PortfolioProvider');
  return context;
};
