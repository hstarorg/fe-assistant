import { vscodeUtil } from '@/utils';
import * as fse from 'fs-extra';
import * as path from 'path';
import { workspace } from 'vscode';
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
    // TODO: How to find the root dir?
    try {
      if (!args.fsPath) {
        vscodeUtil.info('请在项目目录或文件上右键');
        return;
      }
      // 找到应用列表
      const apps = (workspace.workspaceFolders || []).map((x) => ({
        name: x.name,
        path: x.uri.path,
      }));

      let targetAppDir!: string;

      // 如果只有 1 个，则直接清理
      if (apps.length === 1) {
        targetAppDir = apps[0].path;
      } else {
        // 多个时，找到是子集的那个
        const curApp = apps.find((x) => args.fsPath.startsWith(x.path));
        if (curApp) {
          targetAppDir = curApp.path;
        }
      }

      if (!targetAppDir) {
        console.log('未找到项目目录', args.fsPath);
        return;
      }
      console.log('已找到项目目录', targetAppDir);

      // 执行清理动作
      for (let cachePath of [
        'node_modules/.cache',
        'src/.umi',
        'src/.umi-test',
        'src/.umi-production',
      ]) {
        const fullCachePath = path.join(targetAppDir, cachePath);
        if (fse.pathExistsSync(fullCachePath)) {
          try {
            // rm -rf
            fse.rm(fullCachePath, { recursive: true, force: true });
          } catch (ex) {
            console.error(ex);
          }
        }
      }
      vscodeUtil.info('清理 umi 缓存完毕');
    } catch (e) {
      console.error(e);
      return e;
    }
  }
}
