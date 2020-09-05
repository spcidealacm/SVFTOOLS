import * as vscode from "vscode";
import * as data from "../data";
import * as fs from "fs";
import { execSync } from "child_process";
import * as modelCommand from "../model/command";

export { modelCommand };

export class OpenTargetCommand extends modelCommand.OpenFileCommand {
    constructor() {
        super(data.config.command.OPEN_TARGET);
    }
    Func() {
        let targetInfo = data.config.getPathInfo(data.PathType.TARGET_PATH); // get target info
        console.log("targetInfo:", targetInfo);
        if (targetInfo) {
            // if file no exit
            if (!fs.existsSync(targetInfo.mainFile)) {
                // get example info
                let exampleInfo = data.config.getPathInfo(
                    data.PathType.EXAMPLE_PATH
                );
                // copy example file to target
                this.Copy(exampleInfo.mainFile, targetInfo.mainFile);
            }
            // if folder is not target
            if (targetInfo.folder !== data.rootPath()) {
                console.log(targetInfo.folder);
                console.log(data.rootPath());
                execSync(`touch ${targetInfo.openFlag}`); // create open target flag
                this.ShowFolderOnWorkspace(targetInfo.folder); // open target folder
            } else {
                if (fs.existsSync(targetInfo.openFlag)) {
                    execSync(`rm ${targetInfo.openFlag}`); // delete open target flag
                }
                this.ShowFileInTextDoc(targetInfo.mainFile); // open target file
            }
        }
    }
}
export class OpenBackendCommand extends modelCommand.OpenFileCommand {
    constructor() {
        super(data.config.command.OPEN_BACKEND);
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
