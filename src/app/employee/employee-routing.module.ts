import { NgModule } from '@angular/core';
// Import RouterModule & Routes type
import { RouterModule, Routes } from '@angular/router';

// Import all the components that we will be referencing in the route definitions
import { CreateEmployeeComponent } from './create-employee/create-employee.component';
import { ListEmployeesComponent } from './list-employees/list-employees.component';

// Define the routes
const appRoutes: Routes = [
  { path: '', component: ListEmployeesComponent },
  { path: 'create', component: CreateEmployeeComponent },
  { path: 'edit/:id', component: CreateEmployeeComponent },
];

// In a feature module forChild() method must be used to register routes
// Export RouterModule, so the it's directives like RouterLink, RouterOutlet
// are available to the EmployeeModule that imports this module
@NgModule({
  imports: [ RouterModule.forChild(appRoutes) ],
  exports: [ RouterModule ]
})
export class EmployeeRoutingModule { }
