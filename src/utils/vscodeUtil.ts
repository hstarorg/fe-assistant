import { window } from 'vscode';

function info(msg: string) {
  window.showInformationMessage(`fea: ${msg}`, '关闭');
}

export const vscodeUtil = { info };
