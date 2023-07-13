<script>
  import { collection, query, where, onSnapshot } from "firebase/firestore";
  import { db, baseCollection } from "../lib/database";
  import { Dropdown } from "carbon-components-svelte";
  import { ButtonSet, Button } from "carbon-components-svelte";
  import { Tag } from "carbon-components-svelte";

  let users = [];
  let items = [];
  let user;

  if (localStorage.getItem("user")) {
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

  const fibonacci = (n) => {
    const result = [1, 2];
    for (let i = 2; i <= n; i++) {
      result[i] = result[i - 2] + result[i - 1];
    }

    return result;
  }

  console.log(fibonacci(5))

  function setUser(e) {
    const selectedId = e.detail.selectedId;
    const u = users.find(u => u.id === selectedId);
    user = { id: u.id, name: u.name }
    localStorage.setItem("user", JSON.stringify(user));
  }

  $: title = user ? "Hello " + user.name : "Join session";

</script>
<h2>{title}</h2>
{#if user }
  <ButtonSet>
    <Button kind="secondary">Clear</Button>
    <Button>Show</Button>
  </ButtonSet>

  <Tag>IBM Cloud</Tag>
  
  {#each users as user} 
    <p>{user.name} - {user.points}</p>
  {/each}
  {:else}
  <Dropdown {items} on:select={(e) => setUser(e)} />
{/if}


