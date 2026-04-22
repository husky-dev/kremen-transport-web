const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const http = require('http');
const postCssPlugin = require('./tools/postcssPlugin.js');
const tailwindPlugin = require('@tailwindcss/postcss');
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
  let html = '';
  html += `<!DOCTYPE html>`;
  html += `<html lang="en">`;
  html += `<head>`;
  html += `  <meta charset="UTF-8">`;
  html += `  <title>${opt.title || 'Громадський транспорт Кременчука | #Husky.Dev'}</title>`;
  html += `  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`; 
  html += `  <meta name=description content="${opt.description || 'Карта руху громадського транспорту Кременчука'}"/>`;
  html += `  <meta name="keywords" content="кременчук, автобуси, маршрутки, тролейбуси, громадський транспорт, розклад, карта, мапа" />`;
  html += `  <meta property="og:type" content="website" />`;
  html += `  <meta property="og:title" content="${opt.title || 'Громадський транспорт Кременчука | #Husky.Dev'}"/>`;
  html += `  <meta property="og:description" content="${opt.description || 'Карта руху громадського транспорту Кременчука'}"/>`;
  html += `  <meta property="og:url" content="https://transport.Husky.Dev"/>`;
  html += `  <meta property="og:site_name" content="${opt.name || 'Громадський транспорт Кременчука'}"/>`;
  html += `  <meta property="og:image" content="/banner.png?v=4"/>`;
  html += `  <meta name="apple-itunes-app" content="app-id=1600469756">`;
  html += `  <!-- Favicons -->`;
  html += `  <link rel="shortcut icon" href="/favicon-32.png?v=4">`;
  html += `  <link rel="apple-touch-icon" href="/favicon-180.png?v=4">`;
  html += `  <link rel="manifest" href="/manifest.json">`;
  html += `  <!-- Fonts -->`;
  html += `  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap" />`;
  html += `  <!-- Theme -->`;
  html += `  <meta name=theme-color content="#ffffff">`;
  html += `  <meta name=msapplication-TileColor content="#ffffff">`;
  html += `  <!-- Styles -->`;
  html += `  <link rel="stylesheet" href="${opt.cssFilePath || '/app.css'}">`;
  html += `  <!-- Global site tag (gtag.js) - Google Analytics -->`;
  html += `  <script async src="https://www.googletagmanager.com/gtag/js?id=UA-77334417-5"></script>`;
  html += `  <script>`;
  html += `  window.dataLayer = window.dataLayer || [];`;
  html += `  function gtag(){dataLayer.push(arguments);}`;
  html += `  gtag('js', new Date());`;
  html += `  gtag('config', 'UA-77334417-5');`;
  html += `  </script>`;
  html += `  <!-- Cloudflare Web Analytics -->`;
  html += `  <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "f902fd19884543e49fa503ea5f2f164f"}'></script>`;
  html += `  <!-- End Cloudflare Web Analytics -->`;
  html += `</head>`;
  html += `<body class="h-dvh">`;
  html += `  <div id="app"></div>`;
  html += `  <script src="${opt.jsFilePath || '/app.js'}"></script>`;
  html += `</body>`;
  html += `</html>`;
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

