/**
 * Migration 2.5.153 - Add lastEditedBy to comments for foreign comment management
 *
 * - Adds `comments.lastEditedBy` to track which user last edited a comment
 * - Adds foreign key constraint to users table
 */

const { isPostgres } = require('./_helpers')

exports.up = async function (knex) {
  // Postgres only: CapWiki is intended to run on Postgres
  if (!isPostgres(knex)) {
    return
  }

  // Add lastEditedBy column with foreign key constraint
  const hasColumn = await knex.schema.hasColumn('comments', 'lastEditedBy')
  if (!hasColumn) {
    await knex.schema.alterTable('comments', table => {
      table.integer('lastEditedBy').unsigned().nullable()

      // Foreign key constraint to users.id
      table.foreign('lastEditedBy')
        .references('id')
        .inTable('users')
    })
  }
}

exports.down = async function (knex) {
  if (!isPostgres(knex)) {
    return
  }

  // Drop column (cascade will drop the constraint automatically)
  const hasColumn = await knex.schema.hasColumn('comments', 'lastEditedBy')
  if (hasColumn) {
    await knex.schema.alterTable('comments', table => {
      table.dropColumn('lastEditedBy')
    })
  }
}
