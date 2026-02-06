const fs = require('fs');
const path = require('path');

// Configure the path to your environment file
const targetPath = path.join(__dirname, '../src/environments/environment.ts');
const targetPathProd = path.join(__dirname, '../src/environments/environment.prod.ts');

// Load environment variables
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

// Environment file content
const envConfigFile = `export const environment = {
    production: true,
    supabaseUrl: '${supabaseUrl}',
    supabaseKey: '${supabaseKey}'
};
`;

// Write the file
fs.writeFile(targetPath, envConfigFile, function (err) {
    if (err) {
        throw console.error(err);
    } else {
        console.log(`Angular environment.ts file generated correctly at ${targetPath}`);
    }
});

fs.writeFile(targetPathProd, envConfigFile, function (err) {
    if (err) {
        throw console.error(err);
    } else {
        console.log(`Angular environment.prod.ts file generated correctly at ${targetPathProd}`);
    }
});
