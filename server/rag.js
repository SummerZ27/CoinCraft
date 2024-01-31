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
  "We are playing a game. There are 4 players including you. One of the player, the 'spy', is given a phrase different than the one given to everyone else. You don't know whether you are the 'spy' or not. In each round, everyone describes their phrase and vote someone they think are the 'spy' out. You want to generate your response such that it is not too specific that it reveals your identity, but also not too vague. Your response needs to describe your word accurately. You cannot lie about your word. You cannot respond with something that doesn't actually describe your word. Now let's play this game.";
const action_describe =
  "Now it's your turn. Only generate one short sentence of your description of the phrase and encapsulate your response in between two '%' signs. Make sure your description is extremely non-specific so that the spy couldn't tell whether he is the spy or not and doesn't include the given phrase.";
const action_vote_test =
  "Now vote someone out. You can't vote yourself out. Vote out the person whose response is the most likely to be the spy's. A spy's response can be describing another similar object, completely irrelevant, or too vague. Generate the name of your chosen player (select one of A,B,C,D that is not yourself) only. Encapsulate your single-letter response A, B, C, or D in between two '%' signs.";
const round2 =
  "In the last round, a player is voted out. However, the voted out player is not the spy. The remaining three players should describe their words again. ";
const round2_describe =
  "Now it's your turn. Make sure your description in this round is built upon descriptions in the previous round, you can also shortly comment on other people's performace. Only generate one short sentence and encapsulate your response in between two '%' signs. Your response should be less than twenty words.";

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
        content: `Your phrase is '${phrase}'. Player D said: '${descriptionD}.' Player A said:'${descriptionA}.' Player B said:'${descriptionB}.' Your description should be about '${phrase}' and a bit more specific than the descriptions of player D, A, and B.`,
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
    temperature: 0.2,
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
    temperature: 0.2,
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
    temperature: 0.2,
  };
  const completion = await anyscale.chat.completions.create(prompt);
  return completion.choices[0].message.content;
};

const PlayerAtypes2 = async (
  descriptionD,
  descriptionA,
  descriptionB,
  descriptionC,
  descriptionD2,
  phrase
) => {
  const prompt = {
    model: MODEL,
    messages: [
      {
        role: "system",
        content: `${game_prompt} ${round2}$ ${round2_describe}`,
      },
      {
        role: "user",
        content: `Your phrase is '${phrase}'. Player D said: '${descriptionD}.' Player A said:'${descriptionA}.' Player B said:'${descriptionB}.' Player C said:'${descriptionC}.'In the second round, Player D said '${descriptionD2}.'`,
      },
    ],
    temperature: 0.3,
  };
  const completion = await anyscale.chat.completions.create(prompt);
  return completion.choices[0].message.content;
};

const PlayerBtypes2 = async (
  descriptionD,
  descriptionA,
  descriptionB,
  descriptionC,
  descriptionD2,
  descriptionA2,
  phrase
) => {
  const prompt = {
    model: MODEL,
    messages: [
      {
        role: "system",
        content: `${game_prompt} ${round2}$ ${round2_describe}`,
      },
      {
        role: "user",
        content: `Your phrase is '${phrase}'. Player D said: '${descriptionD}.' Player A said:'${descriptionA}.' Player B said:'${descriptionB}.'Player C said:'${descriptionC}.' In the second round, Player D said '${descriptionD2}.' In the second round, the other player said '${descriptionA2}.'`,
      },
    ],
    temperature: 0.3,
  };
  const completion = await anyscale.chat.completions.create(prompt);
  return completion.choices[0].message.content;
};

const PlayerAvotes2 = async (descriptionD2, descriptionA2, descriptionB2, phrase) => {
  const prompt = {
    model: MODEL,
    messages: [
      {
        role: "system",
        content: `${game_prompt} ${action_vote_test}`,
      },
      {
        role: "user",
        content: `You are player A. Your phrase is '${phrase}'. In the past round, Player D said: '${descriptionD2}.' And then you(Player A) said:'${descriptionA2}.' And then Player B said:'${descriptionB2}.'`,
      },
    ],
    temperature: 0.2,
  };
  const completion = await anyscale.chat.completions.create(prompt);
  return completion.choices[0].message.content;
};

const PlayerBvotes2 = async (descriptionD2, descriptionA2, descriptionB2, phrase) => {
  const prompt = {
    model: MODEL,
    messages: [
      {
        role: "system",
        content: `${game_prompt} ${action_vote_test}`,
      },
      {
        role: "user",
        content: `You are player B. Your phrase is '${phrase}'. In the past round, Player D said: '${descriptionD2}.' And then you(Player A) said:'${descriptionA2}.' And then Player B said:'${descriptionB2}.`,
      },
    ],
    temperature: 0.2,
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
  PlayerAtypes2: PlayerAtypes2,
  PlayerBtypes2: PlayerBtypes2,
  PlayerAvotes2: PlayerAvotes2,
  PlayerBvotes2: PlayerBvotes2,
};
