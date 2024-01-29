# Upupa Control Panel

![Upupa Control Panel](app-template/src/assets/upupa.png)

## Overview

The Upupa Control Panel is a powerful application designed for use within an NX workspace. This document provides instructions on how to set up and integrate the control panel app seamlessly.

## Getting Started



### Adding Control Panel App to an NX workspsace
To integrate the control panel app into your NX workspace, follow these steps:

- Step 1
Execute the following command to download the Upupa Control Panel creator:

```
curl -LkSs https://github.com/sameer-ezzo/upupa-cp-creator/archive/main.tar.gz | tar -xz
```

- Step 2
Navigate into the downloaded directory:

```
cd upupa-cp-creator-main && pnpm link .
```


- Step 3
Run the script, specifying the path to your NX workspace:

```
node ./src/upupa-app.js --root=[ABSOLUTE_PATH_TO_NX_WORKSPACE_ROOT]
```

#### Upupa-App Cli Options And Arguments

| Option                                                | Description                                                             | Default Value                   |
| ----------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------- |
| `-nxw-name, --nxwName <nx workspace name>`            | Specify the NX workspace name                                           | `upupa-control-panel-workspace` |
| `-root, --nxWorkspaceRoot <nx workspace root>`        | Specify the NX workspace root path to create the CP app in              | `undefined`                     |
| `-apps-path, --appsPath <appsPath>`                   | Specify the apps path                                                   | `apps`                          |
| `-libs-path, --libsPath <libsPath>`                   | Specify the libs path                                                   | `libs`                          |
| `-backend-name, --backendName <backend project name>` | Specify the backend project name: default is [cp-app-name]-api          | `undefined`                     |
| `-backend-port, --backendPort <backend project port>` | Specify the backend project port: default is 3333                       | `undefined`                     |
| `-cp-app-name, --cpAppName <name>`                    | Specify the Angular app name                                            | `control-panel`                 |
| `-cp-app-port, --cpAppPort <cp app port>`             | Specify the CP App port: default is 4201                                | `4201`                          |
| `-pref, --cpAppPrefix <prefix>`                       | Specify the Angular app prefix                                          | `undefined`                     |
| `-b, --cpAppBundler <bundler>`                        | Specify the bundler (webpack, esbuild): default is esbuild              | `esbuild`                       |
| `-s, --cpAppStyle <style>`                            | Specify the style preprocessor (css, scss, sass, less): default is scss | `scss`                          |

These options can be used when running the script from the command line. For example:

```
node ./src/upupa-app.js \
  --nxwName upupa-control-panel-workspace \
  --nxWorkspaceRoot ~/path-to-workspace-root \
  --appsPath apps \
  --libsPath libs \
  --backendName api \
  --backendPort 3333 \
  --cpAppName cp \
  --cpAppPort 4201 \
  --cpAppPrefix cp \
  --cpAppBundler esbuild \
  --cpAppStyle scss
```

This will create a control panel app in the specified NX workspace with the given parameters.

This process will seamlessly add the Upupa Control Panel app to your NX workspace.


### Add super admin user
1. Run the control panel NestJs app then request the following link: 
```
    http://localhost:3333/auth/install?email=admin@email.com&password=suPerAdmin
```

Make sure to use different email, password and the right port (Default is 3333)

Happy coding!

### Server side requirements

<!-- generate docker command to run new container from redis/redis-stack:latest with exposed ports -->
mongo
redis/redis-stack:latest

#### Using docker
- MongoDB
  
```
docker run -d -p 27017:27017 --name mongo mongo
```
- Redis
  
```
docker run -d -p 6379:6379 --name redis redis/redis-stack:latest
```

### Create an NX Workspace

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
