const fs = require('fs');
const source = fs.readFileSync('src/id-nfx.js', 'utf8');

// UMD Build
const umd = `(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.NFXProvider = factory();
    }
}(typeof self !== 'undefined' ? self : this, function() {
    ${source}
    return NFXProvider;
}));`;

// ESM Build
const esm = source.replace("module.exports", "export");

fs.writeFileSync('dist/id-nfx.umd.js', umd);
fs.writeFileSync('dist/id-nfx.esm.js', esm);
fs.writeFileSync('dist/id-nfx.min.js', umd); // Minified later via terser

console.log('Built id-nfx packages');