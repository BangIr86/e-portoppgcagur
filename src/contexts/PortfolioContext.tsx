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
  pengantar: string;
  keunikan_daerah: string;
  inspirasi_guru: string;
  tujuan_profesional: string;
  narasi_storytelling: string;
}

export type ArtefakKategori =
  | 'modul_ajar'
  | 'media_pembelajaran'
  | 'dokumentasi_mengajar'
  | 'hasil_kerja_siswa'
  | 'penilaian_pamong_dpl'
  | 'instrumen_perangkat_pembelajaran'
  | 'instrumen_praktik_mengajar';

export interface ArtefakFile {
  id: string;
  file_url: string;
  file_type: string; // 'pdf' | 'image' | 'video' | 'youtube' | 'doc' | 'ppt' | 'other' | ''
  youtube_url?: string;
  label?: string;
}

export interface ArtefakItem {
  id: string;
  judul: string;
  deskripsi: string;
  kategoris: ArtefakKategori[];
  files: ArtefakFile[];
  // Legacy fields (kept for backward compatibility, mirrored from kategoris[0]/files[0])
  kategori: ArtefakKategori;
  file_url: string;
  file_type: string;
  youtube_url?: string;
  // 7 field analisis
  konteks: string;
  tujuan: string;
  kelebihan: string;
  kekurangan: string;
  teori_pedagogi: string;
  faktor_keberhasilan: string;
  adaptasi_pembelajaran: string;
}

export interface ReflectionData {
  pengalaman_mengajar: string;
  kekuatan_diri: string;
  kelemahan_diri: string;
  rencana_tindak_lanjut: string;
  filosofi_mengajar: string;
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
  tipe: string; // 'lampiran7' | 'lampiran8' | 'lampiran'
  file_url: string;
  file_type: string;
  youtube_url?: string;
}

export interface PortfolioData {
  profile: ProfileData;
  artefak: ArtefakItem[];
  reflection: ReflectionData;
  model_guru: ModelGuruData;
  lampiran: LampiranItem[];
}

export const KATEGORI_LABEL: Record<ArtefakKategori, string> = {
  modul_ajar: 'Modul Ajar / RPP',
  media_pembelajaran: 'Media Pembelajaran',
  dokumentasi_mengajar: 'Dokumentasi Mengajar',
  hasil_kerja_siswa: 'Hasil Kerja Siswa',
  penilaian_pamong_dpl: 'Penilaian Guru Pamong & DPL',
  instrumen_perangkat_pembelajaran: 'Instrumen Penilaian Perangkat Pembelajaran',
  instrumen_praktik_mengajar: 'Instrumen Penilaian Praktik Mengajar',
};

const defaultProfile: ProfileData = {
  full_name: '', asal_daerah: '', asal_kampus: '', bidang_studi: '',
  foto_url: '', kutipan_motivasi: '', pengantar: '',
  keunikan_daerah: '', inspirasi_guru: '', tujuan_profesional: '',
  narasi_storytelling: '',
};

const defaultReflection: ReflectionData = {
  pengalaman_mengajar: '', kekuatan_diri: '', kelemahan_diri: '',
  rencana_tindak_lanjut: '', filosofi_mengajar: '',
};

const defaultPortfolio: PortfolioData = {
  profile: defaultProfile,
  artefak: [],
  reflection: defaultReflection,
  model_guru: { visi: '', misi: '', kompetensi: [], karakter: [] },
  lampiran: [],
};

