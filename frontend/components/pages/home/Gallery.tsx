import type { CSSProperties } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight, FiMapPin } from 'react-icons/fi';

import type {
  HomepageImageSize,
  HomepageProjectImage,
} from '@/features/projects/types';

import RevealObserverClient from './RevealObserverClient';

type GalleryProps = {
  images: HomepageProjectImage[];
};

const SIZE_CLASSES: Record<HomepageImageSize, string> = {
  standard: '',
  tall: 'lg:row-span-2',
  wide: 'sm:col-span-2',
};

export default function Gallery({ images }: GalleryProps) {
  const homepageImages = [...images]

  if (homepageImages.length === 0) {
    return null;
  }

  return (
    <RevealObserverClient>
      <section
        id="gallery"
        className="bg-stone-darkest py-20 lg:py-30"
      >
        <div className="mx-auto max-w-(--max-content-width) px-6 lg:px-12">
          {/* Section heading */}
          <div className="reveal mb-10 lg:mb-14">
            <span className="text-[11px] font-medium uppercase tracking-[0.35em] text-gold">
              Our Work
            </span>

            <h2 className="mt-3 font-['Cormorant_Garamond'] text-[clamp(36px,4.5vw,60px)] font-light leading-tight text-white">
              Featured Projects
            </h2>
          </div>

          {/* Project grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:auto-rows-[280px] lg:grid-flow-dense lg:grid-cols-3">
            {homepageImages.map((image, index) => (
              <ProjectImageCard
                key={image.id}
                image={image}
                index={index}
              />
            ))}
          </div>

          {/* Projects CTA */}
          <div className="reveal mt-14 text-center lg:mt-16">
            <Link
              href="/projects"
              className="btn-outline text-gold"
              style={{ borderColor: '#b8975a' }}
            >
              <span>Explore All Projects</span>
            </Link>
          </div>
        </div>
      </section>
    </RevealObserverClient>
  );
}

type ProjectImageCardProps = {
  image: HomepageProjectImage;
  index: number;
};

function ProjectImageCard({
  image,
  index,
}: ProjectImageCardProps) {
  const { project } = image;

  const altText =
    image.alt_text ||
    image.caption ||
    `${project.title} completed by Grayson’s Services`;

  const imageSizes =
    image.homepage_size === 'wide'
      ? '(min-width: 1024px) 66vw, (min-width: 640px) calc(100vw - 48px), calc(100vw - 48px)'
      : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, calc(100vw - 48px)';

  return (
    <Link
      href={`/projects/${project.slug}`}
      aria-label={`View ${project.title}`}
      className={[
        'group reveal-scale relative min-h-80 overflow-hidden',
        'focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-gold focus-visible:ring-offset-4',
        'focus-visible:ring-offset-stone-darkest',
        'lg:min-h-0',
        SIZE_CLASSES[image.homepage_size],
      ].join(' ')}
      style={
        {
          '--reveal-delay': `${index * 80}ms`,
        } as CSSProperties
      }
    >
      <Image
        src={image.image_url}
        alt={altText}
        fill
        sizes={imageSizes}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />

      {/* Permanent shading for text readability */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-3/4 bg-linear-to-t from-black/80 via-black/40 to-transparent"
      />

      {/* Hover tint */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-stone-darkest/0 transition-colors duration-500 group-hover:bg-stone-darkest/15"
      />

      <div className="absolute left-4 top-4 bg-gold px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.25em] text-stone-darkest">
        {project.category}
      </div>

      <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
        {project.location && (
          <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]">
            <FiMapPin
              aria-hidden="true"
              className="h-3.5 w-3.5 shrink-0 text-gold"
            />

            <span>{project.location}</span>
          </div>
        )}

        <h3 className="font-['Cormorant_Garamond'] text-2xl leading-tight font-medium text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] lg:text-3xl">
          {project.title}
        </h3>

        <div className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/70 transition-colors duration-300 group-hover:text-white">
          <span>View Project</span>

          <FiArrowRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
}