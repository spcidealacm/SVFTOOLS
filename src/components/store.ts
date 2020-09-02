import * as vscode from "vscode";
import * as configs from "../configs/config.json";

export let context: vscode.ExtensionContext;

export function setContext(value: vscode.ExtensionContext) {
    context = value;
}

export let extensionPath = function () {
    return context.extensionPath;
};

export let rootPath = function () {
    return vscode.workspace.rootPath;
};

export class CommandClass {
    constructor(private cmd: string, private exeFunc?: Function) {
        this.registerCommand();
    }
    protected registerCommand() {
        let disposable: vscode.Disposable = vscode.commands.registerCommand(
            this.cmd,
            () => {
                this.exeFunc ? this.exeFunc() : this.Func();
            }
        );
        context.subscriptions.push(disposable);
    }

    protected Func() {}
}

export interface CommandElement {
    key: string;
    commandElement: CommandClass;
}

export class CommandArray {
    private list = new Array<CommandElement>();
    public create(key: string, cmd: string, exeFunc: Function) {
        if (this.find(key)) {
            return undefined;
        }
        let commandElement = new CommandClass(cmd, exeFunc);
        let item = { key: key, commandElement: commandElement };
        this.list.push(item);
        return commandElement;
    }
    public generate(key: string, instance: CommandClass) {
        if (this.find(key)) {
            return -1;
        }
        let item = { key: key, commandElement: instance };
        this.list.push(item);
        return this.list.length;
    }
    public find(key: string) {
        let flag = undefined;
        this.list.some((element) => {
            if (element.key === key) {
                flag = element.commandElement;
                return true;
            }
        });
        return flag;
    }
    public exist(key: string): boolean {
        let flag = false;
        this.list.some((element) => {
            if (element.key === key) {
                flag = true;
                return true;
            }
        });
        return flag;
    }
}

export class BarClass {
    protected readonly bar: vscode.StatusBarItem;
    constructor(alignment?: vscode.StatusBarAlignment, priority?: number) {
        this.bar = vscode.window.createStatusBarItem(alignment, priority);
        context.subscriptions.push(this.bar);
    }

    public setCommand(command: string | vscode.Command | undefined) {
        this.bar.command = command;
    }

    public setTitle(text: string) {
        this.bar.text = text;
    }

    public setColor(color: string | vscode.ThemeColor | undefined) {
        this.bar.color = color;
    }

    public setShow(show: boolean) {
        show ? this.bar.show() : this.bar.hide();
    }

    public setBar(
        command?: string | vscode.Command,
        title?: string,
        show?: boolean,
        color?: string | vscode.ThemeColor
    ) {
        if (command) {
            this.setCommand(command);
        }
        if (title) {
            this.setTitle(title);
        }
        if (color) {
            this.setColor(color);
        }
        if (show !== undefined) {
            this.setShow(show);
        }
    }
}

export interface BarElement {
    key: string;
    barElement: BarClass;
}

export class BarArray {
    private list = new Array<BarElement>();
    constructor() {}

    public create(
        key: string,
        alignment?: vscode.StatusBarAlignment,
        priority?: number
    ) {
        if (this.find(key)) {
            return undefined;
        }
        let bar = new BarClass(alignment, priority);
        let item = { key: key, barElement: bar };
        this.list.push(item);
        return bar;
    }

    public generate(key: string, instance: BarClass) {
        if (this.find(key)) {
            return -1;
        }
        let item = { key: key, barElement: instance };
        this.list.push(item);
        return this.list.length;
    }
    public find(key: string) {
        let flag = undefined;
        this.list.some((element) => {
            if (element.key === key) {
                flag = element.barElement;
                return true;
            }
        });
        return flag;
    }
    public exist(key: string): boolean {
        let flag = false;
        this.list.some((element) => {
            if (element.key === key) {
                flag = true;
                return true;
            }
        });
        return flag;
    }
    public hide(key: string) {
        let flag = false;
        this.list.some((element) => {
            if (element.key === key) {
                element.barElement.setShow(false);
                flag = true;
                return true;
            }
        });
        return flag;
    }
    public show(key: string) {
        let flag = false;
        this.list.some((element) => {
            if (element.key === key) {
                element.barElement.setShow(true);
                flag = true;
                return true;
            }
        });
        return flag;
    }
}

