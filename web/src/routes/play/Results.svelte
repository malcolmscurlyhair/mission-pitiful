<script>
  export let score = 0;
</script>

<p class="mt-7 mb-6">
  {#if score < 2}
    You scored a measly {score} out of 10.
  {:else if score < 4}
    You scored {score} out of 10.
  {:else if score < 6}
    You scored a moderately impressive {score} out of 10.
  {:else if score < 8}
    You scored an impressive {score} out of 10.
  {:else if score < 9}
    You scored a very impressive {score} out of 10.
  {:else}
    You scored a perfect 10!
  {/if}
</p>

<div class="overflow-hidden rounded-lg bg-white shadow shadow-lg ring-1 ring-black ring-opacity-5">
  <div class="px-8 pt-4 pb-6">
    <div class="flex my-3">
      <div class="mr-10 flex-shrink-0 self-center">
        <div class="bg-gray-200" style="height: 220px; width: 180px">
        </div>
      </div>
      <div>
        <h4 class="text-lg font-bold text-left">
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
        <p class="mt-1 text-left text-sm leading-6">
          {#if score < 2}
            Sadly your ability to decipher corporate language is lacking.
            Instead of entering the corporate world you should get a real job that materially benefits people.
            At least nobody will be emailing you on the weekend!
            Crack open a beer and think about joining a union.
          {:else if score < 4}
            You can understand just enough corporate language to earn you a desk job, but not enough that you get to have underlings.
            You are the beating heart of your company, sadly destined never to climb the corporate ladder.
            Don't forget to complete your training by the end of the week!
          {:else if score < 6}
            You know just enough corporate language to be dangerous, but probably still feel a little
            uneasy talking making small talk with C-suite folk when you share an elevator.
            Concentrate on your Q3 deliverables and there is a leftover donut in the conference room with your name on it.
          {:else if score < 8}
            Your colleagues are jealous of your Powerpoint skills, and you probably belong to a golf club.
            With some luck, one day you will have an assistant to fill out our expense forms.
            Remember to continue delivering value and be a customer champion at all times.
          {:else}
            You're a natural at this! Keep on creating the best outcomes for your clients, building
            innovative solutions via sustainable business practices, and your shareholders will
            continue to grow and thrive.
            It's lonely at the top, but somehow you manage to sleep sleep easily on your giant pile of stock options.
          {/if}
        </p>
      </div>
    </div>
  </div>
</div>