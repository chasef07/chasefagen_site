import { notFound } from 'next/navigation'

import { PostArticle } from '@/components/journal/PostArticle'
import { getPost, postStaticParams } from '@/content/blog/publication'
import { generatePostMetadata } from '@/lib/seo'

type Props = {
  params: Promise<{ year: string; month: string; postSlug: string }>
}

export function generateStaticParams() {
  return postStaticParams()
}

export async function generateMetadata({ params }: Props) {
  const { year, month, postSlug } = await params
  const post = getPost(year, month, postSlug)

  if (!post) return { title: 'Journal entry not found | Chase Fagen' }

  return generatePostMetadata(post)
}

export default async function PostPage({ params }: Props) {
  const { year, month, postSlug } = await params
  const post = getPost(year, month, postSlug)
  if (!post) notFound()

  return <PostArticle post={post} />
}
