import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Condition } from '../condition';
import { passwordStrength } from '../types';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-password-validation',
  standalone: true,
  imports: [
    FormsModule,
    NgFor,
  ],
  templateUrl: './password-validation.component.html',
  styleUrl: './password-validation.component.scss'
})

export class PasswordValidationComponent {
  password: string = ''
  lenghtIsInvalid: boolean = false
  passwordStrength: passwordStrength[] = ['', '', '']
  passwordStrengthLevels: passwordStrength[] = ['easy', 'medium', 'strong']
  get passwordClassesCheck() {
    return this.lenghtIsInvalid === true ?
      ['short', 'short', 'short'] :
      this.passwordStrength
  }
  conditions: string[] = [
    'Only letters/digits/symbols - the password is easy',
    'Combination of letters-symbols/letters-digits/digits-symbols - the password is medium',
    'Has letters, symbols and numbers - the password is strong'
  ]
  conditionsCheck: Condition[] = [
    { name: 'numbers', regex: /[0-9]/, message: 'you need include numbers' },
    { name: 'letters', regex: /[a-zA-Z]/, message: 'you need include letters' },
    { name: 'special symbols', regex: /[^a-zA-Z0-9]/, message: 'you need include special symbols' },
  ]
  listOfUnmetConditions: Condition[] = []

  checkLength() {
    this.password.length < 8 && this.password.length >= 1 ?
      this.lenghtIsInvalid = true :
      this.lenghtIsInvalid = false
  }

  checkPasswordStrength(event: Event) {
    // if password length < 8 return
    this.checkLength()
    if (this.lenghtIsInvalid === true) return

    let countMetConditions: number = 0
    this.listOfUnmetConditions = []

    // checks which conditions are met
    this.conditionsCheck.forEach((condition: Condition) => {
      const conditionIsMet = !!this.password.match(condition.regex)

      if (conditionIsMet) {
        countMetConditions++
      } else {
        this.listOfUnmetConditions.push(condition)
      }
    })

    // clears unmet conditions from DOM if input is empty
    if (this.listOfUnmetConditions.length === 3) {
      this.listOfUnmetConditions = []
    }

    // checks wich classes to use according to password strength
    switch (countMetConditions) {
      case 1:
        this.passwordStrength = ['easy', '', '']
        break;
      case 2:
        this.passwordStrength = ['medium', 'medium', '']
        break;
      case 3:
        this.passwordStrength = ['strong', 'strong', 'strong']
        break;

      default:
        this.passwordStrength = ['', '', '']
        break;
    }
  }
}