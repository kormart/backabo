export { envs as default };

// const envs = ['hej'];

const fetchEnv = async () => {
    const url = 'http://localhost:1337/sites';
    const res = await fetch(url);
    const data = await res.json();
    envs = data.envs;
    // console.log('***inside fetchEnvs: ', envs);
    return envs;
}

var envs = await fetchEnv();
// thisisnotsecret