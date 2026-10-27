import BlogDetail from "@/components/BlogDetail";
import { seedPosts } from "@/lib/seed-posts";

export function generateStaticParams() {
  return seedPosts.map(post => ({ slug: post.slug }));
}
export default async function BlogPage({ params }) {
  const { slug } = await params;
  return <BlogDetail slug={slug} />;
}
