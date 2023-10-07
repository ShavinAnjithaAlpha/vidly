const mongoose = require("mongoose");

// create a schema for the genre collection
const genreSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 50 },
  description: { type: String, required: false, minlength: 3, maxlength: 255 },
});

// create a model for the genre collection
const Genre = mongoose.model("Genre", genreSchema);

mongoose
  .connect("mongodb://127.0.0.1/vidly")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

/**
 * Populates the genres collection with at least 30 documents with descriptions.
 * @returns {Promise} - A promise that resolves when the operation is complete.
 */
async function populateGenres() {
  const genres = [
    {
      name: "Action",
      description: "Movies with lots of action and explosions.",
    },
    { name: "Comedy", description: "Movies that make you laugh out loud." },
    { name: "Drama", description: "Movies that make you cry." },
    { name: "Horror", description: "Movies that scare you." },
    { name: "Romance", description: "Movies about love and relationships." },
    { name: "Sci-Fi", description: "Movies about space and the future." },
    {
      name: "Thriller",
      description: "Movies that keep you on the edge of your seat.",
    },
    { name: "Western", description: "Movies set in the American Old West." },
    { name: "Animation", description: "Movies that are animated." },
    {
      name: "Documentary",
      description: "Movies that are based on real events.",
    },
    { name: "Musical", description: "Movies that have singing and dancing." },
    {
      name: "Mystery",
      description: "Movies that are mysterious and puzzling.",
    },
    { name: "Sport", description: "Movies about sports and athletes." },
    { name: "War", description: "Movies about war and conflict." },
    {
      name: "Biography",
      description: "Movies about real people and their lives.",
    },
    { name: "Crime", description: "Movies about criminals and the law." },
    {
      name: "Family",
      description: "Movies that are suitable for the whole family.",
    },
    {
      name: "Fantasy",
      description: "Movies about magic and mythical creatures.",
    },
    {
      name: "History",
      description: "Movies about historical events and figures.",
    },
    { name: "Music", description: "Movies about music and musicians." },
    { name: "News", description: "Movies that are based on current events." },
    {
      name: "Reality-TV",
      description: "Movies that are based on real-life situations.",
    },
    { name: "Short", description: "Movies that are short in length." },
    { name: "Talk-Show", description: "Movies that are based on talk shows." },
    { name: "War & Politics", description: "Movies about war and politics." },
    { name: "Game-Show", description: "Movies that are based on game shows." },
    {
      name: "Sci-Fi & Fantasy",
      description: "Movies that are both science fiction and fantasy.",
    },
    {
      name: "Action & Adventure",
      description: "Movies that are both action and adventure.",
    },
    { name: "Kids", description: "Movies that are suitable for kids." },
    {
      name: "News & Politics",
      description: "Movies that are both news and politics.",
    },
    { name: "Reality", description: "Movies that are based on reality." },
  ];

  // create an array of promises to insert each genre into the database
  const promises = genres.map((genre) => {
    const { error } = validateGenre(genre);
    if (error) {
      throw new Error(error.details[0].message);
    }

    const newGenre = new Genre(genre);
    return newGenre.save();
  });

  // wait for all promises to resolve
  await Promise.all(promises).then(() => {
    console.log("Successfully populated the genres collection.");
  });
}

// call the function to populate the genres collection
populateGenres();

/**
 * Validates the genre object.
 * @param {Object} body - The request body to validate.
 * @returns {Object} - The validation result.
 */
function validateGenre(body) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    description: Joi.string().min(3).max(255),
  });

  return schema.validate(body);
}
