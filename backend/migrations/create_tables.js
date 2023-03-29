exports.up = function (knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.string("email").notNullable().unique();
      table.integer("usage_count").defaultTo(0);
    })
    .createTable("chats", (table) => {
      table.increments("id").primary();
      table.integer("user_id").unsigned().references("id").inTable("users");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.string("title");
    })
    .createTable("messages", (table) => {
      table.increments("id").primary();
      table.integer("chat_id").unsigned().references("id").inTable("chats");
      table.string("user_question").notNullable();
      table.string("assistant_response").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("messages")
    .dropTableIfExists("chats")
    .dropTableIfExists("users");
};
