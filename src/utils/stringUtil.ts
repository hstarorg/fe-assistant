export const stringUtil = {
  /**
   * 将字符串转换为驼峰命名
   * @param text 要处理的字符串
   * @param big 是否要转换为大驼峰，默认false
   */
  toCamelCase(text: string, big: boolean = false) {
    return text
      .toLowerCase()
      .split(/ |-/g)
      .map((x, idx) => {
        // 如果不是大驼峰，则第一个单词原样返回
        if (!big && idx === 0) {
          return x;
        }
        return x[0].toUpperCase() + x.slice(1);
      })
      .join('');
  },
};
