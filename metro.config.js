const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Aktifkan NativeWind dengan menunjuk ke file CSS global
module.exports = withNativeWind(config, { input: "./global.css" });
