#!/usr/bin/env node

const commander = require('commander');
const fs = require('fs-extra');
const { execSync } = require('child_process');


const tsconfigBaseTemplate = require('./tsconfig.base.template.json');
workspaceRepo = 'git@github.com:sameer-ezzo/workspace.git'
libsPath = `libs`;
appsPath = `apps`;
appInfo = null
commander
    .option('-nxw_root, --nx-workspace-root <nxw_root>', 'Specify the NX workspace root path to create the CP app in', process.cwd())
    .option('-app, --app-name <app>', 'Specify the Angular app name', 'control-panel')
    .option('-p, --app-port <port>', 'Specify the Angular app port: default is 4201', '4201')
    .option('-pref, --app-prefix <prefix>', 'Specify the Angular app prefix')
    .option('-b, --bundler <bundler>', 'Specify the bundler (webpack, esbuild): default is esbuild', 'esbuild')
    .option('-bp, --backendProject <backendProject>', 'Specify the backend project name')
    .option('-s, --style <style>', 'Specify the style preprocessor (css, scss, sass, less): default is scss', 'scss')
    .parse(process.argv);

async function createControlPanelApp() {
    try {
        const { nxWorkspaceRoot, appName, appPort, style, bundler, appPrefix, backendProject } = commander._optionValues;
        appInfo = { nxWorkspaceRoot, appName, appPort, style, bundler, appPrefix, backendProject }

        // check if nx.json exists
        const nxJsonExists = await fs.pathExists(`${appInfo.nxWorkspaceRoot}/nx.json`);
        if (!nxJsonExists) {
            console.error(`${appInfo.nxWorkspaceRoot} is not an nx workspace.`);

            console.log('To create a new nx workspace run the following command: npx create-nx-workspace@latest --preset=empty')
            console.log('To Add Nx to an existing project: npx nx@latest init')
            console.log('For more info visit: https://nx.dev/latest/angular/getting-started/nx-setup')
            process.exit(1);
        }


        const appFolderExists = await fs.pathExists(`${appInfo.nxWorkspaceRoot}/${appsPath}/${appInfo.appName}`);
        if (!appFolderExists) {
            if (!(await fs.pathExists(`${appInfo.nxWorkspaceRoot}/${appsPath}`))) await fs.mkdir(`${appInfo.nxWorkspaceRoot}/${appsPath}`);

            // copy all dependencies and devDependencies from ./app-template/package.template.json to appInfo.nxWorkspaceRoot/package.json
            const packageTemplate = require('./app-template/package.template.json');
            const packageJson = require(`${appInfo.nxWorkspaceRoot}/package.json`);
            packageJson.dependencies = { ...packageTemplate.dependencies, ...packageJson.dependencies };
            packageJson.devDependencies = { ...packageTemplate.devDependencies, ...packageJson.devDependencies };
            await fs.writeFile(`${appInfo.nxWorkspaceRoot}/package.json`, JSON.stringify(packageJson, null, 2), 'utf8');
            execSync(`cd ${appInfo.nxWorkspaceRoot} && pnpm install --verbose`, { stdio: 'inherit', shell: true });


            let command = `cd ${appInfo.nxWorkspaceRoot} && pwd && pnpm exec nx generate @nx/angular:application --name=${appInfo.appName} --bundler=${appInfo.bundler || 'esbuild'} --directory=/${appsPath}/${appInfo.appName} --standalone=false  --port=${appInfo.port || '4201'} --projectNameAndRootFormat=as-provided --no-interactive --verbose`;
            if (appInfo.prefix) command += ` --prefix=${appInfo.prefix}`
            if (appInfo.backendProject) command += ` --backendProject=${appInfo.backendProject}`
            execSync(command, { stdio: 'inherit', shell: true });
            console.log(`Angular app "${appInfo.appName}" created successfully.`);
            await addAngularMaterial(appInfo.nxWorkspaceRoot, appInfo.appName);
            // setup tsconfig
            await setupTsConfig(appInfo.nxWorkspaceRoot, appInfo.appName);
        }
        else {
            console.error(`Angular app "${appInfo.appName}" already exists.`);
            // process.exit(1);
        }

        // clone base components
        await cloneBaseComponents(`${appInfo.nxWorkspaceRoot}/${appsPath}/${appInfo.appName}`);

        // add libs to workspace
        await adWorkspaceLibs(appInfo.nxWorkspaceRoot);
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

async function setupTsConfig(nxw_path, app) {
    const appTsConfigPath = `${nxw_path}/${appsPath}/${app}/tsconfig.app.json`;
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

async function cloneBaseComponents(appPath) {

    const copyFile = async (src, dist) => {
        const fileDistExists = await fs.pathExists(dist);
        if (!fileDistExists) await fs.copy(src, dist)
    }
    const copyFolder = async (src, path) => {
        const files = await fs.readdir(src);
        for (const file of files) {
            copy(`${src}/${file}`, `${path}/${file}`);
        }
    }
    // generate a recursive function that copies a folder to a path
    async function copy(src, dist) {
        const srcStat = await fs.lstat(src);
        if (srcStat.isDirectory()) await copyFolder(src, dist);
        else copyFile(src, dist)
    }
    await copy(`${__dirname}/app-template/src`, `${appPath}/src`);    
}


// generate a function that adds git repo as submodule to a path
async function addSubmodule(nxw_root, repo, path) {
    const command = `cd ${nxw_root} && git submodule add ${repo} ${path}`;
    execSync(command, { stdio: 'inherit', shell: true });
}


async function adWorkspaceLibs(nxw_root) {
    const nx_tsconfig = require(`${nxw_root}/tsconfig.base.json`);

    const libsFolderExists = await fs.pathExists(`${nxw_root}/libs`);
    if (!libsFolderExists) await fs.mkdir(`${nxw_root}/libs`);

    const workspaceInstalled = await checkSubmoduleExists(nxw_root, 'libs/workspace');
    if (!workspaceInstalled) await addSubmodule(nxw_root,workspaceRepo, 'libs/workspace');

    const appPaths = nx_tsconfig.compilerOptions.paths || {}
    const paths = Object.keys(tsconfigBaseTemplate.paths).filter(p => !appPaths[p])
    if (paths.length === 0) return

    paths.forEach(path => appPaths[path] = tsconfigBaseTemplate.paths[path])
    nx_tsconfig.compilerOptions.paths = appPaths;
    await fs.writeFile(`${nxw_root}/tsconfig.base.json`, JSON.stringify(nx_tsconfig, null, 2), 'utf8');
}

async function addAngularMaterial(nxw_root, app) {
    console.log(`Adding Angular Material to ${nxw_root}/${app}`);
    execSync(`cd ${nxw_root} && pnpm add @angular/material -w`, { stdio: 'inherit', shell: true });
    execSync(`cd ${nxw_root} && pnpx nx g @angular/material:ng-add --project=${app} --theme=custom --typography=true --animations=true --hammerJs=true`, { stdio: 'inherit', shell: true });
    console.log(`Angular Material added successfully to ${nxw_root}/${app}`);
}


// generate a function to check if a submodule exists and return false if not
async function checkSubmoduleExists(nxw_root, path) {
    try {
        const command = `cd ${nxw_root} && git submodule status ${path}`;
        const { stdout } = execSync(command, { stdio: 'pipe', shell: true });
        return !stdout || stdout.includes('-');
        
    } catch (error) {
        if (error.message.includes('did not match any file(s) known to git')) return false;
        throw error;
    }
}

createControlPanelApp()