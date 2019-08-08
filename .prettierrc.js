module.exports = {
  parser: 'babylon',
  semi: true,
  singleQuote: true,
  printWidth: 100,
  trailingComma: 'all',
  overrides: [
    {
      files: '*.{css,scss,less,styl}',
      options: {
        parser: 'css',
        tabWidth: 2,
      },
    },
    {
      files: '*.{ts,tsx}',
      options: {
        parser: 'typescript',
      },
    },
  ],
};
