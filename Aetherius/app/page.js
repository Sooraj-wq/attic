import { allPosts } from '../public/mockapi.js';
import PostContainer from '@/components/PostContainer';

export const metadata = {
  title: 'Aetherius | Featured Articles & Recent Posts',
  description: 'Explore featured articles and recent posts on the latest in UI/UX design, SaaS implementation, and emerging technology trends.',
};

//This is the main server component
export default function Home() {
  return (
    <main>
      <PostContainer allPosts={allPosts} />
    </main>
  );
}
