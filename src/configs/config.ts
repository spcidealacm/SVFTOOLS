import * as vscode from "vscode";
import * as configInfo from "./config.json";
import * as data from "../data";
import * as path from "path";
import * as fs from "fs";

export class Config {
    private _command = {
        INSTALL_ENV: configInfo.command.INSTALL_ENV,
        OPEN_TARGET: configInfo.command.OPEN_TARGET,
        OPEN_BACKEND: configInfo.command.OPEN_BACKEND,
        BUILD_BACKEND: configInfo.command.BUILD_BACKEND,
        BUILD_TARGET: configInfo.command.BUILD_TARGET,
        SHOW_REPORT: configInfo.command.SHOW_REPORT,
    };
    public get command() {
        return this._command;
    }

    private _statusbar = new Array();
    public get statusbar() {
        return this._statusbar;
    }

    private _terminal = new Array();
    public get terminal() {
        return this._terminal;
    }

    private _webview = new Array();
    public get webview() {
        return this._webview;
    }

    constructor() {
        this.analysis(configInfo);
        this.test();
    }
    private test() {
        let rootPath = data.rootPath();

        if (rootPath) {
            let filePath = path.join(rootPath, "config.json");
            // const data1 = JSON.stringify(this.command, null, 4);
            // const data2 = JSON.stringify(this.statusbar, null, 4);
            const data3 = JSON.stringify(this.terminal, null, 4);
            // const data4 = JSON.stringify(this.webview, null, 4);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            // fs.appendFileSync(filePath, data1);
            // fs.appendFileSync(filePath, data2);
            fs.appendFileSync(filePath, data3);
            // fs.appendFileSync(filePath, data4);
        }
    }
    private analysis(config: any) {
        for (let element in config) {
            switch (element) {
                case "statusbar":
                    this._statusbar = config[element];
                    this.analysisBarInfo(this._statusbar);
                    break;
                case "terminal":
                    this._terminal = config[element];
                    this.analysisTerminalInfo(this._terminal);
                    break;
                case "webview":
                    this._webview = config[element];
                    break;
                default:
                    break;
            }
        }
    }

    public analysisBarInfo(statusbar: any[]) {
        statusbar.forEach((element) => {
            element.alignment =
                element.alignment === "left"
                    ? vscode.StatusBarAlignment.Left
                    : vscode.StatusBarAlignment.Right;
        });
    }

    public analysisTerminalInfo(terminal: any[]) {
        terminal.forEach((element) => {
            element.script = `${element.exeHead} ${path.join(
                data.extensionPath(),
                element.scriptPath
            )}`;
        });
    }

    public getTerminialInfo(key: string) {
        console.log("get Terminial");
        return this.getElementInfo(this.terminal, key);
    }

    public getStatusbarInfo(key: string) {
        console.log("get Statusbar");
        return this.getElementInfo(this.statusbar, key);
    }

    public getWeibviewInfo(key: string) {
        console.log("get Weibview");
        return this.getElementInfo(this.webview, key);
    }

    private getElementInfo(type: any[], key: string) {
        let result = type.filter((element) => {
            return element.key === key;
        });
        switch (result.length) {
            case 0:
                return undefined;
                break;
            case 1:
                return result[0];
                break;
            default:
                console.log(
                    `[ERROR]: getElement key result: ${result} should only one element.`
                );
                return result[0];
                break;
        }
    }

    public getTerminialInfoFromCommand(command: string) {
        return this.getElementInfoFromCommand(this.terminal, command);
    }

    public getStatusbarInfoFromCommand(command: string) {
        return this.getElementInfoFromCommand(this.statusbar, command);
    }

    public getWebviewInfoFromCommand(command: string) {
        return this.getElementInfoFromCommand(this.webview, command);
    }

    public getTerminialKeyFromCommand(command: string) {
        return this.getElementInfoFromCommand(this.terminal, command)[0].key;
    }

    public getStatusbarKeyFromCommand(command: string) {
        return this.getElementInfoFromCommand(this.statusbar, command)[0].key;
    }

    public getWebviewIKeyFromCommand(command: string) {
        return this.getElementInfoFromCommand(this.webview, command)[0].key;
    }

    private getElementInfoFromCommand(type: any[], command: string) {
        return type.filter((element) => {
            return element.command === command;
        });
    }
}