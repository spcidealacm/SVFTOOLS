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
            instance: new cmd.TerminialCommand(data.config.command.INSTALL_ENV),
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
            instance: new cmd.TerminialCommand(
                data.config.command.BUILD_TARGET
            ),
        },
        {
            key: data.config.command.BUILD_BACKEND,
            instance: new cmd.TerminialCommand(
                data.config.command.BUILD_BACKEND
            ),
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
            instance: new bar.GenerateBar(data.config.command.INSTALL_ENV),
        },
        {
            key: data.config.getStatusbarKeyFromCommand(
                data.config.command.BUILD_BACKEND
            ),
            instance: new bar.GenerateBar(data.config.command.BUILD_BACKEND),
        },
        {
            key: data.config.getStatusbarKeyFromCommand(
                data.config.command.BUILD_TARGET
            ),
            instance: new bar.GenerateBar(data.config.command.BUILD_TARGET),
        },
        {
            key: data.config.getStatusbarKeyFromCommand(
                data.config.command.OPEN_TARGET
            ),
            instance: new bar.GenerateBar(data.config.command.OPEN_TARGET),
        },
        {
            key: data.config.getStatusbarKeyFromCommand(
                data.config.command.OPEN_BACKEND
            ),
            instance: new bar.GenerateBar(data.config.command.OPEN_BACKEND),
        },
        {
            key: data.config.getStatusbarKeyFromCommand(
                data.config.command.SHOW_REPORT
            ),
            instance: new bar.GenerateBar(data.config.command.SHOW_REPORT),
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
