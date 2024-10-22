import { config } from "dotenv";
import { notarize } from "electron-notarize";
const _default = async function notarizing(context) {
  config();
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== "darwin") {
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  return await notarize({
    tool: "notarytool",
    teamId: process.env.APPLE_TEAM_ID,
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APP_APP_PASSWORD,
  });
};
export { _default as default };
