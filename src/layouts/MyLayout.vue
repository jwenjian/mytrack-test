<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          icon="menu"
          aria-label="Menu"
        />

        <q-toolbar-title>Quasar App</q-toolbar-title>

        <q-avatar color="accent" text-color="white">WJ</q-avatar>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered content-class="bg-grey-2">
      <q-list padding class="text-primary">
        <q-item clickable v-ripple to="/" active-class="text-red-14">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>

          <q-item-section>Dashboard</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/projects">
          <q-item-section avatar>
            <q-icon name="work" />
          </q-item-section>

          <q-item-section>Projects</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/tasks">
          <q-item-section avatar>
            <q-icon name="check_box" />
          </q-item-section>

          <q-item-section>Tasks</q-item-section>
        </q-item>

        <q-separator spaced />

        <q-item
          clickable
          v-ripple
          to="/settings"
        >
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>

          <q-item-section>Settings</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/help"
        >
          <q-item-section avatar>
            <q-icon name="help" />
          </q-item-section>

          <q-item-section>Help</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-fab icon="add" direction="up" color="accent">
          <q-fab-action @click="onClick" color="primary" icon="person_add" />
          <q-fab-action @click="onClick" color="primary" icon="mail" />
        </q-fab>
      </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "MyLayout",

  data() {
    return {
      leftDrawerOpen: false
    };
  }
};
</script>

<style scoped>
</style>>