export interface TerminalElement {
    name: string;
    terminal: vscode.Terminal;
}

export class TerminalArray {
    private list = new Array<TerminalElement>();
    constructor() {
        vscode.window.onDidCloseTerminal((terminal) => {
            this.delete(terminal.name);
        });
    }

    public create(key: string) {
        if (this.exist(key)) {
            return this.find(key);
        }
        let terminal = vscode.window.createTerminal(key);
        let item = { name: key, terminal: terminal };
        this.list.push(item);
        return terminal;
    }

    public generate(key: string, instance: vscode.Terminal) {
        if (this.exist(key)) {
            return this.find(key);
        }
        let item = { name: key, terminal: instance };
        this.list.push(item);
        return this.list.length;
    }

    public find(key: string) {
        let flag = undefined;
        this.list.some((element) => {
            if (element.name === key) {
                flag = element.terminal;
                return true;
            }
        });
        return flag;
    }

    public exist(key: string): boolean {
        let flag = false;
        this.list.some((element) => {
            if (element.name === key) {
                flag = true;
                return true;
            }
        });
        console.log(`exist ${flag}: ${key}`);
        return flag;
    }

    public delete(key: string) {
        let flag = false;
        this.list.some((element) => {
            if (element.name === key) {
                element.terminal.dispose();
                let newList = this.list.filter((element) => {
                    return element.name !== key;
                });
                delete this.list;
                this.list = newList;
                flag = true;
                return true;
            }
        });
        return flag;
    }
}
export let command = new CommandArray();
export let statusbar = new BarArray();
export let terminal = new TerminalArray();

export enum ConfigKey {
    SetEnv,
    BuildBackend,
    BuildTarget,
    OpenFile,
}

let ConfigDic = [
    {
        key: ConfigKey.SetEnv,
        value: configs.command["SVFTOOLS.INSTALL.ENV"],
    },
    {
        key: ConfigKey.BuildBackend,
        value: configs.command["SVFTOOLS.BUILD.BACKEND"],
    },
    {
        key: ConfigKey.BuildTarget,
        value: configs.command["SVFTOOLS.BUILD.TARGET"],
    },
    {
        key: ConfigKey.OpenFile,
        value: configs.command["SVFTOOLS.OPEN"],
    },
];

export function GetConfigValue(key: ConfigKey) {
    return ConfigDic.filter((element) => {
        return element.key === key;
    })[0].value;
}

export let Key = {
    SetEnv: GetConfigValue(ConfigKey.SetEnv).key,
    BuildBackend: GetConfigValue(ConfigKey.BuildBackend).key,
    BuildTarget: GetConfigValue(ConfigKey.BuildTarget).key,
    OpenFile: GetConfigValue(ConfigKey.OpenFile).key,
};

export let Bar = {
    SetEnv: GetConfigValue(ConfigKey.SetEnv).bar,
    BuildBackend: GetConfigValue(ConfigKey.BuildBackend).bar,
    BuildTarget: GetConfigValue(ConfigKey.BuildTarget).bar,
    OpenFile: GetConfigValue(ConfigKey.OpenFile).bar,
};

export let Terminal = {
    SetEnv: GetConfigValue(ConfigKey.SetEnv).terminal,
    BuildBackend: GetConfigValue(ConfigKey.BuildBackend).terminal,
    BuildTarget: GetConfigValue(ConfigKey.BuildTarget).terminal,
    OpenFile: GetConfigValue(ConfigKey.OpenFile).terminal,
};
