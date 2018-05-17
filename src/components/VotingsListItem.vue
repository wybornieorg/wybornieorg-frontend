<template>
<router-link :class="['voting-list-item', voting.status, {za: currentVotingVote>0, przeciw: currentVotingVote<0}]" :to="{ name: 'voting', params: { kadencja: voting.numbers.kadencja, posiedzenie: voting.numbers.posiedzenie, glosowanie: voting.numbers.glosowanie } }">
  <div v-if="voting.nazwa" class="nazwa-zwyczajowa">
    {{voting.nazwa.nazwaZwyczajowa}}
  </div>

  <div v-if="voting.projects.length > 1" class="">
    Rozpatrywano wspólnie
  </div>
  <div class="projekty" v-for="project in voting.projects">
    <div v-tooltip="'numer druku'" class="numery" >
      <div class="drukNr">#{{project.drukNr}}</div>
    </div>
    <div v-tooltip="'wprowadza prawo Unii Europejskiej'" v-if="project.prawoUE" class="ue">
      EU
    </div>
    <div class="tytul">{{project.tytul}}</div>
  </div>
  <div class="info">
    <div v-tooltip="'kadencja, posiedzenie, głosowanie'" class="numery">
      <div class="kadencja">k{{voting.numbers.kadencja}}</div><div class="posiedzenie">p{{voting.numbers.posiedzenie}}</div><div class="glosowanie">g{{voting.numbers.glosowanie}}</div>
    </div>
    <div v-tooltip="'frekwencja'" class="frekwencja">f: {{Math.floor(voting.frekwencja * 100)}}%</div>
    <div v-tooltip="'data głosowania'" class="status">{{voting.status}} {{moment(voting.votingDate).calendar().toLowerCase()}}</div>
  </div>
</router-link>
</template>

<script>
export default {
  name: 'votings-list-item',
  props: ['voting', 'id'],
  data () {
    return {}
  },
  components: {
  },
  computed: {
    currentVotingVote () {
      return this.$store.state.userVotes[`${this.voting.numbers.kadencja}/${this.voting.numbers.posiedzenie}/${this.voting.numbers.glosowanie}`]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.numery * {
  padding: 0em 0.5em;
}
.numery {
  display: flex;
  font-weight: bold;
  font-variant: small-caps;
  float: left;
  color: black;
  border-radius: 1vmin;
  overflow: hidden;
  margin-right: 0.5em;
}
.ue{
  font-weight: bold;
  float: left;
  color: yellow;
  border-radius: 1vmin;
  overflow: hidden;
  padding: 0em 0.5em;
  margin-right: 0.5em;
  background-color: hsla(240, 100%, 70%, 1);
}
.tytul{
  font-weight: 400;
}
.kadencja {
  background-color: hsla(60, 50%, 70%, 1);
}
.posiedzenie {
  background-color: hsla(39, 100%, 70%, 1);
}
.glosowanie {
  background-color: hsla(0, 100%, 80%, 1);
}
.drukNr {
  color: white;
  background-color: hsla(240, 100%, 80%, 1);
}
.uchwalono {
  border-right: 1.75vmin solid forestgreen;
}
.uchwalono .status{
  background-color: hsla(120, 50%, 70%, 1);
}
.nazwa-zwyczajowa {
  font-variant: small-caps;
  font-weight: 900;
  letter-spacing: .2em;
  margin-bottom: .2em;
  text-align: center;
}

.odrzucony {
  border-right: 1.75vmin solid red;
}
.odrzucony .status{
  background-color: hsla(348, 50%, 70%, 1);
}
.status, .frekwencja{
  font-variant: small-caps;
  padding: 0 0.5em;
  border-radius: 1vmin;
}
.frekwencja {
  background-color: hsla(180, 50%, 70%, 1);
}
.voting-list-item {
  background: #eee;
  padding: 2vmin;
  margin-bottom: 1vmin;
  border-radius: 1vmin;
}
.voting-list-item > * {
  margin-right: 1em;
}
.info{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 1vmin;
}
.info *{
  color: white;
}
a {
  color: black;
}
.za {
  background-color: lightgreen;
}
.przeciw {
  background-color: lightpink;
}
a.router-link-exact-active {
  box-shadow: 0 0 0 1vmin var(--color-base) inset;
}
</style>
