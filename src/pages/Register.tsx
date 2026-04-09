import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { GraduationCap, UserPlus } from 'lucide-react';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', kampus: '', bidangStudi: '' });
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const update = (key: string, value: string) => setForm(p => ({ ...p, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password minimal 6 karakter'); return; }
    setLoading(true);
    const { error } = await signUp(form.email, form.password, {
      full_name: form.name,
      asal_kampus: form.kampus,
      bidang_studi: form.bidangStudi,
    });
    setLoading(false);
    if (error) {
      toast.error('Registrasi gagal: ' + error.message);
    } else {
      toast.success('Berhasil mendaftar! Silakan cek email untuk verifikasi.');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl hero-gradient mb-4">
            <GraduationCap className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Daftar Akun</h1>
          <p className="text-muted-foreground mt-1">Buat akun e-portfolio Anda</p>
        </div>
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Registrasi</CardTitle>
            <CardDescription>Lengkapi data diri Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Nama Lengkap</Label>
                <Input value={form.name} onChange={e => update('name', e.target.value)} placeholder="Nama lengkap" required />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="nama@email.com" required />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" value={form.password} onChange={e => update('password', e.target.value)} placeholder="Minimal 6 karakter" required />
              </div>
              <div className="space-y-2">
                <Label>Asal Kampus</Label>
                <Input value={form.kampus} onChange={e => update('kampus', e.target.value)} placeholder="Universitas..." required />
              </div>
              <div className="space-y-2">
                <Label>Bidang Studi</Label>
                <Input value={form.bidangStudi} onChange={e => update('bidangStudi', e.target.value)} placeholder="Pendidikan Matematika, dll." required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                <UserPlus className="w-4 h-4 mr-2" />
                {loading ? 'Memproses...' : 'Daftar'}
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">Masuk</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
