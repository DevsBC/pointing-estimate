<script>
  import { collection, query, where, onSnapshot } from "firebase/firestore";
  import { db, baseCollection } from "../lib/database";
  import { Dropdown } from "carbon-components-svelte";
  import { ButtonSet, Button } from "carbon-components-svelte";
  import { Checkbox } from "carbon-components-svelte";
  import { RadioButtonGroup, RadioButton } from "carbon-components-svelte";
  import {
    StructuredList,
    StructuredListHead,
    StructuredListRow,
    StructuredListCell,
    StructuredListBody,
  } from "carbon-components-svelte";

  let users = [];
  let items = [];
  let user;
  let point = 0;
  let show = false;
  let disabled = false;

  if (localStorage.getItem("user")) {
    user = JSON.parse(localStorage.getItem("user"));
  }

  onSnapshot(collection(db, `${baseCollection}/users`), (querySnapshot) => {
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push(doc.data());
    });
    users = [...data];
    items = users.map(u => ({ id: u.id, text: u.name, total: u.total }));
  });

  const fibonacci = (n) => {
    const result = [1, 2];
    for (let i = 2; i <= n; i++) {
      result[i] = result[i - 2] + result[i - 1];
    }

    return result;
  }

  function setUser(e) {
    const selectedId = e.detail.selectedId;
    const u = users.find(u => u.id === selectedId);
    user = { id: u.id, name: u.name }
    localStorage.setItem("user", JSON.stringify(user));
  }

  function selectUser(e) {
    disabled = true;
    const selectedUser = users.find(u => u.id === e.detail.selectedId);

  }

  $: title = user ? "Story Points" : "Join session";
  $: totalUsers = users.length;
  $: points = users.map(u => u.points).reduce((a, b) => a + b, 0);
  $: average = Math.round((points / totalUsers)) || 0;
  $: min = Math.min(...points);
  $: max = Math.max(...points);

</script>
<h2>{title}</h2>
{#if user }
  <div class="row">
    <div class="column">
      <RadioButtonGroup style="padding-bottom:10px;">
        {#each fibonacci(5) as point}
          <RadioButton 
            labelText={point + (point == 1 ? ' point' : ' points')} 
            value={point}/>
        {/each}
      </RadioButtonGroup>

      <StructuredList>
        <StructuredListHead>
          <StructuredListRow head>
            <StructuredListCell head>Players</StructuredListCell>
            <StructuredListCell head>Points</StructuredListCell>
          </StructuredListRow>
        </StructuredListHead>
        <StructuredListBody>
          {#each users as user} 
            <StructuredListRow>
              <StructuredListCell>{ user.name }</StructuredListCell>
              <StructuredListCell> { show ? user.points : "?"}</StructuredListCell>
            </StructuredListRow>
          {/each}
        </StructuredListBody>
      </StructuredList>
   
    </div>
    <div class="column">
      <ButtonSet style="padding:10px">
        <Button kind="secondary" size="small">Clear</Button>
        <Button size="small" on:click={() => show = true}>Show</Button>
      </ButtonSet>
        <h3>Results</h3>
        <div>Average: { average }</div>
        <div>Min: { min }</div>
        <div>Max: { max }</div>
        <div>New points: 0</div>
        <Dropdown {items} titleText="Assign to" on:select={(e) => console.log(e)}  
          itemToString={(item) => {
            return item.text + " (" + item.total + ")";
          }}
        />
    </div>
    
   
  </div>
  
  {:else}
  <Dropdown {items} on:select={(e) => setUser(e)} />
{/if}

<style>
	.row {
	  display: grid;
	  grid-template-columns: 50% 50%;
	}
	.column {
	  padding: 16px;
	  height: 250px;
	}

  .grid {
    padding: 20px;
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-template-rows: repeat(1, 1fr);
    grid-column-gap: 10px;
    grid-row-gap: 5px; 
  }

  @media (min-width: 900px) {
    .grid { grid-template-columns: auto; }
  }
</style>
