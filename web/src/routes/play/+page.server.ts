import { Game     } from '$lib/game';
import { redirect } from '@sveltejs/kit'
import { getTotals, saveResults } from '$lib/persistence'

/**
 * During server-side rendering we initialize the game state, potentially loading it from a cookie.
 */
export  const load = (({ cookies }) => {
  const game = new Game(cookies.get('mission-pitiful'));

  // Load some statistics about which companies users tended to get wrong or right.
  let stats

  if (!process.env.IS_LOCAL) {
    stats = getTotals()
  }
  else {
    // Generate some dummy results.
    stats = {
      top : [
        { company: "Top 1",  correct: 100, incorrect: 0, total: 100, percentage: 100 },
        { company: "Top 2",  correct:  99, incorrect: 1, total: 100, percentage:  99 },
        { company: "Top 3",  correct:  98, incorrect: 2, total: 100, percentage:  98 },
        { company: "Top 4",  correct:  97, incorrect: 3, total: 100, percentage:  97 },
        { company: "Top 5",  correct:  96, incorrect: 4, total: 100, percentage:  96 },
      ],
      bottom: [
        { company: "Bottom 6",  correct: 14, incorrect: 86, total: 100, percentage: 14 },
        { company: "Bottom 7",  correct: 13, incorrect: 87, total: 100, percentage: 13 },
        { company: "Bottom 8",  correct: 12, incorrect: 88, total: 100, percentage: 12 },
        { company: "Bottom 9",  correct: 11, incorrect: 89, total: 100, percentage: 11 },
        { company: "Bottom 10", correct: 10, incorrect: 90, total: 100, percentage: 10 },
      ]
    }
  }

  /**
   * Serialize the state of the game, so it can be reinitialized on the client-side or by
   * the server-side renderer.
   */
  return {
    state : game.toString(),
    stats : stats
  };
});

/**
 * These actions will get invoked if JavaScript is disabled in the browser, or when we
 * want to update totals in our DynamoDB database. In this scenario we fall back to the
 * traditional HTTP request/HTTP response lifecycle. The state of the game will be pulled
 * from the cookie, updated according to the action being performed, then serialized back
 * to the cookie.
 */
export const actions = {

  /**
   * Update game state based on a guess.
   */
  userHasGuessed: async ({ request, cookies }) => {
    const game  = new Game(cookies.get('mission-pitiful'));
    const data  = await request.formData();
    const guess = data.get('guess') as string;

    game.userHasGuessed(guess);

    cookies.set('mission-pitiful', game.toString());

    throw redirect(303, '/play')
  },

  /**
   * Skip to the next question, once the user has reviewed an answer.
   */
  nextQuestion: async ({ cookies }) => {
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
  },

  /**
   * Save the results off to the database.
   */
  saveResults: async ({ request, params, cookies }) => {
    const data      = await request.formData();
    const submitted = data.get('state') as string;
    const game      = new Game(submitted);

    game.nextQuestion()

    if (!process.env.IS_LOCAL) {
      await saveResults(game)
    }

    game.persisted = true

    if (cookies.get('mission-pitiful')) {
      cookies.set('mission-pitiful', game.toString());
    }

    throw redirect(303, '/play')
  },
};
