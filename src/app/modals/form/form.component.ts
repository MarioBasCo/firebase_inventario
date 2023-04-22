import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { IProducto } from 'src/app/interfaces/interfaces';
import { DatabaseService } from 'src/app/services/database.service';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  @Input() titulo: string = '';
  @Input() btnText: string = '';
  @Input() data!: IProducto;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private _svcDB: DatabaseService,
    private _svcMsg: MessagesService) {
    this.form = this.fb.group({
      codigo: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      stock: [0, [Validators.required]],
    });
  }

  validFiel(campo: any){
    return this.getControl(campo)?.hasError('required') && (this.getControl(campo)?.dirty || this.getControl(campo)?.touched)
  }

  getControl(control: string){
    return this.form.get(control);
  }

  ngOnInit() {
    if(this.data){
      this.form.patchValue(this.data);
    }
  }
  
  guardar(){
    if(this.data) {
      this.update();
    } else {
      this.create();
    }
  }

  create(): void {
    this._svcDB.create(this.form.value).then(() => {
      console.log('Nueva noticia creada!');
      this._svcMsg.showToast('Nuevo producto registrado');
      this.cerrarModal();
    });
  }

  update(): void {
    if(this.data.id)
    this._svcDB.update(this.data.id, this.form.value)
        .then(() => {
          this._svcMsg.showToast('Producto actualizado!');
          this.cerrarModal();
        })
        .catch(err => console.log(err));
  }

  cerrarModal(){
    this.modalCtrl.dismiss();
  }
}
