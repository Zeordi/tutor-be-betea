const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// 1. Monorepo watch folders (combine default Expo folders + monorepo root)
config.watchFolders = [...(config.watchFolders || [projectRoot]), monorepoRoot];

// 2. Resolve module paths correctly in pnpm monorepo
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

// 3. Limit parallel workers to prevent Codespaces Out-Of-Memory crashes
config.maxWorkers = 2;

module.exports = config;