//to activate: source venv/bin/activate
//chroma run
require("dotenv").config();
const ANYSCALE_API_KEY = process.env.ANYSCALE_API_KEY;

// some information about this model: https://ai.meta.com/llama/
const MODEL = "meta-llama/Llama-2-13b-chat-hf";
const { OpenAI } = require("openai");
const anyscale = new OpenAI({
  baseURL: "https://api.endpoints.anyscale.com/v1",
  apiKey: ANYSCALE_API_KEY,
});

const game_prompt =
  "We are playing a game. There are 4 players including you. One of the player, the 'spy', is given a phrase different than the one given to everyone else. You don't know whether you are the 'spy' or not. In each round, everyone describes their phrase and vote someone they think are the 'spy' out. If they are only two people left and the spy is still there, then the spy wins. Now let's play this game.";
const action_describe =
  "Now it's your turn. Only generate one short sentence of your description of the phrase and encapsulate your response in between two '%' signs. Make sure your description is extremely non-specific so that the spy couldn't tell whether he is the spy or not and doesn't include the given phrase.";
const action_vote =
  "Now vote someone out. You can't vote yourself. Vote out the person whose response is the most likely to be the spy's. A spy's response can be a response that's too vague or pointing to another object. Only generate the name of your chosen player (select one of A,B,C,D that is not yourself) and encapsulate your single-letter response in between two '%' signs. ";

const action_vote_test =
  "Now vote someone out. Vote out the person whose response is the most likely to be the spy's. A spy's response can be a response that's too vague or pointing to another object. Gnerate the name of your chosen player (select one of A,B,C,D that is not yourself) and let me know why you choose this player and not other players. Go over everyone's response. Encapsulate your single-letter response in between two '%' signs.";
const PlayerAtypes = async (descriptionD, phrase) => {
  const prompt = {
    model: MODEL,
    messages: [
      {
        role: "system",
        content: `${game_prompt} ${action_describe}`,
      },
      {
        role: "user",
        content: `Your phrase is '${phrase}'. Player D says: '${descriptionD}.'`,
      },
    ],
    temperature: 0.5,
  };
  const completion = await anyscale.chat.completions.create(prompt);
  return completion.choices[0].message.content;
};
const PlayerBtypes = async (descriptionD, descriptionA, phrase) => {
  const prompt = {
    model: MODEL,
    messages: [
      {
        role: "system",
        content: `${game_prompt} ${action_describe}`,
      },
      {
        role: "user",
        content: `Your phrase is '${phrase}'. Player D says: '${descriptionD}.' Player A says:'${descriptionA}'`,
      },
    ],
    temperature: 0.5,
  };
  const completion = await anyscale.chat.completions.create(prompt);
  return completion.choices[0].message.content;
};

const PlayerCtypes = async (descriptionD, descriptionA, descriptionB, phrase) => {
  const prompt = {
    model: MODEL,
    messages: [
      {
        role: "system",
        content: `${game_prompt} ${action_describe}`,
      },
      {
        role: "user",
        content: `Your phrase is '${phrase}'. Player D says: '${descriptionD}.' Player A says:'${descriptionA}.' Player B says:'${descriptionB}.'`,
      },
    ],
    temperature: 0.5,
  };
  const completion = await anyscale.chat.completions.create(prompt);
  return completion.choices[0].message.content;
};

const PlayerAvotes = async (descriptionD, descriptionA, descriptionB, descriptionC, phrase) => {
  const prompt = {
    model: MODEL,
    messages: [
      {
        role: "system",
        content: `${game_prompt} ${action_vote_test}`,
      },
      {
        role: "user",
        content: `You are player A. Your phrase is '${phrase}'. In the past round, Player D said: '${descriptionD}.' And then you(Player A) said:'${descriptionA}.' And then Player B said:'${descriptionB}.'And then Player C said:'${descriptionC}.'`,
      },
    ],
    temperature: 0.3,
  };
  const completion = await anyscale.chat.completions.create(prompt);
  return completion.choices[0].message.content;
};

const PlayerBvotes = async (descriptionD, descriptionA, descriptionB, descriptionC, phrase) => {
  const prompt = {
    model: MODEL,
    messages: [
      {
        role: "system",
        content: `${game_prompt} ${action_vote_test}`,
      },
      {
        role: "user",
        content: `You are Player B. Your phrase is '${phrase}'. Player D said: '${descriptionD}.' And then Player A said:'${descriptionA}.' And then you(Player B) said:'${descriptionB}.'And then Player C said:'${descriptionC}.'`,
      },
    ],
    temperature: 0.3,
  };
  const completion = await anyscale.chat.completions.create(prompt);
  return completion.choices[0].message.content;
};

const PlayerCvotes = async (descriptionD, descriptionA, descriptionB, descriptionC, phrase) => {
  const prompt = {
    model: MODEL,
    messages: [
      {
        role: "system",
        content: `${game_prompt} ${action_vote_test}`,
      },
      {
        role: "user",
        content: `You are Player C. Your phrase is '${phrase}'. Player D said: '${descriptionD}.' And then Player A said:'${descriptionA}.' And then Player B said:'${descriptionB}.' And then you(Player C) said:'${descriptionC}.'`,
      },
    ],
    temperature: 0.3,
  };
  const completion = await anyscale.chat.completions.create(prompt);
  return completion.choices[0].message.content;
};

module.exports = {
  PlayerAtypes: PlayerAtypes,
  PlayerBtypes: PlayerBtypes,
  PlayerCtypes: PlayerCtypes,
  PlayerAvotes: PlayerAvotes,
  PlayerBvotes: PlayerBvotes,
  PlayerCvotes: PlayerCvotes,
};
