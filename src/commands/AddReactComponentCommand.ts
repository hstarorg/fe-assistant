import * as path from 'path';
import { stringUtil } from '../utils';
import { bizCommon } from '@/common';
import { ICommand } from './ICommand';

const componentTsxTemplate = require('../templates/react-component-tsx.art');

export class AddReactComponentCommand implements ICommand {
  /**
   * 创建文件
   * @param cmdContext
   */
  createFiles(dir: string, inputValue: string) {
    const name = stringUtil.toCamelCase(inputValue, true);
    const varName = `${name[0].toLowerCase()}${name.slice(1)}`;
    const tsxFilepath = path.join(dir, `${name}.tsx`);
    const lessFilepath = path.join(dir, `${name}.less`);
    const data = {
      name,
      varName,
    };
    try {
      // <pageName>.tsx
      bizCommon.writeTemplateFile(tsxFilepath, data, componentTsxTemplate);
      // <pageName>.less
      bizCommon.writeLessFile(lessFilepath, data);
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e && e.message);
    }
  }

  async execute(args: any) {
    const cwd = bizCommon.getCurrentWorkDir(args.fsPath);
    try {
      const inputValue = await bizCommon.showInputBox();
      // 创建文件
      await this.createFiles(cwd, inputValue);
    } catch (e) {
      throw e;
    }
  }
}
