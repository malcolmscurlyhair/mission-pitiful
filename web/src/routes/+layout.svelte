<script>
  import '../styles.css';
  let GOOGLE_ANALYTICS_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
</script>

<svelte:head>
  {#if GOOGLE_ANALYTICS_ID}
    <script async src="https://www.googletagmanager.com/gtag/js?id={GOOGLE_ANALYTICS_ID}"></script>
    <meta name="google-analytics-id" content={GOOGLE_ANALYTICS_ID} />
    <script>
      const googleAnalyticsID = document.querySelector('meta[name="google-analytics-id"]').getAttribute('content');
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', googleAnalyticsID);
    </script>
  {/if}
</svelte:head>

<div class="app">
  <main>
    <slot/>
  </main>
</div>

