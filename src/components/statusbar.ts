import * as vscode from "vscode";
import * as store from "./store";
import * as configs from "../configs/config.json";
import { extensionPath } from "./store";
import path from "path";

interface BarConfig {
    alignment?: vscode.StatusBarAlignment;
    priority?: number;
    title: string;
    command: string;
    show: boolean;
}

function BarInfo(key: store.ConfigKey): BarConfig {
    let config = store.GetConfigValue(key);
    let result: BarConfig = {
        alignment:
            config.bar.alignment === "left"
                ? vscode.StatusBarAlignment.Left
                : vscode.StatusBarAlignment.Right,
        priority: config.bar.priority,
        title: config.bar.status[0].title,
        command: config.key,
        show: true,
    };
    return result;
}

export class SetEnvBar extends store.BarClass {
    constructor() {
        let barConfig: BarConfig = BarInfo(store.ConfigKey.SetEnv);
        super(barConfig.alignment, barConfig.priority);
        this.setBar(barConfig.command, barConfig.title, barConfig.show);
    }
}

export class BuildBackendBar extends store.BarClass {
    constructor() {
        let barConfig: BarConfig = BarInfo(store.ConfigKey.BuildBackend);
        super(barConfig.alignment, barConfig.priority);
        this.setBar(barConfig.command, barConfig.title, barConfig.show);
    }
}

export class BuildTargetBar extends store.BarClass {
    constructor() {
        let barConfig: BarConfig = BarInfo(store.ConfigKey.BuildTarget);
        super(barConfig.alignment, barConfig.priority);
        this.setBar(barConfig.command, barConfig.title, barConfig.show);
    }
}

export class OpenFileBar extends store.BarClass {
    constructor() {
        let barConfig: BarConfig = BarInfo(store.ConfigKey.OpenFile);
        super(barConfig.alignment, barConfig.priority);
        this.setBar(barConfig.command, barConfig.title, barConfig.show);
    }
}
