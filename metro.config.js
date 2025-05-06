const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);
config.resolver.assetExts.push("hcscript");
config.transformer.assetPlugins = ["expo-asset/tools/hashAssetFiles"];

module.exports = config;