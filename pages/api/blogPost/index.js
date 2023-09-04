import data from "../../../src/data/data.json";

export const getBlogPostBySlug = (slug) => {
  return data.posts.find((post) => post.slug === slug) || null;
};

export const getBlogPostCategories = ({ cats }) => {
  const allPostCategories = data.categories.filter((category) =>
    cats.includes(category.id)
  );

  return allPostCategories;
};
