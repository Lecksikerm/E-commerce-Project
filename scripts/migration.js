// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv/config');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { exec } = require('child_process');

const argv = process.argv.slice(2);
const subcommand = argv[0];
const migrationName = argv[1];

if (!migrationName) {
    console.error('Please provide a migration name');
    process.exit(1);
}

const migrationsDir =
    'src/dal/migrations' || process.env.TYPEORM_MIGRATIONS_DIR;

const dataSource = 'src/dal/orm-config.ts';

const subcommandsMap = {
    'migration:generate': `ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ${migrationsDir}/${migrationName} -d ${dataSource}`,
    'migration:create': `ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:create ${migrationsDir}/${migrationName}`,
};

const command = subcommandsMap[subcommand];

if (!command) {
    console.error('Invalid subcommand');
    process.exit(1);
}

console.log(command);

exec(command).stdout.pipe(process.stdout);