const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const http = require('http');
const postCssPlugin = require('./tools/postcss-plugin.js');
const tailwindPlugin = require('tailwindcss');
const tailwindConfig = require('./tailwind.config.js');
const autoprefixer = require('autoprefixer');

const { name, version } = require('./package.json');

const cwd = process.cwd();

/* Src configs */
const srcPath = `${cwd}/src`;
const entryFilePath = `${srcPath}/index.tsx`;
const publicPath = `${cwd}/public`;
const templateFilePath = `${publicPath}/index.html`;

/* Dist configs */
const distPath = `${cwd}/dist`;
const bundleFilePath = `${distPath}/app.js`;
const cssFilePath = `${distPath}/app.css`;

/* Serve configs */
const servePort = parseInt(process.env.PORT || process.env.APP_PORT || 8080, 10);

/* Utils */

const verbose = true; // Use for debug

const log = {
  trace: (...args) => verbose && console.log('[*]:', ...args),
  debug: (...args) => verbose && console.log('[-]:', ...args),
  info: (...args) => console.log('[+]:', ...args),
  err: (...args) => console.error(...args),
};

const openUrl = url => {
  const startCmd = process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open';
  require('child_process').exec(startCmd + ' ' + url);
};

/* Params */

const getParams = () => {
  const params = { watch: false, serve: false, open: false, sourcemap: false };
  const args = process.argv.slice(2, process.argv.length);
  for (const arg of args) {
    if (arg === '--watch' || arg === '-w') params.watch = true;
    if (arg === '--serve') params.serve = true;
    if (arg === '--open') params.open = true;
    if (arg === '--sourcemap') params.sourcemap = true;
  }
  return params;
};

/* Envs */

const getEnvName = () => {
  const nodeEnv = process.env.NODE_ENV;
  if (nodeEnv) {
    const modNodeEnv = nodeEnv.toLowerCase();
    if (['dev', 'develop', 'development'].includes(modNodeEnv)) return 'development';
    if (['prd', 'prod', 'production'].includes(modNodeEnv)) return 'production';
  }
  return 'production';
};

const getEnvValue = (key, defaultValue) => {
  const envValue = process.env[key];
  if (envValue) return envValue;
  const envFileParams = getEnvFileParams();
  if (envFileParams[key]) return envFileParams[key];
  if (defaultValue) return defaultValue;
  throw new Error(`Env ${key} not found`);
};

const getEnvFileParams = () => {
  if (!fs.existsSync('.env')) return {};
  const content = fs.readFileSync('.env', 'utf8');
  const lines = content.split('\n');
  const params = {};
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line.startsWith('#')) continue;
    const [key, value] = line.split('=');
    params[key] = value;
  }
  return params;
};

/* Files */

const getFileHash = async filename =>
  new Promise((resolve, reject) => {
    const md5sum = crypto.createHash('md5');
    const s = fs.ReadStream(filename);
    s.on('data', d => md5sum.update(d));
    s.on('end', () => resolve(md5sum.digest('hex')));
    s.on('error', err => reject(err));
  });

const mkdirp = folderPath => fs.mkdirSync(folderPath, { recursive: true });

const mkdirpWithFilePath = filePath => mkdirp(path.parse(filePath).dir);

const listFilesInFolder = (folderPath, extensions) => {
  const res = [];
  const items = fs.readdirSync(folderPath);
  for (const item of items) {
    const itemPath = path.resolve(folderPath, item);
    const stat = fs.statSync(itemPath);
    if (stat.isDirectory()) {
      const newItems = listFilesInFolder(itemPath, extensions);
      res.push(...newItems);
    } else if (isFileExtensionInList(itemPath, extensions)) {
      res.push(itemPath);
    }
  }
  return res;
};

const copyFilesInFolder = (srcFolder, distFolder, extensions) => {
  const filePaths = listFilesInFolder(srcFolder, extensions);
  for (const filePath of filePaths) {
    const newFilePath = filePath.replace(srcFolder, distFolder);
    log.debug(`copy "${filePath.replace(cwd, '')}" to "${newFilePath.replace(cwd, '')}"`);
    mkdirpWithFilePath(newFilePath);
    fs.copyFileSync(filePath, newFilePath);
  }
};

