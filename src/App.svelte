<script>
  // @ts-nocheck
  import { Router, links, Route } from "svelte-routing";
  import {
    Header,
    SkipToContent,
    Content,
    InlineNotification,
  } from "carbon-components-svelte";

  import Home from "./pages/Home.svelte"; 
</script>

<div use:links>
  <Router url="">
    <Header
      company="WINDRVR"
      platformName="Pointing Estimate"
      expandedByDefault={false}
    >
      <div slot="skip-to-content">
        <SkipToContent />
      </div>
    </Header>

    <Content>
      <Route path="/" component={Home} />
      <Route let:location>
        <InlineNotification
          hideCloseButton
          title="Error:"
          subtitle={`No route found for ${location.pathname}`}
        />
      </Route>
    </Content>
  </Router>
</div>
