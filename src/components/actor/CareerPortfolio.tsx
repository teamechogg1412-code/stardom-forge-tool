import type { Career } from '@/types/actor';

export default function CareerPortfolio({ careers }: { careers: Career[] }) {
  const dramaFilm = careers.filter(c => c.category === 'drama_film');
  const brandEditorial = careers.filter(c => c.category === 'brand_editorial');

  if (dramaFilm.length === 0 && brandEditorial.length === 0) return null;

  return (
    <section className="py-24 px-[8%] border-b border-border">
      <h2 className="text-3xl font-black text-center tracking-[4px] uppercase text-primary mb-12">Career Portfolio</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 max-w-[1300px] mx-auto">
        {dramaFilm.length > 0 && (
          <div>
            <h3 className="text-xl font-black text-primary mb-10 pb-4 border-b-4 border-primary tracking-wide">Drama & Film</h3>
            <ul className="space-y-7">
              {dramaFilm.map(c => (
                <li key={c.id} className="flex gap-7 items-start">
                  <span className="w-[70px] shrink-0 text-base font-black text-muted-foreground tracking-wide">{c.year_label}</span>
                  <div>
                    <span className="block text-lg font-extrabold leading-snug">{c.title}</span>
                    {c.description && <span className="block text-sm text-muted-foreground font-medium mt-1">{c.description}</span>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {brandEditorial.length > 0 && (
          <div>
            <h3 className="text-xl font-black text-primary mb-10 pb-4 border-b-4 border-primary tracking-wide">Brand & Editorial</h3>
            <ul className="space-y-7">
              {brandEditorial.map(c => (
                <li key={c.id} className="flex gap-7 items-start">
                  <span className="w-[70px] shrink-0 text-base font-black text-muted-foreground tracking-wide">{c.year_label}</span>
                  <div>
                    <span className="block text-lg font-extrabold leading-snug">{c.title}</span>
                    {c.description && <span className="block text-sm text-muted-foreground font-medium mt-1">{c.description}</span>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
