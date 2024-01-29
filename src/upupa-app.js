#!/usr/bin/env node
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var fs = require('fs-extra');
var execSync = require('child_process').execSync;
var tsconfigBaseTemplate = require('./tsconfig.base.template.json');
var join = require('path').join;
var workspaceRepo = 'git@github.com:sameer-ezzo/workspace.git';
// create logger based on console to add colors to the output
// log grey, info green, warn yellow, error red
var logger = {
    log: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return console.log.apply(console, __spreadArray(['\x1b[90m%s\x1b[0m'], args, false));
    },
    info: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return console.log.apply(console, __spreadArray(['\x1b[32m%s\x1b[0m'], args, false));
    },
    warn: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return console.log.apply(console, __spreadArray(['\x1b[33m%s\x1b[0m'], args, false));
    },
    error: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return console.log.apply(console, __spreadArray(['\x1b[31m%s\x1b[0m'], args, false));
    },
};
commander_1.program.option('-nxw-name, --nxwName <nx workspace name>', 'Specify the NX workspace name', 'upupa-control-panel-workspace')
    .option('-root, --nxWorkspaceRoot <nx workspace root>', 'Specify the NX workspace root path to create the CP app in', undefined)
    .option('-apps-path, --appsPath <appsPath>', 'Specify the apps path', 'apps')
    .option('-libs-path, --libsPath <libsPath>', 'Specify the libs path', 'libs')
    .option('-backend-name, --backendName <backend project name>', "Specify the backend project name: default is [cp-app-name]-api")
    .option('-backend-port, --backendPort <backend project port>', "Specify the backend project port: default is 3333")
    .option('-cp-app-name, --cpAppName <name>', 'Specify the Angular app name', 'control-panel')
    .option('-cp-app-port, --cpAppPort <cp app port>', 'Specify the CP App port: default is 4201', '4201')
    .option('-pref, --cpAppPrefix <prefix>', 'Specify the Angular app prefix')
    .option('-b, --cpAppBundler <bundler>', 'Specify the bundler (webpack, esbuild): default is esbuild', 'esbuild')
    .option('-s, --cpAppStyle <style>', 'Specify the style preprocessor (css, scss, sass, less): default is scss', 'scss');
