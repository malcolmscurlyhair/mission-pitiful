<script lang="ts">
  import { Game } from './game';

  export let data;

  let game = new Game(data.state)

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
  }

  function nextQuestion() {
    game.nextQuestion()

    currentGuess  = null;
    index         = game.index;
    showingAnswer = game.showingAnswer;
    score         = game.score;
  }

  function restart() {
    game.reset()

    currentGuess  = null;
    index         = game.index;
    showingAnswer = game.showingAnswer;
    score         = game.score;
  }
</script>

<div class="mx-auto max-w-lg py-10">
  <div class="text-center w-full">
    <span class="flex items-center justify-center w-full">
      <ol class="flex items-center pb-5">
        {#each game.correctAnswers as choice, i}
          <li class="relative" class:pr-5={i < 9}>
            {#if i < index}

              <div class="absolute inset-0 flex items-center">
                <div class="h-0.5 w-full bg-gray-100"></div>
              </div>

              {#if game.correctAnswers[i] === game.guesses[i] }
                <span class="relative flex h-5 w-5 items-center justify-center rounded-full bg-green-600">
                  <svg class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clip-rule="evenodd" />
                  </svg>
                </span>
              {:else}
                <span class="relative flex h-5 w-5 items-center justify-center rounded-full bg-red-300">
                  <svg class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                          d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
                          clip-rule="evenodd" />
                  </svg>
                </span>
              {/if}

            {:else if i === index && i < 10}

              <div class="absolute inset-0 flex items-center">
                <div class="h-0.5 w-full bg-gray-200"></div>
              </div>

              <span class="relative flex h-5 w-5 items-center justify-center rounded-full border-2 border-gray-600 bg-white">
                <span class="h-2.5 w-2.5 rounded-full bg-gray-600"></span>
              </span>

            {:else if i < 10}

              <div class="absolute inset-0 flex items-center">
                <div class="h-0.5 w-full bg-gray-200"></div>
              </div>

              <span class="group relative flex h-5 w-5 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                <span class="h-2.5 w-2.5 rounded-full bg-transparent"></span>
              </span>

            {/if}
          </li>
        {/each}
      </ol>
    </span>

{#if gameIsOver}

  <div>
    Your scored {score} out of 10.

    <form method="POST" action="?/restart" on:submit|preventDefault={restart}>
      <button type="submit" class="rounded-full bg-indigo-600 mt-10 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
        Have another go →
      </button>
    </form>
  </div>

{:else}

  <h2 class="mt-2 text-base font-bold leading-6 text-gray-900 mb-5">
    Question {index + 1}
  </h2>
  <p class="mt-1 text-sm text-gray-500">
    Read this mission statement:
  </p>
  <p class="pt-5 pb-8">
    {statement}
  </p>

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
        <div class="group flex mt-5 mb-5 rounded-full p-1 text-left">
          <span class="flex min-w-0 flex-1 items-center space-x-3 pl-3 my-3">
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p class="text-sm font-medium text-gray-900">{choice}</p>
            </div>
          </span>

          <div class="my-3 mr-10 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
        </div>
      {/if}

      {#if choice === correctAnswer}
        <div class="group flex mt-5 mb-5 rounded-full p-1 text-left">
          <span class="flex min-w-0 flex-1 items-center space-x-3 pl-3 my-3">
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p class="text-sm font-medium text-gray-900">{choice}</p>
              <p class="mt-1 text-sm text-gray-500">({description})</p>
            </div>
          </span>

          <div class="my-3 mr-10 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
        </div>
      {/if}
    {/each}

    <div class="w-full text-center">
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
