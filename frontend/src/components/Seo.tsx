import type { JSX } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE_NAME, SITE_OG_IMAGE, absoluteUrl } from '../lib/site';

/**
 * Per-page document metadata. React 19 hoists <title>/<meta>/<link> rendered
 * anywhere in the tree into <head>, so we don't need a helmet library.
 */
export function Seo({
  title,
  description,
  noindex = false,
  image = SITE_OG_IMAGE,
  type = 'website',
}: {
  title: string;
  description?: string;
  noindex?: boolean;
  /** Path relatif (mis. '/img/hero.png') atau URL absolut. */
  image?: string;
  /** 'website' untuk halaman umum, 'product' untuk halaman paket. */
  type?: 'website' | 'article' | 'product';
}): JSX.Element {
  const { pathname } = useLocation();
  const url = absoluteUrl(pathname);
  const ogImage = absoluteUrl(image);

  return (
    <>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {noindex ? (
        <meta name="robots" content="noindex, follow" />
      ) : (
        <link rel="canonical" href={url} />
      )}

      {/* Open Graph — Facebook, WhatsApp, LinkedIn, dsb. */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="id_ID" />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={title} />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage} />
    </>
  );
}
