import Image from 'next/image'
import { Fragment } from 'react'

import { isPreoptimizedImage } from '@/lib/images'
import type { BlogImage, BlogPost as BlogPostType } from '@/types/blog'

function PostImage({
  image,
  eager = false,
}: {
  image: BlogImage
  eager?: boolean
}) {
  return (
    <figure className="flex flex-col gap-3">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          unoptimized={isPreoptimizedImage(image.src)}
          sizes="(max-width: 640px) calc(100vw - 3rem), 680px"
          className="object-contain"
          loading={eager ? 'eager' : 'lazy'}
        />
      </div>
      {image.caption && (
        <figcaption className="text-center text-sm leading-6 text-muted-foreground">
          {image.caption}
        </figcaption>
      )}
    </figure>
  )
}

export function PostBody({ post }: { post: BlogPostType }) {
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
    <div className="flex max-w-[68ch] flex-col gap-6 font-serif text-lg leading-8 text-foreground/85 sm:text-xl sm:leading-9">
      {paragraphs.map((paragraph, index) => {
        const followingImages = imagesByParagraph.get(index + 1) ?? []

        return (
          <Fragment key={index}>
            <p className="whitespace-pre-line break-words">{paragraph}</p>
            {followingImages.map((image, imageIndex) => (
              <PostImage
                key={`${image.src}-${imageIndex}`}
                image={image}
                eager={image === post.images[0]}
              />
            ))}
          </Fragment>
        )
      })}
    </div>
  )
}
