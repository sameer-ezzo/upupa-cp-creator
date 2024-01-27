import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'account-layout',
    standalone: true,
    templateUrl: './account-layout.component.html',
    styleUrls: ['./account-layout.component.scss'],
    imports: [RouterOutlet]
})
export default class AccountLayoutComponent {
}
