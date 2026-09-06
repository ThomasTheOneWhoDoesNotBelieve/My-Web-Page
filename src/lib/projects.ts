import type { ImageMetadata } from 'astro';

type MarkdownModule = {
  frontmatter: {
    title?: string;
    place?: string;
    date?: string;
    order?: number;
    note?: string;
  };
};

type ImageModule = {
  default: ImageMetadata;
};

export type PhotoProject = {
  slug: string;
  index: string;
  title: string;
  place: string;
  date: string;
  order: number;
  note: string;
  cover: ImageMetadata;
  photos: ImageMetadata[];
};

const metaModules = import.meta.glob<MarkdownModule>(
  '../content/projects/*/project.md',
  { eager: true }
);

const coverModules = import.meta.glob<ImageModule>(
  '../content/projects/*/cover.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true }
);

const photoModules = import.meta.glob<ImageModule>(
  '../content/projects/*/photos/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true }
);

function slugFromMetaPath(path: string) {
  return path.match(/\/projects\/([^/]+)\/project\.md$/)?.[1] ?? '';
}

function slugFromImagePath(path: string) {
  return path.match(/\/projects\/([^/]+)\//)?.[1] ?? '';
}

function numericSort([a]: [string, unknown], [b]: [string, unknown]) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

export function getProjects(): PhotoProject[] {
  const raw = Object.entries(metaModules)
    .map(([metaPath, module]) => {
      const slug = slugFromMetaPath(metaPath);
      if (!slug || slug.startsWith('_')) return null;

      const photos = Object.entries(photoModules)
        .filter(([path]) => slugFromImagePath(path) === slug)
        .sort(numericSort)
        .map(([, imageModule]) => imageModule.default);

      const explicitCover = Object.entries(coverModules)
        .find(([path]) => slugFromImagePath(path) === slug)?.[1].default;

      const cover = explicitCover ?? photos[0];
      if (!cover) return null;

      const fm = module.frontmatter ?? {};

      return {
        slug,
        index: '',
        title: fm.title ?? slug.toUpperCase(),
        place: fm.place ?? '',
        date: fm.date ?? '',
        order: Number(fm.order ?? 999),
        note: fm.note ?? '',
        cover,
        photos,
      };
    })
    .filter((project): project is PhotoProject => project !== null)
    .sort((a, b) => b.order - a.order || a.title.localeCompare(b.title));

  return raw.map((project, i) => ({
    ...project,
    index: String(i + 1).padStart(3, '0'),
  }));
}

export function getProject(slug: string) {
  return getProjects().find((project) => project.slug === slug);
}
