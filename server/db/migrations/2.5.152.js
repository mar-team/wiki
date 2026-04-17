const { isPostgres } = require('./_helpers')

exports.up = async function (knex) {
  if (!isPostgres(knex)) {
    return
  }

  await knex.transaction(async (trx) => {
    const hasTable = await trx.schema.hasTable('pageRedirects')
    if (!hasTable) {
      await trx.schema.createTable('pageRedirects', table => {
        table.increments('id').primary()
        table.string('siteId').notNullable()
        table.string('localeCode', 5).notNullable()
        table.string('fromPath').notNullable()
        table.string('toPath').notNullable()
        table.timestamp('createdAt').defaultTo(knex.fn.now())

        table.index(['siteId', 'localeCode', 'fromPath'], 'pageRedirects_lookup_idx')
      })
    }
  })
}

exports.down = async function (knex) {
  if (!isPostgres(knex)) {
    return
  }

  await knex.transaction(async (trx) => {
    const hasTable = await trx.schema.hasTable('pageRedirects')
    if (hasTable) {
      await trx.schema.dropTable('pageRedirects')
    }
  })
}
