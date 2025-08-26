import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Employee, EmployeeService } from 'src/app/services/employee.service';
import { SearchService } from 'src/app/services/search.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  autoResize(event: Event): void {
    const target = event.target as HTMLTextAreaElement | null;
    if (!target) return;

    target.style.height = 'auto';
    target.style.height = target.scrollHeight + 'px';
  }

  ngAfterViewInit() {
    const modal = document.getElementById('employeeModal');
    if (modal) {
      modal.addEventListener('hidden.bs.modal', () => {
        const textareas = modal.querySelectorAll<HTMLTextAreaElement>('textarea.auto-expand');
        textareas.forEach(t => {
          t.style.height = '38px';
        });
      });
    }
  }

  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  role = '';
  newEmployee: Employee = { name: '', email: '', jobTitle: '', phone: '', imageUrl: '' };
  selectedEmployee: Employee = { name: '', email: '', jobTitle: '', phone: '', imageUrl: '' };
  modalMode: 'add' | 'edit' | 'delete' = 'add';
  private modalRef?: bootstrap.Modal;

  constructor(private empService: EmployeeService, private auth: AuthService, private searchService: SearchService) { }

  ngOnInit(): void {
    this.role = this.auth.getRole();
    this.loadEmployees();

    this.searchService.searchTerm$.subscribe(term => {
      this.applySearch(term);
    });
  };

  loadEmployees(): void {
    this.empService.getEmployees().subscribe(data => {
      this.employees = data;
      this.filteredEmployees = data;
    });
  }

  applySearch(term: string): void {
    if (!term) {
      this.filteredEmployees = this.employees;
    } else {
      const lower = term.toLowerCase();
      this.filteredEmployees = this.employees.filter(emp =>
        emp.name.toLowerCase().includes(lower) ||
        emp.email.toLowerCase().includes(lower) ||
        emp.jobTitle.toLowerCase().includes(lower) ||
        emp.phone.toLowerCase().includes(lower)
      );
    }
  }

  addEmployee(): void {
    if (this.role === 'ADMIN') {
      this.empService.addEmployee(this.newEmployee).subscribe(() => {
        this.loadEmployees();
        this.newEmployee = { name: '', email: '', jobTitle: '', phone: '', imageUrl: '' };
      });
    }
  }

  onSaveEmployee() {
    if (this.role === 'ROLE_ADMIN') {
      if (this.modalMode === 'add') {
        this.empService.addEmployee(this.selectedEmployee).subscribe(() => {
          this.loadEmployees();
          this.modalRef?.hide();
        });
      } else if (this.modalMode === 'edit') {
        this.empService.updateEmployee(this.selectedEmployee).subscribe(() => {
          this.loadEmployees();
          this.modalRef?.hide();
        });
      }
    }
  }

  deleteEmployee(id: number) {
    if (this.role === 'ROLE_ADMIN') {
      this.empService.deleteEmployee(id).subscribe(() => this.loadEmployees());
      this.modalRef?.hide();
    }
  }

  onOpenModal(employee: Employee | null, mode: 'add' | 'edit' | 'delete'): void {
    this.modalMode = mode;
    if (mode === 'add') {
      this.selectedEmployee = { name: '', email: '', jobTitle: '', phone: '', imageUrl: '' };
    } else if (mode === 'edit' && employee) {
      this.selectedEmployee = { ...employee };
    } else if (mode === 'delete' && employee) {
      this.selectedEmployee = { ...employee };
    }
    const modalEl = document.getElementById('employeeModal');
    const deleteModalEl = document.getElementById('deleteEmployeeModal');
    if (mode === 'delete' && deleteModalEl) {
      this.modalRef = new bootstrap.Modal(deleteModalEl);
      this.modalRef.show();
      return;
    } else if (modalEl) {
      this.modalRef = new bootstrap.Modal(modalEl);
      this.modalRef.show();
    }
  }

}
