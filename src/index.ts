import loader = require('./loader');
import convert from './convert';
import parse from './parse';

module.exports = loader;
export default loader;
export * from './decls';
export { convert, parse };
