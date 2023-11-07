export class Game {
  index:         number;      // Which question number the user is on (0-10).
  statements:    string[];    // The mission statements the user has to guess.
  descriptions:  string[];    // The descriptions of what each company does.
  choices:       string[][];  // The potential answers available for each question.
  guesses:       number[];    // The answers the user has given so far.
  answers:       number[];    // The correct answers.
  score:         number;      // The total score so far.
  showingAnswer: boolean;     // Whether we are showing the current answer.

  /**
   * Create a game object from the player's cookie, or initialise a new game.
   */
  constructor(serialized: string | undefined = undefined) {
    if (serialized) {
      // TODO
    }

    this.reset()
  }

  /**
   * Reset the state of the game (either when the user first comes to the /play
   * page, or when they reset, or when the opt to play again.
   */
  reset() {
    this.index         = 0;
    this.score         = 0;
    this.guesses       = [];
    this.showingAnswer = false;

    // TODO: load in random questions and answers.
  }

  /**
   * Update game state based on a guess.
   */
  enter(guess: number) {
    // TODO: record the guess, calculate the score, show the answer.

    return true;
  }

  /**
   * Skip to the next question, once the user has reviewed the answer.
   */
  next(guess: number) {
    // TODO: skip to the next question, reset the showing state.

    return true;
  }

  /**
   * Is the game over?
   */
  isGameOver() : boolean {
    return this.index == 10;
  }

  /**
   * Serialize game state so it can be set as a cookie.
   */
  toString() {
    // TODO
    return `${this.index}-${this.score}`;
  }
}
