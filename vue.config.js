module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: [{loader:'vue-inheritance-loader'}],
          // use: [
          //   {
          //     loader: './extension-loader.js',
          //     options: {
          //       // EXT_POINT_TAG: 'extension-point1',
          //       // EXTENSIONS_TAG: 'extensions1',
          //       // EXTENSION_TAG: 'extension1',
          //       // EXT_POINT_NAME_ATTR: 'name1',
          //       // EXT_POINT_REF_ATTR: 'point1',
          //       // EXTENDABLE_ATTR: 'extendable1',
          //       // EXTENDS_ATTR: 'extends1'
          //     }
          //   }
          // ]
        }
      ]
    }
  }
}