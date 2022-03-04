import config from 'config';

const {default:configVariable} = await config.get('variable');

console.debug(configVariable.foo);
