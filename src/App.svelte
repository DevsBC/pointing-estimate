<script>
  // @ts-nocheck
  import {
    Header,
    SkipToContent,
    Content,
  } from "carbon-components-svelte";

  import Home from "./pages/Home.svelte"; 
</script>

<Header
  company="WINDRVR"
  platformName="Pointing Estimate"
  expandedByDefault={false}>
  <div slot="skip-to-content">
    <SkipToContent />
  </div>
</Header>

<Content>
  <Home/>
</Content>