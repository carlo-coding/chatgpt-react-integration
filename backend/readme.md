Now, you can run the migrations to create the tables if they don't exist. First, make sure you have Knex.js installed globally:

```
npm install -g knex
```

Then run the migrations:

```
knex migrate:latest --knexfile knexfile.js
```

This command will create the tables if they don't exist using the structure defined in the `create_tables.js` file. If you ever need to rollback the migrations, you can run:

```
knex migrate:rollback --knexfile knexfile.js
```

This will drop the tables in reverse order as defined in the `exports.down` function.
