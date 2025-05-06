const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);
defaultConfig.resolver.assetExts.push("hcscript");
defaultConfig.transformer.assetPlugins = ["expo-asset/tools/hashAssetFiles"];

module.exports = config;