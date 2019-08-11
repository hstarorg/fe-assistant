import { window, workspace } from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import { stringUtil, templateUtil } from '../utils';

const pageModelTemplate = require('../templates/react-page-model.art');
const pageTsxTemplate = require('../templates/react-page-tsx.art');
const pageLessTemplate = require('../templates/react-page-less.art');

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
    if (fs.existsSync(dir)) {
      return Promise.reject('folder exists, please retry');
    }
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
    const pageName = stringUtil.toCamelCase(cmdContext.folderName!, true);
    const varPageName = `${pageName[0].toLowerCase()}${pageName.slice(1)}`;
    const pageTsxPath = path.join(cmdContext.dir!, `${pageName}.tsx`);
    const pageLessPath = path.join(cmdContext.dir!, `${pageName}.less`);
    const pageModelPath = path.join(cmdContext.dir!, `model.ts`);
    const data = {
      pageName,
      varPageName,
    };
    try {
      // <pageName>.tsx
      fs.writeFileSync(pageTsxPath, templateUtil.renderToString(pageTsxTemplate, data), 'utf8');
      // <pageName>.less
      fs.writeFileSync(pageLessPath, templateUtil.renderToString(pageLessTemplate, data), 'utf8');
      // model.ts
      fs.writeFileSync(pageModelPath, templateUtil.renderToString(pageModelTemplate, data), 'utf8');
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e && e.message);
    }
  }
}