// Migrasi data lama: jika `artefak` tersimpan sebagai object lama (bukan array), konversi ke array
export const normalizeArtefak = (item: any): ArtefakItem => {
  const kategori: ArtefakKategori = item?.kategori || 'dokumentasi_mengajar';
  const kategoris: ArtefakKategori[] = Array.isArray(item?.kategoris) && item.kategoris.length
    ? item.kategoris
    : [kategori];
  const legacyFile: ArtefakFile | null = item?.file_url
    ? { id: crypto.randomUUID(), file_url: item.file_url, file_type: item.file_type || '', youtube_url: item.youtube_url }
    : null;
  const files: ArtefakFile[] = Array.isArray(item?.files) && item.files.length
    ? item.files.map((f: any) => ({
        id: f?.id || crypto.randomUUID(),
        file_url: f?.file_url || '',
        file_type: f?.file_type || '',
        youtube_url: f?.youtube_url,
        label: f?.label,
      }))
    : (legacyFile ? [legacyFile] : []);
  const primary = files[0];
  return {
    id: item?.id || crypto.randomUUID(),
    judul: item?.judul || '',
    deskripsi: item?.deskripsi || '',
    kategoris,
    files,
    kategori: kategoris[0],
    file_url: primary?.file_url || '',
    file_type: primary?.file_type || '',
    youtube_url: primary?.youtube_url,
    konteks: item?.konteks || '',
    tujuan: item?.tujuan || '',
    kelebihan: item?.kelebihan || '',
    kekurangan: item?.kekurangan || '',
    teori_pedagogi: item?.teori_pedagogi || '',
    faktor_keberhasilan: item?.faktor_keberhasilan || '',
    adaptasi_pembelajaran: item?.adaptasi_pembelajaran || '',
  };
};

const migrateArtefak = (raw: any): ArtefakItem[] => {
  if (Array.isArray(raw)) return raw.map(normalizeArtefak);
  if (raw && typeof raw === 'object' && (raw.kendala || raw.teori_pedagogi || raw.faktor_keberhasilan || raw.adaptasi_pembelajaran)) {
    return [normalizeArtefak({
      judul: 'Artefak Pembelajaran',
      konteks: raw.kendala || '',
      teori_pedagogi: raw.teori_pedagogi || '',
      faktor_keberhasilan: raw.faktor_keberhasilan || '',
      adaptasi_pembelajaran: raw.adaptasi_pembelajaran || '',
    })];
  }
  return [];
};

interface SectionStatus {
  beranda: boolean;
  profil: boolean;
  artefak: boolean;
  analisis: boolean;
  refleksi: boolean;
  model_guru: boolean;
  lampiran: boolean;
}

export interface ThemeOverrides {
  uppercaseHeadings?: boolean;
  letterSpacingHeading?: string; // e.g. '0.04em'
}

// Map per-theme overrides: { [themeId]: ThemeOverrides }
export type ThemeOverridesMap = Record<string, ThemeOverrides>;

// Normalisasi: data lama bisa berbentuk flat (ThemeOverrides) untuk satu tema saja.
// Konversi ke map yang dimiliki tema aktif.
const normalizeOverridesMap = (raw: any, activeThemeId: string): ThemeOverridesMap => {
  if (!raw || typeof raw !== 'object') return {};
  const keys = Object.keys(raw);
  const looksLikeFlat = keys.some(k => k === 'uppercaseHeadings' || k === 'letterSpacingHeading');
  if (looksLikeFlat) {
    const flat: ThemeOverrides = {};
    if (typeof raw.uppercaseHeadings === 'boolean') flat.uppercaseHeadings = raw.uppercaseHeadings;
    if (typeof raw.letterSpacingHeading === 'string') flat.letterSpacingHeading = raw.letterSpacingHeading;
    return Object.keys(flat).length ? { [activeThemeId]: flat } : {};
  }
  return raw as ThemeOverridesMap;
};

interface PortfolioContextType {
  data: PortfolioData;
  slug: string | null;
  theme: string;
  themeOverrides: ThemeOverrides;
  themeOverridesMap: ThemeOverridesMap;
  updateTheme: (themeId: string) => void;
  updateThemeOverrides: (patch: Partial<ThemeOverrides>) => void;
  resetThemeOverrides: () => void;
  updateProfile: (profile: Partial<ProfileData>) => void;
  addArtefak: (item: Omit<ArtefakItem, 'id'>) => string;
  updateArtefak: (id: string, patch: Partial<ArtefakItem>) => void;
  removeArtefak: (id: string) => void;
  updateReflection: (patch: Partial<ReflectionData>) => void;
  updateModelGuru: (model: Partial<ModelGuruData>) => void;
  addLampiran: (item: LampiranItem) => void;
  removeLampiran: (id: string) => void;
  reorderLampiran: (items: LampiranItem[]) => void;
  updateSlug: (newSlug: string) => Promise<{ ok: boolean; error?: string; slug?: string }>;
  checkSlugAvailable: (candidate: string) => Promise<boolean>;
  saving: boolean;
  completionPercent: number;
  sectionStatus: SectionStatus;
  rubrikLevel: 'kurang' | 'cukup' | 'baik' | 'sangat_baik';
  loadPortfolio: (userId?: string) => Promise<PortfolioData | null>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [data, setData] = useState<PortfolioData>(defaultPortfolio);
  const [slug, setSlug] = useState<string | null>(null);
  const [theme, setTheme] = useState<string>('classic-blue');
  const [themeOverridesMap, setThemeOverridesMap] = useState<ThemeOverridesMap>({});
  const [saving, setSaving] = useState(false);
  const slugRef = useRef<string | null>(null);
  const themeRef = useRef<string>('classic-blue');

