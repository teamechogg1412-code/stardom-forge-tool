import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, Twitter, Menu, X, ChevronDown, Mail, MapPin } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';

function useScrollFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, className: `transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}` };
}

export default function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState<'KR' | 'EN'>('KR');
  const about = useScrollFadeIn();
  const contact = useScrollFadeIn();
  const portal = useScrollFadeIn();

  const t = {
    KR: {
      slogan: 'ONE ORIGINAL ORBIT',
      sub: 'WE ARE O3 COLLECTIVE',
      aboutTitle: 'About Us',
      aboutDesc: 'O3 Collective는 독창적인 궤도 위에서 각자의 빛을 발하는 아티스트들의 집합체입니다. 우리는 획일적인 시스템이 아닌, 개별 아티스트의 본질과 잠재력을 극대화하는 전략적 매니지먼트를 지향합니다.',
      aboutPhilo: '하나의 원본, 하나의 궤도. 우리는 모방이 아닌 창조를, 트렌드 추종이 아닌 트렌드 설정을 믿습니다. 각 아티스트가 자신만의 오리지널 궤도를 그리며, 그 궤적이 모여 하나의 강력한 집합체를 이룹니다.',
      contactTitle: 'Contact',
      address: '서울특별시 강남구',
      fanMail: '팬 커뮤니케이션',
      partnerMail: '파트너십 문의',
      viewArtists: 'VIEW OUR ARTISTS',
      artistSub: '우리의 아티스트를 만나보세요',
      nav: { about: '소개', artists: '아티스트', contact: '연락처' },
    },
    EN: {
      slogan: 'ONE ORIGINAL ORBIT',
      sub: 'WE ARE O3 COLLECTIVE',
      aboutTitle: 'About Us',
      aboutDesc: 'O3 Collective is a constellation of artists, each shining on their own original orbit. We pursue strategic management that maximizes every artist\'s essence and potential — not a one-size-fits-all system.',
      aboutPhilo: 'One original, one orbit. We believe in creation over imitation, in setting trends rather than following them. Each artist draws their own original trajectory, and together those paths form one powerful collective.',
      contactTitle: 'Contact',
      address: 'Gangnam-gu, Seoul',
      fanMail: 'Fan Communication',
      partnerMail: 'Partnership Inquiry',
      viewArtists: 'VIEW OUR ARTISTS',
      artistSub: 'Discover our roster',
      nav: { about: 'About', artists: 'Artists', contact: 'Contact' },
    },
  }[lang];

  return (
    <div className="bg-foreground text-primary-foreground scroll-smooth">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-10 py-5">
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-primary-foreground/80 hover:text-primary-foreground transition-colors z-50">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <button onClick={() => setLang(lang === 'KR' ? 'EN' : 'KR')}
          className="text-xs font-bold tracking-[3px] text-primary-foreground/70 hover:text-primary-foreground transition-colors border border-primary-foreground/20 px-3 py-1.5 rounded-full z-50">
          {lang === 'KR' ? 'EN' : 'KR'}
        </button>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/95 backdrop-blur-md flex flex-col items-center justify-center gap-8">
          {[
            { label: t.nav.about, href: '#about' },
            { label: t.nav.artists, href: '/artists' },
            { label: t.nav.contact, href: '#contact' },
          ].map(item => (
            <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)}
              className="text-2xl font-light tracking-[6px] text-primary-foreground/80 hover:text-accent transition-colors uppercase">
              {item.label}
            </a>
          ))}
        </div>
      )}

      {/* Section 1: Hero */}
      <section className="relative h-screen flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="O3 Collective" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/40 to-transparent" />
        </div>
        <div className="relative z-10 px-6 md:px-16 pb-28 md:pb-32">
          <p className="text-xs md:text-sm font-light tracking-[8px] md:tracking-[12px] text-primary-foreground/60 mb-4 uppercase">
            {t.sub}
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            {t.slogan}
          </h1>
          <div className="w-16 h-[2px] bg-accent mt-6" />
        </div>
        {/* Social bar */}
        <div className="relative z-10 bg-foreground border-t border-primary-foreground/10 px-6 md:px-16 py-4 flex items-center justify-between">
          <div className="flex gap-5">
            <a href="#" className="text-primary-foreground/50 hover:text-accent transition-colors"><Instagram size={18} /></a>
            <a href="#" className="text-primary-foreground/50 hover:text-accent transition-colors"><Youtube size={18} /></a>
            <a href="#" className="text-primary-foreground/50 hover:text-accent transition-colors"><Twitter size={18} /></a>
          </div>
          <a href="#about" className="text-primary-foreground/40 hover:text-primary-foreground/70 transition-colors">
            <ChevronDown size={20} className="animate-bounce" />
          </a>
        </div>
      </section>

      {/* Section 2: About */}
      <section id="about" className="min-h-screen bg-primary-foreground text-foreground flex items-center">
        <div {...about} className={`w-full px-6 md:px-16 lg:px-24 py-24 md:py-32 ${about.className}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 max-w-6xl mx-auto">
            <div>
              <p className="text-xs font-bold tracking-[6px] text-muted-foreground uppercase mb-4">{t.aboutTitle}</p>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                O3<br />Collective
              </h2>
              <div className="w-12 h-[2px] bg-accent mt-6" />
            </div>
            <div className="flex flex-col justify-center gap-6">
              <p className="text-sm md:text-base leading-relaxed text-muted-foreground font-medium">
                {t.aboutDesc}
              </p>
              <p className="text-sm md:text-base leading-relaxed text-muted-foreground/80">
                {t.aboutPhilo}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Contact */}
      <section id="contact" className="bg-foreground text-primary-foreground">
        <div {...contact} className={`w-full px-6 md:px-16 lg:px-24 py-24 md:py-32 ${contact.className}`}>
          <div className="max-w-6xl mx-auto">
            <p className="text-xs font-bold tracking-[6px] text-primary-foreground/50 uppercase mb-4">{t.contactTitle}</p>
            <div className="w-12 h-[2px] bg-accent mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold tracking-[2px] text-primary-foreground/40 uppercase mb-2">Address</p>
                  <p className="text-sm text-primary-foreground/80">{t.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold tracking-[2px] text-primary-foreground/40 uppercase mb-2">{t.fanMail}</p>
                  <a href="mailto:fan@o3collective.com" className="text-sm text-primary-foreground/80 hover:text-accent transition-colors">fan@o3collective.com</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold tracking-[2px] text-primary-foreground/40 uppercase mb-2">{t.partnerMail}</p>
                  <a href="mailto:partner@o3collective.com" className="text-sm text-primary-foreground/80 hover:text-accent transition-colors">partner@o3collective.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Artist Portal */}
      <section className="bg-primary-foreground text-foreground">
        <div {...portal} className={`w-full px-6 md:px-16 lg:px-24 py-32 md:py-40 text-center ${portal.className}`}>
          <p className="text-xs font-bold tracking-[6px] text-muted-foreground uppercase mb-6">{t.artistSub}</p>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-10" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t.viewArtists}
          </h2>
          <Link to="/artists"
            className="inline-block border-2 border-foreground px-10 py-4 text-sm font-bold tracking-[4px] uppercase hover:bg-foreground hover:text-primary-foreground transition-all duration-300">
            ENTER →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground border-t border-primary-foreground/10 px-6 md:px-16 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-5">
          <a href="#" className="text-primary-foreground/40 hover:text-accent transition-colors"><Instagram size={16} /></a>
          <a href="#" className="text-primary-foreground/40 hover:text-accent transition-colors"><Youtube size={16} /></a>
          <a href="#" className="text-primary-foreground/40 hover:text-accent transition-colors"><Twitter size={16} /></a>
        </div>
        <p className="text-[11px] text-primary-foreground/30 tracking-[2px]">© O3 Collective. All rights reserved.</p>
      </footer>
    </div>
  );
}
