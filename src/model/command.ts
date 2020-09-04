import * as vscode from "vscode";
import * as data from "../data";

interface TerInfo {
    key: string;
    title: string;
    script: string;
}
function terminal(command: string) {
    function startTerminal(info: TerInfo) {
        let terminal = data.mterminal.create(info.title);
        if (terminal) {
            terminal.show();
            terminal.sendText(info.script);
        }
    }
    let info = data.config.getTerminialInfoFromCommand(command)[0];
    if (info) {
        let terInfo: TerInfo = {
            key: info.key,
            title: info.title,
            script: info.script,
        };
        startTerminal(terInfo);
    }
}
export class SetEnvCommand extends data.CommandBasic {
    constructor() {
        super(data.context, data.config.command.INSTALL_ENV);
    }
    Func() {
        terminal(data.config.command.INSTALL_ENV);
    }
}
export class BuildBackendCommand extends data.CommandBasic {
    constructor() {
        super(data.context, data.config.command.BUILD_BACKEND);
    }
    Func() {
        terminal(data.config.command.BUILD_BACKEND);
    }
}
export class BuildTargetCommand extends data.CommandBasic {
    constructor() {
        super(data.context, data.config.command.BUILD_TARGET);
    }
    Func() {
        terminal(data.config.command.BUILD_TARGET);
    }
}
export class OpenTargetCommand extends data.CommandBasic {
    constructor() {
        super(data.context, data.config.command.OPEN_TARGET);
    }
    Func() {
        vscode.window.showInformationMessage("TARGET", "YES");
    }
}
export class OpenBackendCommand extends data.CommandBasic {
    constructor() {
        super(data.context, data.config.command.OPEN_BACKEND);
    }
    Func() {
        vscode.window.showInformationMessage("BACKEND", "YES");
    }
}

export class ShowReportCommand extends data.CommandBasic {
    constructor() {
        super(data.context, data.config.command.SHOW_REPORT);
    }
    Func() {
        vscode.window.showInformationMessage("SHOW REPORT", "YES");
    }
}
