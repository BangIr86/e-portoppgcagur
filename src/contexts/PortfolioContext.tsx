import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import { generateUniqueSlug, slugify } from '@/lib/slug';

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
  judul: string;
  tipe: string;
  file_url: string;
  file_type: string; // 'pdf' | 'image' | 'video' | 'youtube' | 'doc' | 'ppt' | 'other'
  youtube_url?: string;
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
  slug: string | null;
  updateProfile: (profile: Partial<ProfileData>) => void;
  updateArtefak: (artefak: Partial<ArtefakData>) => void;
  updateModelGuru: (model: Partial<ModelGuruData>) => void;
  addLampiran: (item: LampiranItem) => void;
  removeLampiran: (id: string) => void;
  reorderLampiran: (items: LampiranItem[]) => void;
  updateSlug: (newSlug: string) => Promise<{ ok: boolean; error?: string; slug?: string }>;
  checkSlugAvailable: (candidate: string) => Promise<boolean>;
  saving: boolean;
  completionPercent: number;
  loadPortfolio: (userId?: string) => Promise<PortfolioData | null>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [data, setData] = useState<PortfolioData>(defaultPortfolio);
  const [slug, setSlug] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const slugRef = useRef<string | null>(null);

  const saveToDb = useCallback(async (newData: PortfolioData) => {
    if (!user) return;
    setSaving(true);
    try {
      // Auto-generate slug ONLY when none exists yet. Once user has a slug
      // (auto or manual), it persists until they explicitly change it via updateSlug.
      let nextSlug = slugRef.current;
      if (!nextSlug && newData.profile.full_name) {
        nextSlug = await generateUniqueSlug(newData.profile.full_name, user.id);
        slugRef.current = nextSlug;
        setSlug(nextSlug);
      }

      await supabase.from('portfolios').upsert({
        user_id: user.id,
        profile_data: newData.profile as any,
        artefak_data: newData.artefak as any,
        model_guru_data: newData.model_guru as any,
        lampiran_data: newData.lampiran as any,
        ...(nextSlug ? { slug: nextSlug } : {}),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
    } catch {
      toast.error('Gagal menyimpan data');
    } finally {
      setSaving(false);
    }
  }, [user]);

  const checkSlugAvailable = useCallback(async (candidate: string): Promise<boolean> => {
    const cleaned = slugify(candidate);
    if (!cleaned) return false;
    if (cleaned === slugRef.current) return true; // current slug is "available" to self
    const { data: row } = await supabase
      .from('portfolios')
      .select('user_id')
      .eq('slug', cleaned)
      .maybeSingle();
    if (!row) return true;
    return row.user_id === user?.id;
  }, [user]);

  const updateSlugFn = useCallback(async (newSlug: string) => {
    if (!user) return { ok: false as const, error: 'Tidak terautentikasi' };
    const cleaned = slugify(newSlug);
    if (!cleaned) return { ok: false as const, error: 'Slug tidak valid' };
    if (cleaned.length < 3) return { ok: false as const, error: 'Minimal 3 karakter' };
    if (cleaned === slugRef.current) return { ok: true as const, slug: cleaned };

    const available = await checkSlugAvailable(cleaned);
    if (!available) return { ok: false as const, error: 'Slug sudah digunakan' };

    setSaving(true);
    try {
      const { error } = await supabase
        .from('portfolios')
        .update({ slug: cleaned, updated_at: new Date().toISOString() })
        .eq('user_id', user.id);
      if (error) return { ok: false as const, error: 'Gagal menyimpan slug' };
      slugRef.current = cleaned;
      setSlug(cleaned);
      return { ok: true as const, slug: cleaned };
    } finally {
      setSaving(false);
    }
  }, [user, checkSlugAvailable]);

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
      if (!userId || userId === user?.id) {
        setData(loaded);
        const loadedSlug = (row as any).slug || null;
        slugRef.current = loadedSlug;
        setSlug(loadedSlug);
      }
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

  const reorderLampiran = (items: LampiranItem[]) => {
    const newData = { ...data, lampiran: items };
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
    <PortfolioContext.Provider value={{ data, slug, updateProfile, updateArtefak, updateModelGuru, addLampiran, removeLampiran, reorderLampiran, updateSlug: updateSlugFn, checkSlugAvailable, saving, completionPercent, loadPortfolio }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error('usePortfolio must be used within PortfolioProvider');
  return context;
};
