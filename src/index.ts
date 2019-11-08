import loader = require('./loader');
import convert from './convert';
import parse from './parse';

const main = Object.assign(loader, { convert, parse });
module.exports = main;
export default loader as typeof main;
export * from './decls';
export { convert, parse };
