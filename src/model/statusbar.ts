import * as vscode from "vscode";
import * as data from "../data";

interface BarConfig {
    alignment?: vscode.StatusBarAlignment;
    priority?: number;
    title: string;
    command: string;
    show: boolean;
}
function getInfo(command: string) {
    let info = data.config.getStatusbarInfoFromCommand(command)[0];
    let barInfo: BarConfig = {
        alignment: info.alignment,
        priority: info.priority,
        title: info.status[0].title,
        command: info.command,
        show: true,
    };
    return barInfo;
}
export class SetEnvBar extends data.BarBasic {
    constructor() {
        let barInfo = getInfo(data.config.command.INSTALL_ENV);
        super(data.context, barInfo.alignment, barInfo.priority);
        this.setBar(barInfo.command, barInfo.title, barInfo.show);
    }
}
export class BuildBackendBar extends data.BarBasic {
    constructor() {
        let barInfo = getInfo(data.config.command.BUILD_BACKEND);
        super(data.context, barInfo.alignment, barInfo.priority);
        this.setBar(barInfo.command, barInfo.title, barInfo.show);
    }
}
export class BuildTargetBar extends data.BarBasic {
    constructor() {
        let barInfo = getInfo(data.config.command.BUILD_TARGET);
        super(data.context, barInfo.alignment, barInfo.priority);
        this.setBar(barInfo.command, barInfo.title, barInfo.show);
    }
}
export class OpenTargetBar extends data.BarBasic {
    constructor() {
        let barInfo = getInfo(data.config.command.OPEN_TARGET);
        super(data.context, barInfo.alignment, barInfo.priority);
        this.setBar(barInfo.command, barInfo.title, barInfo.show);
    }
}
export class OpenBackendBar extends data.BarBasic {
    constructor() {
        let barInfo = getInfo(data.config.command.OPEN_BACKEND);
        super(data.context, barInfo.alignment, barInfo.priority);
        this.setBar(barInfo.command, barInfo.title, barInfo.show);
    }
}

export class ShowReportBar extends data.BarBasic {
    constructor() {
        let barInfo = getInfo(data.config.command.SHOW_REPORT);
        super(data.context, barInfo.alignment, barInfo.priority);
        this.setBar(barInfo.command, barInfo.title, barInfo.show);
    }
}
