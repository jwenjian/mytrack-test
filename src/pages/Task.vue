<template>
  <div class="q-pa-md">
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="accent" @click="showTaskCreateDialog" />
    </q-page-sticky>
    <q-table title="Tasks" :data="data" :columns="columns" row-key="name" />
    <!-- dialogs -->
    <q-dialog v-model="dialog.create.show">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Create a task</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="onCreate" ref="form.create">
            <em class="form-label">Title *</em>
            <q-input
              outlined
              v-model="dialog.create.model.title"
            />
            <em class="form-label">Description (optional)</em>
            <q-editor v-model="dialog.create.model.description" min-height="5rem" max-height="15rem" />
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn color="primary" label="Create" @click="onCreate"/>
          <q-btn flat label="Close" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: "task",
  data() {
    return {
      dialog: {
        create: {
          show: false,
          model: {
            title: null,
            description: ""
          }
        }
      },
      data: [],
      columns: []
    };
  },
  methods: {
    showTaskCreateDialog() {
      this.dialog.create.show = !this.dialog.create.show;
    },
    onCreate() {
      this.$refs["form.create"]
        .validate()
        .then(valid => {
          console.log(this.$q); // eslint-disable-line
          this.$q.notify(JSON.stringify(this.dialog.create.model));
        })
        .catch(err => {
          this.$q.notify("Invalid!" + err);
        });
    }
  }
};
</script>

<style>
.form-label {
  display: block;
  margin-top: 1em;
  margin-bottom: 0.5em;
}
</style>
