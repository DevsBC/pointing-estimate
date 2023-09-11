<script>
  // @ts-nocheck
  import { onSnapshot, doc, updateDoc, writeBatch } from "firebase/firestore";
  import { db, baseCollection } from "../lib/database";
  import { Checkbox, Form, FormGroup, Modal, RadioButton, RadioButtonGroup, RadioTile, TileGroup } from "carbon-components-svelte";
  import { Button, Tag } from "carbon-components-svelte";
  import {
    StructuredList,
    StructuredListHead,
    StructuredListRow,
    StructuredListCell,
    StructuredListBody,
  } from "carbon-components-svelte";
  export let users = [];
  export let user;

  const skills = [
    { key: 'Expert', value: 1 },
    { key: 'Advanced', value: 2 },
    { key: 'Intermediate', value: 3 },
    { key: 'Beginner', value: 5 },
    { key: 'Basic', value: 8 },
    { key: 'Nothing', value: 13 }
  ];
  let skillsPoint = 0;

  const dependencies = [
    { key: 'None', value: 1 },
    { key: 'Almost nothing', value: 2 },
    { key: 'Few', value: 3 },
    { key: 'Some', value: 5 },
    { key: 'Many', value: 8 },
    { key: 'Unknown', value: 13 }
  ];
  let dependenciesPoint = 0;

  const efforts  = [
    { key: 'Up to 2 hours', value: 1 },
    { key: 'Half day (4 hours)', value: 2 },
    { key: 'Up to 2 days', value: 3 },
    { key: 'Up to 1 week', value: 5 },
    { key: 'Up to 2 weeks', value: 8 },
    { key: 'More than 2 weeks', value: 13 }
  ];
  let effortsPoint = 0;

  const colors = ["red", "magenta", "purple", "cyan", "teal", "green", "gray", "cool-gray", "warm-gray"];

  const admins = ["F2E4PvgcoP2g2uwH7Wpf", "MPlPcsaiB4k6NysYRaz5", "zn3qccqF9nyBKko8VGH7"];

  let show = false;
  let newPoints = 0;
  let finalPoints = 0;
  let open = false;


  onSnapshot(doc(db, `${baseCollection}/estimates/new`), (doc) => {
    const data = doc.data();
    newPoints = data.points;
    show = data.show;
  });

  const fibonacci = (n) => {
    const result = [1, 2];
    for (let i = 2; i <= n; i++) {
      result[i] = result[i - 2] + result[i - 1];
    }

    return result;
  }

  async function selectUser(id, checked) {
    const batch = writeBatch(db);
    for (const user of users.filter(u => u.assigned)) {
      const userRef = doc(db, `${baseCollection}/users`, user.id);
      if (user.id !== id) {
        batch.update(userRef, { assigned: false });
      }
    }
    const ref = doc(db, `${baseCollection}/users`, id);
    batch.update(ref, { assigned: checked });
    await batch.commit();
  }

  async function clear() {
    await updateUsers();
  }

  async function updateUsers() {
    const batch = writeBatch(db);
    for (const user of users) {
      const userRef = doc(db, `${baseCollection}/users`, user.id);
      if (userAssigned && userAssigned.id === user.id) {
        const total = userAssigned.total + finalPoints;
        batch.update(userRef, { points: 0, assigned: false, total });
      } else {
        batch.update(userRef, { points: 0, assigned: false });
      }
    }
    const estimateRef = doc(db, `${baseCollection}/estimates/new`);
    batch.update(estimateRef, { points: 0, show: false });
    await batch.commit();
  }

  async function setPoints(points) {
    await updateUser(user.id, { points });
  }

  async function updateUser(id, data) {
    const ref = doc(db, `${baseCollection}/users`, id);
    await updateDoc(ref, { ...data });
  }

  async function estimatePoints() {
    document.querySelector('#reset').click();
    open = false;
    let points = skillsPoint + dependenciesPoint + effortsPoint;
    points = Math.round(points / 3);
    points = fibonacci(5).reduce((prev, curr) => (Math.abs(curr - points) < Math.abs(prev - points) ? curr : prev));
    await updateEstimate({ points });
  }

  async function updateEstimate(data) {
    const ref = doc(db, `${baseCollection}/estimates/new`);
    await updateDoc(ref, { ...data });
  }

  async function startNew() {
    const batch = writeBatch(db);
    for (const user of users) {
      const userRef = doc(db, `${baseCollection}/users`, user.id);
      batch.update(userRef, { points: 0, total: 0, assigned: false });

    }
    const estimateRef = doc(db, `${baseCollection}/estimates/new`);
    batch.update(estimateRef, { points: 0, show: false });
    await batch.commit();
  }

  function getColor() {
    var randomIndex = Math.floor(Math.random() * colors.length); 
    return colors[randomIndex];
  }

  $: totalUsers = users.filter(u => u.points > 0).length;
  $: pointsArray = users.filter(u => u.points > 0).map(u => u.points);
  $: pointsTotal = pointsArray.reduce((a, b) => a + b, 0);
  $: average = (pointsTotal / totalUsers)|| 0;
  $: min = Math.min(...pointsArray.filter(p => p !== 0));
  $: max = Math.max(...pointsArray);  
  $: newAverage = Math.round((newPoints + average) / 2);
  $: userAssigned = users.find(u => u.assigned);

