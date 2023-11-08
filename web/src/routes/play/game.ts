import { companies } from '$lib/quiz';

export class Game {
  index:          number;      // Which question number the user is on (0-10).
  score:          number;      // The total score so far.
  guesses:        string[];    // The answers the user has given so far.
  showingAnswer:  boolean;     // Whether we are showing the current answer.
  choices:        string[][];  // The potential answers available for each question.
  correctAnswers: string[];    // The actual correct answers.

  statements:     string[];    // The mission statements the user has to guess.
  descriptions:   string[];    // The descriptions of what each company does.

  /**
   * Create a game object from the player's cookie, or initialise a new game.
   */
  constructor(serialized: string | undefined = undefined) {
    if (serialized) {
      try {
        const data = JSON.parse(serialized);

        this.index           = data.index;
        this.score           = data.score;
        this.guesses         = data.guesses;
        this.showingAnswer   = data.showingAnswer;
        this.choices         = data.choices;
        this.correctAnswers  = data.correctAnswers;

        // Reload the mission statement and business model for each company -
        // these won't be serialized in the cookie since it gets too big.
        this.statements = this.correctAnswers.map((company) => {
          if (!company) return null;

          return companies[company]['mission-statement']
        })

        this.descriptions = this.correctAnswers.map((company) => {
          if (!company) return null;

          return companies[company]['business-model']
        })
      }
      catch (e) {
        console.log(e)

        // There any number of reasons the cookie could be corrupted, just reset the game state.
        this.reset()
      }
    }
    else {
      this.reset()
    }
  }

  /**
   * Reset the state of the game (either when the user first comes to the /play
   * page, or when they reset, or when the opt to play again).
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

    quizAnswers.forEach((companyName) => {
      const companyDetail = companies[companyName];

      this.correctAnswers.push(companyName);
      this.statements.push(companyDetail['mission-statement']);
      this.descriptions.push(companyDetail['business-model']);

      // Pick the next 9 companies as wrong answers.
      const wrongAnswers = companyNames.splice(0, 9);
      const allAnswers   = [ companyName, ...wrongAnswers ];

      this.choices.push(shuffle(allAnswers));
    })

    // Add any empty slot in each array for the 'game over' state.
    this.correctAnswers.push(null);
    this.statements.push(null);
    this.descriptions.push(null);
    this.choices.push(null);
  }

  /**
   * Update game state based on a guess. Return 'true' if the answer is correct.
   */
  useHasGuessed(guess: string) {
    this.guesses.push(guess);
    this.showingAnswer = true;

    if (guess == this.correctAnswers[this.index]) {
      this.score++;
    }
  }

  /**
   * Skip to the next question, once the user has reviewed the answer. Return
   * 'true' if the game is over.
   */
  nextQuestion() {
    this.index++;
    this.showingAnswer = false;
  }

  /**
   * Serialize game state so it can be set as a cookie.
   */
  toString() : string {
    const response = JSON.stringify({
      index          : this.index,
      score          : this.score,
      guesses        : this.guesses,
      showingAnswer  : this.showingAnswer,
      choices        : this.choices,
      correctAnswers : this.correctAnswers,
    })

    console.log(response);
    console.log(`Serialized form is ${response.length} characters`)

    return response;
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