import { Game } from './game';
import { redirect } from '@sveltejs/kit'

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
  useHasGuessed: async ({ request, cookies }) => {
    const game  = new Game(cookies.get('mission-pitiful'));
    const data  = await request.formData();
    const guess = /** @type {string} */ data.get('guess') /***/ as string;

    game.useHasGuessed(guess);

    cookies.set('mission-pitiful', game.toString());

    throw redirect(303, '/play')
  },

  /**
   * Modify game state when the user presses "Next".
   */
  nextQuestion: async ({ request, cookies }) => {
    const game = new Game(cookies.get('mission-pitiful'));

    game.nextQuestion()

    cookies.set('mission-pitiful', game.toString());

    throw redirect(303, '/play')
  },

  restart: async ({ cookies }) => {
    cookies.delete('mission-pitiful');

    throw redirect(303, '/play')
  }
};
