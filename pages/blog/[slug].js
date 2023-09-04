import { useRouter } from "next/router";
import {
  getBlogPostBySlug,
  getBlogPostCategories,
} from "../api/blogPost/index";
import "../../app/globals.css";

const BlogPostPage = ({ post }) => {
  const postCategories = getBlogPostCategories({ cats: post.categories });
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  const { imageUrl = post, excerpt = "", title = "" } = post;
  return (
    <div className="container mx-auto mt-8 mb-8 p-4 bg-white rounded-lg shadow-lg">
      <article>
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <div className="aspect-video">
          <img
            src={imageUrl}
            alt="Blog Post Image"
            className="w-full h-full object-cover rounded-lg mb-4 aspect-video"
          />
        </div>
        <div className="py-2">
          {postCategories.map((category) => {
            return <p className="mr-1 text-sky-700">{category.name}</p>;
          })}
        </div>
        <p className="text-gray-900 leading-relaxed mb-2">{excerpt}</p>
        <p className="text-gray-400">
          Published on <span className="font-semibold">Date</span> by{" "}
          <span className="font-semibold">Author</span>
        </p>
      </article>
    </div>
  );
};

export default BlogPostPage;

export async function getServerSideProps({ params }) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
  };
}
