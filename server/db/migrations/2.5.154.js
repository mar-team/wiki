/**
 * Migration 2.5.154 - Increase all 'path' columns to 510 characters
 *
 * Extends the max length of every Postgres table column named 'path' from VARCHAR(255) to VARCHAR(510).
 */

const { isPostgres } = require('./_helpers')

async function getPathTables(trx) {
  const result = await trx.raw(`
    SELECT table_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND column_name = 'path'
    ORDER BY table_name
  `)

  return result.rows.map(row => row.table_name)
}

async function alterPathLength(trx, length) {
  const tableNames = await getPathTables(trx)

  for (const tableName of tableNames) {
    await trx.raw(`
      ALTER TABLE public."${tableName}"
      ALTER COLUMN "path" TYPE character varying(${length})
    `)
  }
}

exports.up = async function (knex) {
  if (!isPostgres(knex)) {
    return
  }

  await knex.transaction(async (trx) => {
    await alterPathLength(trx, 510)
  })
}

exports.down = async function (knex) {
  if (!isPostgres(knex)) {
    return
  }

  await knex.transaction(async (trx) => {
    await alterPathLength(trx, 255)
  })
}
