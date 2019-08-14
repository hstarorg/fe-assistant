import * as path from 'path';
import { stringUtil } from '../utils';
import { bizCommon } from '@/common';
import { ICommand } from './ICommand';

const blockTsxTemplate = require('../templates/react-block-tsx.art');

export class AddReactBlockCommand implements ICommand {
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
      // <blockName>.tsx
      bizCommon.writeTemplateFile(tsxFilepath, data, blockTsxTemplate);
      // <blockName>.less
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
      const dir = path.join(cwd, inputValue);
      await bizCommon.createDir(dir);
      // 创建文件
      await this.createFiles(dir, inputValue);
    } catch (e) {
      return e;
    }
  }
}
