import { companies } from '$lib/quiz';

export class Game {
  index:          number;      // Which question number the user is on (0-10).
  score:          number;      // The total score so far.
  guesses:        string[];    // The answers the user has given so far.
  showingAnswer:  boolean;     // Whether we are showing the current answer.

  statements:     string[];    // The mission statements the user has to guess.
  descriptions:   string[];    // The descriptions of what each company does.
  choices:        string[][];  // The potential answers available for each question.
  correctAnswers: string[];    // The actual correct answers.

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
    this.index          = 0;
    this.score          = 0;
    this.guesses        = [];
    this.showingAnswer  = false;

    this.statements     = [];
    this.descriptions   = [];
    this.choices        = [];
    this.correctAnswers = [];

    const companyNames = shuffle(Object.keys(companies));
    const quizAnswers  = companyNames.splice(0, 10);

    quizAnswers.forEach((companyName, index) => {
      const companyDetail = companies[companyName];

      this.correctAnswers.push( companyDetail['name']              );
      this.statements.push(     companyDetail['mission-statement'] );
      this.descriptions.push(   companyDetail['business-model']    );

      // Pick the next 9 companies as wrong answers.
      const wrongAnswers = companyNames.splice(0, 9).map((name) => {
        return companies[companyName]['name']
      });

      const allAnswers = [ companyDetail['name'], ...wrongAnswers ];

      this.choices.push(shuffle(allAnswers));
    })
  }

  /**
   * Update game state based on a guess. Return 'true' if the answer is correct.
   */
  answerQuestion(guess: string) : boolean {
    this.guesses.push(guess);

    this.showingAnswer = true;

    if (this.guesses[this.index] == this.correctAnswers[this.index]) {
      this.score++;
      return true;
    }

    return false;
  }

  /**
   * Skip to the next question, once the user has reviewed the answer. Return
   * 'true' if the game is over.
   */
  nextQuestion() : boolean{
    this.index++;
    this.showingAnswer = false;

    return this.index == 10;
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
  toString() : string {
    // TODO
    return `${this.index}-${this.score}`;
  }
}

/**
 * Randomize an array of strings.
 */
function shuffle(array: string[]) : string[] {
  const shuffled = array.slice();

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}