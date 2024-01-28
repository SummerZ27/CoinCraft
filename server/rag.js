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

// check whether the api key is valid.
// this is only called on server start, so it does not waste too many resources (and will present expensive server crashes when api keys expire)
let hasapikey = false;
const validateAPIKey = async () => {
  try {
    await anyscale.chat.completions.create({
      model: "meta-llama/Llama-2-7b-chat-hf",
      messages: [{ role: "system", content: "" }],
    });
    hasapikey = true;
    return hasapikey;
  } catch {
    console.log("validate api key failed");
    return hasapikey;
  }
};

const isRunnable = () => hasapikey && collection !== null;

// embedding helper function
const generateEmbedding = async (document) => {
  const embedding = await anyscale.embeddings.create({
    model: EMBEDDING_MODEL,
    input: document,
  });
  return embedding.data[0].embedding;
};

// chat completion helper function
const chatCompletion = async (query) => {
  const prompt = {
    model: MODEL,
    messages: [
      {
        role: "system",
        content: `${game_prompt} Your phrase is 'plane'. Player A says: '${query}. 'Player B says: 'This is a vehicle used to transport people and goods over long distances.' Player C says:'This is a mode of transportation commonly seen at airports.' Player D says:'This is a flying vehicle that provides a means of air travel.'${action_vote}`,
      },
    ],
    // temperature controls the variance in the llms responses
    // higher temperature = more variance
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

const initCollection = async () => {
  await validateAPIKey();
  if (!hasapikey) return;
  try {
    collection = await client.getOrCreateCollection({
      name: COLLECTION_NAME,
    });
    // initialize collection embeddings with corpus
    // in production, this function should not run that often, so it is OK to resync the two dbs here
    await syncDBs();
    console.log("finished initializing chroma collection");
  } catch (error) {
    console.log("chromadb not running");
  }
};

// This is an async function => we don't know that the collection is
// initialized before someone else runs functions that depend on the
// collection, so we could get null pointer errors when collection = null
// before initCollection() has finished. That's probably okay, but if we
// see errors, it's worth keeping in mind.
initCollection();

// retrieving context helper function
const NUM_DOCUMENTS = 1;
const retrieveContext = async (query, k) => {
  const queryEmbedding = await generateEmbedding(query);
  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: k,
  });
  return results.documents;
};

// RAG
const retrievalAugmentedGeneration = async (query) => {
  //const context = await retrieveContext(query, NUM_DOCUMENTS);
  const llmResponse = await chatCompletion(query);
  return llmResponse;
};

// add a document to collection
const addDocument = async (document) => {
  const embedding = await generateEmbedding(document.content);
  await collection.add({
    ids: [document._id.toString()],
    embeddings: [embedding],
    documents: [document.content],
  });
};

// update a document in collection
const updateDocument = async (document) => {
  await collection.delete({ ids: [document._id.toString()] });
  await addDocument(document);
};

// delete a document in collection
const deleteDocument = async (id) => {
  await collection.delete({
    ids: [id.toString()],
  });
};

module.exports = {
  isRunnable: isRunnable,
  addDocument: addDocument,
  updateDocument: updateDocument,
  deleteDocument: deleteDocument,
  retrievalAugmentedGeneration: retrievalAugmentedGeneration,
};
