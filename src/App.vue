<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  mounted() {
    console.log(this.$db) // eslint-disable-line
    if (this.$db == null || typeof this.$db === "undefined") {
      this.$q.notify({
        message: "Database initialized failed!!!",
        position: "center"
      });
    }
  }
};
</script>
