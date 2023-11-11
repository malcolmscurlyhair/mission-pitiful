<script lang="ts">
  import { browser } from "$app/environment"
  import { Game    } from './game';

  import Progress from './Progress.svelte';
  import Results  from './Results.svelte';

  export let data;

  const localState = browser && localStorage ? localStorage.getItem('mission-pitiful') : null

  let game = new Game(localState || data.state)

  $: index         = game.index;                 // Which question number the user is on (0-10).
  $: score         = game.score;                 // The total score so far.
  $: gameIsOver    = index == 10;                // Is the game over?
  $: currentGuess  = game.guesses[index];        // What was the user's last guess.
  $: showingAnswer = game.showingAnswer;         // Whether we are showing the current answer.
  $: choices       = game.choices[index];        // The potential answers available for the current question.
  $: correctAnswer = game.correctAnswers[index]; // The actual correct answer.
  $: statement     = game.statements[index];     // The mission statement the user has to guess.
  $: description   = game.descriptions[index];   // A clear description of what the current company does.

  function useHasGuessed(answer: string) {
    game.useHasGuessed(answer);

    currentGuess  = answer;
    index         = game.index;
    showingAnswer = game.showingAnswer;
    score         = game.score;
    game          = game;

    localStorage.setItem('mission-pitiful', game.toString(true));
  }

  function nextQuestion() {
    game.nextQuestion()

    currentGuess  = null;
    index         = game.index;
    showingAnswer = game.showingAnswer;
    score         = game.score;
    game          = game;

    localStorage.setItem('mission-pitiful', game.toString(true));
  }

  function restart() {
    game.reset()

    currentGuess  = null;
    index         = game.index;
    showingAnswer = game.showingAnswer;
    score         = game.score;
    game          = game;

    localStorage.removeItem('mission-pitiful');
  }

  function djb2Hash(str: string): number {
    let hash = 5381;

    for (let i = 0; i < str.length; i++) {
      hash = (hash * 33) ^ str.charCodeAt(i);
    }

    return hash >>> 0;
  }

  // Choose a random stock photo (using the statement descriptor as a seed,
  // so we always get the same image for a given mission statement).
  $: imageNumber = djb2Hash(statement || "") % 21
  $: imageUrl    = `/stock/${imageNumber}.jpg`
</script>

<div class="mx-auto max-w-lg py-10">
  <div class="text-center w-full">
    <Progress game={game} />

{#if gameIsOver}

  <div>
    <Results score={score} />

    <form method="POST" action="?/restart" on:submit|preventDefault={restart}>
      <button type="submit" class="rounded-full bg-indigo-600 mt-10 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
        Have Another Go →
      </button>
    </form>
  </div>

{:else}

  <h2 class="mt-2 text-base font-bold leading-6 text-gray-900 mb-5">
    Mission Statement {index + 1}
  </h2>

  <div class="mt-3 mx-20 bg-contain bg-center bg-no-repeat italic"
       style="background-image: url({imageUrl}); height: 180px; opacity: 0.8">

  </div>

  <blockquote class="text-center text-lg font-semibold mt-4 leading-7 text-gray-900 mb-8">
    “{statement}”
  </blockquote>

  {#if showingAnswer}
    {#if currentGuess === correctAnswer}
      <h3 class="text-md font-bold text-gray-900">
        You guessed correctly!
      </h3>
    {:else}
      <h3 class="text-md font-bold text-gray-900">
        You guessed incorrectly.
      </h3>
    {/if}

    {#each choices as choice}
      {#if choice === currentGuess && choice !== correctAnswer}
        <div class="group flex mt-1 mb-1 rounded-full p-1 text-left">
          <span class="flex min-w-0 flex-1 items-center space-x-3 pl-3">
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p class="text-sm font-medium text-gray-900">{choice}</p>
            </div>
          </span>

          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <svg class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
        </div>
      {/if}

      {#if choice === correctAnswer}
        <div class="group flex mt-1 mb-1 rounded-full p-1 text-left">
          <span class="flex min-w-0 flex-1 items-center pl-3 mr-8">
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p class="text-sm font-medium text-gray-900">{choice}</p>
              <p class="mt-1 text-sm text-gray-500">({description})</p>
            </div>
          </span>

          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
            <svg class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
        </div>
      {/if}
    {/each}

    <div class="mt-8 w-full text-center">
      <form method="POST" action="?/nextQuestion" on:submit|preventDefault={nextQuestion}>
        <button type="submit" class="rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Next →
        </button>
      </form>
    </div>

  {:else}
    <h3 class="text-sm font-medium text-gray-500 mb-5">
      Which company do you think this is?
    </h3>

    <ul role="list" class="flex-wrap mx-15">
      {#each choices as choice}
        <li class="inline-block items-center justify-between pb-3 mr-3">
          <form method="POST"
                action="?/useHasGuessed"
                on:submit|preventDefault={() => useHasGuessed(choice)}>

            <input name="guess" type="hidden" value={choice} />

            <button type="submit"
                    class="group flex w-full items-center justify-between space-x-3 rounded-full border border-gray-300 p-1 text-left shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">

              <span class="flex min-w-0 flex-1 items-center space-x-3 pl-3">
                <span class="block min-w-0 flex-1 text-xs">
                  {choice}
                </span>
              </span>

              <span class="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center">
                <svg class="h-5 w-5 text-gray-400 group-hover:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                </svg>
              </span>

            </button>
          </form>
        </li>
      {/each}
    </ul>
  {/if}
{/if}

  </div>
</div>

