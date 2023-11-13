<script>
  export let stats;
</script>

{#if stats}

  <div class="my-3 sm:my-8 mx-5 sm:mx-1 px-5 pt-3 overflow-hidden rounded-lg bg-white shadow shadow-lg ring-1 ring-black ring-opacity-5">
    <div class="flex items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-gray-900 text-left">
          Most Obscure
        </h1>
        <p class="mt-2 text-sm text-gray-700 text-left">
          Here's the companies people guessed wrong most often.
        </p>
      </div>
    </div>
    <div class="mt-5 mb-7 flow-root">
      <table class="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th scope="col" colspan="2" class="pb-4 text-left text-xs font-semibold text-gray-400">
              Company
            </th>
            <th scope="col" class="pb-4 text-right text-xs font-semibold text-gray-400">
              Correct
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          {#each stats.bottom as company}
            <tr>
              <td class="py-3 pr-5 whitespace-nowrap text-xs text-gray-900 text-left">
                {company.company}
              </td>
              <td class="py-3 whitespace-nowrap w-full">
                <div class="overflow-hidden rounded-full bg-gray-100 w-full">
                  <div class="h-2 rounded-full bg-gray-500" style="width: calc({company.percentage / 100} * 100%);"></div>
                </div>
              </td>
              <td class="py-3 mb-5 pl-5 whitespace-nowrap text-xs text-gray-500 text-right">
                {company.percentage}%
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>

  <div class="my-3 sm:my-8 mx-5 sm:mx-1 px-5 pt-3 overflow-hidden rounded-lg bg-white shadow shadow-lg ring-1 ring-black ring-opacity-5">
    <div class="flex items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-gray-900 text-left">
          Clear Speakers
        </h1>
        <p class="mt-2 text-sm text-gray-700 text-left">
          Here's the companies people guessed correctly most often.
        </p>
      </div>
    </div>
    <div class="mt-5 mb-7 flow-root">
      <table class="min-w-full divide-y divide-gray-200">
        <thead>
        <tr>
          <th scope="col" colspan="2" class="pb-4 text-left text-xs font-semibold text-gray-400">
            Company
          </th>
          <th scope="col" class="pb-4 text-right text-xs font-semibold text-gray-400">
            Correct
          </th>
        </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          {#each stats.top as company}
            <tr>
              <td class="py-3 pr-5 whitespace-nowrap text-xs text-gray-900 text-left">
                {company.company}
              </td>
              <td class="py-3 whitespace-nowrap w-full">
                <div class="overflow-hidden rounded-full bg-gray-100 w-full">
                  <div class="h-2 rounded-full bg-gray-500" style="width: calc({company.percentage / 100} * 100%);"></div>
                </div>
              </td>
              <td class="py-3 mb-5 pl-5 whitespace-nowrap text-xs text-gray-500 text-right">
                {company.percentage}%
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>

{/if}

