<template>
<div class="mpw">
  <div class="">
    <h3>#weszło w życie</h3>
  </div>
  <ul v-html="mpw.markup">
  </ul>
  <div class="footer">
    <div class="authors">
      <div class="author" v-for="author in mpw.author">
        {{author}}
      </div>
    </div>
    <a target="_blank" :href="this.mpw.source"><img id="mpw-logo" src="@/assets/logo-MPW-RGB-poziom.png" alt="mamprawowiedziec.pl"></a>
  </div>
</div>
</template>

<script>
export default {
  name: 'mamprawowiedziec',
  props: ['mpw'],
  data () {
    return {}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mpw {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: white;
  color: black;
  border-radius: 1vmin;
  padding: 2vmin;
}

.mpw ul {
  margin: 0;
  padding-left: 1em;
  padding-bottom: 1em;
}

#mpw-logo {
  max-width: 50vmin;
}

.footer {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  color: #32AAD2;
  text-transform: uppercase;
  font-family: serif;
  font-weight: bold;
  justify-content: center;
  align-items: center;
  font-size: .8em;
}

.authors {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
}

.author {
  margin: 1em;
}
</style>
