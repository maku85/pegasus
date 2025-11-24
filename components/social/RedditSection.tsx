import {
  FaArrowUp,
  FaCommentAlt,
  FaExternalLinkAlt,
  FaReddit,
} from "react-icons/fa";

import { getRedditPosts } from "@/lib/reddit";

interface RedditSectionProps {
  query: string;
}

export default async function RedditSection({ query }: RedditSectionProps) {
  const posts = await getRedditPosts(query);
  if (posts.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
        <span className="w-1 h-8 bg-[#FF4500] rounded-full"></span>
        Social Buzz (Reddit)
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#1a1a1b] hover:bg-[#272729] border border-white/5 hover:border-white/20 rounded-xl overflow-hidden transition-all group flex flex-col"
          >
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                <FaReddit className="text-[#FF4500] text-lg" />
                <span className="font-bold text-gray-300">
                  r/{post.subreddit}
                </span>
                <span>•</span>
                <span>u/{post.author}</span>
              </div>

              <h3 className="font-bold text-white mb-3 line-clamp-3 group-hover:text-[#FF4500] transition-colors flex-1">
                {post.title}
              </h3>

              <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-3 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <FaArrowUp />
                    <span>
                      {post.ups > 1000
                        ? `${(post.ups / 1000).toFixed(1)}k`
                        : post.ups}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaCommentAlt />
                    <span>{post.num_comments}</span>
                  </div>
                </div>
                <FaExternalLinkAlt className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
