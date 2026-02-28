// src/api/posts.js

export const allPosts = [
  {
    id: 1,
    title: 'Business Driven Solutions: A Deep Dive into SaaS',
    description: 'Explore the principles and techniques that drive user-centric UI design, ensuring a seamless and in...',
    imageSrc: '/img1.jpg',
    author: {
      name: 'Jennifer Taylor',
      avatarSrc: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    readTime: '7 min read',
    category: 'Business',
    isFeatured: true,
  },
  {
    id: 2,
    title: 'Revolutionizing industries through SaaS implementation',
    description: 'A look at how Software as a Service is changing the landscape of modern industries.',
    imageSrc: '/img3.jpg',
    author: {
      name: 'John Smith',
      avatarSrc: 'https://randomuser.me/api/portraits/men/34.jpg',
    },
    readTime: '4 min read',
    category: 'Technology',
    isFeatured: true,
  },
  {
    id: 3,
    title: 'Synergizing saas and UX design for elevating digital experiences',
    description: 'Dive into the world of user interfaces with our expert guides, latest trends, and practical tips.',
    imageSrc: '/img4.jpg',
    author: {
      name: 'Jennifer Taylor',
      avatarSrc: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    readTime: '5 min read',
    category: 'Design',
    isFeatured: true,
  },
  {
    id: 4,
    title: 'Mastering UI Elements: A Practical Guide for Designers',
    description: 'Dive into the world of user interfaces with our expert guides, latest trends, and practical tips.',
    imageSrc: '/img5.jpg',
    author: {
      name: 'Ryan A.',
      avatarSrc: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    readTime: '3 min read',
    category: 'Design',
    isFeatured: true,
  },
  {
    id: 5,
    title: 'Navigating saas waters with intuitive UI and UX',
    description: 'Learn the best practices for creating intuitive and user-friendly SaaS applications.',
    imageSrc: '/img6.jpg',
    author: {
        name: 'Emily White',
        avatarSrc: 'https://randomuser.me/api/portraits/women/33.jpg',
    },
    readTime: '6 min read',
    category: 'UX',
    isFeatured: true, // This is now also featured
  }
];