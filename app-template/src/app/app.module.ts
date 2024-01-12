import { NgModule, Provider } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { UtilsModule } from '@upupa/common';
import { ControlPanelModule } from '@upupa/cp';
import { DynamicFormModule } from '@upupa/dynamic-form';
import { HtmlEditorComponent, HtmlEditorModule } from '@upupa/html-editor';
import { DataTableModule } from '@upupa/table';
import { UploadModule } from '@upupa/upload';


import { appRoutes } from './app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule, DEFAULT_LOGIN, DEFAULT_VERIFY } from '@upupa/auth';
import { LanguageModule, LanguageService } from '@upupa/language';
import { DataModule } from '@upupa/data';
import { DF_MATERIAL_THEME_INPUTS, DynamicFormMaterialThemeModule } from '@upupa/dynamic-form-material-theme';
import AdminLayoutComponent from './layouts/admin-layout/admin-layout.component';



const logInProvider: Provider = {
  provide: DEFAULT_LOGIN, useFactory: (lang: LanguageService) => {
    const l = lang.language ?? lang.defaultLang
    return `/${l}/account/login?redirect=/${l}`
  }, deps: [LanguageService]
}
const verifyProvider: Provider = {
  provide: DEFAULT_VERIFY, useFactory: (lang: LanguageService) => {
    const l = lang.language ?? lang.defaultLang
    return `/${l}/account/verify?redirect=/${l}`
  }, deps: [LanguageService]
}



@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),

    LanguageModule.forRoot('en', {}, 'lang', '/assets/langs'),
    DataModule.forChild('/api'),
    AuthModule.forRoot(`/auth`, { default_login_url: logInProvider, default_verify_url: verifyProvider }),
    UploadModule.forChild(`/storage`),
    UtilsModule,
    HtmlEditorModule.register(`/storage`),
    DataTableModule,
    DynamicFormMaterialThemeModule,
    DynamicFormModule.forRoot([], {
      'material': {
        ...DF_MATERIAL_THEME_INPUTS,
        'html': { component: HtmlEditorComponent }
      }
    },
      'material', { enableLogs: true }
    ),
    ControlPanelModule.register({})
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

