<script>
  export let score = 0;
</script>

<p class="mt-1 mb-4 sm:mt-7 sm:mb-6">
  {#if score < 2}
    You scored a measly {score} out of 10.
  {:else if score < 4}
    You scored {score} out of 10.
  {:else if score < 6}
    You scored a moderately impressive {score} out of 10.
  {:else if score < 8}
    You scored an impressive {score} out of 10.
  {:else if score < 10}
    You scored a very impressive {score} out of 10.
  {:else}
    You scored a perfect 10!
  {/if}
</p>

<style>
  .award-icon {
    height: 180px;
    width: 180px;
  }
</style>

<div class="my-3 sm:my-8 mx-5 sm:mx-1 overflow-hidden rounded-lg bg-white shadow shadow-lg ring-1 ring-black ring-opacity-5">
  <div class="px-8 pt-4 pb-6">
    <div class="flex flex-col sm:flex-row my-3 items-center sm:items-start">
      <div class="sm:mr-7 text-center">
        {#if score < 2}
          <div class="bg-gray-500 award-icon">
            <img src="/awards/janitor.svg" alt="A janitor doing a real job">
          </div>
        {:else if score < 4}
          <div class="bg-gray-100 award-icon" style="box-shadow: inset 0 0 10px rgba(150, 150, 150, 0.4);">
            <img src="/awards/cubicle-dweller.svg" alt="A person wearing a shirt and tie">
          </div>
        {:else if score < 6}
          <div class="bg-red-400 award-icon" style="box-shadow: inset 0 0 10px rgba(150, 100, 100, 0.9);">
            <img src="/awards/middle-manager.svg" alt="A manager bossing people around">
          </div>
        {:else if score < 8}
          <div class="bg-blue-500 award-icon" style="box-shadow: inset 0 0 10px rgba(100, 100, 100, 0.4);">
            <img src="/awards/head-of-department.svg" alt="A senior business person give a presentation">
          </div>
        {:else}
          <div class="bg-gray-800 award-icon" style="border-radius: 10px">
            <img src="/awards/ceo.svg" alt="A CEO giving an inspirational speech">
          </div>
        {/if}
        <h4 class="text-lg font-bold text-center mt-3">
          {#if score < 2}
            Janitor
          {:else if score < 4}
            Cubicle Dweller
          {:else if score < 6}
            Middle Manager
          {:else if score < 8}
            Head of Department
          {:else}
            Future CEO
          {/if}
        </h4>
      </div>
      <div class="text-center">
        <p class="mt-0 text-center sm:text-left text-sm leading-6 font-semibold text-gray-500">
          {#if score < 2}
            <b class="text-gray-900">Your ability to decipher corporate language is sadly lacking.</b>
            Instead of entering the corporate world you should get a real job that materially benefits people.
            At least nobody will be emailing you on the weekend!
            Crack open a beer and think about joining a union.
          {:else if score < 4}
            <b class="text-gray-900">You can understand just enough corporate language to earn you a desk job, but not enough that you get to have underlings.</b>
            You are the beating heart of your company, sadly destined never to climb the corporate ladder.
            Don't forget to complete your training by the end of the week!
          {:else if score < 6}
            <b class="text-gray-900">You know just enough corporate language to be dangerous, but probably still feel a little
            uneasy talking making smalltalk with C-suite folk when you share an elevator.</b>
            Concentrate on your Q3 deliverables and there is a leftover donut in the conference room with your name on it.
          {:else if score < 8}
            <b class="text-gray-900">Your colleagues are jealous of your Powerpoint skills, and you probably belong to a golf club.</b>
            With some luck, one day you will have an assistant to fill out our expense forms.
            Remember to continue delivering value and be a customer champion at all times.
          {:else}
            <b class="text-gray-900">You're a natural at this!</b> Keep on creating the best outcomes for your clients, building
            innovative solutions via sustainable business practices, and your shareholders will
            continue to grow and thrive.
            It's lonely at the top, but somehow you manage to sleep easily on your giant pile of stock options.
          {/if}
        </p>
      </div>
    </div>
  </div>
</div>