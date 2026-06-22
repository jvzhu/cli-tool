# cli-tool

Comprehensive TypeScript command-line utility built with Commander.js.

## Features

- Core commands: `init`, `config`, `help`, `version`, `update`
- Utility commands: `file`, `convert`, `validate`, `generate`, `sync`, `build`
- Interactive prompts with Inquirer and progress spinners with Ora
- Colored output, table/JSON/YAML/CSV formatting
- Config merging from `~/.clirc`, project `.clirc`, and `.env`
- API client with auth, rate-limit logging, and structured logs
- Plugin, middleware, and hook extension architecture
- Strict TypeScript + Jest tests with coverage thresholds

## Installation

### Local

```bash
npm install
npm run build
node dist/index.js --help
```

### Global

```bash
npm install -g @jvzhu/cli-tool
cli-tool --help
```

## Configuration

Config is merged in this order:

1. defaults
2. `~/.clirc`
3. project `.clirc` or `.clirc.yaml`
4. `.env` values (`CLI_TOOL_API_URL`, `CLI_TOOL_API_TOKEN`)

Example `.clirc`:

```json
{
  "outputFormat": "table",
  "safeDelete": true,
  "logLevel": "info"
}
```

## Commands

```bash
cli-tool init
cli-tool config get outputFormat
cli-tool config set outputFormat json
cli-tool file list "src/**/*.ts"
cli-tool file copy a.txt b.txt
cli-tool convert input.json output.yaml
cli-tool validate data.json schema.json
cli-tool generate myComponent
cli-tool sync --api-url https://api.example.com --token <token>
cli-tool build
cli-tool version
```

## Output Formats

Global option:

```bash
cli-tool --output json help-json
```

Supported: `table`, `json`, `yaml`, `csv`.

## Development

```bash
npm run lint
npm run build
npm test
```

## Troubleshooting

- Ensure Node.js 20+ is installed.
- If command not found after global install, check npm global bin path.
- Set `CLI_TOOL_LOG_LEVEL=debug` in `.env` for more diagnostics.

## Contributing

1. Create a branch
2. Add or update tests
3. Run lint, build, and tests
4. Open a pull request
