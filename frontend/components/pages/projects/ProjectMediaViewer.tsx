'use client';

import {
  type ReactNode,
  useCallback,
  useRef,
  useState,
} from 'react';

import Image from 'next/image';

import type {
  Project,
  ProjectImage as ProjectImageData,
} from '@/features/projects/types';

import {
  formatProjectImageRole,
  getProjectImageLabel,
} from './ProjectImage';

interface ProjectMediaViewerProps {
  projectTitle: string;
  images: readonly ProjectImageData[];
  children: (controls: {
    imageCount: number;
    openGallery: (imageId?: number) => void;
  }) => ReactNode;
}

export default function ProjectMediaViewer({
  projectTitle,
  images,
  children,
}: ProjectMediaViewerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const openGallery = useCallback((imageId?: number) => {
    if (images.length === 0) return;

    const selectedIndex =
      imageId === undefined
        ? 0
        : images.findIndex((image) => image.id === imageId);

    setActiveImageIndex(Math.max(0, selectedIndex));
    dialogRef.current?.showModal();
  }, [images]);

  const showPreviousImage = useCallback(() => {
    if (images.length === 0) return;

    setActiveImageIndex((current) =>
      (current - 1 + images.length) % images.length,
    );
  }, [images.length]);

  const showNextImage = useCallback(() => {
    if (images.length === 0) return;

    setActiveImageIndex((current) =>
      (current + 1) % images.length,
    );
  }, [images.length]);

  const activeImage = images[activeImageIndex] ?? images[0];

  return (
    <>
      {children({
        imageCount: images.length,
        openGallery,
      })}

      {images.length > 0 && (
        <dialog
          ref={dialogRef}
          aria-label={`${projectTitle} photo gallery`}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              event.currentTarget.close();
            }
          }}
          onKeyDown={(event) => {
            if (images.length < 2) return;

            if (event.key === 'ArrowLeft') {
              event.preventDefault();
              showPreviousImage();
            }

            if (event.key === 'ArrowRight') {
              event.preventDefault();
              showNextImage();
            }
          }}
          className="m-auto h-[100dvh] max-h-none w-[100dvw] max-w-none overflow-hidden bg-transparent p-0 backdrop:bg-black/85 open:flex open:items-center open:justify-center"
        >
          <div className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden bg-stone-darkest text-white lg:h-[92dvh] lg:w-[min(92vw,90rem)]">
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/15 px-3 py-2 sm:gap-4 sm:px-6 sm:py-3">
              <div className="min-w-0">
                <p className="truncate text-xs font-medium sm:text-sm">
                  {projectTitle}
                </p>
                <p
                  aria-live="polite"
                  aria-atomic="true"
                  className="mt-0.5 text-[9px] tracking-[0.16em] text-white/60 uppercase sm:text-[10px] sm:tracking-[0.18em]"
                >
                  Photo {activeImageIndex + 1} of {images.length}
                </p>
              </div>

              <button
                type="button"
                aria-label="Close photo gallery"
                onClick={() => dialogRef.current?.close()}
                className="flex size-10 shrink-0 items-center justify-center border border-white/25 text-white transition-colors hover:border-gold hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold motion-reduce:transition-none sm:size-11"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="relative min-h-0 flex-1 overflow-hidden bg-black/25">
              {activeImage && (
                <Image
                  src={activeImage.image_url}
                  alt={getProjectImageLabel(
                    activeImage,
                    projectTitle,
                  )}
                  fill
                  sizes="100vw"
                  className="object-contain px-11 py-2 sm:p-6"
                />
              )}

              {images.length > 1 && (
                <>
                  <GalleryControl
                    label="View previous photo"
                    direction="previous"
                    onClick={showPreviousImage}
                  />
                  <GalleryControl
                    label="View next photo"
                    direction="next"
                    onClick={showNextImage}
                  />
                </>
              )}
            </div>

            {activeImage && (
              <div className="max-h-20 shrink-0 overflow-y-auto border-t border-white/15 px-3 py-2 text-center sm:max-h-28 sm:px-6 sm:py-3">
                <p className="text-[11px] leading-4 text-white/75 sm:text-xs sm:leading-5">
                  {activeImage.caption ||
                    formatProjectImageRole(activeImage.role)}
                </p>
              </div>
            )}

            {images.length > 1 && (
              <div
                role="group"
                aria-label="Choose a project photo"
                className="flex shrink-0 snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain border-t border-white/15 px-3 py-2 sm:px-6 sm:py-3"
              >
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    type="button"
                    aria-label={`View photo ${index + 1}: ${getProjectImageLabel(image, projectTitle)}`}
                    aria-pressed={index === activeImageIndex}
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative aspect-4/3 w-16 shrink-0 snap-start overflow-hidden bg-stone-dark transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold motion-reduce:transition-none sm:w-24 ${
                      index === activeImageIndex
                        ? 'ring-2 ring-gold'
                        : 'opacity-55 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={image.image_url}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </dialog>
      )}
    </>
  );
}

export function getUniqueProjectImages(
  project: Project,
): ProjectImageData[] {
  const images = [
    ...(project.cover_image ? [project.cover_image] : []),
    ...project.images,
  ];
  const seenIds = new Set<number>();

  return images.filter((image) => {
    if (seenIds.has(image.id)) return false;

    seenIds.add(image.id);
    return true;
  });
}

function GalleryControl({
  label,
  direction,
  onClick,
}: {
  label: string;
  direction: 'previous' | 'next';
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`absolute top-1/2 flex size-10 -translate-y-1/2 items-center justify-center bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-gold hover:text-stone-darkest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold motion-reduce:transition-none sm:size-12 ${
        direction === 'previous' ? 'left-1 sm:left-5' : 'right-1 sm:right-5'
      }`}
    >
      <ArrowIcon direction={direction} />
    </button>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
    >
      <path
        d="m3 3 12 12M15 3 3 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowIcon({
  direction,
}: {
  direction: 'previous' | 'next';
}) {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className={direction === 'previous' ? 'rotate-180' : ''}
    >
      <path
        d="M3 9h12m-4-4 4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}