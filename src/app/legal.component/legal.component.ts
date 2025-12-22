import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar.component/navbar.component';

@Component({
  selector: 'app-legal',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './legal.component.html',
  styleUrls: ['./legal.component.css']
})
export class LegalComponent {
  // Default view is Privacy Policy
  view: 'privacy' | 'terms' = 'privacy';
}
