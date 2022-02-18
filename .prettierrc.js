module.exports = {
  semi: false,
  printWidth: 110,
  singleQuote: true,
  trailingComma: 'none',
  overrides: [{ files: '*.vue', options: { printWidth: 99999 } }],
  plugins: [require('prettier-plugin-tailwindcss')]
}
