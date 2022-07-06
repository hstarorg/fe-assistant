import * as fs from 'fs';
import * as path from 'path';
import { window, workspace } from 'vscode';
import { templateUtil, util } from '@/utils';

const lessTemplate = require('../templates/react-less.art');
const modelTemplate = require('../templates/react-model.art');

export const bizCommon = {
  /**
   * 写入 less 文件
   * @param filepath
   * @param data
   */
  writeLessFile(filepath: string, data: { varName: string }) {
    fs.writeFileSync(filepath, templateUtil.renderToString(lessTemplate, data), 'utf8');
  },

  /**
   * 写入 model 文件
   * @param filepath
   * @param data
   */
  writeModelFile(filepath: string, data: { name: string; varName: string }) {
    fs.writeFileSync(filepath, templateUtil.renderToString(modelTemplate, data), 'utf8');
  },

  /**
   * 写入模板文件
   * @param filepath
   * @param data
   */
  writeTemplateFile(filepath: string, data: any, template: any) {
    fs.writeFileSync(filepath, templateUtil.renderToString(template, data), 'utf8');
  },

  /**
   * 获取当前工作目录
   * @param fsPath
   */
  getCurrentWorkDir(fsPath: string): string {
    const cwd: string = fs.lstatSync(fsPath).isDirectory() ? fsPath : path.dirname(fsPath);
    return cwd;
  },

  /**
   * 获取应用根目录
   * @param fsPath
   */
  getRootDir(fsPath: string) {
    let dir = this.getCurrentWorkDir(fsPath);
    do {
      // package.json 是否存在
      const packageJsonExists = fs.existsSync(path.join(dir, 'package.json'));
      // 指定目录存在
      try {
        const dirsExists = ['src', 'node_module']
          .map((x) => {
            const tmpPath = path.join(dir, x);
            // 必须存在且是目录
            return fs.existsSync(tmpPath) && fs.statSync(tmpPath).isDirectory();
          })
          .every((x) => x);
        if (packageJsonExists && dirsExists) {
          return dir;
        }
      } catch (ex) {
        console.log(ex);
      }

      const newDir = path.join(dir, '../');
      // 最终一层
      if (dir === newDir) {
        return null;
      }
      dir = newDir;
    } while (true);
  },

  /**
   * 创建目录
   * @param dirname
   */
  createDir(dirname: string): Promise<string> {
    if (fs.existsSync(dirname)) {
      return Promise.reject('folder exists, please retry');
    }
    return util
      .promisify(fs.mkdir)(dirname)
      .then(() => {
        return dirname;
      });
  },

  /**
   * 获取用户输入
   */
  showInputBox(): Promise<string> {
    if ((workspace.workspaceFolders?.length || 0) === 0) {
      return Promise.reject('Please open a project first. Thanks! :-)');
    } else {
      return new Promise((resolve, reject) => {
        window
          .showInputBox({
            prompt: "What's the name of the new folder?",
            value: 'folder',
          })
          .then((inputValue) => {
            if (!inputValue || /[~`!#$%\^&*+=\[\]\\';,/{}|\\":<>\?\s]/g.test(inputValue)) {
              return reject("That's not a valid name! (no whitespaces or special characters)");
            }
            resolve(inputValue);
          });
      });
    }
  },
};
