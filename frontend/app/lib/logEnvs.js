/* eslint no-console:0 */
export default (title) => {
  const titleArgs = __CLIENT__ ? [`%c ENVs: ${title}`, 'color: green'] : [`ENVs: ${title}`];
  console.group(...titleArgs);
  console.log('\t__CLIENT__', __CLIENT__);
  console.log('\t__SERVER__', __SERVER__);
  console.log('\t__DEVELOPMENT__', __DEVELOPMENT__);
  console.groupEnd(...titleArgs);
};
