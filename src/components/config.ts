import * as vscode from "vscode";
import * as wconfig from "../configs/configure.json";
import * as store from "./store";
import * as path from "path";
import * as fs from "fs";

export class Data {
    private _command = new Array();
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
        this.analysis(wconfig);
        //test();
    }
    test() {
        let rootPath = store.rootPath();

        if (rootPath) {
            let filePath = path.join(rootPath, "config.json");
            const data1 = JSON.stringify(this.command, null, 4);
            const data2 = JSON.stringify(this.statusbar, null, 4);
            const data3 = JSON.stringify(this.terminal, null, 4);
            const data4 = JSON.stringify(this.webview, null, 4);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            fs.appendFileSync(filePath, data1);
            fs.appendFileSync(filePath, data2);
            fs.appendFileSync(filePath, data3);
            fs.appendFileSync(filePath, data4);
        }
    }
    analysis(config: any) {
        for (let element in config) {
            switch (element) {
                case "command":
                    this._command = config[element];
                    break;
                case "statusbar":
                    this._statusbar = config[element];
                    this.analysisBar(this._statusbar);
                    break;
                case "terminal":
                    this._terminal = config[element];
                    this.analysisTerminal(this._terminal);
                    break;
                case "webview":
                    this._webview = config[element];
                    break;
                default:
                    break;
            }
        }
    }

    public analysisBar(statusbar: any[]) {
        statusbar.forEach((element) => {
            element.alignment =
                element.alignment === "left"
                    ? vscode.StatusBarAlignment.Left
                    : vscode.StatusBarAlignment.Right;
        });
    }

    public analysisTerminal(terminal: any[]) {
        terminal.forEach((element) => {
            element.scriptPath = path.join(
                store.extensionPath(),
                element.scriptPath
            );
        });
    }

    public getTerminial(command: string) {
        return this.terminal.filter((element) => {
            return element.command === command;
        });
    }

    public getStatusbar(command: string) {
        return this.statusbar.filter((element) => {
            return element.command === command;
        });
    }

    public getWebview(command: string) {
        return this.webview.filter((element) => {
            return element.command === command;
        });
    }
}
