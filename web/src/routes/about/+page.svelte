<div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
  <!--
    Background backdrop, show/hide based on modal state.

    Entering: "ease-out duration-300"
      From: "opacity-0"
      To: "opacity-100"
    Leaving: "ease-in duration-200"
      From: "opacity-100"
      To: "opacity-0"
  -->
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

  <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
      <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
        <div>
          <div class="absolute right-0 top-0 pr-4 pt-4 block">
            <a href="/" class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              <span class="sr-only">Back</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </a>
          </div>
          <div class="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-green-100">
            <img class="inline-block rounded-full" src="/malcolm.jpg" alt="">
          </div>
          <div class="mt-3 text-center sm:mt-5">
            <div class="mt-2">
              <p class="text-sm text-gray-900 mb-3 font-bold">
                Created by <a target="_blank"
                              class="text-indigo-600 hover:text-gray-500"
                              href="https://bsky.app/profile/secretmalcolm.bsky.social">Malcolm</a>
              </p>

              <p class="text-sm text-gray-500 mb-3">
                The source code is
                <a target="_blank"
                   class="text-indigo-600 hover:text-gray-500"
                   href="https://github.com/malcolmscurlyhair/mission-pitiful">over here</a> if you are interested.
              </p>

              <p class="text-sm text-gray-500 mb-3">
                If you like this please consider
                <a target="_blank"
                   class="text-indigo-600 hover:text-gray-500"
                   href="https://livebook.manning.com/book/grokking-web-application-security/welcome/v-5/">purchasing my book!</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


