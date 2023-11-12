<script>
  import { page } from '$app/stores';
</script>
CUSTOM ERROR
<h1>{$page.status}: {$page.error.message}</h1>