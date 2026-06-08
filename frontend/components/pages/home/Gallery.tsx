import { Project } from './types';
import RevealObserverClient from './RevealObserverClient';
import GalleryInteractive  from "./GalleryInteractiveClient"
import { CATEGORIES } from './data';


const categories = ['All', 'Decks', 'Driveways', 'Retaining Walls', 'Walkways'];

type GalleryProps = {
  projects: Project[];
};

export default function Gallery({ projects }: GalleryProps) {

  return (
    <RevealObserverClient>
      <section id="gallery" className="bg-stone-darkest py-20 lg:py-30">
        <div className="max-w-(--max-content-width) mx-auto px-6 lg:px-12">

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-8">
            <div className="reveal">
              <span className="text-[11px] tracking-[0.35em] uppercase text-gold font-medium">Our Work</span>
              <h2 className="font-['Cormorant_Garamond'] text-[clamp(36px,4.5vw,60px)] font-light text-white mt-3 leading-tight">
                Featured Projects
              </h2>
            </div>
          </div>

          <GalleryInteractive projects={projects} categories={CATEGORIES}/>

          {/* CTA */}
          <div className="text-center mt-16 reveal">
            <a href="/projects" className="btn-outline text-gold" style={{ borderColor: '#b8975a' }}>
              <span>View Full Portfolio</span>
            </a>
          </div>
        </div>
      </section>
    </RevealObserverClient>
  );
}


