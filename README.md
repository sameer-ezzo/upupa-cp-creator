# Upupa Control Panel

![Upupa Control Panel](app-template/src/assets/upupa.png)

## Overview

The Upupa Control Panel is a powerful application designed for use within an NX workspace. This document provides instructions on how to set up and integrate the control panel app seamlessly.

## Getting Started

### 1. Create an NX Workspace

Begin by creating an NX workspace using the following command:

```bash
pnpx create-nx-workspace@latest --pm pnpm --style scss
```
The above command will prompt these questions, we recommend to use the answers bellow

1. Where would you like to create your workspace? [YOUR_WORKSPACE_NAME]
2. Which stack do you want to use?
   
    None:          Configures a TypeScript/JavaScript project with minimal structure.
3. Package-based monorepo, integrated monorepo, or standalone project?
   
    Package-based Monorepo:     Nx makes it fast, but lets you run things your way.


### 2. Add Control Panel App
To integrate the control panel app into your NX workspace, follow these steps:

- Step 1
Execute the following command to download the Upupa Control Panel creator:

```
curl -LkSs https://github.com/sameer-ezzo/upupa-cp-creator/archive/main.tar.gz | tar -xz
```

- Step 2
Navigate into the downloaded directory:

```
cd upupa-cp-creator-main
```

- Step 3
Make the script executable:

```
chmod +x upupa-app.cjs
```

- Step 4
Run the script, specifying the path to your NX workspace:

```
node upupa-app.cjs --nx-workspace-root=[PATH_TO_NX_WORKSPACE]
```

#### Upupa-App Cli Options And Arguments

* --nx-workspace-root: This option allows you to specify the NX workspace root path where the Upupa control panel app will be created. By default, it uses the current working directory.

* --app-name: This option allows you to specify the name of the Angular app. The default name is 'control-panel'.
* --app-port: This option allows you to specify the port on which the Angular app will run. The default port is 4201.
* --app-prefix: This option allows you to specify the prefix for the Angular app.
* --bundler: This option allows you to specify the bundler to be used. The options are 'webpack' and 'esbuild'. The default bundler is 'esbuild'.
* --backendProject: This option allows you to specify the name of the backend project.
* --style: This option allows you to specify the style preprocessor to be used. The options are 'css', 'scss', 'sass', and 'less'. The default preprocessor is 'scss'.

These options can be used when running the script from the command line. For example:

```
node upupa-app.cjs --nx-workspace-root ./my-nx-workspace --app-name my-app --app-port 4300 --app-prefix my-prefix --bundler webpack --backendProject my-backend --style scss
```

This will create a control panel app in the specified NX workspace with the given parameters.

This process will seamlessly add the Upupa Control Panel app to your NX workspace.
Happy coding!