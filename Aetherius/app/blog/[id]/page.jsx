import { allPosts } from '@/public/mockapi.js';
import { notFound } from 'next/navigation';


export async function generateMetadata({ params }) {
  const post = allPosts.find(p => p.id === parseInt(params.id));

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The post you are looking for does not exist.',
    };
  }

  return {
    title: post.title,
    description: post.description,
  };
}


export default function PostPage({ params }) {
  const post = allPosts.find(p => p.id === parseInt(params.id));
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.imageSrc,
    author: {
      '@type': 'Person',
      name: post.author.name,
    },
};

  if (!post) {
    notFound();
  }

  return (
    <article className="bg-white">
      {/* Full width Hero Image */}
      <header className="w-full h-80 md:h-96">
        <img
          src={post.imageSrc}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-12 md:pt-16 text-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-8">
              {post.title}
            </h1>
        </div>
      </div>
      

      <div className="max-w-3xl md:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="prose prose-lg max-w-none">
          <p className="lead">{post.description}</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.
          </p>
          <p>
            Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor.
          </p>
          <p>In the sprawling, invisible cities of the digital world, every application we use is a building, and every website is a public square. These are not spaces of brick and mortar, but of light and logic, architected with code and designed with intent. The most profound of these digital structures are the ones we barely notice—the ones that feel so natural, so intuitive, that they become an effortless extension of our own will. This seamlessness is not an accident; it is the result of a deep design philosophy centered on the principle of cognitive resonance.</p>
          <p>Cognitive resonance is the idea that a user interface should align perfectly with the user's mental model of how something should work. It’s the satisfying, silent click of understanding when a button does exactly what you expect, or when information appears precisely where you anticipate it to be. This principle goes beyond mere aesthetics. A beautiful but confusing application has failed in its primary role. The true goal is to minimize cognitive load—the amount of mental effort required to use a product. A well-designed digital tool, much like a perfectly balanced chef's knife, doesn't require conscious thought to operate; it invites the user to simply do.</p>
          <p>Equally important to the elements we see are the spaces we don't. In digital design, this is often referred to as negative space, or whitespace. It is the art of strategic emptiness. A cluttered interface is like a noisy, crowded room; it overwhelms the senses and makes it difficult to focus on what's important. Ample whitespace, by contrast, creates a sense of calm and order. It draws the eye to key elements, improves legibility, and gives the content room to breathe. This intentional use of space is a guiding hand, subtly directing the user's journey through the information without ever feeling restrictive. It is the quiet framework upon which clarity is built.</p>
          <p>Our interaction with technology is also no longer confined to sight alone. The most immersive experiences are multi-sensory. Consider the subtle vibration—the haptic feedback—your phone provides when you successfully complete a payment. It’s a non-visual confirmation that builds confidence and trust. Think of the soft, satisfying "swoosh" of sending an email or the gentle chime of a new message. These sonic cues are not mere embellishments; they are integral parts of the user feedback loop, providing information and emotional context that visuals alone cannot convey. By engaging touch and sound, designers can create a richer, more holistic and satisfying interaction.</p>
          <p>Ultimately, as we move forward, the line between the user and the interface will continue to blur. The future of design lies in creating symbiotic systems that learn and adapt to the individual. By leveraging data and understanding the deep-seated patterns of human cognition, we can build experiences that are not just universally usable but uniquely personal. The application of tomorrow won't just serve a function; it will anticipate needs, preempt confusion, and resonate with its user on a fundamental level. The architects of these digital spaces are not just building tools; they are shaping the very texture of our daily focus and interaction with the world.</p>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-200 flex items-center gap-4">
          <img
            src={post.author.avatarSrc}
            alt={post.author.name}
            className="h-14 w-14 rounded-full object-cover"
          />
          <div>
            <p className="text-gray-500 text-sm">Written by</p>
            <p className="font-semibold text-gray-900 text-lg">{post.author.name}</p>
          </div>
        </div>

      </div>
    </article>
  );
}