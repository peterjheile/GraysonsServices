import Image from 'next/image';

import type { ProjectImage as ProjectImageData } from '@/features/projects/types';

interface ProjectImageProps {
  image: ProjectImageData;
  projectTitle: string;
  sizes: string;
  className?: string;
  showRole?: boolean;
}

export default function ProjectImage({
  image,
  projectTitle,
  sizes,
  className = '',
  showRole = false,
}: ProjectImageProps) {
  const altText =
    image.alt_text ||
    image.caption ||
    `${projectTitle} completed by Grayson’s Services`;

  return (
    <figure
      className={`relative overflow-hidden bg-stone-pale ${className}`}
    >
      <Image
        src={image.image_url}
        alt={altText}
        fill
        sizes={sizes}
        className="object-cover"
      />

      {showRole && image.role !== 'general' && (
        <figcaption className="absolute top-3 left-3 bg-stone-darkest/80 px-2.5 py-1.5 text-[9px] font-semibold tracking-[0.2em] text-white uppercase backdrop-blur-sm">
          {formatProjectImageRole(image.role)}
        </figcaption>
      )}
    </figure>
  );
}

export function getProjectImageLabel(
  image: ProjectImageData,
  projectTitle: string,
): string {
  return (
    image.alt_text ||
    image.caption ||
    `${formatProjectImageRole(image.role)} image of ${projectTitle}`
  );
}

export function formatProjectImageRole(
  role: ProjectImageData['role'],
): string {
  const labels: Record<ProjectImageData['role'], string> = {
    general: 'Project',
    before: 'Before',
    after: 'After',
  };

  return labels[role];
}