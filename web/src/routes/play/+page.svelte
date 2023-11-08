<script lang="ts">
  import type { PageData, ActionData } from './$types';

  /** @type {import('./$types').PageData} */
  export let data: PageData;

  /** @type {import('./$types').ActionData} */
  export let form: ActionData;

  let index         : number,
      gameIsOver    : boolean,
      question      : string,
      choices       : string[],
      correctAnswer : string,
      description   : string,
      guesses       : string[],
      currentGuess  : string,
      showingAnswer : boolean,
      score         : number;

  /** The index of the current guess. */
  $: index = data.index;

  /** Whether the user has answered all the questions. **/
  $: gameIsOver = index == 10;

  /** Latest quiz question. */
  $: question = data.statements[index];

  /** All possible answers to the current question. */
  $: choices = data.choices[index];

  /** Latest correct answer. */
  $: correctAnswer = data.correctAnswers[index];

  /** The actual business model of the company under discussion. */
  $: description = data.descriptions[index];

  /** Correct answer to the current quiz question. */
  $: guesses = data.guesses;

  /** Correct answer to the current quiz question. */
  $: currentGuess = index >= guesses.length ? guesses[index] : null;

  /** Whether we are showing the current (correct) answer after the user has made a guess. */
  $: showingAnswer = data.showingAnswer;

  /** The user's score. */
  $: score = data.score;

  function useHasGuessed(answer: string) {
    guesses.push(answer)
    currentGuess = answer

    if (answer == correctAnswer) {
      score++;
    }

    showingAnswer = true;
  }

  function nextQuestion() {
    showingAnswer = false;
    index++;
  }

  function resetGame() {
    window.location.href = '/play'
  }
</script>

{#if gameIsOver}
  <div class="result">
    Your score is {score} out of 10.
    <a href="#" class="reset" on:click={resetGame}>
      Click here to restart.
    </a>
  </div>
{:else}
  <h2>Question {index + 1} (currentGuess: {currentGuess}) (score: {score})</h2>
  <div class="question">
    <div class="preamble">Which company has the following mission statement:</div>
    <p class="mission-statement">
      {question}
    </p>
    {#if showingAnswer}
      <ul class="possible-answers">
        {#each choices as choice}
          {#if choice === currentGuess}
            {#if choice === correctAnswer}
              <li>{choice} [CORRECT] ({description})</li>
            {:else}
              <li>{choice} [WRONG]</li>
            {/if}
          {:else if choice === correctAnswer}
            <li>{choice} [RIGHT ANSWER] ({description})</li>
          {:else}
            <li>{choice}</li>
          {/if}
        {/each}
      </ul>
      <a href="#" class="next-question" on:click={nextQuestion}>
        Next
      </a>
    {:else}
      <ul class="possible-answers">
        {#each choices as choice}
          <li>
            <a href="#" class="answer" on:click={() => { useHasGuessed(choice) }}>
              {choice}
            </a>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
{/if}



