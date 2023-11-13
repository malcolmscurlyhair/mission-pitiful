<script lang="ts">
  import { browser } from "$app/environment"
  import { Game    } from '$lib/game';

  import Progress from './Progress.svelte';
  import Results  from './Results.svelte';
  import Stats    from './Stats.svelte';

  // The server initializes the game state, which contains all the company names
  // and the corresponding data. See +page.server.ts for details.
  export let data;

  // We load stats on what mission statements the users tended to guess right or
  // wrong most often.
  const stats = data.stats;

  // As the user progresses through the quiz, we write the game state to localStorage.
  // (If the JavaScript is enabled; otherwise it's written to a cookie). This keeps
  // the user's place if they refresh the page.
  const localState = browser && localStorage ? localStorage.getItem('mission-pitiful') : null

  // Initialize the game state, either from local storage, the data passed from the server,
  // or if neither is populated, generate a fresh quiz.
  let game = new Game(localState || data.state)

  // Unpack some of the game state into local variables so the renderer
  // will update the page as they change.
  $: index         = game.index;                 // Which question number the user is on (0-10).
  $: score         = game.score;                 // The total score so far.
  $: gameIsOver    = index == 10;                // Is the game over? We only go 10 rounds?
  $: currentGuess  = game.guesses[index];        // What was the user's last guess?
  $: showingAnswer = game.showingAnswer;         // Whether we are showing the current answer.
  $: choices       = game.choices[index];        // The potential answers available for the current question.
  $: correctAnswer = game.correctAnswers[index]; // The actual correct answer.
  $: statement     = game.statements[index];     // The mission statement the user has to guess.
  $: description   = game.descriptions[index];   // A clear description of what the current company does, shown after the answer is revealed.

  /**
   * The user has guessed an answer, figure out whether they are correct and update
   * the game state and reactive variables. Save the game state to localStorage. Note
   * that this function won't get called if JavaScript is disabled (duh), in which case
   * we fall back to a server-side action (see +page.server.ts).
   */
  function useHasGuessed(answer: string) {
    game.useHasGuessed(answer);

    currentGuess  = answer;
    index         = game.index;
    showingAnswer = game.showingAnswer;
    score         = game.score;
    game          = game;

    localStorage.setItem('mission-pitiful', game.toString(true));
  }

  /**
   * Skip to the next question after the answer has been revealed.
   */
  function nextQuestion() {
    game.nextQuestion()

    currentGuess  = null;
    index         = game.index;
    showingAnswer = game.showingAnswer;
    score         = game.score;
    game          = game;

    localStorage.setItem('mission-pitiful', game.toString(true));
  }

  /**
   * Restart the game, after the quiz is over and the user chooses to try again.
   */
  function restart() {
    localStorage.removeItem('mission-pitiful');

    game.reset()

    game          = game;
    currentGuess  = null;
    index         = game.index;
    showingAnswer = game.showingAnswer;
    score         = game.score;
  }

  /**
   * Save the results to the DynamoDB database, flip to the 'game over' state.
   */
  async function saveResults(event)  {
    nextQuestion()

    const state = game.toString(true)

    localStorage.setItem('mission-pitiful', state)
    game.persisted = true

    const body = new URLSearchParams()
    body.append('state', state)

    await fetch(event.target.action, {
      method: 'POST',
      body: body
    })
  }

  /**
   * Called when the user clicks on the "Quit" icon in the top-left corner. We assume
   * the user wants a fresh game state if they return, so clear all game state out of
   * localStorage.
   */
  function exitPage() {
    localStorage.removeItem('mission-pitiful');

    window.location.href = '/'
  }

  /**
   * A method of turning a string into a random number consistently. (See http://www.cse.yorku.ca/~oz/hash.html)
   */
  function djb2Hash(str: string): number {
    let hash = 5381;

    for (let i = 0; i < str.length; i++) {
      hash = (hash * 33) ^ str.charCodeAt(i);
    }

    return hash >>> 0;
  }

  // Choose a random stock photo (using the statement descriptor as a seed,
  // so we always get the same image for a given mission statement).
  $: imageNumber = djb2Hash(statement || "") % 21;
  $: imageUrl    = `/stock/${imageNumber}.jpg`;

