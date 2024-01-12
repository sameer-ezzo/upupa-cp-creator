
<!-- include image from ./app-template/src/assets/upupa.png -->
![upupa-control-panel](app-template/src/assets/upupa.png)
## Upupa Control Panel

You can use this app only with NX workspace.

To create an NX workspace write: 
```
pnpx create-nx-workspace@latest [APP_NAME] --packageManager=pnpm
```

To add control panel app to your NX workspace run:

1. 
````
curl -LkSs https://github.com/sameer-ezzo/upupa-cp-creator/archive/main.tar.gz | tar -xz
````

2. 
````
cd upupa-cp-creator
chmod +x upupa-app.cjs
pnpm link
node upupa-app.cjs --nx-workspace-root=[PATH_TO_NX_WORKSPACE]
````