  const saveToDb = useCallback(async (newData: PortfolioData) => {
    if (!user) return;
    setSaving(true);
    try {
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
        reflection_data: newData.reflection as any,
        model_guru_data: newData.model_guru as any,
        lampiran_data: newData.lampiran as any,
        ...(nextSlug ? { slug: nextSlug } : {}),
        updated_at: new Date().toISOString(),
      } as any, { onConflict: 'user_id' });
    } catch {
      toast.error('Gagal menyimpan data');
    } finally {
      setSaving(false);
    }
  }, [user]);

  const checkSlugAvailable = useCallback(async (candidate: string): Promise<boolean> => {
    const cleaned = slugify(candidate);
    if (!cleaned) return false;
    if (cleaned === slugRef.current) return true;
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
      const r: any = row;
      const loaded: PortfolioData = {
        profile: { ...defaultProfile, ...((r.profile_data as any) || {}) },
        artefak: migrateArtefak(r.artefak_data),
        reflection: { ...defaultReflection, ...((r.reflection_data as any) || {}) },
        model_guru: (r.model_guru_data as any) || defaultPortfolio.model_guru,
        lampiran: (r.lampiran_data as any) || defaultPortfolio.lampiran,
      };
      if (!userId || userId === user?.id) {
        setData(loaded);
        const loadedSlug = r.slug || null;
        slugRef.current = loadedSlug;
        setSlug(loadedSlug);
        const loadedTheme = r.theme || 'classic-blue';
        themeRef.current = loadedTheme;
        setTheme(loadedTheme);
        setThemeOverridesMap(normalizeOverridesMap(r.theme_overrides, loadedTheme));
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
    autoSave({ ...data, profile: { ...data.profile, ...profile } });
  };

  const addArtefak = (item: Omit<ArtefakItem, 'id'>) => {
    const id = crypto.randomUUID();
    autoSave({ ...data, artefak: [...data.artefak, { ...item, id }] });
    return id;
  };

  const updateArtefakFn = (id: string, patch: Partial<ArtefakItem>) => {
    autoSave({ ...data, artefak: data.artefak.map(a => a.id === id ? { ...a, ...patch } : a) });
  };

  const removeArtefak = (id: string) => {
    autoSave({ ...data, artefak: data.artefak.filter(a => a.id !== id) });
  };

  const updateReflection = (patch: Partial<ReflectionData>) => {
    autoSave({ ...data, reflection: { ...data.reflection, ...patch } });
  };

  const updateModelGuru = (model: Partial<ModelGuruData>) => {
    autoSave({ ...data, model_guru: { ...data.model_guru, ...model } });
  };

  const addLampiran = (item: LampiranItem) => autoSave({ ...data, lampiran: [...data.lampiran, item] });
  const removeLampiran = (id: string) => autoSave({ ...data, lampiran: data.lampiran.filter(l => l.id !== id) });
  const reorderLampiran = (items: LampiranItem[]) => autoSave({ ...data, lampiran: items });

  const updateTheme = useCallback(async (themeId: string) => {
    if (!user) return;
    themeRef.current = themeId;
    setTheme(themeId);
    setSaving(true);
    try {
      await supabase.from('portfolios').update({ theme: themeId, updated_at: new Date().toISOString() } as any).eq('user_id', user.id);
    } catch {
      toast.error('Gagal menyimpan tema');
    } finally {
      setSaving(false);
    }
  }, [user]);

  const themeOverrides: ThemeOverrides = themeOverridesMap[theme] || {};

  const updateThemeOverrides = useCallback(async (patch: Partial<ThemeOverrides>) => {
    if (!user) return;
    const activeTheme = themeRef.current;
    const currentForTheme = themeOverridesMap[activeTheme] || {};
    const merged: ThemeOverrides = { ...currentForTheme, ...patch };
    // Cleanup: hapus key yang undefined agar tidak menyimpan noise
    if (merged.uppercaseHeadings === undefined) delete merged.uppercaseHeadings;
    if (merged.letterSpacingHeading === undefined) delete merged.letterSpacingHeading;
    const nextMap: ThemeOverridesMap = { ...themeOverridesMap, [activeTheme]: merged };
    setThemeOverridesMap(nextMap);
    setSaving(true);
    try {
      await supabase.from('portfolios').update({ theme_overrides: nextMap as any, updated_at: new Date().toISOString() } as any).eq('user_id', user.id);
    } catch {
      toast.error('Gagal menyimpan kustomisasi tema');
    } finally {
      setSaving(false);
    }
  }, [user, themeOverridesMap]);

  const resetThemeOverrides = useCallback(async () => {
    if (!user) return;
    const activeTheme = themeRef.current;
    const nextMap: ThemeOverridesMap = { ...themeOverridesMap };
    delete nextMap[activeTheme];
    setThemeOverridesMap(nextMap);
    setSaving(true);
    try {
      await supabase.from('portfolios').update({ theme_overrides: nextMap as any, updated_at: new Date().toISOString() } as any).eq('user_id', user.id);
    } catch {
      toast.error('Gagal mereset kustomisasi tema');
    } finally {
      setSaving(false);
    }
  }, [user, themeOverridesMap]);

  // ============ STATUS RUBRIK ============
  const sectionStatus: SectionStatus = (() => {
    const p = data.profile;
    const r = data.reflection;
    const m = data.model_guru;

    const beranda = Boolean(p.full_name && p.asal_daerah && p.kutipan_motivasi && p.pengantar);
    const profil = Boolean(p.keunikan_daerah && p.inspirasi_guru && p.tujuan_profesional);
    const artefak = data.artefak.length > 0 && data.artefak.every(a => a.judul && a.deskripsi && a.kategori);
    const analisis = data.artefak.length > 0 && data.artefak.every(a =>
      a.konteks && a.tujuan && a.kelebihan && a.kekurangan && a.teori_pedagogi && a.faktor_keberhasilan && a.adaptasi_pembelajaran
    );
    const refleksi = Boolean(r.pengalaman_mengajar && r.kekuatan_diri && r.kelemahan_diri && r.rencana_tindak_lanjut && r.filosofi_mengajar);
    const model_guru = Boolean(m.visi && m.misi && m.kompetensi.length > 0 && m.karakter.length > 0);
    const lampiran = data.lampiran.length > 0;

    return { beranda, profil, artefak, analisis, refleksi, model_guru, lampiran };
  })();

  const completionPercent = (() => {
    const items = Object.values(sectionStatus);
    const filled = items.filter(Boolean).length;
    return Math.round((filled / items.length) * 100);
  })();

  const rubrikLevel: 'kurang' | 'cukup' | 'baik' | 'sangat_baik' = (() => {
    if (completionPercent >= 90) return 'sangat_baik';
    if (completionPercent >= 70) return 'baik';
    if (completionPercent >= 40) return 'cukup';
    return 'kurang';
  })();

  return (
    <PortfolioContext.Provider value={{
      data, slug, theme, themeOverrides, themeOverridesMap, updateTheme, updateThemeOverrides, resetThemeOverrides,
      updateProfile,
      addArtefak, updateArtefak: updateArtefakFn, removeArtefak,
      updateReflection,
      updateModelGuru,
      addLampiran, removeLampiran, reorderLampiran,
      updateSlug: updateSlugFn, checkSlugAvailable,
      saving, completionPercent, sectionStatus, rubrikLevel, loadPortfolio,
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error('usePortfolio must be used within PortfolioProvider');
  return context;
};
