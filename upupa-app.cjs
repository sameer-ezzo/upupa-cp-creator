#!/usr/bin/env node

const commander = require('commander');
const fs = require('fs-extra');
const { execSync } = require('child_process');

const tsconfigBaseTemplate = require('./tsconfig.base.template.json');
const { join } = require('path');
const workspaceRepo = 'git@github.com:sameer-ezzo/workspace.git'

// create logger based on console to add colors to the output
// log grey, info green, warn yellow, error red
const logger = {
    log: (...args) => console.log('\x1b[90m%s\x1b[0m', ...args),
    info: (...args) => console.log('\x1b[32m%s\x1b[0m', ...args),
    warn: (...args) => console.log('\x1b[33m%s\x1b[0m', ...args),
    error: (...args) => console.log('\x1b[31m%s\x1b[0m', ...args),
}


appInfo = null
commander
    .option('-root, --nx-workspace-root <root>', 'Specify the NX workspace root path to create the CP app in', undefined)
    .option('-name, --name <name>', 'Specify the Angular app name', 'control-panel')
    .option('-appsPath, --appsPath <appsPath>', 'Specify the apps path', 'apps')
    .option('-libsPath, --libsPath <libsPath>', 'Specify the libs path', 'libs')
    .option('-p, --port <port>', 'Specify the Angular app port: default is 4201', '4201')
    .option('-pref, --prefix <prefix>', 'Specify the Angular app prefix')
    .option('-b, --bundler <bundler>', 'Specify the bundler (webpack, esbuild): default is esbuild', 'esbuild')
    .option('-bp, --backendProject <backendProject>', `Specify the backend project name: default is [app-name]-api`)
    .option('-s, --style <style>', 'Specify the style preprocessor (css, scss, sass, less): default is scss', 'scss')
    .parse(process.argv);

function getParentPath() {
    return process.cwd().split('/').slice(0, -1).join('/');
}

async function createControlPanelApp() {
    try {
        appInfo = readAppInfo();
        if (!appInfo.nxWorkspaceRoot) appInfo.nxWorkspaceRoot = join(getParentPath(), 'upupa-control-panel-workspace');
        const nxJsonExists = await fs.pathExists(`${appInfo.nxWorkspaceRoot}/nx.json`);
        if (!nxJsonExists) {
            logger.error(`${appInfo.nxWorkspaceRoot} is not an nx workspace.`);
            logger.log('Creating a new nx workspace...');
            execSync(`cd ${getParentPath()} && pnpx create-nx-workspace@latest --name upupa-control-panel-workspace --preset=apps -pm pnpm --cli=nx --nx-cloud=false --style=scss `, { stdio: 'inherit', shell: true });
            logger.log('nx workspace created successfully.');
        }

        await adWorkspaceLibs(appInfo.nxWorkspaceRoot);

        if (!(await fs.pathExists(`${appInfo.nxWorkspaceRoot}/${appInfo.appsPath}`))) await fs.mkdir(`${appInfo.nxWorkspaceRoot}/${appInfo.appsPath}`);

        const backendProjectAppExists = await fs.pathExists(`${appInfo.nxWorkspaceRoot}/${appInfo.appsPath}/${appInfo.backendProject}`);
        if (!backendProjectAppExists) {
            execSync(`cd ${appInfo.nxWorkspaceRoot} && pnpm install  @nx/nest@latest`, { stdio: 'inherit', shell: true });
            execSync(`cd ${appInfo.nxWorkspaceRoot} && pnpm exec nx g @nx/nest:init --unitTestRunner=jest --skipFormat=false --skipPackageJson=false --interactive=false`, { stdio: 'inherit', shell: true });
            let ngCmd = `pnpm exec nx generate @nx/nest:application --name=${appInfo.backendProject} --directory=${appInfo.appsPath}/${appInfo.backendProject} --tags=api --projectNameAndRootFormat=as-provided --no-interactive`
            const command = `cd ${appInfo.nxWorkspaceRoot} && ${ngCmd}`;
            logger.log('executing: ', ngCmd);
            execSync(command, { stdio: 'inherit', shell: true });
            await cloneServerAppComponents(`${appInfo.nxWorkspaceRoot}/${appInfo.appsPath}/${appInfo.backendProject}`, true);
            await setupNodeAppTsConfig(appInfo.nxWorkspaceRoot, appInfo.backendProject);
            logger.log(`Backend Node app "${appInfo.backendProject}" created successfully.`);
        }
        else {
            logger.info(`Backend app "${appInfo.backendProject}" already exists.`);
            await cloneServerAppComponents(`${appInfo.nxWorkspaceRoot}/${appInfo.appsPath}/${appInfo.backendProject}`, false)
        }


        const cpClientAppExists = await fs.pathExists(`${appInfo.nxWorkspaceRoot}/${appInfo.appsPath}/${appInfo.name}`);
        if (!cpClientAppExists) {
            execSync(`cd ${appInfo.nxWorkspaceRoot} && pnpm install @nx/angular@latest`, { stdio: 'inherit', shell: true });
            await new Promise(resolve => setTimeout(resolve, 5000));
            execSync(`cd ${appInfo.nxWorkspaceRoot} && pnpm exec nx g @nx/angular:init --e2eTestRunner=cypress --linter=eslint --style=scss --interactive=false`, { stdio: 'inherit', shell: true });
            let ngCmd = `pnpm exec nx generate @nx/angular:application --name=${appInfo.name} --bundler=${appInfo.bundler} --directory=/${appInfo.appsPath}/${appInfo.name}  --backendProject=${appInfo.backendProject} --standalone=false  --port=${appInfo.port} --style=${appInfo.style} --projectNameAndRootFormat=as-provided --no-interactive --verbose`
            if (appInfo.prefix) ngCmd += ` --prefix=${appInfo.prefix}`
            const command = `cd ${appInfo.nxWorkspaceRoot} && ${ngCmd}`;
            logger.log('executing: ', ngCmd);
            execSync(command, { stdio: 'inherit', shell: true });
            await addAngularMaterial(appInfo.nxWorkspaceRoot, appInfo.name);
            await setupNgAppTsConfig(appInfo.nxWorkspaceRoot, appInfo.name);
            await cloneClientAppComponents(`${appInfo.nxWorkspaceRoot}/${appInfo.appsPath}/${appInfo.name}`, true);
            logger.log(`Angular app "${appInfo.name}" created successfully.`);
        }
        else {
            logger.info(`Angular app "${appInfo.name}" already exists.`);
            await cloneClientAppComponents(`${appInfo.nxWorkspaceRoot}/${appInfo.appsPath}/${appInfo.name}`, false);
        }

        await configureWorkspace(appInfo.nxWorkspaceRoot);

    } catch (error) {
        logger.error(error.message);
        process.exit(1);
    }
}

