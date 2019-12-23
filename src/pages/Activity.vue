<template>
  <div class="q-pa-md">
    <q-timeline layout="comfortable" color="secondary">
      <q-timeline-entry heading>MyTrack Activities</q-timeline-entry>
      <template v-for="i in items">
        <q-timeline-entry
          :title="i.title"
          :subtitle="i.create_time.toLocaleDateString() + i.create_time.toLocaleTimeString()"
          :icon="i.type | type2icon"
          :key="i.id"
        >
          <p class="item-subtitle">{{ i.subtitle }}</p>
          <div class="item-body">{{ i.body }}</div>
        </q-timeline-entry>
      </template>
    </q-timeline>
  </div>
</template>

<script>
import { Order } from "lovefield";
export default {
  name: "activity-page",
  data() {
    return {
      items: []
    };
  },
  filters: {
    type2icon: function(type) {
      if (type === 100) {
        return 'check_box'
      }
      if (type === 101) {
        return 'av_timer'
      }
      return 'timeline'
    }
  },
  methods: {
    getAllActivity() {
      let activityTable = this.$db.getSchema().table("activity");
      this.$db
        .select()
        .from(activityTable)
        .orderBy(activityTable.id, Order.DESC)
        .exec()
        .then(rows => {
          this.items = rows;
        })
        .catch(err => {
          this.$q.notify({
            message:
              "Error get activities, detailed error message: " +
              JSON.stringify(err),
            color: "red"
          });
        });
    }
  },
  mounted() {
    this.getAllActivity();
  }
};
</script>

<style scoped>
.item-subtitle {
  font-weight: bold;
}
.item-body {
  color: grey;
}
</style>
