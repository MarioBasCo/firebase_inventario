import { Injectable } from '@angular/core';
import { IProducto } from '../interfaces/interfaces';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private dbPath = '/productos';

  tutorialsRef!: AngularFirestoreCollection<IProducto>;

  constructor(private firestore: AngularFirestore) { 
    this.tutorialsRef = this.firestore.collection(this.dbPath);
  }

  getAll(): AngularFirestoreCollection<IProducto> {
    return this.tutorialsRef;
  }

  create(tutorial: IProducto): any {
    return this.tutorialsRef.add({ ...tutorial });
  }

  update(id: string, data: any): Promise<void> {
    return this.tutorialsRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.tutorialsRef.doc(id).delete();
  }
}
