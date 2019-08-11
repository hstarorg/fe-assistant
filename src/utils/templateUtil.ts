// import * as artTemplate from 'art-template';

export const templateUtil = {
  /**
   * 编译模板
   * @param templateText
   * @param model
   */
  renderToString(template: any, model: any) {
    // return templateText;
    return template({ model });
  },
};
