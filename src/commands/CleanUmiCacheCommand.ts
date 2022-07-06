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
    console.log(args, cwd);
    // TODO: How to find the root dir?
    try {

    } catch (e) {
      return e;
    }
  }
}
