import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Employee, EmployeeService, Religion } from 'src/app/services/employee.service';
import { SearchService } from 'src/app/services/search.service';
import * as bootstrap from 'bootstrap';
import { ReligionService } from 'src/app/services/religion.service';

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

  religions: Religion[] = [];
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  role = '';
  newEmployee: Employee = { name: '', email: '', jobTitle: '', phone: '', imageUrl: '' };
  selectedEmployee: Employee & { religionName?: string } = { name: '', email: '', jobTitle: '', phone: '', imageUrl: '' };
  modalMode: 'add' | 'edit' | 'delete' | 'view' = 'view';
  filteredReligions: any[] = [];
  selectedFile?: File;
  imageFlag: number = 0;
  imageError: string | null = null;
  private modalRef?: bootstrap.Modal;

  constructor(private empService: EmployeeService, private auth: AuthService, private searchService: SearchService, private religionService: ReligionService) { }

  ngOnInit(): void {
    this.role = this.auth.getRole();
    this.loadEmployees();
    if (this.role === 'ROLE_ADMIN') this.loadReligions();

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

  loadReligions(): void {
    this.religionService.getReligions().subscribe(
      (response: Religion[]) => {
        this.religions = response;
      },
      (error) => {
        console.error('Error fetching religions:', error);
      }
    );
  }

  filterReligions() {
    const term = this.selectedEmployee.religion?.name?.toLowerCase() || '';
    if (term === '') {
      this.filteredReligions = [];
      return;
    }
    this.filteredReligions = this.religions.filter(r =>
      r.name.toLowerCase().includes(term)
    );
  }

  selectReligion(r: any) {
    this.selectedEmployee.religion = r;
    this.filteredReligions = [];
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
    if (this.role === 'ROLE_ADMIN') {
      this.empService.addEmployee(this.newEmployee).subscribe(() => {
        this.loadEmployees();
        this.newEmployee = { name: '', email: '', jobTitle: '', phone: '', imageUrl: '' };
      });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const maxSizeKB = 50;
    const desiredWidth = 300;
    const desiredHeight = 300;
    const maxFileNameLength = 100;
    const fileNamePattern = /^[a-zA-Z0-9._-]+$/; // only safe characters

    // ✅ Check file name length
    if (file.name.length > maxFileNameLength) {
      this.imageError = `File name should not exceed ${maxFileNameLength} characters.`;
      this.selectedFile = undefined;
      return;
    }

    // ✅ Check file name characters
    if (!fileNamePattern.test(file.name)) {
      this.imageError = `File name can only contain letters, numbers, '.', '-', and '_'.`;
      this.selectedFile = undefined;
      return;
    }

    // ✅ Check file size
    if (file.size / 1024 > maxSizeKB) {
      this.imageError = `File size should be under ${maxSizeKB}KB.`;
      this.selectedFile = undefined;
      return;
    }

    // ✅ Check resolution
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const img = new Image();
      img.onload = () => {
        if (img.width !== desiredWidth || img.height !== desiredHeight) {
          this.imageError = `Image resolution must be ${desiredWidth}x${desiredHeight}px.`;
          this.selectedFile = undefined;
        } else {
          this.imageError = null;
          this.selectedFile = file; // ✅ Valid image
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  onSaveEmployee() {
    if (this.modalMode === 'add' || this.modalMode === 'edit') {
      const religionName = this.selectedEmployee.religion?.name;

      if (religionName) {
        this.religionService.addReligion(religionName).subscribe(religion => {
          this.selectedEmployee.religion = religion;
          this.saveEmployeeData();
        });
      } else {
        this.saveEmployeeData();
      }
    }
  }

  saveEmployeeData() {
    if (this.modalMode === 'add') {
      this.empService.addEmployee(this.selectedEmployee).subscribe(emp => {
        this.loadEmployees();
        this.modalRef?.hide();
        this.selectedFile = undefined;
      });
    } else if (this.modalMode === 'edit') {
      this.empService.updateEmployee(this.selectedEmployee).subscribe(emp => {
        if (this.selectedFile) {
          this.empService.uploadEmployeeImage(emp.id!, this.selectedFile).subscribe(() => {
            this.loadEmployees();
            this.modalRef?.hide();
            this.selectedFile = undefined;
          });
        } else {
          this.loadEmployees();
          this.modalRef?.hide();
        }
      });
    }
  }

  deleteEmployee(id: number) {
    if (this.role === 'ROLE_ADMIN') {
      this.empService.deleteEmployee(id).subscribe(() => this.loadEmployees());
      this.modalRef?.hide();
    }
  }

  onOpenModal(employee: Employee | null, mode: 'add' | 'edit' | 'delete' | 'view'): void {
    this.modalMode = mode;
    if (mode === 'add') {
      this.selectedEmployee = { name: '', email: '', jobTitle: '', phone: '', imageUrl: '' };
    } else if (mode === 'edit' && employee) {
      this.selectedEmployee = { ...employee };
    } else if (mode === 'delete' && employee) {
      this.selectedEmployee = { ...employee };
    } else if (mode === 'view' && employee) {
      this.selectedEmployee = { ...employee };
    }
    const modalEl = document.getElementById('employeeModal');
    const deleteModalEl = document.getElementById('deleteEmployeeModal');
    const viewModalEl = document.getElementById('employeeDetailsModal');
    if (mode === 'delete' && deleteModalEl) {
      this.modalRef = new bootstrap.Modal(deleteModalEl);
      this.modalRef.show();
      return;
    } else if (mode === 'view' && viewModalEl) {
      this.modalRef = new bootstrap.Modal(viewModalEl);
      this.modalRef.show();
    } else if (modalEl) {
      this.modalRef = new bootstrap.Modal(modalEl);
      this.modalRef.show();
    }
  }

  compareReligion(r1: any, r2: any): boolean {
    return r1 && r2 ? r1.id === r2.id : r1 === r2;
  }

  onReligionChange(name: string) {
    const found = this.religions.find(r => r.name === name);
    if (found) {
      this.selectedEmployee.religion = found;
    } else {
      this.selectedEmployee.religion = { id: undefined, name: name } as Religion;
    }
  }

}
