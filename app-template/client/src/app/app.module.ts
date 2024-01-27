import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { UtilsModule } from '@upupa/common';
import { ControlPanelModule } from '@upupa/cp';
import { DynamicFormModule } from '@upupa/dynamic-form';
import { DataTableModule } from '@upupa/table';
import { HtmlEditorComponent, HtmlEditorModule } from '@upupa/html-editor';
import { UploadModule } from '@upupa/upload';


import { appRoutes } from './app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from '@upupa/auth';
import { LanguageModule } from '@upupa/language';
import { DataModule } from '@upupa/data';
import { DF_MATERIAL_THEME_INPUTS, DynamicFormMaterialThemeModule } from '@upupa/dynamic-form-material-theme';
import { DynamicFormNativeThemeModule, FileSelectComponent } from '@upupa/dynamic-form-native-theme';

import AdminLayoutComponent from './layouts/admin-layout/admin-layout.component';


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
    AuthModule.forRoot(`/auth`),
    UploadModule.forChild(`/storage`),
    UtilsModule,
    HtmlEditorModule.register(`/storage`),
    DataTableModule,
    DynamicFormMaterialThemeModule,
    DynamicFormNativeThemeModule,
    DynamicFormModule.forRoot([], {
      'material': {
        ...DF_MATERIAL_THEME_INPUTS,
        'html': { component: HtmlEditorComponent },
        'file': { component: FileSelectComponent }
      }
    },
      'material', { enableLogs: true }
    ),
    ControlPanelModule.register({})
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

