<script>
  import { Dropdown } from "carbon-components-svelte";
  export let items;
</script>

<Dropdown
  {items}
  on:select
/>

