import { Component, signal } from '@angular/core';
import { InputComponent } from './input.component';

@Component({
  selector: 'app-input-example',
  standalone: true,
  imports: [InputComponent],
  template: `
    <div class="example-container">
      <h2>Input Component Examples</h2>

      <!-- Basic text input -->
      <app-input
        label="Name"
        placeholder="Enter your name"
        [validators]="{ required: true, minLength: 2 }"
        [(value)]="name"
      />

      <!-- Email input with validation -->
      <app-input
        label="Email"
        type="email"
        placeholder="Enter your email"
        [validators]="{ required: true, email: true }"
        [(value)]="email"
      />

      <!-- Password input -->
      <app-input
        label="Password"
        type="password"
        placeholder="Enter your password"
        [validators]="{ required: true, minLength: 8 }"
        [(value)]="password"
      />

      <!-- Number input -->
      <app-input
        label="Age"
        type="number"
        placeholder="Enter your age"
        [validators]="{ required: true, custom: ageValidator }"
        [(value)]="age"
      />

      <!-- Disabled input -->
      <app-input
        label="Disabled Field"
        placeholder="This field is disabled"
        [disabled]="true"
        value="Disabled content"
      />

      <!-- Custom validation -->
      <app-input
        label="Phone Number"
        placeholder="Enter phone number"
        [validators]="{ pattern: phonePattern }"
        [(value)]="phone"
      />

      <div class="debug-info">
        <h3>Debug Information</h3>
        <pre>{{ debugInfo() }}</pre>
      </div>
    </div>
  `,
  styles: [
    `
      .example-container {
        max-width: 600px;
        margin: 20px;
        padding: 20px;
      }

      app-input {
        margin-bottom: 20px;
        display: block;
      }

      .debug-info {
        margin-top: 30px;
        padding: 15px;
        background-color: #f5f5f5;
        border-radius: 4px;
      }

      pre {
        white-space: pre-wrap;
        font-family: monospace;
      }
    `,
  ],
})
export class InputExampleComponent {
  name = signal('');
  email = signal('');
  password = signal('');
  age = signal('');
  phone = signal('');

  phonePattern = /^\d{3}-\d{3}-\d{4}$/; // US phone format: 123-456-7890

  ageValidator = (value: string): string | null => {
    const ageNum = parseInt(value, 10);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 120) {
      return 'Age must be between 18 and 120';
    }
    return null;
  };

  debugInfo = signal('');

  constructor() {
    // Update debug info when any value changes
    this.updateDebugInfo();
  }

  private updateDebugInfo(): void {
    this.debugInfo.set(
      `
Name: ${this.name()}
Email: ${this.email()}
Password: ${this.password()}
Age: ${this.age()}
Phone: ${this.phone()}
    `.trim(),
    );
  }
}
