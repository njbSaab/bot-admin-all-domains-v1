import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment'; // Импорт environment

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  email = '';
  password = '';
  passwordVisible = false;
  errorMessage = '';

  // Используем данные из environment
  private validEmail = environment.auth.email;
  private validPassword = environment.auth.password;



  constructor(private router: Router) {
    console.log(this.validEmail, this.validPassword);
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.email === this.validEmail && this.password === this.validPassword) {
      localStorage.setItem('isAuthenticated', 'true');
      this.router.navigate(['/admin']);
    } else {
      this.errorMessage = 'Invalid email or password.';
    }
  }
}
