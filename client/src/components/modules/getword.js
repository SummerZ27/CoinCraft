function getRandomWord() {
  const words = ["apple", "moon", "ocean", "car", "violin", "bike", "apartment", "cat"];
  const spy_words = ["orange", "sun", "river", "truck", "cello", "scooter", "house", "dog"];
  if (!Array.isArray(words) || words.length === 0) {
    throw new Error("The word list must be a non-empty array.");
  }

  const randomIndex = Math.floor(Math.random() * words.length);
  return [words[randomIndex], spy_words[randomIndex]];
}
export default getRandomWord;
