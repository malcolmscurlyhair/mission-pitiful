<script>
  import '../styles.css';
  let GOOGLE_ANALYTICS_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
</script>

<svelte:head>

  {#if GOOGLE_ANALYTICS_ID}
    <script async src="https://www.googletagmanager.com/gtag/js?id={GOOGLE_ANALYTICS_ID}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', {GOOGLE_ANALYTICS_ID});
    </script>
  {/if}
</svelte:head>

<div class="app">
  <main>
    <slot/>
  </main>
</div>

