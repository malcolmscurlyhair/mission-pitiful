<script>
  export let game;
</script>

<span class="flex items-center justify-center w-full">
  <ol class="flex items-center pb-5">
    {#each game.correctAnswers as choice, i}
      <li class="relative" class:pr-5={i < 9}>
        {#if i < game.index}

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

        {:else if i === game.index && i < 10}

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