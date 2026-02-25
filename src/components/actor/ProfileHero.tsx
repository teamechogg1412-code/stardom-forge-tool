import type { ActorFull } from '@/types/actor';
import ImageCarousel from './ImageCarousel';

export default function ProfileHero({ actor }: { actor: ActorFull }) {
  return (
    <section className="min-h-screen flex flex-col md:flex-row items-center gap-16 px-[8%] py-28 border-b border-border">
      <div className="flex-shrink-0 w-full max-w-[450px]">
        <ImageCarousel
          images={actor.images}
          fallbackUrl={actor.profile_image_url}
          fallbackInitial={actor.name_ko[0]}
        />
      </div>

      <div className="flex-1 flex flex-col gap-5">
        <div className="border-b-4 border-foreground pb-3 mb-3">
          <h1 className="text-5xl font-black leading-tight">{actor.name_ko}</h1>
          {actor.name_en && <p className="text-lg text-muted-foreground font-light tracking-[4px] uppercase mt-1">{actor.name_en}</p>}
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {[
            { label: 'Followers', value: actor.followers },
            { label: 'Posts', value: actor.posts },
            { label: 'Following', value: actor.following },
          ].map(item => item.value ? (
            <div key={item.label} className="bg-secondary p-5 text-center rounded-lg border border-border">
              <span className="block text-xs text-primary font-extrabold uppercase mb-1">{item.label}</span>
              <span className="text-xl font-black">{item.value}</span>
            </div>
          ) : null)}
        </div>

        {(actor.avg_likes || actor.avg_comments) && (
          <div className="flex gap-5 justify-end text-sm text-muted-foreground font-bold -mt-2">
            {actor.avg_likes && <span>❤️ {actor.avg_likes}</span>}
            {actor.avg_comments && <span>💬 {actor.avg_comments}</span>}
          </div>
        )}

        {actor.actor_tags.length > 0 && (
          <div>
            <h3 className="text-xs text-muted-foreground font-extrabold uppercase mb-2.5">Global & Major Projects</h3>
            <div className="flex flex-wrap gap-2">
              {actor.actor_tags.map(tag => (
                <span key={tag.id} className={`text-sm px-4 py-1.5 font-bold rounded border transition-colors ${
                  tag.tag_style === 'important' ? 'bg-primary text-primary-foreground border-primary' :
                  tag.tag_style === 'award' ? 'bg-accent text-accent-foreground border-accent' :
                  'bg-card text-foreground border-border'
                }`}>{tag.tag_text}</span>
              ))}
            </div>
          </div>
        )}

        {actor.awards.length > 0 && (
          <div>
            <h3 className="text-xs text-muted-foreground font-extrabold uppercase mb-2.5">Honors & Awards</h3>
            <div className="flex flex-wrap gap-2">
              {actor.awards.map(award => (
                <span key={award.id} className="text-sm px-4 py-1.5 font-bold rounded bg-accent text-accent-foreground border border-accent">
                  🏆 {award.year_label && `(${award.year_label}) `}{award.title}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2.5 p-5 bg-secondary rounded-xl border-l-[6px] border-primary">
          {[
            { label: 'Physical', value: actor.height },
            { label: 'Language', value: actor.language },
            { label: 'Brand', value: actor.brand_keyword },
          ].map(item => item.value ? (
            <div key={item.label}>
              <span className="text-[0.7rem] text-primary font-extrabold block mb-1">{item.label}</span>
              <span className="text-sm font-extrabold">{item.value}</span>
            </div>
          ) : null)}
        </div>

        {actor.instagram_id && (
          <a href={`https://instagram.com/${actor.instagram_id}`} target="_blank" rel="noopener noreferrer"
            className="inline-block mt-2 text-sm font-bold text-primary hover:underline tracking-wider uppercase">
            Go to Official Instagram →
          </a>
        )}
      </div>
    </section>
  );
}
