<template>
<g v-tooltip="singleDeputy.name + ' ' + singleDeputy.vote + ' ' + singleDeputy.group">
  <circle :cx='cx' :cy='cy' :r="dotSize" :class="koloruj" :id="i"></circle>
  <text v-if="!isMobile" :x="cx" :y="cy" font-family="mono" :font-size="dotSize * 1.4" stroke="none" fill="white">{{singleDeputy.name[0]}}</text>
</g>
</template>

<script>
export default {
  props: ["singleDeputy", "cx", "cy", "i"],
  data() {
    return {
      r: 15,
      show: false,
      dotSize: 2
    };
  },
  computed: {
    currentVotingVote() {
      return this.$store.state.userVotes[
        `${this.$route.params.kadencja}/${this.$route.params.posiedzenie}/${
          this.$route.params.glosowanie
        }`
      ];
    },
    isMobile() {
      return this.$store.getters.isMobile;
    },
    zgodnosc() {
      let deputyVote =
        this.singleDeputy.vote === "Za"
          ? 1
          : this.singleDeputy.vote === "Przeciw"
            ? -1
            : 0;
      return this.currentVotingVote * deputyVote > 0;
    },
    koloruj() {
      let result = "";
      if (
        this.singleDeputy.vote === "Wstrzymał się" ||
        this.singleDeputy.vote === "Nie oddał głosu"
      ) {
        result = "wstrzymanie";
      } else if (this.singleDeputy.vote === "Nieobecny") {
        result = "nieobecnosc";
      } else if (
        this.currentVotingVote === undefined ||
        this.currentVotingVote === 0
      ) {
        return "";
      } else {
        result = this.zgodnosc ? "zgodny" : "niezgodny";
      }
      // if (this.singleDeputy.group === 'PiS') {
      //   result += ' pis'
      // } else if (this.singleDeputy.group === 'PO') {
      //   result += ' po'
      // } else if (this.singleDeputy.group === 'Kukiz15') {
      //   result += ' kukiz'
      // } else if (this.singleDeputy.group === 'N') {
      //   result += ' nowoczesna'
      // } else if (this.singleDeputy.group === 'PSL') {
      //   result += ' psl'
      // }
      return result;
    }
  },
  created() {
    // this.fetchIMG()
  },
  methods: {
    fetchIMG() {
      return null;
    }
  },
  watch: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
div {
  width: 100px;
}

text {
  dominant-baseline: central;
  text-anchor: middle;
}

.pis {
  stroke: firebrick;
}

.po {
  stroke: gold;
}

.kukiz {
  stroke: black;
}

.nowoczesna {
  stroke: blue;
}

.psl {
  stroke: green;
}

.zgodny {
  fill: green;
}

.niezgodny {
  fill: red;
}

.nieobecnosc {
  fill: black;
}

.wstrzymanie {
  fill: darkorchid;
}

circle {
  stroke: none;
  stroke-width: 2;
  /*transition: 0.5s;*/
  fill: #777;
}

/*circle:hover {
  transform: scale(1.2, 1.2);
}*/

title {
  font-size: 24px;
}
</style>
