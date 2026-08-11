'use client';

import { useMemo } from 'react';

import Image from 'next/image';

import type { Project } from '@/features/projects/types';

import ProjectMediaViewer, {
  getUniqueProjectImages,
} from './ProjectMediaViewer';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({
  project,
}: ProjectCardProps) {
  const headingId = `project-${project.id}-title`;
  const images = useMemo(
    () => getUniqueProjectImages(project),
    [project],
  );
  const cardImage = project.cover_image ?? images[0] ?? null;

  return (
    <ProjectMediaViewer
      projectTitle={project.title}
      images={images}
    >
      {({ imageCount, openGallery }) => (
        <article
          aria-labelledby={headingId}
          className="flex h-full flex-col"
        >
          {cardImage ? (
            <button
              type="button"
              aria-label={`View project photos for ${project.title}`}
              onClick={() => openGallery(cardImage.id)}
              className="group relative mb-4 block aspect-4/3 w-full overflow-hidden bg-[#eee9e2] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              <Image
                src={cardImage.image_url}
                alt={
                  cardImage.alt_text ||
                  `${project.title} completed by Grayson’s Services`
                }
                fill
                sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transform-gpu transition-transform duration-500 ease-out group-hover:scale-[1.025] group-focus-visible:scale-[1.025] motion-reduce:transform-none motion-reduce:transition-none"
              />
            </button>
          ) : (
            <div className="mb-4 flex aspect-4/3 items-center justify-center bg-[#eee9e2] px-6 text-center">
              <span className="text-[10px] font-medium tracking-[0.25em] text-stone-light uppercase">
                Project images coming soon
              </span>
            </div>
          )}

          <div className="flex flex-1 flex-col">
            {(project.category || project.completion_year !== null) && (
              <div className="mb-2 flex items-start justify-between gap-4">
                {project.category ? (
                  <p className="text-[9px] leading-relaxed font-medium tracking-[0.2em] text-gold uppercase sm:text-[10px]">
                    {project.category}
                  </p>
                ) : null}

                {project.completion_year !== null && (
                  <p className="ml-auto shrink-0 text-[10px] leading-relaxed tracking-[0.1em] text-stone-light">
                    {project.completion_year}
                  </p>
                )}
              </div>
            )}

            <h3
              id={headingId}
              className="mb-1 font-['Cormorant_Garamond'] text-xl leading-tight font-semibold text-stone-darkest sm:text-2xl"
            >
              {project.title}
            </h3>

            {project.location && (
              <p className="mb-3 text-[10px] tracking-[0.2em] text-stone-light uppercase">
                {project.location}
              </p>
            )}

            {project.caption && (
              <p className="line-clamp-2 text-xs leading-relaxed font-light text-stone">
                {project.caption}
              </p>
            )}

            {imageCount > 0 ? (
              <button
                type="button"
                aria-label={`View project photos for ${project.title}`}
                onClick={() => openGallery()}
                className="group mt-auto inline-flex w-fit items-center gap-2 pt-5 text-[10px] font-semibold tracking-[0.2em] text-stone-darkest uppercase transition-colors duration-200 hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold motion-reduce:transition-none"
              >
                <span>View project</span>

                <svg
                  aria-hidden="true"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  className="transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none"
                >
                  <path
                    d="M1.5 6h9M7 2.5 10.5 6 7 9.5"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            ) : (
              <span className="mt-auto pt-5 text-[10px] font-medium tracking-[0.2em] text-stone-light uppercase">
                Photos coming soon
              </span>
            )}
          </div>
        </article>
      )}
    </ProjectMediaViewer>
  );
}