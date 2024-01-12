import { Component, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '@upupa/auth';
import { SCAFFOLDING_SCHEME, ScaffoldingScheme, SideBarGroup } from '@upupa/cp';
import { languageDir, LanguageService } from '@upupa/language';
import { Subject, of, switchMap, filter, map, combineLatest } from 'rxjs';
import { toTitleCase } from '@upupa/common';


@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export default class AdminLayoutComponent {
  destroyed$ = new Subject();
  private readonly scheme = inject(SCAFFOLDING_SCHEME)


  dir$ = this.languageService.language$.pipe(switchMap((l) => of(languageDir(l))))
  
  sideBarCmds$ = combineLatest([this.auth.user$, this.languageService.language$])
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .pipe(map(([_, lang]) => accordionItems(lang, this.scheme)))

  constructor(public router: Router,
    public languageService: LanguageService,
    public auth: AuthService) {
  }

  changeLang(lang: string) {
    const url = this.router.url.substring(4);
    this.router.navigateByUrl(`/${lang}/${url}`);
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  async ngOnInit() {
    // await this._fixArtBoards()
  }
}


function accordionItems(lang: string, scaffoldingScheme: ScaffoldingScheme): SideBarGroup[] {

  const listItems = Object.entries({ ...scaffoldingScheme['list'] })
    .map(([key, value]) => ({ name: key, text: value['meta']['text'] ?? toTitleCase(key), icon: value['meta']['icon'], link: `/${lang}/admin/list/${key}` }));

  return [
    {
      groupName: 'Content',
      name: 'Content',
      items: [
        ...listItems
      ]
    }
  ];
}
