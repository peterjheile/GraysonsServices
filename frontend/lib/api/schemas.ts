import { z } from 'zod';

export const httpUrlSchema = z.url({
  protocol: /^https?$/,
});

const rootRelativeAssetSchema = z.string().regex(
  /^\/(?!\/)/,
  'Expected an HTTP(S) URL or root-relative path',
);

export const assetUrlSchema = z.union([
  httpUrlSchema,
  rootRelativeAssetSchema,
]);

export const nullableAssetUrlSchema = z
  .union([
    assetUrlSchema,
    z.literal(''),
    z.null(),
  ])
  .transform((value) => value || null);