</script>

{#if user }
{#if admins.includes(user.id)}
<Button style="float:right;" on:click={startNew}>Start new session</Button>
{/if}
  <h1>{user.name}</h1>
  <h2>Story Points</h2>
    
  <div class="row">
    <div class="column">
      <Tag interactive on:click={() => setPoints(0)}>?</Tag>
      {#each fibonacci(5) as point}
          <Tag interactive 
            type={getColor()}
            on:click={() => setPoints(point)}>
            {point + (point == 1 ? ' point' : ' points')}
          </Tag>
        {/each}
      <StructuredList>
        <StructuredListHead>
          <StructuredListRow head>
            <StructuredListCell head>Players</StructuredListCell>
            <StructuredListCell head>Points</StructuredListCell>
            <StructuredListCell head>Assigned</StructuredListCell>
          </StructuredListRow>
        </StructuredListHead>
        <StructuredListBody>
          {#each users as u} 
            <StructuredListRow>
              <StructuredListCell>{ u.name }</StructuredListCell>
              <StructuredListCell> <b>{ (show || (user.id === "F2E4PvgcoP2g2uwH7Wpf" || user.id == u.id)) ? u.points : ( u.points > 0 ? "READY" :"?")}</b></StructuredListCell>
              <StructuredListCell><Checkbox checked={u.assigned} on:change={(e) => selectUser(u.id, e.target.checked)}/></StructuredListCell>
            </StructuredListRow>
          {/each}
        </StructuredListBody>
      </StructuredList>
   
    </div>
  
    <div class="column">
      <Button kind="secondary" size="small" on:click={clear}>Clear</Button>
      <Button kind="danger-ghost" size="small" on:click={() => updateEstimate({ show: true })}>Show</Button>
      {#if userAssigned && userAssigned.id === user.id }
      <Button kind="ghost" size="small" on:click={() => open = true}>Estimate</Button>
      {/if}
      {#if show}
        <TileGroup legend="Results" on:select={(e) => finalPoints = e.detail}>
          <RadioTile value={average}>Average votes: {average}</RadioTile>
          <RadioTile value={min}>Min: {min}</RadioTile>
          <RadioTile value={max}>Max: {max}</RadioTile>
          <RadioTile value={newPoints}>Points estimated: {newPoints}</RadioTile>
          <RadioTile value={newAverage}>Average estimated: {average}</RadioTile>
        </TileGroup>
      {/if}

    </div>
    
  </div>
{/if}

<Modal  
  bind:open
  modalHeading="Estimate"
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
  hasForm
  on:open={() => { skillsPoint = 0; dependenciesPoint = 0; effortsPoint = 0;}}
  on:click:button--secondary={() => (open = false)}
  on:submit={estimatePoints}>
  <Form>
    <input type="reset" id="reset" value="reset" style="display: none;"/>

    <FormGroup legendText="Skill level or prior knowledge regarding this task">
      <RadioButtonGroup on:change={(e) => skillsPoint = e.detail}>
        {#each skills as skill }
          <RadioButton 
          value={skill.value} 
          labelText={skill.key}
          />
        {/each}
      </RadioButtonGroup>
    </FormGroup>

    <FormGroup legendText="Dependencies or external aspects required to complete this task">
      <RadioButtonGroup on:change={(e) => dependenciesPoint = e.detail}>
        {#each dependencies as dependency }
          <RadioButton 
            value={dependency.value} 
            labelText={dependency.key} 
            />
        {/each}
      </RadioButtonGroup>
    </FormGroup>

    <FormGroup legendText="Planned time to complete this task">
      <RadioButtonGroup on:change={(e) => effortsPoint = e.detail}>
        {#each efforts as effort }
          <RadioButton 
          value={effort.value} 
          labelText={effort.key}
          />
        {/each}
      </RadioButtonGroup>
    </FormGroup>
  </Form>
</Modal>

<style>
	.row {
	  display: grid;
	  grid-template-columns: 60% 40%;
	}
	.column {
	  padding: 16px;
	  height: 250px;
	}

</style>
