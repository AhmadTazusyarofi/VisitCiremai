import type { JSX } from 'react';

/**
 * Per-page document metadata. React 19 hoists <title>/<meta> rendered
 * anywhere in the tree into <head>, so we don't need a helmet library.
 */
export function Seo({
  title,
  description,
  noindex = false,
}: {
  title: string;
  description?: string;
  noindex?: boolean;
}): JSX.Element {
  return (
    <>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {noindex && <meta name="robots" content="noindex" />}
    </>
  );
}
