// import something here
import lf from 'lovefield'

// schema
const schema = lf.schema.create('mytrack', 1);

// create table `task`
schema.createTable('task')
  .addColumn('id', lf.Type.INTEGER)
  .addColumn('title', lf.Type.STRING)
  .addColumn('description', lf.Type.STRING)
  .addColumn('create_time', lf.Type.DATE_TIME)
  .addColumn('total_spent_minute', lf.Type.NUMBER)
  .addPrimaryKey(['id'], true)
  .addIndex('idx_create_time', ['create_time'], false, lf.Order.DESC);

schema.createTable('spent_time_item')
  .addColumn('id', lf.Type.INTEGER)
  .addColumn('task_id', lf.Type.INTEGER)
  .addColumn('spent_minute', lf.Type.INTEGER)
  .addColumn('description', lf.Type.STRING)
  .addColumn('create_time', lf.Type.DATE_TIME)
  .addPrimaryKey(['id'], true)
  .addIndex('idx_task_id', ['task_id'], false, lf.Order.DESC)

schema.createTable('activity')
  .addColumn('id', lf.Type.INTEGER)
  .addColumn('type', lf.Type.INTEGER)
  .addColumn('title', lf.Type.STRING)
  .addColumn('subtitle', lf.Type.STRING)
  .addColumn('body', lf.Type.STRING)
  .addColumn('create_time', lf.Type.DATE_TIME)
  .addPrimaryKey(['id'], true)

// "async" is optional
export default async ({ Vue }) => {
  // something to do
  const db = await schema.connect()
  Vue.prototype.$db = db
}
