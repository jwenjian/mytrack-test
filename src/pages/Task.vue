<template>
  <div class="q-pa-md">
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="accent" @click="showTaskCreateDialog" />
    </q-page-sticky>
    <q-table
      title="Tasks"
      :loading="table.loading"
      :data="data"
      :columns="columns"
      row-key="id"
      :pagination.sync="pagination"
      @request="getTableData"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width :props="props" key="id">{{ props.row.id }}</q-td>
          <q-td auto-width :props="props" key="title">{{ props.row.title }}</q-td>
          <q-td auto-width :props="props" key="description">{{ props.row.description }}</q-td>
          <q-td
            auto-width
            :props="props"
            key="total_spent_minute"
          >{{ props.row.total_spent_minute | minutes2readable }}</q-td>
          <q-td auto-width :props="props" key="create_time">{{ props.row.create_time }}</q-td>
          <q-td auto-width :props="props" key="operation">
            <q-btn
              round
              color="primary"
              icon="av_timer"
              size="sm"
              class="row-btn"
              @click="showTimeTrackDialog(props.row)"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <!-- dialogs -->
    <!-- task create dialog -->
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
    <!-- time tracking dialog -->
    <q-dialog v-model="dialog.track.show">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Time tracking on task: {{dialog.track.info.task.title}}</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="onTrack" ref="form.track">
            <em class="form-label">Date *</em>
            <q-input outlined v-model="dialog.track.model.dateStr" mask="date" :rules="['date']">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date
                      v-model="dialog.track.model.dateStr"
                      @input="() => $refs.qDateProxy.hide()"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <em class="form-label">Time *</em>
            <q-input
              outlined
              v-model="dialog.track.model.timeExression"
              lazy-rules
              :rules="dialog.track.rule.timeExression"
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
          <q-btn color="primary" label="Track" @click="onTrack" />
          <q-btn flat label="Close" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { fn, Order } from "lovefield";
