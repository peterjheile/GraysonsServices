'use client';

import { useMemo } from 'react';

import Image from 'next/image';

import type {
  Project,
  ProjectImage as ProjectImageData,
} from '@/features/projects/types';

import BeforeAfterSlider from './BeforeAfterSlider';
import ProjectImage, {
  formatProjectImageRole,
  getProjectImageLabel,
} from './ProjectImage';
import ProjectMediaViewer, {
  getUniqueProjectImages,
} from './ProjectMediaViewer';

interface FeaturedProjectMediaProps {
  project: Project;
}

export default function FeaturedProjectMedia({
  project,
}: FeaturedProjectMediaProps) {
  const images = useMemo(
    () => getUniqueProjectImages(project),
    [project],
  );

  const beforeImage = images.find(
    (image) => image.role === 'before',
  );
  const afterImage = images.find(
    (image) => image.role === 'after',
  );
  const hasComparison = Boolean(beforeImage && afterImage);

  const primaryImage =
    project.cover_image ??
    afterImage ??
    beforeImage ??
    images[0] ??
    null;

  const previewImages = images
    .filter((image) => {
      if (hasComparison) {
        return (
          image.id !== beforeImage?.id &&
          image.id !== afterImage?.id
        );
      }

      return image.id !== primaryImage?.id;
    })
    .slice(0, 3);

  if (!primaryImage || images.length === 0) {
    return <ImagePlaceholder />;
  }

  return (
    <ProjectMediaViewer
      projectTitle={project.title}
      images={images}
    >
      {({ openGallery }) => (
        <div className="space-y-3">
          {beforeImage && afterImage ? (
            <BeforeAfterSlider
              key={`${beforeImage.id}-${afterImage.id}`}
              before={{
                src: beforeImage.image_url,
                alt: getProjectImageLabel(
                  beforeImage,
                  project.title,
                ),
              }}
              after={{
                src: afterImage.image_url,
                alt: getProjectImageLabel(
                  afterImage,
                  project.title,
                ),
              }}
              className="aspect-4/3 w-full"
            />
          ) : (
            <ProjectImage
              image={primaryImage}
              projectTitle={project.title}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="aspect-4/3"
              showRole
            />
          )}

          {previewImages.length > 0 && (
            <div
              className={`grid gap-3 ${
                previewImages.length === 1
                  ? 'grid-cols-1'
                  : previewImages.length === 2
                    ? 'grid-cols-2'
                    : 'grid-cols-3'
              }`}
            >
              {previewImages.map((image) => (
                <PreviewButton
                  key={image.id}
                  image={image}
                  projectTitle={project.title}
                  onClick={() => openGallery(image.id)}
                />
              ))}
            </div>
          )}

          {images.length > 1 && (
            <button
              type="button"
              onClick={() => openGallery()}
              className="btn-outline w-full justify-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold motion-reduce:transition-none sm:w-auto"
            >
              <span>View all {images.length} photos</span>
            </button>
          )}
        </div>
      )}
    </ProjectMediaViewer>
  );
}

function PreviewButton({
  image,
  projectTitle,
  onClick,
}: {
  image: ProjectImageData;
  projectTitle: string;
  onClick: () => void;
}) {
  const previewLabel =
    image.caption || formatProjectImageRole(image.role);

  return (
    <button
      type="button"
      aria-label={`Open ${getProjectImageLabel(image, projectTitle)}`}
      title={previewLabel}
      onClick={onClick}
      className="group relative aspect-4/3 min-w-0 overflow-hidden bg-stone-pale focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
    >
      <Image
        src={image.image_url}
        alt=""
        fill
        sizes="(min-width: 1024px) 16vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
      />

      <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/45 to-transparent px-3 pt-6 pb-2 text-left">
        <span className="block truncate text-[10px] leading-tight font-medium text-white">
          {previewLabel}
        </span>
      </span>
    </button>
  );
}

function ImagePlaceholder() {
  return (
    <div className="flex aspect-4/3 items-center justify-center bg-stone-pale px-6 text-center">
      <span className="text-[10px] font-medium tracking-[0.25em] text-stone-light uppercase">
        Project images coming soon
      </span>
    </div>
  );
}