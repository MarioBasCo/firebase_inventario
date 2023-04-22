import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { FormComponent } from '../modals/form/form.component';
import { DatabaseService } from '../services/database.service';
import { MessagesService } from '../services/messages.service';
import { map } from 'rxjs';
import { IProducto } from '../interfaces/interfaces';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  loaded: boolean = false;
  data: IProducto[] = [];

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private _svcDB: DatabaseService,
    private _svcMsg: MessagesService
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this._svcDB.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      console.log(data);
      this.data = data;
      this.loaded = true;
    });
  }

  async openModal(data: any = null) {
    const titulo = data ? 'Editar Registro' : 'Nuevo Registro';
    const btnText = data ? 'Actualizar' : 'Guardar';

    const modal = await this.modalCtrl.create({
      component: FormComponent,
      componentProps: {
        titulo,
        data,
        btnText
      },
      backdropDismiss: true,
      cssClass: 'small-modal'
    });

    modal.present();
  }

  editar(item: any) {
    this.openModal(item);
  }

  async eliminar(item: any) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar Eliminación',
      subHeader: '¿Quieres eliminar este registro?',
      message: '¡Vas a eliminar este registro!',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => { console.log('Alert canceled'); }
        },
        {
          text: 'Confirmar',
          role: 'confirm',
          handler: () => {
            console.log('Alert confirmed');
            this.deleteRegistro(item);
          }
        }
      ],
    });

    await alert.present();
  }


  deleteRegistro(data: any): void {
    if (data.id) {
      this._svcDB.delete(data.id)
        .then(() => {
          console.log('The tutorial was updated successfully!');
          this._svcMsg.showToast('Registro eliminado!');
        })
        .catch(err => console.log(err));
    }
  }
}
