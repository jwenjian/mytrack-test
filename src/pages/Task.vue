<template>
  <div class="q-pa-md">
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="accent" @click="showTaskCreateDialog" />
    </q-page-sticky>
    <q-table title="Tasks" :data="data" :columns="columns" row-key="id" />
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
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Title is required']"
            />
            <em class="form-label">Description (optional)</em>
            <q-editor
              v-model="dialog.create.model.description"
              min-height="5rem"
              max-height="15rem"
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn color="primary" label="Create" @click="onCreate" />
          <q-btn flat label="Close" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { Order } from "lovefield";

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
      columns: [
        {
          name: "id",
          label: "ID",
          required: true,
          field: "id",
          sortable: true,
          align: "left"
        },
        {
          name: "title",
          label: "Title",
          required: true,
          field: "title",
          align: "left"
        },
        {
          name: "description",
          label: "Description",
          required: true,
          field: "description",
          align: "left"
        },
        {
          name: "create_time",
          label: "Create time",
          required: true,
          align: "left",
          field: row => "" + row.create_time
        }
      ]
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
          if (!valid) {
            return;
          }
          let taskTable = this.$db.getSchema().table("task");
          let row = taskTable.createRow({
            title: this.dialog.create.model.title,
            description: this.dialog.create.model.description,
            create_time: new Date()
          });
          this.$db
            .insertOrReplace()
            .into(taskTable)
            .values([row])
            .exec()
            .then(rows => {
              this.$q.notify({
                color: "green",
                message: "Success!"
              });
              this.dialog.create.model.title = null;
              this.dialog.create.model.description = "";
              this.getTableData();
              this.dialog.create.show = false;
            })
            .catch(err => {
              this.$q.notify({
                color: "red",
                message:
                  "Create failed, detailed message: " + JSON.stringify(err)
              });
            });
        })
        .catch(err => {
          this.$q.notify("Invalid!" + err);
        });
    },
    getTableData() {
      let taskTable = this.$db.getSchema().table("task");
      this.$db
        .select()
        .from(taskTable)
        .orderBy(taskTable.id, Order.DESC)
        .exec()
        .then(rows => {
          this.data = rows;
          console.log(rows);
        })
        .catch(err => {
          this.$q.notify({
            message:
              "Error get tasks, detailed message: " + JSON.stringify(err),
            color: "red"
          });
        });
    }
  },
  mounted() {
    this.getTableData();
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
