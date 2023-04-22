import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(private toastCtrl: ToastController) { }

  async showToast(message: string, color: string = "medium") {
    let t = await this.toastCtrl.create({
      message,
      color,
      duration: 3000
    });
    t.present();
  }

}
