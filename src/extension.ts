import * as vscode from "vscode";
import * as store from "./components/store";
import * as command from "./components/command";
import * as statusbar from "./components/statusbar";

export function activate(context: vscode.ExtensionContext) {
    store.setContext(context);
    let commandInfo = [
        {
            key: store.Key.SetEnv,
            value: new command.SetEnvCommand(),
        },
        {
            key: store.Key.BuildBackend,
            value: new command.BuildBackendCommand(),
        },
        {
            key: store.Key.BuildTarget,
            value: new command.BuildTargetCommand(),
        },
        {
            key: store.Key.OpenFile,
            value: new command.OpenFileCommand(),
        },
    ];
    let statusbarInfo = [
        {
            key: store.Key.SetEnv,
            value: new statusbar.SetEnvBar(),
        },
        {
            key: store.Key.BuildBackend,
            value: new statusbar.BuildBackendBar(),
        },
        {
            key: store.Key.BuildTarget,
            value: new statusbar.BuildTargetBar(),
        },
        {
            key: store.Key.OpenFile,
            value: new statusbar.OpenFileBar(),
        },
    ];

    commandInfo.forEach((element) => {
        store.command.generate(element.key, element.value);
    });
    statusbarInfo.forEach((element) => {
        store.statusbar.generate(element.key, element.value);
    });
}

export function deactivate() {}
