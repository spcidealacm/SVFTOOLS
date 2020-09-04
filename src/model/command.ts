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

export class TerminialCommand extends data.CommandBasic {
    constructor(command: string) {
        super(data.context, command);
    }
    Func() {
        terminal(this.cmd);
    }
}
export class OpenFileCommand extends data.CommandBasic {
    constructor(command: string) {
        super(data.context, command);
    }
    Func() {
        // vscode.window.showInformationMessage("OpenFile", "YES");
    }
}
export class OpenTargetCommand extends OpenFileCommand {
    constructor() {
        super(data.config.command.OPEN_TARGET);
    }
    Func() {
        super.Func();
        vscode.window.showInformationMessage("TARGET", "YES");
    }
}
export class OpenBackendCommand extends OpenFileCommand {
    constructor() {
        super(data.config.command.OPEN_BACKEND);
    }
    Func() {
        super.Func();
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
