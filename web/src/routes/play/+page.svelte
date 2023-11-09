<script lang="ts">
  import { Game } from './game';

  export let data;

  let game = new Game(data.state)

  $: index         = game.index;
  $: gameIsOver    = index == 10;
  $: currentGuess  = index >= game.guesses.length ? game.guesses[index] : null;
  $: showingAnswer = game.showingAnswer;
  $: choices       = game.choices[index];
  $: correctAnswer = game.correctAnswers[index];
  $: description   = game.descriptions[index];

  function useHasGuessed(answer: string) {
    game.useHasGuessed(answer);

    currentGuess  = answer;
    index         = game.index;
    showingAnswer = game.showingAnswer;
  }

  function nextQuestion() {
    game.nextQuestion()

    currentGuess  = null;
    index         = game.index;
    showingAnswer = game.showingAnswer;
  }

  function restart() {
    game.reset()

    currentGuess  = null;
    index         = game.index;
    showingAnswer = game.showingAnswer;
  }
</script>

{#if gameIsOver}
  <div class="result">
    Your score is {game.score} out of 10.

    <form method="POST" action="?/restart" on:submit|preventDefault={restart}>
      <button type="submit">
        Click here to restart.
      </button>
    </form>
  </div>
{:else}
  <h2>Question {index + 1} (score: {game.score})</h2>

  <div class="question">
    <div class="preamble">Which company has the following mission statement:</div>
    <p class="mission-statement">
      {game.statements[index]}
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
      <form method="POST" action="?/nextQuestion" on:submit|preventDefault={nextQuestion}>
        <button type="submit">
          Next
        </button>
      </form>
    {:else}
      <ul class="possible-answers">
        {#each choices as choice}
          <li>
            <form method="POST" action="?/useHasGuessed" on:submit|preventDefault={() => useHasGuessed(choice)}>
              <input name="guess" type="hidden" value={choice} />

              <button type="submit">
                {choice}
              </button>
            </form>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
{/if}
