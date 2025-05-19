import { Component, EventEmitter, Input, OnInit, Output, SimpleChange } from '@angular/core';
import { IDatosPago } from '../../interfaces/datosPago.interface';

@Component({
  selector: 'app-mini-metodo-pago',
  templateUrl: './mini-metodo-pago.component.html',
  styleUrl: './mini-metodo-pago.component.css'
})
export class MiniMetodoPagoComponent implements OnInit {
  public metodoSeleccionado!: string;
  public datosPago: IDatosPago = {
    cvv: 0,
    fechaCaducidad: '',
    numeroTarjeta: "",
    titularTarjeta: ""
  };

  public cvv!: number;
  public fechaCaducidadError: boolean = false;
  public cardNumberError: boolean = false;
  public cardNumberTouched = false;
  public cvvError: boolean = false;

  @Output()
  public EventMetodoPago: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  public datosPagoEvent:EventEmitter<IDatosPago> = new EventEmitter<IDatosPago>();

  @Output()
  public volverAPrincipal: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
    this.validarFormulario();
  }


  seleccionarMetodo(metodo: string) {
    this.metodoSeleccionado = metodo;
    this.EventMetodoPago.emit(this.metodoSeleccionado);
  }

  onCardNumberChange() {
    if(this.datosPago.numeroTarjeta){
      this.cardNumberError = !this.ValidarNumeroTarjeta(this.datosPago.numeroTarjeta);
      this.cardNumberTouched = true;
    }else{
      this.cardNumberError = true;
    }
  }

  onCvvBlur() {
    console.log("CVV ingresado:", this.datosPago.cvv);

    if (this.datosPago.cvv) {
      this.cvvError = !this.validateCvv(this.datosPago.cvv);
    } else {
      this.cvvError = true; // Si el campo está vacío
    }

  }


  ValidarNumeroTarjeta(cardNumber: string): boolean {
    let sum = 0;
    let shouldDouble = false;

    // Elimina cualquier carácter no numérico
    cardNumber = this.datosPago.numeroTarjeta.replace(/\D/g, '');

    // Recorre el número de tarjeta de derecha a izquierda
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digito = parseInt(cardNumber.charAt(i), 10);

      // Duplica el dígito solo si shouldDouble es true
      if (shouldDouble) {
        digito *= 2;
        if (digito > 9) {
          digito -= 9;
        }
      }

      // Suma el dígito al total
      sum += digito;

      // Alterna el valor de shouldDouble para la siguiente iteración
      shouldDouble = !shouldDouble;
    }

    // El número de tarjeta es válido si el total es divisible por 10
    return sum % 10 === 0;
  }


  autoFormatMonth() {
    let cleaned = this.datosPago.fechaCaducidad.replace(/[^0-9]/g, '');

    if (cleaned.length > 2) {
      cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }
    this.datosPago.fechaCaducidad = cleaned;

    this.fechaCaducidadError = !this.validateMonth(cleaned);
  }

  validateInput(event: KeyboardEvent) {
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'Tab'];
    // Evita que se ingresen caracteres que no son números o backspace
    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  validateMonth(expiryDate: string) {
    const [month, year] = expiryDate.split('/').map(part => parseInt(part, 10));

    if (!month || !year || month < 1 || month > 12) {
      return false; // Mes no válido
    }

    const today = new Date();
    const expiry = new Date();
    expiry.setFullYear(year, month - 1, 1);

    return expiry > today; // La fecha de expiración debe ser mayor que hoy
  }

  validateCvv(cvv: number): boolean {
    const cvvString = cvv.toString(); // Convertir a string para validación
    return /^\d{3,4}$/.test(cvvString); // Asegura que sean 3 o 4 dígitos numéricos
  }

  formValid(){
    return !this.cardNumberError && !this.fechaCaducidadError && !this.cvvError;
  }

  validarFormulario() {
    this.cardNumberError = !this.ValidarNumeroTarjeta(this.datosPago.numeroTarjeta);
  }


  submit() {
    this.datosPagoEvent.emit(this.datosPago);
    this.volverAPrincipal.emit();
  }


  ParaAtras() {
    this.volverAPrincipal.emit();
  }




}
