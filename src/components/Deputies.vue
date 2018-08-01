<template>
<div class="deputies">
  <div v-if="currentVoting.frekwencja" id="svg-container">
      <svg id="deputies-graph" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 220 130">
            <text text-anchor="middle" dominant-baseline="hanging" x="0" y="0" font-family="mono" font-weight="bold" font-size="10" stroke="none" fill="black">{{currentVoting.drukNr}}</text>
            <g>
              <deputy v-for="(deputy, index) in currentVoting.deputies" :key="index" :singleDeputy='deputy' :cx="placeX(index)" :cy="placeY(index)" :i="index"></deputy>
            </g>
            <g>
              <text x='5' y='125' font-size="8" stroke-width="5" stroke-linejoin="bevel" stroke-linecap="round" stroke="darkorchid" fill="white">Wstrzymał się</text>
              <text x='5' y='125' font-size="8" stroke="none" fill="white">Wstrzymał się</text>

              <text x='73' y='125' font-size="8" stroke-width="5" stroke-linejoin="bevel" stroke-linecap="round" stroke="black" fill="white">Nieobecny</text>
              <text x='73' y='125' font-size="8" stroke="none" fill="white">Nieobecny</text>

              <text x='130' y='125' font-size="8" stroke-width="5" stroke-linejoin="bevel" stroke-linecap="round" stroke="green" fill="white">Zgodny</text>
              <text x='130' y='125' font-size="8" stroke="none" fill="white">Zgodny</text>

              <text x='174' y='125' font-size="8" stroke-width="5" stroke-linejoin="bevel" stroke-linecap="round" stroke="red" fill="white">Niezgodny</text>
              <text x='174' y='125' font-size="8" stroke="none" fill="white">Niezgodny</text>
            </g>
          </svg>
    </div>
    <div v-else>
      <h2>Brak imiennych wyników głosowania!</h2>
    </div>
</div>
</template>

<script>
import Deputy from "@/components/Deputy";

export default {
  name: "deputies",
  props: ["currentVoting"],
  data() {
    return {
      s1: 10 // ilość osób w kolumnie
    };
  },
  components: {
    Deputy
  },
  methods: {
    placeX(x) {
      let result =
        110 +
        -Math.cos(Math.floor(x / this.s1) * this.s1 * (Math.PI / 450)) *
          Math.cos(((x % this.s1) + 18) * (Math.PI / 70)) *
          150;
      return result;
    },
    placeY(y) {
      let result =
        5 +
        Math.sin(Math.floor(y / this.s1) * this.s1 * (Math.PI / 450)) *
          Math.cos(((y % this.s1) + 18) * (Math.PI / 70)) *
          150;
      return result;
    }
  }
};
</script>

<style scoped lang="scss">
.voting {
  display: flex;
  background: #444;
  color: #eee;
  width: 100%;
  padding: 5vmin;
}

.novoting {
  width: 100%;
  display: flex;
  justify-content: center;
}

.project-data {
  color: black;
  background: white;
  padding: 2vmin;
  margin: 2vmin 0;
  border-radius: 1vmin;
}

.project-data svg,
.voting-data svg {
  margin-right: 0.5em;
}

.link > a {
  display: flex;
  align-items: center;
}

.link {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: 1vmin;
  background-color: #eee;
  margin: 0.5em 0;
  padding: 0.2em 0.5em;
  text-transform: uppercase;
}

.offerName {
  font-size: 75%;
}

.voting-data p {
  font-weight: bold;
  font-size: 150%;
}

h1,
h2,
h3 {
  /* text-decoration: underline; */
  /* line-height: 1.5em; */
  padding-bottom: 0.5em;
  border-bottom: 0.1em solid #ddd;
  text-align: left;
  display: flex;
  justify-content: space-between;
}

#button-container {
  margin: 5vh 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  justify-content: space-around;
  align-items: flex-end;
  height: 16vmin;
  user-select: none;
}

.vote-button {
  border-radius: 1vmin;
  width: 15vmin;
  height: 15vmin;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  user-select: none;
  cursor: pointer;
  transition: 0.1s;
  color: white;
  border: 0.3vmin solid black;
  border-bottom: 1vmin solid black;
  filter: brightness(0.9);
}

.button-voted {
  filter: none;
  border-bottom: 0.3vmin solid black;
}

.red {
  background-color: red;
}

.green {
  background-color: green;
}

.vote-button svg {
  width: 7vmin;
  height: 7vmin;
  stroke: white;
}

#deputies {
  flex-wrap: wrap;
  display: flex;
  list-style: none;
}

svg#deputies-graph {
  width: 100%;
  user-select: none;
}

.currentVoting {
  /* display: flex;
    justify-content: center;
    flex-direction: column; */
  width: 100%;
}

@media screen and (max-aspect-ratio: 1/1) {
  .voting {
    width: 100vw;
  }
  svg#deputies-graph {
    height: 55vmin;
  }
}

@media screen and (min-device-aspect-ratio: 1/1) {
  .voting {
    height: 100vh;
    overflow-y: scroll;
  }
}
</style>
