import * as vscode from "vscode";
import { Config } from "./configs/config";
import { CommandBasic, mcommand } from "./components/command";
import { BarBasic, mbar } from "./components/statusbar";
import { mterminal } from "./components/terminial";

export let context: vscode.ExtensionContext;

let setContextCount = true;
function setContext(value: vscode.ExtensionContext) {
    if (setContextCount) {
        context = value;
        setContextCount = false;
    } else {
        console.log("[ERROR]: someplace call setContext again.");
    }
}

export const extensionPath = function () {
    return context.extensionPath;
};

export const rootPath = function () {
    return vscode.workspace.rootPath;
};

export const userHome = function () {
    return process.env.HOME || process.env.USERPROFILE;
};

export let config: Config;

let setConfigCount = true;
function setConfig() {
    if (setConfigCount) {
        config = new Config();
    } else {
        console.log("[ERROR]: someplace call setContext again.");
    }
}

export function initial(value: vscode.ExtensionContext) {
    setContext(value);
    setConfig();
}

export { CommandBasic, mcommand };

export { BarBasic, mbar };

export { mterminal };
