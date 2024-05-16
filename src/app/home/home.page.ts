import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  email: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private modalController: ModalController // Inject ModalController
  ) {
    this.email = this.authService.getUserEmail();
  }

  async logout() {
    this.authService.logOut();
    await this.modalController.dismiss(); // Close the modal
    this.router.navigateByUrl('/login');
  }
}
