import * as vscode from "vscode";
import * as store from "./store";
import { extensionPath } from "./store";
import path from "path";

function terminalFunc(key: store.ConfigKey) {
    let config = store.GetConfigValue(key);
    if (
        config.terminal.title !== "" &&
        config.terminal.scriptPath !== "" &&
        config.terminal.exeHead !== ""
    ) {
        let terminal = store.terminal.create(config.terminal.title);
        if (terminal) {
            terminal.show();
            let scriptPath = config.terminal.scriptPath;
            let exeHead = config.terminal.exeHead;
            let absScriptPath = path.join(extensionPath(), scriptPath);
            let sendText = `${exeHead} ${absScriptPath}`;
            terminal.sendText(sendText);
        }
    }
}

export class SetEnvCommand extends store.CommandClass {
    constructor() {
        super(store.GetConfigValue(store.ConfigKey.SetEnv).key);
    }
    Func() {
        terminalFunc(store.ConfigKey.SetEnv);
    }
}

export class BuildBackendCommand extends store.CommandClass {
    constructor() {
        super(store.GetConfigValue(store.ConfigKey.BuildBackend).key);
    }
    Func() {
        terminalFunc(store.ConfigKey.BuildBackend);
    }
}

export class BuildTargetCommand extends store.CommandClass {
    constructor() {
        super(store.GetConfigValue(store.ConfigKey.BuildTarget).key);
    }
    Func() {
        terminalFunc(store.ConfigKey.BuildTarget);
    }
}
export class OpenFileCommand extends store.CommandClass {
    constructor() {
        super(store.GetConfigValue(store.ConfigKey.OpenFile).key);
    }
    Func() {
        // terminalFunc(store.ConfigKey.OpenFile);
        vscode.window.showInformationMessage("HELLO", "YES");
    }
}
