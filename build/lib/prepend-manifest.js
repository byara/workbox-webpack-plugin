const swBuild = require("@anilanar/workbox-build");
const path = require("path");
const BasePlugin = require("./base-plugin");
const errors = require("./errors");

/**
 * An instance of this plugin prepends a file with the manifest assigned to
 * `self.__file_manifest`. The manifest is generated using
 * [workbox-build:getFileManifestEntries]{@link
 * module:workbox-build.getFileManifestEntries}.
 *
 * @memberof module:workbox-webpack-plugin
 */
class PrependManifestPlugin extends BasePlugin {
  /**
   * Create a new instance of `PrependManifestPlugin`.
   *
   * @param {Object} [config] All the options as passed to
   * [workbox-build:getFileManifestEntries]{@link
   * module:workbox-build.injectManifest}. See
   * [workbox-build:getFileManifestEntries]{@link
   * module:workbox-build.injectManifest} for all possible options.
   * @param {String} [config.swSrc] When invalid, compilation throws an error.
   * @param {String} [config.swDest] Defaults to `%{outputPath}/sw.js`.
   */
  constructor(config) {
    super(config);
  }
  /**
   * @private
   * @param {Object} compilation The [compilation](https://github.com/webpack/docs/wiki/how-to-write-a-plugin#accessing-the-compilation),
   * passed from Webpack to this plugin.
   * @throws Throws an error if `swSrc` option is invalid.
   * @return {Object} The configuration for a given compilation.
   */
  getConfig(compilation) {
    const config = super.getConfig(compilation);

    if (!config.swSrc) {
      throw new Error(errors["invalid-sw-src"]);
    }

    if (!config.swDest) {
      config.swDest = path.join(compilation.options.output.path, "sw.js");
    }

    return config;
  }
  /**
   * This method uses [workbox-build:injectManifest]{
   * @link module:workbox-build.injectManifest} to generate a manifest file.
   *
   * @private
   * @param {Object} compilation The [compilation](https://github.com/webpack/docs/wiki/how-to-write-a-plugin#accessing-the-compilation),
   * @param {Function} [callback] function that must be invoked when handler
   * finishes running.
   */
  handleAfterEmit(compilation, callback) {
    try {
      const config = this.getConfig(compilation);
      swBuild
        .prependManifest(config)
        .then(() => callback())
        .catch(e => callback(e));
    } catch (e) {
      callback(e);
    }
  }
}

module.exports = PrependManifestPlugin;
