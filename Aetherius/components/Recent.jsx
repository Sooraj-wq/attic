import React from "react";
import Link from 'next/link';


//Component for cards that appear under the recentPosts section
export default function RecentPosts({ posts }) {
  const recentPosts = posts;

  return (
    <section className="sm:py-8">
      <div className="w-full px-2 mt-3 sm:px-6 lg:px-8">
        
        {/*Section header*/}
        <div className="flex justify-between items-baseline mb-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Recent Posts</h2>
          <a href="#" className="text-sm font-semibold text-gray-700 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 hover:cursor-pointer transition-colors">
            All Posts
          </a>
        </div>

        <div className="w-[100%] grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 hover:cursor-pointer">
          {recentPosts.map((post) => (
          //Maps over each post to find relevant articles
            <Link href={`/blog/${post.id}`} key={post.id}>
                <div key={post.id} className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col transition-transform hover:scale-105">
                  <img 
                    src={post.imageSrc} 
                    alt={post.title} 
                    className="w-full h-52 object-cover" 
                  />
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                      {post.description}
                    </p>
                    <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-100">
                      <img 
                        src={post.author.avatarSrc} 
                        alt={post.author.name} 
                        className="h-9 w-9 rounded-full object-cover" 
                      />
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">{post.author.name}</p>
                        <p className="text-gray-500">{post.readTime}</p>
                      </div>
                    </div>
                  </div>
                </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}