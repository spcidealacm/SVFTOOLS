import * as vscode from "vscode";
import * as data from "../data";
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

interface TerInfo {
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
            title: info.key,
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
    Func() { }
    ShowFolderOnWorkspace(folderPath: string) {
        if (fs.existsSync(folderPath)) {
            let stat = fs.statSync(folderPath);
            if (stat.isDirectory()) {
                let uri = vscode.Uri.file(folderPath);
                vscode.commands.executeCommand("vscode.openFolder", uri);
            }
        }
    }
    ShowFileInTextDoc(filePath: string) {
        vscode.commands.executeCommand("workbench.files.action.focusFilesExplorer");
        data.mterminal.hide();
        if (fs.existsSync(filePath)) {
            let stat = fs.statSync(filePath);
            if (stat.isFile()) {
                vscode.window.showTextDocument(vscode.Uri.file(filePath));
            }
        }
    }
    CreateFolder(folderPath: string) {
        if (!fs.existsSync(folderPath)) {
            let upFolderPath = path.resolve(folderPath, "..");
            if (!fs.existsSync(upFolderPath)) {
                this.CreateFolder(upFolderPath);
            } else {
                fs.mkdirSync(folderPath);
            }
        }
    }
    CreateFile(filePath: string) {
        if (!fs.existsSync(filePath)) {
            let folderPath = path.resolve(filePath, "..");
            this.CreateFolder(folderPath);
        }
        fs.writeFileSync(filePath, "");
    }
    Copy(from: string, to: string) {
        if (fs.existsSync(from)) {
            let upFolder = path.resolve(to, "..");
            this.CreateFolder(upFolder);
            execSync(`cp -rf ${from} ${to}`);
        } else {
            console.log(`[ERROR]: CopyFile form: ${from} is not exist`);
        }
    }
    Delete(thePath: string) {
        if (fs.existsSync(thePath)) {
            execSync(`rm -rf ${thePath}`);
        }
    }
}
