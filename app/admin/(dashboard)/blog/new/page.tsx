import BlogForm from '../BlogForm';

export default function NewBlogPostPage() {
  return (
    <BlogForm
      initial={{ title: '', excerpt: '', contentHtml: '', coverImage: null, status: 'draft', seoTitle: '', seoDescription: '' }}
    />
  );
}
