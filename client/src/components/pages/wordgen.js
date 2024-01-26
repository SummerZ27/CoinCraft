import React, { useState, useEffect } from "react";

function getRandomWord() {
  const words = ["apple", "moon", "ocean", "car", "violin", "bike", "apartment", "cat"];
  const spy_words = ["orange", "sun", "river", "truck", "cello", "scooter", "house", "dog"];
  if (!Array.isArray(words) || words.length === 0) {
    throw new Error("The word list must be a non-empty array.");
  }

  const randomIndex = Math.floor(Math.random() * words.length);
  const two_words = [words[randomIndex], spy_words[randomIndex]];
  return two_words;
}

// Example usage
function generate() {
  const randomWord = getRandomWord();
  console.log(randomWord);
}

<button onClick={generate} className="generateWord">
  Generate Word
</button>;