import { formatCurrentDate } from "../util/common";

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
        },
        track: {
          show: false,
          info: {
            task: {
              id: null,
              title: "",
              description: "",
              create_time: null
            }
          },
          model: {
            dateStr: "",
            timeExression: null,
            description: ""
          },
          rule: {
            timeExression: [
              val => {
                let result = false;
                if (val && val.length > 0) {
                  // case insensitive
                  let r = new RegExp(
                    /^([\d]{1,2}[h]|[\d]{1,2}[m]|[\d]{1,2}[h][\d]{1,2}[m])$/,
                    "i"
                  );
                  if (r.test(val)) {
                    result = true;
                  }
                }
                if (!result) {
                  return "30m - 30 Minitues; 1h - 1 Hour; 1h30m - 1 Hour 30 Minutes.";
                }
                return true;
              }
            ]
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
          name: "total_spent_minute",
          label: "Total spent",
          required: true,
          field: "total_spent_minute",
          align: "left"
        },
        {
          name: "create_time",
          label: "Create time",
          required: true,
          align: "left",
          field: row => "" + row.create_time
        },
        {
          name: "operation",
          label: "Operation",
          required: true,
          align: "left"
        }
      ],
      pagination: {
        sortBy: "id",
        descending: true,
        page: 1,
        rowsPerPage: 3,
        rowsNumber: 0
      },
      table: {
        loading: true
      }
    };
  },
  filters: {
    minutes2readable: function(val) {
      if (val <= 0) {
        return "0h0m";
      }
      return `${parseInt(val / 60)}h${val % 60}m`;
    }
  },
  methods: {
    parseMinitues(timeExression) {
      let input = timeExression.toLowerCase();
      let result = 0;
      // 1h
      if (input.indexOf("h") > 0 && input.indexOf("m") < 0) {
        result = Number(input.split("h")[0]) * 60;
      } else if (input.indexOf("h") < 0 && input.indexOf("m") > 0) {
        // 30m
        result = Number(input.split("m")[0]);
      } else {
        // 1h30m
        let hourStr = input.substring(0, input.indexOf("h"));
        let minutesStr = input.substring(
          input.indexOf("h") + 1,
          input.indexOf("m")
        );
        result = Number(hourStr) * 60 + Number(minutesStr);
      }
      return result;
    },
    onTrack() {
      this.$refs["form.track"].validate().then(valid => {
        if (!valid) {
          return;
        }
        let minutes = this.parseMinitues(this.dialog.track.model.timeExression);
        let taskTable = this.$db.getSchema().table("task");
        let activityTable = this.$db.getSchema().table("activity");
        let spentTimeItemTable = this.$db.getSchema().table("spent_time_item");
        let tx = this.$db.createTransaction();
        tx.begin([taskTable, activityTable, spentTimeItemTable])
          .then(() => {
            // count up total spent time of task
            let q = this.$db
              .update(taskTable)
              .set(
                taskTable.total_spent_minute,
                this.dialog.track.info.task.total_spent_minute + minutes
              )
              .where(taskTable.id.eq(this.dialog.track.info.task.id));
            return tx.attach(q);
          })
          .then(result => {
            // insert spent time item
            let row = spentTimeItemTable.createRow({
              task_id: this.dialog.track.info.task.id,
              description: this.dialog.track.model.description,
              create_time: new Date(),
              spent_minute: minutes
            });
            let q = this.$db
              .insertOrReplace()
              .into(spentTimeItemTable)
              .values([row]);
            return tx.attach(q);
          })
          .then(result => {
            // 101 - new spent time on task
            let row = activityTable.createRow({
              type: 101,
              title: "Spent time on task",
              subtitle: `Sepnt ${this.dialog.track.model.timeExression} on task: ${this.dialog.track.info.task.title}.`,
              body: this.dialog.track.model.description,
              create_time: new Date()
            });
            let q = this.$db
              .insertOrReplace()
              .into(activityTable)
              .values([row]);
            return tx.attach(q);
          })
          .then(() => {
            return tx.commit();
          })
          .then(() => {
            this.$q.notify({
              color: "green",
              message: "Success!"
            });
            this.dialog.track.model.dateStr = null;
            this.dialog.track.model.timeExression = "";
            this.getTableData();
            this.dialog.track.show = false;
          })
          .catch(err => {
            this.$q.notify({
              color: "red",
              message: "Create failed, detailed message: " + JSON.stringify(err)
            });
          });
      });
    },
    showTimeTrackDialog(row) {
      this.dialog.track.model.dateStr = formatCurrentDate();
      this.dialog.track.info.task = row;
      this.dialog.track.show = true;
    },
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
          let activityTable = this.$db.getSchema().table("activity");

          let tx = this.$db.createTransaction();

          tx.begin([taskTable, activityTable])
            .then(() => {
              let row = taskTable.createRow({
                title: this.dialog.create.model.title,
                description: this.dialog.create.model.description,
                total_spent_minute: 0,
                create_time: new Date()
              });
              let insertTaskQuery = this.$db
                .insertOrReplace()
                .into(taskTable)
                .values([row]);

              return tx.attach(insertTaskQuery);
            })
            .then(results => {
              let activity = activityTable.createRow({
                type: 100,
                title: "Create a task",
                subtitle: this.dialog.create.model.title,
                body: this.dialog.create.model.description,
                create_time: new Date()
              });
              let insertActivityQuery = this.$db
                .insertOrReplace()
                .into(activityTable)
                .values([activity]);
              return tx.attach(insertActivityQuery);
            })
            .then(() => {
              return tx.commit();
            })
            .then(() => {
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
    getTableData(queryObj) {
      if (queryObj && queryObj.pagination) {
        this.pagination = queryObj.pagination;
      }
      this.table.loading = true;
      let taskTable = this.$db.getSchema().table("task");
      Promise.all([
        this.$db
          .select(fn.count(taskTable.id))
          .from(taskTable)
          .exec(),
        this.$db
          .select()
          .from(taskTable)
          .orderBy(taskTable.id, Order.DESC)
          .skip((this.pagination.page - 1) * this.pagination.rowsPerPage)
          .limit(this.pagination.rowsPerPage)
          .exec()
      ])
        .then(result => {
          let countResult = result[0];
          let dataResult = result[1];
          this.pagination.rowsNumber = countResult[0]["COUNT(id)"];
          this.data = dataResult;
          this.table.loading = false;
        })
        .catch(err => {
          this.$q.notify({
            message:
              "Error get tasks, detailed error message: " + JSON.stringify(err),
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
.row-btn {
  margin-left: 0.5em;
}
</style>
