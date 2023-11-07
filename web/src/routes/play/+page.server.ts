import { Game } from './game';

export const load = (({ cookies }) => {
  const game = new Game(cookies.get('mission-pitiful'));

  return {
    index:          game.index,           // Which question number the user is on (0-10).
    score:          game.score,           // The total score so far.
    guesses:        game.guesses,         // The answers the user has given so far.
    showingAnswer:  game.showingAnswer,   // Whether we are showing the current answer.

    statements:     game.statements,      // The mission statements the user has to guess.
    descriptions:   game.descriptions,    // The descriptions of what each company does.
    choices:        game.choices,         // The potential answers available for each question.
    correctAnswers: game.correctAnswers,  // The correct answers.
  };
});

export const actions = {

  /**
   * Modify game state in reaction to a guess.
   */
  answerQuestion: async ({ request, cookies }) => {
    const game  = new Game(cookies.get('mission-pitiful'));

    // TODO

    cookies.set('mission-pitiful', game.toString());
  },

  /**
   * Modify game state when the user presses "Next".
   */
  nextQuestion: async ({ request, cookies }) => {
    const game = new Game(cookies.get('mission-pitiful'));

    // TODO

    cookies.set('mission-pitiful', game.toString());
  },

  restart: async ({ cookies }) => {
    cookies.delete('mission-pitiful');
  }
};
