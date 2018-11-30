const model = 'model.py';
const parts = window.location.pathname.split('/');
const isLocal = window && window.location.host.match('local');
const { host, protocol, versionPath } = F.service.URL();

let account = 'forio-dev';
let project = 'battle-arena';
/* eslint-disable no-magic-numbers */
if (parts[1] === 'app') {
    account = parts[2];
    project = parts[3];
}
/* eslint-enable */

const endpoints = {
    root: `${host}/run/${account}/${project}`,
    host: `${host}`,
    isLocal,
    account,
    project,
    model,
    versionPath,
    protocol,
    isDemo: project.endsWith('-demo'),
    isTrial: project.endsWith('-trial'),
};

export default endpoints;
