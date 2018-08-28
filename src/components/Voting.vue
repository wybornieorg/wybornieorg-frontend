<template>
<div class="voting">
  <div v-if="glosowanie === undefined || currentVoting === undefined" class="novoting">
    Wybierz projekt z listy!
  </div>
  <div v-else id="cp" class="currentVoting">
    <h1 v-if="currentVoting.nazwa">{{currentVoting.nazwa.nazwaZwyczajowa}}</h1>
    <h2>Przegłosowane projekty<a v-tooltip="'Zaproponuj nazwę zwyczajową!'" class="offerName" target="_blank" :href="'mailto:michalwoloszyn+3buotfyq3fngqjkf5paj@boards.trello.com?subject=TUTAJ WPISZ PROPONOWANĄ NAZWĘ&body=nie kasuj tej linijki! http://wybornie.org' + $route.path"><font-awesome-icon icon="lightbulb"/></a></h2>
    <div class="project-data" v-for="(project, index) in currentVoting.projects" :key="index">
      <h3>#{{project.drukNr}}</h3>
      <h3>{{project.tytul}}</h3>
      <p>{{project.opis}}</p>

      <div v-for="(link, index) in links" :key="index" class="link" v-if="project[link.key] || link.href">
        <a target="_blank" :href="project[link.key] || link.href(project)">
          <font-awesome-icon :icon="link.icon" />{{link.name}}
          <font-awesome-icon icon="external-link-alt" />
        </a>
      </div>
    </div>

    <mam-prawo-wiedziec v-if="currentVoting.mpw" :mpw="currentVoting.mpw"></mam-prawo-wiedziec>

    <div class="voting-data">
      <h2>Dane głosowania</h2>
      <p>{{currentVoting.status}} {{votingTime.calendar().toLowerCase()}}</p>
      <p>frekwencja {{Math.floor(currentVoting.frekwencja*100)}}%</p>
      <div class="link">
        <a target="_blank" :href="currentVoting.votingLink">
          <font-awesome-icon icon="check-square" />decydujące głosowanie
          <font-awesome-icon icon="external-link-alt" />
        </a>
      </div>
    </div>

    <div id="ocena">
      <h3 style="text-align: center">Jak oceniasz ten projekt?</h3>
    </div>
    <div id="button-container">
      <div :class="['vote-button', 'green', {'button-voted': currentVotingVote > 0}]" @click="userVote(true)">
        <font-awesome-icon icon="thumbs-up" />
      </div>
      <div :class="['vote-button', 'grey', {'button-voted': currentVotingVote === undefined || currentVotingVote === 0}]" @click="userVote(null)">
        <font-awesome-icon icon="question" />
      </div>
      <div :class="['vote-button', 'red', {'button-voted': currentVotingVote < 0}]" @click="userVote(false)">
        <font-awesome-icon icon="thumbs-down" />
      </div>
    </div>

    <deputies :currentVoting="currentVoting"></deputies>

  </div>

</div>
</template>

<script>
import Deputies from "@/components/Deputies";
import MamPrawoWiedziec from "@/components/MamPrawoWiedziec";

export default {
  name: "voting",
  props: ["kadencja", "posiedzenie", "glosowanie"],
  data() {
    return {
      links: [
        {
          key: "przebiegLink",
          name: "przebieg projektu",
          icon: "bolt"
        },
        {
          key: "trescLink",
          name: "treść projektu",
          icon: "file-alt"
        },
        {
          href: a => a.drukPdfLink + "#search=UZASADNIENIE",
          name: "uzasadnienie",
          icon: "file-pdf"
        },
        {
          key: "isapLink",
          name: "ISAP tekst ustawy",
          icon: "file"
        },
        {
          key: "komisje",
          name: "komisje i podkomisje",
          icon: "comments"
        },
        {
          href: a => this.mediaLink(a.tytul),
          name: "media o projekcie",
          icon: "tv"
        }
      ],
      s1: 10 // ilość osób w kolumnie
    };
  },
  components: {
    MamPrawoWiedziec,
    Deputies
  },
  mounted() {
    this.fetchVoting();
    this.registerKbdHandlers();
  },
  updated() {
    document.querySelector("#scrollable-container").scrollTo({
      top:
        document.querySelector(".router-link-exact-active").offsetTop -
        document.querySelector(".router-link-exact-active").clientHeight,
      behavior: "smooth"
    });
  },
  watch: {
    $route: function() {
      this.fetchVoting();

      document.querySelector(".voting").scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  },
  computed: {
    votingTime() {
      return this.moment(new Date(this.currentVoting.votingDate));
    },
    currentVotingVote() {
      return this.$store.state.userVotes[
        `${this.kadencja}/${this.posiedzenie}/${this.glosowanie}`
      ];
    },
    userVotes() {
      return this.$store.state.userVotes;
    },
    currentVoting() {
      return this.$store.getters.currentVoting(
        `${this.kadencja}/${this.posiedzenie}/${this.glosowanie}`
      );
    }
  },
  methods: {
    registerKbdHandlers() {
      document.addEventListener("keydown", event => {
        if (event.key === "ArrowUp") {
          event.preventDefault();
          this.userVote(true);
        }
        if (event.key === "ArrowDown") {
          event.preventDefault();
          this.userVote(false);
        }
      });
    },
    userVote(vote) {
      this.$store.commit("userVote", {
        numbers: `${this.kadencja}/${this.posiedzenie}/${this.glosowanie}`,
        vote: vote
      });
      document.querySelector(".voting").scrollTo({
        top: document.querySelector("#ocena").offsetTop,
        behavior: "smooth"
      });
    },
    fetchVoting() {
      this.$store.dispatch("fetchVoting", {
        votingNumbers: `${this.kadencja}/${this.posiedzenie}/${this.glosowanie}`
      });
    },
    mediaLink(tytul) {
      let result = "";
      result =
        "https://encrypted.google.com/search?q=" +
        tytul.replace(/ /g, "+").replace(/"/g, "") +
        "&tbm=nws";
      if (this.currentVoting.nazwa) {
        result =
          "https://encrypted.google.com/search?q=" +
          this.currentVoting.nazwa.nazwaZwyczajowa;
      }
      return result;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
  fill: white;
  color: white;
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
