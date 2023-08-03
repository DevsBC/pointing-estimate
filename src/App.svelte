<script>
  // @ts-nocheck
  import {
    Header,
    SkipToContent,
    Content,
    HeaderUtilities,
    Button,
    Dropdown
  } from "carbon-components-svelte";
  import Home from "./pages/Home.svelte"; 
  import { collection, onSnapshot } from "firebase/firestore";
  import { db, baseCollection} from "./lib/database";
  
  let user;
  let items = [];
  let users = [];
  let isAuth = localStorage.getItem("user");

  if (isAuth) {
    user = JSON.parse(localStorage.getItem("user"));
  }

  onSnapshot(collection(db, `${baseCollection}/users`), (querySnapshot) => {
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push(doc.data());
    });
    users = [...data];
    items = users.map(u => ({ id: u.id, text: u.name }));
  });

  function logout() {
    localStorage.removeItem("user");
    location.reload();
  }

  function selectUser(e) {
    const selectedId = e.detail.selectedId;
    const u = users.find(u => u.id === selectedId);
    user = { id: u.id, name: u.name };
    localStorage.setItem("user", JSON.stringify(user));
    isAuth = true;
  }

</script>

<Header
  company="WINDRVR"
  platformName="Pointing Estimate"
  expandedByDefault={false}>
  <div slot="skip-to-content">
    <SkipToContent />
  </div>
  {#if isAuth}
  <HeaderUtilities>
    <Button kind="danger-tertiary" on:click={logout}>Log out</Button>
  </HeaderUtilities>
  {/if}
</Header>
 
<Content>
  {#if isAuth}
    <Home {user} {users}/>
    {:else}
    <h2>Join Session</h2>
    <Dropdown {items} on:select={(e) => selectUser(e)} />
  {/if}
</Content>