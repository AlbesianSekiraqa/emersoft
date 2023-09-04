import data from "../../../src/data/data.json";

export default function handler(req, res) {
  const { title, category } = req.query;

  if (!title && !category) {
    res.status(200).json(data);
    return;
  }

  let filteredData = data.posts;
  const searchedCategory = data.categories.find((cat) => cat.slug === category);

  if (title) {
    const lowercaseTitle = title.toLowerCase();
    filteredData = filteredData.filter((item) =>
      item.title.toLowerCase().includes(lowercaseTitle)
    );
  }

  if (category) {
    filteredData = filteredData.filter((item) =>
      item.categories.includes(searchedCategory.id)
    );
  }

  if (title && category) {
    const lowercaseTitle = title.toLowerCase();
    filteredData = filteredData.filter(
      (item) =>
        item.title.toLowerCase().includes(lowercaseTitle) &&
        item.categories.includes(searchedCategory.id)
    );
  }

  res.status(200).json(filteredData);
}
