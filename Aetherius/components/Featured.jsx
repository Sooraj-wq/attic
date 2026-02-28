import React from "react";
import Link from "next/link";

export default function Featured({ posts }) {
    //Filtering data to get only featured posts
    const featuredPosts = posts.filter(post => post.isFeatured);

    // The first featured post will be the main one
    const mainPost = featuredPosts[0];

    // The rest of the featured posts will go in the side list
    const otherFeaturedPosts = featuredPosts.slice(1, 5);

    return (
        <div className="w-full flex flex-col justify-start items-start gap-10 md:gap-15 md:px-8 mt-6 md:items-start md:flex-row">

            {/*The main big card component*/}
            <Link href={`/blog/${mainPost.id}`} className="h-100 w-full md:w-[50%] flex-shrink-0 block">
                <div className="ft-card bg-gray-400 rounded-3xl w-full h-full relative overflow-hidden hover:cursor-pointer">
                    <img src={mainPost.imageSrc} alt={mainPost.title} className="h-full w-full object-cover transition-transform duration-300 ease-in-out hover:scale-125"/>
                    <div className="ft-footer absolute bottom-0 left-0 w-full h-[30%] p-5 backdrop-blur-sm">
                        <button className="border-amber-400 bg-none border-1 text-white rounded-4xl py-1 px-2 mb-2">{mainPost.category}</button>
                        <div className="ml-1 ft-card-title text-white text-2xl font-bold truncate overflow-hidden whitespace-nowrap">
                            {mainPost.title}
                        </div>
                    </div>
                </div>
            </Link>

            {/* The Posts */}
            <div className="ft-posts flex flex-col gap-2 ml-2">
                <p className="ft-title text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Other Featured Posts</p>
                <div className="w-full max-w-sm flex flex-col">
                    {otherFeaturedPosts.map((post) => (
                     <Link href={`/blog/${post.id}`} key={post.id}>
                        <div key={post.id} className="flex items-center gap-4 py-4 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-50 hover:rounded-2xl transition-colors" >
                            <img src={post.imageSrc} alt={post.title} className="h-14 w-18 rounded-lg object-cover flex-shrink-0"/>
                            <p className="font-semibold text-gray-800 leading-tight">
                                {post.title}
                            </p>
                        </div>
                    </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}