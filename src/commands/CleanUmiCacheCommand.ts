import { bizCommon } from '@/common';
import * as path from 'path';
import type { ICommand } from './ICommand';


/**
 * 清理 UMI 的缓存文件
 * node_modules/.cache/
 * src/.umi/
 * src/.umi-test/
 * src/.umi-production/
 */
export class CleanUmiCacheCommand implements ICommand {


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
