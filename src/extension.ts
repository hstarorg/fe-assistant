// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {
  AddReactPageCommand,
  AddReactBlockCommand,
  AddReactComponentCommand,
  CleanUmiCacheCommand,
} from './commands';
import type { CommandCtor } from './commands/ICommand';

function registerCommand(cmdName: string, commandClass: CommandCtor) {
  const disposable = vscode.commands.registerCommand(`extension.${cmdName}`, (args: any) => {
    // The code you place here will be executed every time your command is executed
    const command = new commandClass();
    command.execute(args).catch((message: string) => vscode.window.showErrorMessage(message));
  });
  return disposable;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "FEAssistant" is now active!');

  context.subscriptions.push(
    registerCommand('feaAddReactPage', AddReactPageCommand),
    registerCommand('feaAddReactBlock', AddReactBlockCommand),
    registerCommand('feaAddReactComponent', AddReactComponentCommand),
    registerCommand('feaCleanUmiCache', CleanUmiCacheCommand),
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
