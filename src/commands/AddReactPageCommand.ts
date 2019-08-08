import { window, workspace, TextEditor } from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

type AddReactPageCommandContext = {
  clickedFolderPath: string;
  folderName?: string;
  dir?: string;
};

export class AddReactPageCommand {
  /**
   * 输入目录名
   * @param args
   */
  public showFileNameDialog(args: { fsPath: string }): Promise<AddReactPageCommandContext> {
    const clickedFolderPath = args.fsPath;
    const newFolderPath: string = fs.lstatSync(clickedFolderPath).isDirectory()
      ? clickedFolderPath
      : path.dirname(clickedFolderPath);
    const cmdContext: AddReactPageCommandContext = {
      clickedFolderPath: newFolderPath,
    };

    if (workspace.rootPath === undefined) {
      return Promise.reject('Please open a project first. Thanks! :-)');
    } else {
      return new Promise((resolve, reject) => {
        window
          .showInputBox({
            prompt: "What's the name of the new folder?",
            value: 'folder',
          })
          .then(fileName => {
            if (!fileName || /[~`!#$%\^&*+=\[\]\\';,/{}|\\":<>\?\s]/g.test(fileName)) {
              return reject("That's not a valid name! (no whitespaces or special characters)");
            }
            cmdContext.folderName = fileName;
            resolve(cmdContext);
          });
      });
    }
  }

  /**
   * 创建目录
   */
  createFolder(cmdContext: AddReactPageCommandContext) {
    const dir = path.join(cmdContext.clickedFolderPath, cmdContext.folderName!);
    return util
      .promisify(fs.mkdir)(dir)
      .then(() => {
        cmdContext.dir = dir;
        return cmdContext;
      });
  }

  /**
   * 创建文件
   * @param cmdContext
   */
  createFiles(cmdContext: AddReactPageCommandContext) {
    return Promise.resolve();
  }
}
