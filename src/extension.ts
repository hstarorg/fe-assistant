// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { AddReactPageCommand } from './commands/AddReactPageCommand';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "FEAssistant" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand('extension.feaAddReactPage', (args: any) => {
    // The code you place here will be executed every time your command is executed
    const arpCommand = new AddReactPageCommand();
    arpCommand
      .showFileNameDialog(args)
      .then(arpCommand.createFolder)
      .then(arpCommand.createFiles)
      .catch((message: string) => vscode.window.showErrorMessage(message));
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
