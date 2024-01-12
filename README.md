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

This process will seamlessly add the Upupa Control Panel app to your NX workspace.

Happy coding!