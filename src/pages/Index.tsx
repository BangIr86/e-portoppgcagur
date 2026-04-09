import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, ArrowRight, BookOpen, Users, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg hero-gradient flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-foreground">E-Portfolio PPG</span>
        </div>
        <div className="flex gap-2">
          <Link to="/login"><Button variant="ghost" size="sm">Masuk</Button></Link>
          <Link to="/register"><Button size="sm">Daftar</Button></Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="showcase-hero text-primary-foreground py-24 px-6 mt-4 mx-4 rounded-3xl">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }} className="max-w-3xl mx-auto text-center">
          <p className="text-sm uppercase tracking-widest opacity-70 mb-4">Platform E-Portfolio</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">Bangun Portofolio<br />PPG Prajabatan Anda</h1>
          <p className="text-lg opacity-80 mb-8 max-w-xl mx-auto">Dokumentasikan perjalanan profesional Anda sebagai calon guru melalui e-portfolio yang modern dan profesional.</p>
          <div className="flex gap-3 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-0">
                Mulai Sekarang <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-3xl font-bold text-foreground text-center mb-12">
            Fitur Utama
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: 'Dokumentasi Lengkap', desc: 'Catat profil, artefak pembelajaran, dan refleksi Anda secara terstruktur.' },
              { icon: Users, title: 'Tampilan Profesional', desc: 'Portfolio ditampilkan seperti website profesional yang bisa dibagikan.' },
              { icon: Award, title: 'Siap Presentasi', desc: 'Export ke PDF dan bagikan link portfolio ke dosen pembimbing.' },
            ].map((f, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }}
                className="p-6 rounded-xl bg-card card-shadow text-center">
                <div className="w-12 h-12 rounded-xl hero-gradient flex items-center justify-center mx-auto mb-4">
                  <f.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-sm text-muted-foreground border-t">
        <p>© {new Date().getFullYear()} E-Portfolio PPG Prajabatan. Dibuat untuk mendukung pendidikan Indonesia.</p>
      </footer>
    </div>
  );
};

export default Index;
