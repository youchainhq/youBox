# `@youbox/external-compile`

Package to enable YOUBox to run arbitrary commands as part of compilation.

## Configuration

In your YOUBox config (`youbox-config.js`):

```javascript
module.exports = {
  compilers: {
    external: {
      command: "<compilation-command>",
      targets: [{
        path: "<relative/globbed/path/to/outputs/*.output>",
        command: "<artifact-generation-command>"
      }]
    }
  }
}
```
