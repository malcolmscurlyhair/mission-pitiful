import { Game } from './game';
import { redirect } from '@sveltejs/kit'

/**
 * During server-side rendering we initialize the game state, potentially loading it from a cookie.
 */
export const load = (({ cookies }) => {
  const game = new Game(cookies.get('mission-pitiful'));

  /**
   * Serialize the state of the game, so it can be reinitialized on the client-side or by
   * the server-side renderer.
   */
  return {
    state: game.toString()
  };
});

/**
 * These actions will get invoked if JavaScript is disabled in the browser. In this scenario
 * we fall back to the traditional HTTP request/HTTP response lifecycle. The state of the
 * game will be pulled from the cookie, updated according to the action being performed,
 * then serialized back to the cookie.
 */
export const actions = {

  /**
   * Update game state based on a guess.
   */
  useHasGuessed: async ({ request, cookies }) => {
    const game  = new Game(cookies.get('mission-pitiful'));
    const data  = await request.formData();
    const guess = data.get('guess') as string;

    game.useHasGuessed(guess);

    cookies.set('mission-pitiful', game.toString());

    throw redirect(303, '/play')
  },

  /**
   * Skip to the next question, once the user has reviewed an answer.
   */
  nextQuestion: async ({ request, cookies }) => {
    const game = new Game(cookies.get('mission-pitiful'));

    game.nextQuestion()

    cookies.set('mission-pitiful', game.toString());

    throw redirect(303, '/play')
  },

  /**
   * Reset the state of the game (either when the user first comes to the /play
   * page, or when the opt to play again).
   */
  restart: async ({ cookies }) => {
    cookies.delete('mission-pitiful');

    throw redirect(303, '/play')
  }
};
