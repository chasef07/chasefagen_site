import Image from 'next/image'
import { Fragment } from 'react'

import { isPreoptimizedImage } from '@/lib/images'
import type { BlogImage, BlogPost } from '@/types/blog'

function PostImage({
  image,
  eager = false,
}: {
  image: BlogImage
  eager?: boolean
}) {
  return (
    <figure className="my-4 flex flex-col gap-3">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-paper-deep">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          unoptimized={isPreoptimizedImage(image.src)}
          sizes="(max-width: 640px) calc(100vw - 2rem), 672px"
          className="object-contain"
          loading={eager ? 'eager' : 'lazy'}
        />
      </div>
      {image.caption && (
        <figcaption className="font-mono text-xs leading-relaxed text-ink-soft">
          {image.caption}
        </figcaption>
      )}
    </figure>
  )
}

export function PostBody({ post }: { post: BlogPost }) {
  const paragraphs = post.content.split(/\n{2,}/).filter(Boolean)
  const imagesByParagraph = new Map<number, BlogImage[]>()

  post.images.forEach((image, index) => {
    const paragraph = Math.max(
      1,
      Math.round(((index + 1) * paragraphs.length) / (post.images.length + 1)),
    )
    imagesByParagraph.set(paragraph, [
      ...(imagesByParagraph.get(paragraph) ?? []),
      image,
    ])
  })

  return (
    <div className="flex flex-col gap-[1.1em] font-serif text-[1.25rem] leading-[1.65] sm:text-[1.3rem] [&>p:first-child]:first-letter:float-left [&>p:first-child]:first-letter:pt-2 [&>p:first-child]:first-letter:pr-3 [&>p:first-child]:first-letter:font-display [&>p:first-child]:first-letter:text-[5.25rem] [&>p:first-child]:first-letter:leading-[0.8] [&>p:first-child]:first-letter:text-accent">
      {paragraphs.map((paragraph, index) => (
        <Fragment key={index}>
          <p className="break-words whitespace-pre-line">{paragraph}</p>
          {(imagesByParagraph.get(index + 1) ?? []).map((image, imageIndex) => (
            <PostImage
              key={`${image.src}-${imageIndex}`}
              image={image}
              eager={image === post.images[0]}
            />
          ))}
        </Fragment>
      ))}
    </div>
  )
}