</script>

<!-- The "Quit Game" icon -->
<div class="flex absolute left-2 top-0 sm:left-5 sm:top-4 text-gray-400 hover:text-gray-900">
  <a href="/" class="text-2xl" on:click|preventDefault={exitPage}>
    ←
  </a>
</div>

{#if game}
  <div class="sm:mx-auto max-w-lg py-0 sm:py-5">
  <div class="text-center mx-2 sm:mx-0 sm:w-full">

    <!-- A row of baubles showing how far the user has progressed through the quiz. -->
    <Progress game={game} />

{#if gameIsOver}

  <div>

    <!-- Tell the user how they did. -->
    <Results score={score} />

    <!-- Show stats about which companies are most commonly guessed correct or incorrectly. -->
    <Stats stats={stats} />

    <div class="mt-10 mx-5 sm:mx-0 text-gray-400 text-xs">
      Did you enjoy this? If you did, please consider
      <a target="_blank"
         class="text-indigo-400 hover:text-gray-400"
         href="https://livebook.manning.com/book/grokking-web-application-security/welcome/v-5/">purchasing my book!</a>

    </div>

    <!-- Let them try again. -->
    <form method="POST" action="?/restart" on:submit|preventDefault={restart}>
      <button type="submit" class="rounded-full bg-indigo-600 mt-10 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
        Have Another Go →
      </button>
    </form>
  </div>

{:else}

  <h2 class="mt-1 mb-2 sm:mt-2 sm:mb-5 text-base font-bold leading-6 text-gray-900 ">
    Mission Statement {index + 1}
  </h2>

  <!-- Some tasteful and generic stock art illustrations. -->
  <div class="mt-1 sm:mt-3 mx-2 sm:mx-20 bg-contain bg-center bg-no-repeat italic"
       style="background-image: url({imageUrl}); height: 180px; opacity: 0.8">
  </div>

  <blockquote class="mx-3 sm:mx-0 mb-5 sm:mb-8 text-center text-md font-semibold mt-4 leading-7 text-gray-900 ">
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

    {#if choices}
      {#each choices as choice}
        {#if choice === currentGuess && choice !== correctAnswer}
          <!-- Show that their guess was incorrect, wab wab. -->
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
          <!-- Show the correct answer, plus an actual description of the company's business model. -->
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
    {/if}

    {#if index === 9}
      <!-- POST results to the serverside. -->
      <div class="mt-3 sm:mt-8 w-full text-center">
        <form method="POST" action="?/saveResults" on:submit|preventDefault={saveResults}>
          <input type="hidden" name="state" value={game.toString()} />
          <button type="submit" class="rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Next →
          </button>
        </form>
      </div>
    {:else}
      <!-- Skip to the the next question when the user is ready. -->
      <div class="mt-3 sm:mt-8 w-full text-center">
        <form method="POST" action="?/nextQuestion" on:submit|preventDefault={nextQuestion}>
          <button type="submit" class="rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Next →
          </button>
        </form>
      </div>
    {/if}



  {:else}
    <h3 class="text-sm font-medium text-gray-500 mb-5">
      Which company do you think this is?
    </h3>

    <ul role="list" class="flex-wrap mx-15">
      {#if choices}
        {#each choices as choice}
          <!--
            Allow the user to guess company. This either calls the useHasGuessed()
            function, or if JavaScript is disabled, we submit a POST request to the
            server.
          -->
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
      {/if}
    </ul>
  {/if}
{/if}

  </div>
</div>
{/if}

<footer class="bg-white">
  <div class="mx-auto max-w-7xl overflow-hidden px-6 pt-10 pb-7">
    <nav class="columns-2 flex justify-center" aria-label="Footer">
      <div class="pb-6">
        <a href="/about" class="text-sm text-gray-400 hover:text-gray-900">About</a>
      </div>
    </nav>
  </div>
</footer>
