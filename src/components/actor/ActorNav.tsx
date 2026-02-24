import { Link } from 'react-router-dom';

export default function ActorNav({ actorName }: { actorName?: string }) {
  return (
    <nav className="fixed top-0 w-full px-[6%] py-4 flex justify-between items-center bg-background/98 z-[1000] border-b-2 border-primary backdrop-blur-sm">
      <Link to="/" className="text-sm font-black tracking-[2px] text-primary uppercase">
        {actorName || 'Portfolio'}
      </Link>
      <div className="hidden md:flex gap-6">
        <a href="#profile" className="text-xs text-muted-foreground font-bold uppercase hover:text-primary transition-colors">Profile</a>
        <a href="#career" className="text-xs text-muted-foreground font-bold uppercase hover:text-primary transition-colors">Career</a>
        <a href="#insight" className="text-xs text-muted-foreground font-bold uppercase hover:text-primary transition-colors">Insight</a>
        <a href="#videos" className="text-xs text-muted-foreground font-bold uppercase hover:text-primary transition-colors">Archive</a>
      </div>
    </nav>
  );
}
