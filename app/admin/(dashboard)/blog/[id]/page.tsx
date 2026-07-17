import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import BlogForm from '../BlogForm';

type Params = { params: Promise<{ id: string }> };

export default async function EditBlogPostPage({ params }: Params) {
  const { id } = await params;
  const postId = Number(id);
  if (!Number.isInteger(postId)) notFound();

  const post = await prisma.blogPost.findUnique({ where: { id: postId } });
  if (!post) notFound();

  return (
    <BlogForm
      postId={post.id}
      slug={post.slug}
      initial={{
        title: post.title, excerpt: post.excerpt, contentHtml: post.contentHtml, coverImage: post.coverImage,
        status: post.status as 'draft' | 'published', seoTitle: post.seoTitle, seoDescription: post.seoDescription,
      }}
    />
  );
}
