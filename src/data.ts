import * as vscode from "vscode";
import { Config } from "./configs/config";
import { CommandBasic, mcommand } from "./components/command";
import { BarBasic, mbar } from "./components/statusbar";
import { mterminal } from "./components/terminial";

export let context: vscode.ExtensionContext;
export let config: Config;

export const extensionPath = function () {
    return context.extensionPath;
};

export const rootPath = function () {
    return vscode.workspace.rootPath;
};

export const userHome = function () {
    return process.env.HOME || process.env.USERPROFILE;
};

export function initial(value: vscode.ExtensionContext) {
    context = value;
    config = new Config();
}

export { CommandBasic, mcommand };

export { BarBasic, mbar };

export { mterminal };

export const PathType = {
    TARGET_PATH: "TARGET_PATH",
    EXAMPLE_PATH: "EXAMPLE_PATH",
    BACKEND_PATH: "BACKEND_PATH",
};
