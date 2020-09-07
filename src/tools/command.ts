import * as vscode from "vscode";
import * as data from "../data";
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";
import * as modelCommand from "../model/command";

export { modelCommand };

export class InstallSVFEnvironment extends modelCommand.TerminialCommand {
    constructor() {
        super(data.config.command.INSTALL_ENV);
    }
    Func() {
        let backendinfo = data.config.getPathInfo(data.config.pathType.BACKEND_PATH);
        if (fs.existsSync(backendinfo.folder)) {
            vscode.window.showInformationMessage(
                "A backend folder is detected, do you use the original settings? (Note: Note that choosing No will delete the original configuration.)",
                "YES",
                "NO"
            ).then((result) => {
                switch (result) {
                    case "YES":
                        super.Func();
                        break;
                    case "NO":
                        console.log(`time=$(date "+%Y-%m-%d-%H-%M-%S")&&mv ${backendinfo.folder} ${backendinfo.folder}.$time.bak`);
                        let backupFolder = path.join(backendinfo.position, "SVFBackup");
                        if (!fs.existsSync(backupFolder)) {
                            fs.mkdirSync(backupFolder);
                        }
                        let folderName = path.basename(backendinfo.folder);
                        let backupFolderPath = path.join(backupFolder, folderName);
                        console.log(`time=$(date "+%Y-%m-%d-%H-%M-%S")&&mv ${backendinfo.folder} ${backupFolderPath}.$time.bak`);
                        execSync(`time=$(date "+%Y-%m-%d-%H-%M-%S")&&mv ${backendinfo.folder} ${backupFolderPath}.$time.bak`);
                        super.Func();
                        break;
                    default:
                        break;
                }

            });
        } else {
            super.Func();
        }

    }
}

export class OpenTargetCommand extends modelCommand.OpenFileCommand {
    constructor() {
        super(data.config.command.OPEN_TARGET);
    }
    Func() {
        /*{
            "key": "TARGET_PATH"
            "position": user home
            "folder": user home/INPUT_PROJECT
            "mainFile": user home/INPUT_PROJECT/example.c
            "openFlag": extension path/OpenTarget.flag
        }*/

        let targetInfo = data.config.getPathInfo(
            data.config.pathType.TARGET_PATH
        ); // get target info

        console.log("targetInfo:", targetInfo);
        if (targetInfo) {
            // if file no exit
            if (!fs.existsSync(targetInfo.mainFile)) {
                // get example info
                let exampleInfo = data.config.getPathInfo(
                    data.config.pathType.EXAMPLE_PATH
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
        /*{
            "key": "BACKEND_PATH"
            "position": user home
            "folder": user home/SVF-example
            "mainFile": user home/SVF-example/src/svf-ex.cpp
            "openFlag": extension path/OpenSVFEX.flag
        }*/
        let backendInfo = data.config.getPathInfo(
            data.config.pathType.BACKEND_PATH
        );
        let filePath = backendInfo.mainFile;
        if (fs.existsSync(filePath)) {
            this.ShowFileInTextDoc(filePath);
        } else {
            let folderPath = backendInfo.folder;
            if (fs.existsSync(folderPath)) {
                vscode.window
                    .showInformationMessage(
                        "Cannot find main file in backend, do you want to download a new one?",
                        "Yes",
                        "NO"
                    )
                    .then((result) => {
                        if (result === "YES") {
                            execSync(`rm -rf ${folderPath}`);
                            execSync("git clone https://github.com/SVF-tools/SVF-example.git");
                            this.ShowFileInTextDoc(filePath);
                        }
                    });
            } else {
                vscode.window
                    .showInformationMessage(
                        "Cannot find backend folder, do you want to download it?",
                        "Yes",
                        "NO"
                    )
                    .then((result) => {
                        if (result === "YES") {
                            execSync("git clone https://github.com/SVF-tools/SVF-example.git");
                            this.ShowFileInTextDoc(filePath);
                        }
                    });
            }
        }
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