const isFileExtensionInList = (filePath, extensions) => {
  if (!extensions) return true;
  const ext = path.extname(filePath);
  if (!ext) return false;
  return extensions.includes(ext.substring(1).toLocaleLowerCase());
};

/* Template */

const getTemplateHtml = (opt) => {
  let html = fs.readFileSync(templateFilePath, 'utf8');
  if (opt.title) html = html.replace(/<title>.*<\/title>/, `<title>${opt.title}</title>`);
  if (opt.description) html = html.replace(/<meta name="description" content=".*">/, `<meta name="description" content="${opt.description}">`);
  if (opt.cssFilePath) html = html.replace(/<link rel="stylesheet" href="\/app.css">/, `<link rel="stylesheet" href="${opt.cssFilePath}">`);
  if (opt.jsFilePath) html = html.replace(/<script src="\/app.js"><\/script>/, `<script src="${opt.jsFilePath}"></script>`);
  return html;
};

/* Serve */

const serve = async (servedir, serverport, buildOptions) => {
  const ctx = await esbuild.context(buildOptions);
  const { host, port } = await ctx.serve({ servedir });

  http.createServer((req, res) => {
    const forwardRequest = path => {
      const options = {
        hostname: host,
        port,
        path,
        method: req.method,
        headers: req.headers,
      };

      const proxyReq = http.request(options, proxyRes => {
        if (proxyRes.statusCode === 404) {
          return forwardRequest('/');
        }
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
      });
      req.pipe(proxyReq, { end: true });
    };
    forwardRequest(req.url);
  }).listen(serverport);
};

/* Run */

const run = async () => {
  const params = getParams();
  log.debug('params=', params);

  const env = getEnvName();
  log.debug('env=', env);

  log.info('copy public files');
  copyFilesInFolder(`${cwd}/public`, distPath, ['ico', 'js', 'png', 'json', 'svg', 'jpg', 'jpeg', 'txt', 'xml']);

  const buildOptions = {
    entryPoints: [entryFilePath],
    bundle: true,
    sourcemap: env !== 'production' || params.sourcemap,
    minify: env === 'production',
    outfile: bundleFilePath,
    publicPath: '/',
    loader: {
      '.png': 'file',
      '.jpg': 'file',
      '.svg': 'text',
      '.md': 'text',
    },
    define: {
      'APP_ENV': JSON.stringify(env),
      'APP_NAME': JSON.stringify(name),
      'APP_VERSION': JSON.stringify(version),
      'MAPS_API_KEY': JSON.stringify(getEnvValue('MAPS_API_KEY')),
    },
    plugins: [
      postCssPlugin({ plugins: [tailwindPlugin(tailwindConfig), autoprefixer] }),
    ],
  };

  if (params.serve) {
    // Serve mode
    log.info('generating index.html');
    fs.mkdirSync(distPath, { recursive: true });
    fs.writeFileSync(`${distPath}/index.html`, getTemplateHtml({}));
    log.info('generating index.html done');

    log.info(`start serving at http://localhost:${servePort}/`);
    serve(distPath, servePort, { ...buildOptions, sourcemap: 'inline', minify: false });
    if (params.open) {
      log.info(`open browser at http://localhost:${servePort}/`);
      openUrl(`http://localhost:${servePort}/`);
    }
  } else {
    // Dist mode
    log.info('bundle js');
    await esbuild.build(buildOptions);
    log.info('bundle js done');

    log.info('getting bundle hash');
    const bundleHash = (await getFileHash(bundleFilePath)).slice(0, 10);
    log.info(`getting bundle hash done, ` + bundleHash);

    log.info('getting css hash');
    const cssHash = (await getFileHash(cssFilePath)).slice(0, 10);
    log.info(`getting css hash done, ` + cssHash);

    log.info('generating index.html');
    fs.mkdirSync(distPath, { recursive: true });
    fs.writeFileSync(`${distPath}/index.html`, getTemplateHtml({
      jsFilePath: `/app.js?${bundleHash}`,
      cssFilePath: `/app.css?${cssHash}`,
    }));
    log.info('generating index.html done');
  }
};

run().catch(err => {
  log.err(err);
  process.exit(1);
});

