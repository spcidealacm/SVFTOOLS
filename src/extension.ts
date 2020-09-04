import * as vscode from "vscode";
import * as data from "./data";
import * as cmd from "./model/command";
import * as bar from "./model/statusbar";

export function activate(context: vscode.ExtensionContext) {
    initial(context);
}

function initial(context: vscode.ExtensionContext) {
    data.initial(context);
    const command = [
        {
            key: data.config.command.INSTALL_ENV,
            instance: new cmd.SetEnvCommand(),
        },
        {
            key: data.config.command.OPEN_TARGET,
            instance: new cmd.OpenTargetCommand(),
        },
        {
            key: data.config.command.OPEN_BACKEND,
            instance: new cmd.OpenBackendCommand(),
        },
        {
            key: data.config.command.BUILD_TARGET,
            instance: new cmd.BuildTargetCommand(),
        },
        {
            key: data.config.command.BUILD_BACKEND,
            instance: new cmd.BuildBackendCommand(),
        },
        {
            key: data.config.command.SHOW_REPORT,
            instance: new cmd.ShowReportCommand(),
        },
    ];
    const statusbar = [
        {
            key: data.config.getStatusbarKeyFromCommand(
                data.config.command.INSTALL_ENV
            ),
            instance: new bar.SetEnvBar(),
        },
        {
            key: data.config.getStatusbarKeyFromCommand(
                data.config.command.BUILD_BACKEND
            ),
            instance: new bar.BuildBackendBar(),
        },
        {
            key: data.config.getStatusbarKeyFromCommand(
                data.config.command.BUILD_TARGET
            ),
            instance: new bar.BuildTargetBar(),
        },
        {
            key: data.config.getStatusbarKeyFromCommand(
                data.config.command.OPEN_TARGET
            ),
            instance: new bar.OpenTargetBar(),
        },
        {
            key: data.config.getStatusbarKeyFromCommand(
                data.config.command.OPEN_BACKEND
            ),
            instance: new bar.OpenBackendBar(),
        },
        {
            key: data.config.getStatusbarKeyFromCommand(
                data.config.command.SHOW_REPORT
            ),
            instance: new bar.ShowReportBar(),
        },
    ];

    command.forEach((element) => {
        data.mcommand.generate(element.key, element.instance);
    });
    statusbar.forEach((element) => {
        data.mbar.generate(element.key, element.instance);
    });
}

export function deactivate() {}
