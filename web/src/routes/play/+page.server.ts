import { Game } from './game';
import { redirect } from '@sveltejs/kit'

export const load = (({ cookies }) => {
  const game = new Game(cookies.get('mission-pitiful'));

  return {
    state: game.toString()
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