function readAppInfo() {
    let { nxWorkspaceRoot, name, appsPath, libsPath, port, style, bundler, prefix, backendProject } = commander._optionValues;
    backendProject = backendProject && backendProject.trim().length > 0 ? backendProject : `${name}-api`;
    return { nxWorkspaceRoot, name, port, appsPath, libsPath, style, bundler, prefix, backendProject };
}

async function setupNodeAppTsConfig(nxw_path, app) {
    const appTsConfigPath = `${nxw_path}/${appInfo.appsPath}/${app}/tsconfig.app.json`;
    if (!(await fs.pathExists(appTsConfigPath))) return logger.warn(`File ${appTsConfigPath} does not exist.`);
    const tsconfig = require(appTsConfigPath);
    tsconfig.compilerOptions = {
        ...tsconfig.compilerOptions,
        "strictNullChecks": false,
        "noImplicitAny": false,
    } //todo: this should be removed once the @upupa/libs are updated to use these options

    await fs.writeFile(appTsConfigPath, JSON.stringify(tsconfig, null, 2), 'utf8');
}
async function setupNgAppTsConfig(nxw_path, app) {
    const appTsConfigPath = `${nxw_path}/${appInfo.appsPath}/${app}/tsconfig.app.json`;
    const tsconfig = require(appTsConfigPath);
    tsconfig.include = [...(tsconfig.include || []), "src/**/*.model.ts"].filter((v, i, a) => a.indexOf(v) === i);
    tsconfig.compilerOptions = {
        ...tsconfig.compilerOptions,
        "useDefineForClassFields": false,
        "esModuleInterop": true,
        "forceConsistentCasingInFileNames": true,
        "strict": false,
        "noImplicitOverride": true,
        "noPropertyAccessFromIndexSignature": true,
        "noImplicitReturns": true,
        "noFallthroughCasesInSwitch": true
    } //todo: this should be removed once the @upupa/libs are updated to use these options

    await fs.writeFile(appTsConfigPath, JSON.stringify(tsconfig, null, 2), 'utf8');
}
const copyFile = async (src, dist) => {
    const fileDistExists = await fs.pathExists(dist);
    if (fileDistExists) {
        const f = `${dist}_${new Date().getTime()}.bak`
        logger.info(`File ${dist} already exists. Renaming it to ${f}`);
        await fs.rename(dist, f);
    }
    await fs.copy(src, dist)
}
const copyFolder = async (src, dist) => {

    const distDirExists = await fs.pathExists(dist);
    if (distDirExists) {
        const f = `${dist}_${new Date().getTime()}.bak`

        logger.info(`${dist} already exists. Renaming it to ${f}`);
        await fs.rename(dist, f);
        await fs.mkdir(dist);
    }

    const files = await fs.readdir(src);
    for (const file of files) {
        copy(`${src}/${file}`, `${dist}/${file}`);
    }
}

async function copy(src, dist, overwrite = false) {
    if (overwrite) return await fs.copy(src, dist, { overwrite: true })

    const srcStat = await fs.lstat(src);
    if (srcStat.isDirectory()) await copyFolder(src, dist);
    else copyFile(src, dist)
}

