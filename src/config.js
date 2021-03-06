const fs = require('fs');
const yaml = require('yaml');
const path = require('path');
const { validate } = require('jsonschema');

function processConfig() {
  const args = process.argv.slice(2);
  let filename = './config.yaml';
  if (args.length >= 1) {
    filename = args[0];
  }
  const file = fs.readFileSync(filename, 'utf8');
  const config = yaml.parse(file);
  const errors = validateConfig(config);
  if (errors.length > 0) {
    console.log('Invalid config file:', errors);
    process.exit(1);
  }
  return config;
}

function validateConfig(config) {
  const filePath = path.join(path.dirname(__dirname), 'data', 'config_schema.json');
  const schema = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const result = validate(config, schema, { allowUnknownAttributes: false });
  return result.errors.map(e => e.stack);
}

module.exports = processConfig();
