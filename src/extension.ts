import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "SVFTOOLS" is now active!');

	let disposable = vscode.commands.registerCommand('SVFTOOLS.helloWorld', () => {

		vscode.window.showInformationMessage('Hello World from SVFTOOLS!');
	});

	context.subscriptions.push(disposable);
}
export function deactivate() {}
