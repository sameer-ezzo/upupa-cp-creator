
import { NgModule } from '@angular/core';
import { MembershipModule, UsersManagementModule } from '@upupa/membership';



@NgModule({
    imports: [MembershipModule, UsersManagementModule],
    exports: [MembershipModule, UsersManagementModule]
})
export class AccountsModule { }