try {
    commander_1.program.parse(process.argv);
}
catch (error) {
    logger.error(error.message);
}
function readAppInfo() {
    var conf = commander_1.program.opts();
    console.log('RAW App Config: ', conf);
    conf.backendName = (conf.backendName || '').trim().length > 0 ? conf.backendName : "".concat(conf.cpAppName, "-api");
    conf.backendPort = conf.backendName || '3333';
    if (conf.nxWorkspaceRoot)
        conf.nxwName = (conf.nxwName || '').trim().length > 0 ? conf.nxwName : 'upupa-control-panel-workspace';
    console.log('App Config: ', conf);
    return __assign({}, conf);
}
function getParentPath() {
    return process.cwd().split('/').slice(0, -1).join('/');
}
var appInfo = readAppInfo();
function createControlPanelApp() {
    return __awaiter(this, void 0, void 0, function () {
        var nxWorkspaceRoot, nxJsonExists, backendProjectAppExists, ngCmd, command, cpClientAppExists, ngCmd, command, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 22, , 23]);
                    appInfo = readAppInfo();
                    nxWorkspaceRoot = appInfo.nxWorkspaceRoot || getParentPath();
                    return [4 /*yield*/, fs.pathExists("".concat(nxWorkspaceRoot, "/nx.json"))];
                case 1:
                    nxJsonExists = _a.sent();
                    if (!nxJsonExists) {
                        logger.error("".concat(nxWorkspaceRoot, " is not an nx workspace."));
                        appInfo.nxWorkspaceRoot = join(appInfo.nxWorkspaceRoot || getParentPath(), appInfo.nxwName);
                        logger.log("Creating a new nx workspace in ".concat(appInfo.nxWorkspaceRoot, "..."));
                        execSync("cd ".concat(nxWorkspaceRoot, " && pnpx create-nx-workspace@latest --name ").concat(appInfo.nxwName, " --preset=apps -pm pnpm --cli=nx --nx-cloud=false --style=scss"), { stdio: 'inherit', shell: true });
                        logger.log('nx workspace created successfully.');
                    }
                    return [4 /*yield*/, adWorkspaceLibs(appInfo.nxWorkspaceRoot)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, fs.pathExists("".concat(appInfo.nxWorkspaceRoot, "/").concat(appInfo.appsPath))];
                case 3:
                    if (!!(_a.sent())) return [3 /*break*/, 5];
                    return [4 /*yield*/, fs.mkdir("".concat(appInfo.nxWorkspaceRoot, "/").concat(appInfo.appsPath))];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [4 /*yield*/, fs.pathExists("".concat(appInfo.nxWorkspaceRoot, "/").concat(appInfo.appsPath, "/").concat(appInfo.backendName))];
                case 6:
                    backendProjectAppExists = _a.sent();
                    if (!!backendProjectAppExists) return [3 /*break*/, 9];
                    execSync("cd ".concat(appInfo.nxWorkspaceRoot, " && pnpm install  @nx/nest@latest"), { stdio: 'inherit', shell: true });
                    execSync("cd ".concat(appInfo.nxWorkspaceRoot, " && pnpm exec nx g @nx/nest:init --unitTestRunner=jest --skipFormat=false --skipPackageJson=false --interactive=false"), { stdio: 'inherit', shell: true });
                    ngCmd = "pnpm exec nx generate @nx/nest:application --name=".concat(appInfo.backendName, " --directory=").concat(appInfo.appsPath, "/").concat(appInfo.backendName, " --tags=api --projectNameAndRootFormat=as-provided --no-interactive");
                    command = "cd ".concat(appInfo.nxWorkspaceRoot, " && ").concat(ngCmd);
                    logger.log('executing: ', ngCmd);
                    execSync(command, { stdio: 'inherit', shell: true });
                    return [4 /*yield*/, cloneServerAppComponents("".concat(appInfo.nxWorkspaceRoot, "/").concat(appInfo.appsPath, "/").concat(appInfo.backendName), true)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, setupNodeAppTsConfig(appInfo.nxWorkspaceRoot, appInfo.backendName)];
                case 8:
                    _a.sent();
                    logger.log("Backend Node app \"".concat(appInfo.backendName, "\" created successfully."));
                    return [3 /*break*/, 11];
                case 9:
                    logger.info("Backend app \"".concat(appInfo.backendName, "\" already exists."));
                    return [4 /*yield*/, cloneServerAppComponents("".concat(appInfo.nxWorkspaceRoot, "/").concat(appInfo.appsPath, "/").concat(appInfo.backendName), false)];
                case 10:
                    _a.sent();
                    _a.label = 11;
                case 11: return [4 /*yield*/, fs.pathExists("".concat(appInfo.nxWorkspaceRoot, "/").concat(appInfo.appsPath, "/").concat(appInfo.cpAppName))];
                case 12:
                    cpClientAppExists = _a.sent();
                    if (!!cpClientAppExists) return [3 /*break*/, 17];
                    execSync("cd ".concat(appInfo.nxWorkspaceRoot, " && pnpm install @nx/angular@latest"), { stdio: 'inherit', shell: true });
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 5000); })];
                case 13:
                    _a.sent();
                    execSync("cd ".concat(appInfo.nxWorkspaceRoot, " && pnpm exec nx g @nx/angular:init --e2eTestRunner=cypress --linter=eslint --style=scss --interactive=false"), { stdio: 'inherit', shell: true });
                    ngCmd = "pnpm exec nx generate @nx/angular:application --name=".concat(appInfo.cpAppName, " --bundler=").concat(appInfo.cpAppBundler, " --directory=/").concat(appInfo.appsPath, "/").concat(appInfo.cpAppName, "  --backendProject=").concat(appInfo.backendName, " --standalone=false  --port=").concat(appInfo.cpAppPort, " --style=").concat(appInfo.cpAppStyle, " --projectNameAndRootFormat=as-provided --no-interactive --verbose");
                    if (appInfo.cpAppPrefix)
                        ngCmd += " --prefix=".concat(appInfo.cpAppPrefix);
                    command = "cd ".concat(appInfo.nxWorkspaceRoot, " && ").concat(ngCmd);
                    logger.log('executing: ', ngCmd);
                    execSync(command, { stdio: 'inherit', shell: true });
                    return [4 /*yield*/, addAngularMaterial(appInfo.nxWorkspaceRoot, appInfo.cpAppName)];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, cloneClientAppComponents("".concat(appInfo.nxWorkspaceRoot, "/").concat(appInfo.appsPath, "/").concat(appInfo.cpAppName), true)];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, setupNgApp(appInfo.nxWorkspaceRoot, appInfo.cpAppName)];
                case 16:
                    _a.sent();
                    logger.log("Angular app \"".concat(appInfo.cpAppName, "\" created successfully."));
                    return [3 /*break*/, 20];
                case 17:
                    logger.info("Angular app \"".concat(appInfo.cpAppName, "\" already exists."));
                    return [4 /*yield*/, cloneClientAppComponents("".concat(appInfo.nxWorkspaceRoot, "/").concat(appInfo.appsPath, "/").concat(appInfo.cpAppName), false)];
                case 18:
                    _a.sent();
                    return [4 /*yield*/, setupNgApp(appInfo.nxWorkspaceRoot, appInfo.cpAppName)];
                case 19:
                    _a.sent();
                    _a.label = 20;
                case 20: return [4 /*yield*/, configureWorkspace(appInfo.nxWorkspaceRoot)];
                case 21:
                    _a.sent();
                    return [3 /*break*/, 23];
                case 22:
                    error_1 = _a.sent();
                    logger.error(error_1.message);
                    process.exit(1);
                    return [3 /*break*/, 23];
                case 23: return [2 /*return*/];
            }
        });
    });
}
function setupNodeAppTsConfig(nxw_path, app) {
    return __awaiter(this, void 0, void 0, function () {
        var appTsConfigPath, tsconfig;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    appTsConfigPath = "".concat(nxw_path, "/").concat(appInfo === null || appInfo === void 0 ? void 0 : appInfo.appsPath, "/").concat(app, "/tsconfig.app.json");
                    return [4 /*yield*/, fs.pathExists(appTsConfigPath)];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/, logger.warn("File ".concat(appTsConfigPath, " does not exist."))];
                    tsconfig = require(appTsConfigPath);
                    tsconfig.compilerOptions = __assign(__assign({}, tsconfig.compilerOptions), { "strictNullChecks": false, "noImplicitAny": false }); //todo: this should be removed once the @upupa/libs are updated to use these options
                    return [4 /*yield*/, fs.writeFile(appTsConfigPath, JSON.stringify(tsconfig, null, 2), 'utf8')];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function setupNgApp(nxw_path, app) {
    return __awaiter(this, void 0, void 0, function () {
        var appTsConfigPath, tsconfig, projectPath, project, styles;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    appTsConfigPath = "".concat(nxw_path, "/").concat(appInfo === null || appInfo === void 0 ? void 0 : appInfo.appsPath, "/").concat(app, "/tsconfig.app.json");
                    tsconfig = require(appTsConfigPath);
                    tsconfig.include = __spreadArray(__spreadArray([], (tsconfig.include || []), true), ["src/**/*.model.ts"], false).filter(function (v, i, a) { return a.indexOf(v) === i; });
                    tsconfig.compilerOptions = __assign(__assign({}, tsconfig.compilerOptions), { "useDefineForClassFields": false, "esModuleInterop": true, "forceConsistentCasingInFileNames": true, "strict": false, "noImplicitOverride": true, "noPropertyAccessFromIndexSignature": true, "noImplicitReturns": true, "noFallthroughCasesInSwitch": true }); //todo: this should be removed once the @upupa/libs are updated to use these options
                    return [4 /*yield*/, fs.writeFile(appTsConfigPath, JSON.stringify(tsconfig, null, 2), 'utf8')];
                case 1:
                    _a.sent();
                    projectPath = "".concat(nxw_path, "/").concat(appInfo === null || appInfo === void 0 ? void 0 : appInfo.appsPath, "/").concat(app, "/project.json");
                    project = require(projectPath);
                    styles = project.targets.build.options.styles || [];
                    project.targets.build.options.styles = __spreadArray(__spreadArray([], styles, true), ["".concat(appInfo === null || appInfo === void 0 ? void 0 : appInfo.appsPath, "/").concat(app, "/src/cp-styles.scss")], false).filter(function (v, i, a) { return a.indexOf(v) === i; });
                    return [4 /*yield*/, fs.writeFile(projectPath, JSON.stringify(project, null, 2), 'utf8')];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
var copyFile = function (src, dist) { return __awaiter(void 0, void 0, void 0, function () {
    var fileDistExists, f;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fs.pathExists(dist)];
            case 1:
                fileDistExists = _a.sent();
                if (!fileDistExists) return [3 /*break*/, 3];
                f = "".concat(dist, "_").concat(new Date().getTime(), ".bak");
                logger.info("File ".concat(dist, " already exists. Renaming it to ").concat(f));
                return [4 /*yield*/, fs.rename(dist, f)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [4 /*yield*/, fs.copy(src, dist)];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var copyFolder = function (src, dist) { return __awaiter(void 0, void 0, void 0, function () {
    var distDirExists, f, files, _i, files_1, file;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fs.pathExists(dist)];
            case 1:
                distDirExists = _a.sent();
                if (!distDirExists) return [3 /*break*/, 4];
                f = "".concat(dist, "_").concat(new Date().getTime(), ".bak");
                logger.info("".concat(dist, " already exists. Renaming it to ").concat(f));
                return [4 /*yield*/, fs.rename(dist, f)];
            case 2:
                _a.sent();
                return [4 /*yield*/, fs.mkdir(dist)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [4 /*yield*/, fs.readdir(src)];
            case 5:
                files = _a.sent();
                for (_i = 0, files_1 = files; _i < files_1.length; _i++) {
                    file = files_1[_i];
                    copy("".concat(src, "/").concat(file), "".concat(dist, "/").concat(file));
                }
                return [2 /*return*/];
        }
    });
}); };
function copy(src, dist, overwrite) {
    if (overwrite === void 0) { overwrite = false; }
    return __awaiter(this, void 0, void 0, function () {
        var srcStat;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!overwrite) return [3 /*break*/, 2];
                    return [4 /*yield*/, fs.copy(src, dist, { overwrite: true })];
                case 1: return [2 /*return*/, _a.sent()];
                case 2: return [4 /*yield*/, fs.lstat(src)];
                case 3:
                    srcStat = _a.sent();
                    if (!srcStat.isDirectory()) return [3 /*break*/, 5];
                    return [4 /*yield*/, copyFolder(src, dist)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    copyFile(src, dist);
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
function cloneClientAppComponents(appPath, overwrite) {
    if (overwrite === void 0) { overwrite = false; }
    return __awaiter(this, void 0, void 0, function () {
        var paths, _i, paths_1, path;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    paths = [
                        'proxy.conf.json',
                        'src/app/layouts',
                        'src/app/models',
                        'src/main.ts',
                        'src/cp-styles.scss',
                        'src/assets/langs',
                        'src/assets/upupa.png',
                        'src/app/accounts.module.ts',
                        'src/app/material-imports.module.ts',
                        'src/app/app.module.ts',
                        'src/app/app.routes.ts',
                        'src/app/app.component.html',
                        'src/app/app.component.scss',
                        'src/app/app.component.spec.ts',
                    ];
                    _i = 0, paths_1 = paths;
                    _a.label = 1;
                case 1:
                    if (!(_i < paths_1.length)) return [3 /*break*/, 4];
                    path = paths_1[_i];
                    return [4 /*yield*/, copy("".concat(__dirname, "/app-template/client/").concat(path), "".concat(appPath, "/").concat(path), overwrite)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function cloneServerAppComponents(appPath, overwrite) {
    if (overwrite === void 0) { overwrite = false; }
    return __awaiter(this, void 0, void 0, function () {
        var paths, _i, paths_2, path;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    paths = [
                        'src/main.ts',
                        'src/app/app.module.ts',
                        'src/app/config.ts'
                    ];
                    _i = 0, paths_2 = paths;
                    _a.label = 1;
                case 1:
                    if (!(_i < paths_2.length)) return [3 /*break*/, 4];
                    path = paths_2[_i];
                    return [4 /*yield*/, copy("".concat(__dirname, "/app-template/server/").concat(path), "".concat(appPath, "/").concat(path), overwrite)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function addSubmodule(nxw_root, repo, path) {
    return __awaiter(this, void 0, void 0, function () {
        var command;
        return __generator(this, function (_a) {
            command = "cd ".concat(nxw_root, " && git submodule add ").concat(repo, " ").concat(path);
            logger.log('Adding workspace submodule ..., ', command);
            execSync(command, { stdio: 'inherit', shell: true });
            return [2 /*return*/];
        });
    });
}
function adWorkspaceLibs(nxw_root) {
    return __awaiter(this, void 0, void 0, function () {
        var libsFolderExists, workspaceInstalled, runInit, error_2, command, stdout, r, command_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger.log('Adding SS and Upupa libs to the workspace ...');
                    return [4 /*yield*/, fs.pathExists("".concat(nxw_root, "/").concat(appInfo === null || appInfo === void 0 ? void 0 : appInfo.libsPath))];
                case 1:
                    libsFolderExists = _a.sent();
                    if (!!libsFolderExists) return [3 /*break*/, 3];
                    return [4 /*yield*/, fs.mkdir("".concat(nxw_root, "/").concat(appInfo === null || appInfo === void 0 ? void 0 : appInfo.libsPath))];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [4 /*yield*/, checkSubmoduleExists(nxw_root, "".concat(appInfo === null || appInfo === void 0 ? void 0 : appInfo.libsPath, "/workspace"))];
                case 4:
                    workspaceInstalled = _a.sent();
                    runInit = false;
                    if (!!workspaceInstalled) return [3 /*break*/, 8];
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, addSubmodule(nxw_root, workspaceRepo, "".concat(appInfo === null || appInfo === void 0 ? void 0 : appInfo.libsPath, "/workspace"))];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 7:
                    error_2 = _a.sent();
                    logger.error('Failed to add workspace submodule. Please add it manually and try again.');
                    logger.error(error_2.message);
                    runInit = true;
                    return [3 /*break*/, 8];
                case 8:
                    if (runInit) {
                        command = "cd ".concat(nxw_root, "/").concat(appInfo === null || appInfo === void 0 ? void 0 : appInfo.libsPath, "/workspace && git status");
                        stdout = execSync(command, { stdio: 'pipe', shell: true }).stdout;
                        r = stdout || '';
                        if (r.includes('Changes not staged for commit') || r.includes('Changes to be committed')) {
                            logger.error('Workspace submodule has changes that are not committed. Please commit them before continuing.');
                        }
                        else {
                            command_1 = "cd ".concat(nxw_root, " && git submodule update --init --recursive");
                            logger.log('Workspace submodule already exists. Updating it with: ', command_1);
                            execSync(command_1, { stdio: 'inherit', shell: true });
                        }
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function configureWorkspace(nxw_root) {
    return __awaiter(this, void 0, void 0, function () {
        var nx_tsconfig, nx_Paths, angularCompilerOptions, compilerOptions, paths, packageTemplate, packageJson;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nx_tsconfig = require("".concat(nxw_root, "/tsconfig.base.json"));
                    nx_Paths = nx_tsconfig.compilerOptions.paths || {};
                    angularCompilerOptions = tsconfigBaseTemplate.angularCompilerOptions, compilerOptions = tsconfigBaseTemplate.compilerOptions;
                    nx_tsconfig.compilerOptions = __assign(__assign({}, compilerOptions), (nx_tsconfig.compilerOptions || {}));
                    nx_tsconfig.angularCompilerOptions = __assign(__assign({}, angularCompilerOptions), (nx_tsconfig.angularCompilerOptions || {}));
                    paths = Object.keys(compilerOptions.paths);
                    paths.forEach(function (path) { return nx_Paths[path] = ["".concat(appInfo === null || appInfo === void 0 ? void 0 : appInfo.libsPath, "/workspace/").concat(compilerOptions.paths[path])]; });
                    nx_tsconfig.compilerOptions.paths = nx_Paths;
                    return [4 /*yield*/, fs.writeFile("".concat(nxw_root, "/tsconfig.base.json"), JSON.stringify(nx_tsconfig, null, 2), 'utf8')];
                case 1:
                    _a.sent();
                    logger.log('Adding SS and Upupa libs dependencies and devDependencies ...');
                    packageTemplate = require('./app-template/package.template.json');
                    packageJson = require("".concat(appInfo === null || appInfo === void 0 ? void 0 : appInfo.nxWorkspaceRoot, "/package.json"));
                    packageJson.dependencies = __assign(__assign({}, packageTemplate.dependencies), packageJson.dependencies);
                    packageJson.devDependencies = __assign(__assign({}, packageTemplate.devDependencies), packageJson.devDependencies);
                    return [4 /*yield*/, fs.writeFile("".concat(appInfo === null || appInfo === void 0 ? void 0 : appInfo.nxWorkspaceRoot, "/package.json"), JSON.stringify(packageJson, null, 2), 'utf8')];
                case 2:
                    _a.sent();
                    logger.log('Installing SS and Upupa libs dependencies and devDependencies ...');
                    execSync("cd ".concat(appInfo === null || appInfo === void 0 ? void 0 : appInfo.nxWorkspaceRoot, " && pnpm install --verbose"), { stdio: 'inherit', shell: true });
                    return [2 /*return*/];
            }
        });
    });
}
function addAngularMaterial(nxw_root, app) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            logger.log("Adding Angular Material to ".concat(nxw_root, "/").concat(app));
            execSync("cd ".concat(nxw_root, " && pnpm add @angular/material"), { stdio: 'inherit', shell: true });
            execSync("cd ".concat(nxw_root, " && pnpx nx g @angular/material:ng-add --project=").concat(app, " --theme=custom --typography=true --animations=true --hammerJs=true"), { stdio: 'inherit', shell: true });
            logger.log("Angular Material added successfully to ".concat(nxw_root, "/").concat(app));
            return [2 /*return*/];
        });
    });
}
// generate a function to check if a submodule exists and return false if not
function checkSubmoduleExists(nxw_root, path) {
    return __awaiter(this, void 0, void 0, function () {
        var command, stdout;
        return __generator(this, function (_a) {
            try {
                command = "cd ".concat(nxw_root, " && git submodule status ").concat(path);
                stdout = execSync(command, { stdio: 'pipe', shell: true }).stdout;
                return [2 /*return*/, (stdout || '').includes('-')];
            }
            catch (error) {
                if (error.message.includes('did not match any file(s) known to git'))
                    return [2 /*return*/, false];
                throw error;
            }
            return [2 /*return*/];
        });
    });
}
createControlPanelApp();
