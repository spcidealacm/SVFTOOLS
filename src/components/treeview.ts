import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import mkdirp from 'mkdirp';
import rimraf from 'rimraf';

namespace _ {

    function handleResult<T>(resolve: (result: T) => void, reject: (error: Error) => void, error: Error | null | undefined, result: T): void {
        if (error) {
            reject(massageError(error));
        } else {
            resolve(result);
        }
    }

    function massageError(error: Error & { code?: string }): Error {
        if (error.code === 'ENOENT') {
            return vscode.FileSystemError.FileNotFound();
        }

        if (error.code === 'EISDIR') {
            return vscode.FileSystemError.FileIsADirectory();
        }

        if (error.code === 'EEXIST') {
            return vscode.FileSystemError.FileExists();
        }

        if (error.code === 'EPERM' || error.code === 'EACCESS') {
            return vscode.FileSystemError.NoPermissions();
        }

        return error;
    }

    export function checkCancellation(token: vscode.CancellationToken): void {
        if (token.isCancellationRequested) {
            throw new Error('Operation cancelled');
        }
    }

    export function normalizeNFC(items: string): string;
    export function normalizeNFC(items: string[]): string[];
    export function normalizeNFC(items: string | string[]): string | string[] {
        if (process.platform !== 'darwin') {
            return items;
        }

        if (Array.isArray(items)) {
            return items.map(item => item.normalize('NFC'));
        }

        return items.normalize('NFC');
    }

    export function readdir(path: string): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            fs.readdir(path, (error, children) => handleResult(resolve, reject, error, normalizeNFC(children)));
        });
    }

    export function stat(path: string): Promise<fs.Stats> {
        return new Promise<fs.Stats>((resolve, reject) => {
            fs.stat(path, (error, stat) => handleResult(resolve, reject, error, stat));
        });
    }

    export function readfile(path: string): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            fs.readFile(path, (error, buffer) => handleResult(resolve, reject, error, buffer));
        });
    }

    export function writefile(path: string, content: Buffer): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            fs.writeFile(path, content, error => handleResult(resolve, reject, error, void 0));
        });
    }

    export function exists(path: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            fs.exists(path, exists => handleResult(resolve, reject, null, exists));
        });
    }

    export function rmrf(path: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            rimraf(path, error => handleResult(resolve, reject, error, void 0));
        });
    }

    export function mkdir(path: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            mkdirp(path, error => handleResult(resolve, reject, error, void 0));
        });
    }

    export function rename(oldPath: string, newPath: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            fs.rename(oldPath, newPath, error => handleResult(resolve, reject, error, void 0));
        });
    }

    export function unlink(path: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            fs.unlink(path, error => handleResult(resolve, reject, error, void 0));
        });
    }
}

export class FileStat implements vscode.FileStat {

    constructor(private fsStat: fs.Stats) { }

    get type(): vscode.FileType {
        return this.fsStat.isFile() ? vscode.FileType.File : this.fsStat.isDirectory() ? vscode.FileType.Directory : this.fsStat.isSymbolicLink() ? vscode.FileType.SymbolicLink : vscode.FileType.Unknown;
    }

    get isFile(): boolean | undefined {
        return this.fsStat.isFile();
    }

    get isDirectory(): boolean | undefined {
        return this.fsStat.isDirectory();
    }

    get isSymbolicLink(): boolean | undefined {
        return this.fsStat.isSymbolicLink();
    }

    get size(): number {
        return this.fsStat.size;
    }

    get ctime(): number {
        return this.fsStat.ctime.getTime();
    }

    get mtime(): number {
        return this.fsStat.mtime.getTime();
    }
}

interface Entry {
    uri: vscode.Uri;
    type: vscode.FileType;
}

export class FileSystemProvider implements vscode.TreeDataProvider<Entry>, vscode.FileSystemProvider {

}





class NewTreeItem extends vscode.TreeItem {

    constructor(label: string, private _itemPath: string, state?: vscode.TreeItemCollapsibleState, private _itemCommand?: vscode.Command) {
        super(label, state);
    }

    get itemPath(): string {
        return this._itemPath;
    }

    resourceUri = vscode.Uri.file(this.itemPath);
    command = this._itemCommand;
}

class NewTreeDataProvider implements vscode.TreeDataProvider<NewTreeItem> {

    private _onDidChangeTreeData: vscode.EventEmitter<NewTreeItem | undefined | void> = new vscode.EventEmitter<NewTreeItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<NewTreeItem | undefined | void> = this._onDidChangeTreeData.event;

    constructor(private rootPath: string) {

        vscode.commands.registerCommand("fileExplorer.openFile", (resource) =>
            this.openResource(resource)
        );

    }

    private openResource(resource: vscode.Uri): void {
        vscode.window.showTextDocument(resource);
    }

    getTreeItem(element: NewTreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: NewTreeItem): Thenable<NewTreeItem[]> {

        if (!this.rootPath || !fs.existsSync(this.rootPath)) {
            console.log(`NewTreeDataProvider root is ${this.rootPath}`);
            return Promise.resolve([]);
        }

        if (!element) {
            return Promise.resolve(this.getItem(this.rootPath));
        } else {
            return Promise.resolve(this.getItem(element.itemPath));
        }
    }

    isDir(path: string) {

        let stat = fs.statSync(path);

        if (stat.isDirectory()) {
            return true;
        }

        return false;
    }

    getItem(rootPath: string): NewTreeItem[] {

        if (!this.isDir(rootPath)) {
            return [];
        }

        let dir = fs.readdirSync(rootPath);
        let dirTreeItem: NewTreeItem[] = [];

        dir.forEach((itemElement) => {

            const itemPath: string = path.join(rootPath, itemElement);
            const collapsible: vscode.TreeItemCollapsibleState = this.isDir(itemPath) ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None;

            if (this.isDir(itemPath)) {

                dirTreeItem.push(
                    new NewTreeItem(itemElement, itemPath, collapsible)
                );

            } else {

                let command = {
                    command: "fileExplorer.openFile",
                    title: "Open File",
                    arguments: [vscode.Uri.file(itemPath)],
                };

                dirTreeItem.push(
                    new NewTreeItem(itemElement, itemPath, collapsible, command)
                );
            }

        });

        return dirTreeItem;
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }
}

class RgisterTreeDataProvider {

    constructor(id: string, rootPath: string) {
        this.registerTree(id, rootPath);
    }

    registerTree(id: string, rootPath: string) {

        let provider = new NewTreeDataProvider(rootPath);

        vscode.window.createTreeView(id, { treeDataProvider: provider });
        vscode.commands.registerCommand("svfbackend.refreshEntry", () =>
            provider.refresh()
        );

        setInterval(() => {
            provider.refresh();
        }, 1000);

    }
}

export { NewTreeItem, NewTreeDataProvider, RgisterTreeDataProvider };