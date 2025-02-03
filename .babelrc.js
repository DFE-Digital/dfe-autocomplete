module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        corejs: 3,
        shippedProposals: true,
        useBuiltIns: 'usage',
        loose: true
      }
    ]
  ],
  plugins: [
    ['@babel/plugin-transform-class-properties', { loose: true }],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-transform-react-jsx', { pragma: 'h' }],

    // Improve legacy IE compatibility
    ['@babel/plugin-transform-modules-commonjs', { loose: true }],
    '@babel/plugin-transform-member-expression-literals',
    '@babel/plugin-transform-property-literals'
  ]
}
