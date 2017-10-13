#!/usr/bin/env node

/**
 * Define isomorphic constants.
 */
global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';
global.console.group = title => console.log(title); // eslint-disable-line
global.console.groupEnd = () => console.log(''); // eslint-disable-line

// TODO: vyresit pomoci babel transform, webpack iso tools apod.
const hook = require('node-hook');

// ignore types that are not supported server-side
hook.hook('.css', () => {});
hook.hook('.scss', () => {});
hook.hook('.png', () => {});
hook.hook('.jpg', () => {});
hook.hook('.svg', () => {});

require('./server');
