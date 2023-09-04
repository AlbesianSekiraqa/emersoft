import Link from "next/link";
import { getBlogPostCategories } from "../../../pages/api/blogPost/index";

const Card = ({ data }) => {
  const {
    id = "",
    slug = "#",
    imageUrl = "#",
    title = "Post Title",
    excerpt = "Post Description",
    categories = [],
  } = data;
  const postCategories = getBlogPostCategories({ cats: categories });

  return (
    <Link
      href={`blog/${slug}`}
      key={id}
      className="mx-auto bg-white shadow-md rounded-md overflow-hidden transform hover:translate-y-2 transition-transform duration-150 ease-in-out"
    >
      <div>
        <img src={imageUrl} alt="Post alt" />
      </div>
      <div className="px-6 pt-4 pb-0">
        {postCategories.map((category, index) => {
          return (
            <p key={index} className="mr-1 text-sky-700">
              {category.name}
            </p>
          );
        })}
      </div>
      <div className="px-6 py-2">
        <h2 className="text-2xl font-bold text-black">{title}</h2>
      </div>
      <div className="px-6 pb-4 pt-1">
        <p className="text-gray-700">{excerpt}</p>
      </div>
      <div className="flex items-center justify-between px-6 pb-5 pt-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img
              src={imageUrl}
              alt="Author"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-gray-700">Author Name</p>
        </div>
        <p className="text-gray-500">Date of Post</p>
      </div>
    </Link>
  );
};

export default Card;
