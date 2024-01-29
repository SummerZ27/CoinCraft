//to activate: source venv/bin/activate
//chroma run
require("dotenv").config();
const Document = require("./models/document");

const ANYSCALE_API_KEY = process.env.ANYSCALE_API_KEY;
const CHROMADB_URI = process.env.CHROMADB_URI || "http://localhost:8000";

// some information about this model: https://ai.meta.com/llama/
const MODEL = "meta-llama/Llama-2-13b-chat-hf";
// another common choice of embedding model is text-embedding-ada-002.
// we use gte-large because this is the only embedding model anyscale has access to
const EMBEDDING_MODEL = "thenlper/gte-large";

// anyscale uses openAI under the hood! but anyscale gives us $10 free credits
const { OpenAI } = require("openai");
const anyscale = new OpenAI({
  baseURL: "https://api.endpoints.anyscale.com/v1",
  apiKey: ANYSCALE_API_KEY,
});

const game_prompt =
  "We are playing a game. There are 4 players including you. One of the player, the 'spy', is given a phrase different than the one given to everyone else. You don't know whether you are the 'spy' or not. In each round, everyone describes their phrase and vote someone they think are the 'spy' out. If they are only two people left and the spy is still there, then the spy wins. Now let's play this game.";
const action_describe = "Now it's your turn. Only generate your description of the phrase.";
const action_vote =
  "Now vote someone out. Only generate the name of your chosen player. Select one of A,B,C,D.";

// chat completion helper function
const PlayerAtypes = async (query) => {
  const prompt = {
    model: MODEL,
    messages: [
      {
        role: "system",
        content: `${game_prompt} Your phrase is 'plane'. Player A says: '${query}. 'Player B says: 'This is a vehicle used to transport people and goods over long distances.' Player C says:'This is a mode of transportation commonly seen at airports.' Player D says:'This is a flying vehicle that provides a means of air travel.'`,
      },
      {
        role: "user",
        content: `${action_vote}`,
      },
    ],
    temperature: 0.7,
  };
  const completion = await anyscale.chat.completions.create(prompt);
  return completion.choices[0].message.content;
};

const PlayerBtypes = async (query, phrase) => {
  const prompt = {
    model: MODEL,
    messages: [
      {
        role: "system",
        content: `${game_prompt} Your phrase is '${phrase}'. Player A says: '${query}.'`,
      },
      {
        role: "user",
        content: `${action_describe}`,
      },
    ],
    temperature: 0.7,
  };
  const completion = await anyscale.chat.completions.create(prompt);
  return completion.choices[0].message.content;
};

// initialize vector database
const COLLECTION_NAME = "catbook-collection";
const { ChromaClient } = require("chromadb");
const client = new ChromaClient({
  path: CHROMADB_URI,
});

let collection = null;

// sync main and vector dbs
const syncDBs = async () => {
  // retrieve all documents
  const allDocs = await collection.get();
  // delete all documents
  await collection.delete({
    ids: allDocs.ids,
  });
  // retrieve corpus from main db
  const allMongoDocs = await Document.find({});
  if (allMongoDocs.length === 0) {
    // avoid errors associated with passing empty lists to chroma
    console.log("number of documents", await collection.count());
    return;
  }
  const allMongoDocIds = allMongoDocs.map((mongoDoc) => mongoDoc._id.toString());
  const allMongoDocContent = allMongoDocs.map((mongoDoc) => mongoDoc.content);
  let allMongoDocEmbeddings = allMongoDocs.map((mongoDoc) => generateEmbedding(mongoDoc.content));
  allMongoDocEmbeddings = await Promise.all(allMongoDocEmbeddings); // ensure embeddings finish generating
  // add corpus to vector db
  await collection.add({
    ids: allMongoDocIds,
    embeddings: allMongoDocEmbeddings,
    documents: allMongoDocContent,
  });
  console.log("number of documents", await collection.count());
};

const retrievalAugmentedGeneration = async (query, phrase) => {
  const llmResponse = await PlayerBtypes(query, phrase);
  return llmResponse;
};

module.exports = {
  retrievalAugmentedGeneration: retrievalAugmentedGeneration,
};