async function cloneClientAppComponents(appPath, overwrite = false) {

    const paths = [
        'proxy.conf.json',
        'src/app/layouts',
        'src/app/models',
        'src/main.ts',
        'src/assets/langs',
        'src/assets/upupa.png',
        'src/app/accounts.module.ts',
        'src/app/material-imports.module.ts',
        'src/app/app.module.ts',
        'src/app/app.routes.ts',
        'src/app/app.component.html',
        'src/app/app.component.scss',
        'src/app/app.component.spec.ts',
    ]

    for (const path of paths) {
        await copy(`${__dirname}/app-template/client/${path}`, `${appPath}/${path}`, overwrite);
    }
}

async function cloneServerAppComponents(appPath, overwrite = false) {

    const paths = [
        'src/main.ts',
        'src/app/app.module.ts',
        'src/app/config.ts'
    ]

    for (const path of paths) {
        await copy(`${__dirname}/app-template/server/${path}`, `${appPath}/${path}`, overwrite);
    }
}

async function addSubmodule(nxw_root, repo, path) {
    const command = `cd ${nxw_root} && git submodule add ${repo} ${path}`;
    logger.log('Adding workspace submodule ..., ', command);
    execSync(command, { stdio: 'inherit', shell: true });
}


async function adWorkspaceLibs(nxw_root) {
    logger.log('Adding SS and Upupa libs to the workspace ...');

    const libsFolderExists = await fs.pathExists(`${nxw_root}/${appInfo.libsPath}`);
    if (!libsFolderExists) await fs.mkdir(`${nxw_root}/${appInfo.libsPath}`);

    const workspaceInstalled = await checkSubmoduleExists(nxw_root, `${appInfo.libsPath}/workspace`);
    let runInit = false;
    if (!workspaceInstalled) {
        try {
            await addSubmodule(nxw_root, workspaceRepo, `${appInfo.libsPath}/workspace`);
        } catch (error) {
            logger.error('Failed to add workspace submodule. Please add it manually and try again.');
            logger.error(error.message);
            runInit = true
        }
    }
    if (runInit) {
        const command = `cd ${nxw_root}/${appInfo.libsPath}/workspace && git status`;
        const { stdout } = execSync(command, { stdio: 'pipe', shell: true });
        const r = stdout || ''
        if (r.includes('Changes not staged for commit') || r.includes('Changes to be committed')) {
            logger.error('Workspace submodule has changes that are not committed. Please commit them before continuing.');

        } else {
            const command = `cd ${nxw_root} && git submodule update --init --recursive`;
            logger.log('Workspace submodule already exists. Updating it with: ', command);
            execSync(command, { stdio: 'inherit', shell: true });
        }


    }

}

async function configureWorkspace(nxw_root) {
    const nx_tsconfig = require(`${nxw_root}/tsconfig.base.json`);
    const nx_Paths = nx_tsconfig.compilerOptions.paths || {};
    const { angularCompilerOptions, compilerOptions } = tsconfigBaseTemplate

    nx_tsconfig.compilerOptions = { ...compilerOptions, ...nx_tsconfig.compilerOptions };
    nx_tsconfig.angularCompilerOptions = { ...angularCompilerOptions, ...(nx_tsconfig.angularCompilerOptions || {}) };

    const paths = Object.keys(compilerOptions.paths)
    paths.forEach(path => nx_Paths[path] = [`${appInfo.libsPath}/workspace/${compilerOptions.paths[path]}`]);
    nx_tsconfig.compilerOptions.paths = nx_Paths;
    await fs.writeFile(`${nxw_root}/tsconfig.base.json`, JSON.stringify(nx_tsconfig, null, 2), 'utf8');

    logger.log('Adding SS and Upupa libs dependencies and devDependencies ...');
    const packageTemplate = require('./app-template/package.template.json');
    const packageJson = require(`${appInfo.nxWorkspaceRoot}/package.json`);
    packageJson.dependencies = { ...packageTemplate.dependencies, ...packageJson.dependencies };
    packageJson.devDependencies = { ...packageTemplate.devDependencies, ...packageJson.devDependencies };
    await fs.writeFile(`${appInfo.nxWorkspaceRoot}/package.json`, JSON.stringify(packageJson, null, 2), 'utf8');
    logger.log('Installing SS and Upupa libs dependencies and devDependencies ...');
    execSync(`cd ${appInfo.nxWorkspaceRoot} && pnpm install --verbose`, { stdio: 'inherit', shell: true });
}

async function addAngularMaterial(nxw_root, app) {
    logger.log(`Adding Angular Material to ${nxw_root}/${app}`);
    execSync(`cd ${nxw_root} && pnpm add @angular/material`, { stdio: 'inherit', shell: true });
    execSync(`cd ${nxw_root} && pnpx nx g @angular/material:ng-add --project=${app} --theme=custom --typography=true --animations=true --hammerJs=true`, { stdio: 'inherit', shell: true });
    logger.log(`Angular Material added successfully to ${nxw_root}/${app}`);
}


// generate a function to check if a submodule exists and return false if not
async function checkSubmoduleExists(nxw_root, path) {
    try {
        const command = `cd ${nxw_root} && git submodule status ${path}`;
        const { stdout } = execSync(command, { stdio: 'pipe', shell: true });
        return (stdout || '').includes('-');

    } catch (error) {
        if (error.message.includes('did not match any file(s) known to git')) return false;
        throw error;
    }
}

createControlPanelApp()