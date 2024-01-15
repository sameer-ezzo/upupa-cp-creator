
import { NgModule } from '@angular/core';
import { MembershipModule, UsersManagementModule } from '@upupa/membership';


@NgModule({
    imports: [MembershipModule, UsersManagementModule],
    exports: [MembershipModule, UsersManagementModule]
})
export class AccountsModule { }





import {PermissionsModule} from '@upupa/permissions';
@NgModule({
    imports: [PermissionsModule],
    exports: [PermissionsModule]
})
export class AppPermissionsModule { }