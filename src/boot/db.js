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
  .addPrimaryKey(['id'], true)
  .addIndex('idx_create_time', ['create_time'], false, lf.Order.DESC);

// "async" is optional
export default async ({ Vue }) => {
  // something to do
  const db = await schema.connect()
  Vue.prototype.$db = db
}
