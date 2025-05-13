import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private storage:AngularFireStorage,
    private afs: AngularFirestore,
    private toastr:ToastrService,
    private router:Router
  ) { }


  uploadImage(selectedImage,postData){ 
    const filePath = `postIMG/${Date.now()}`;
    console.log(filePath);


    this.storage.upload(filePath,selectedImage).then(()=>{
      console.log('post image uploaded successfully');

      this.storage.ref(filePath).getDownloadURL().subscribe(URL=>{
        //console.log(URL);
        postData.postImgPath = URL;
        console.log(postData);

        // if(formStatus == 'Edit'){
        //   this.updateData(id,postData);
        // }else{
          
        // }
        this.saveData(postData);

      })

    })
  }
  saveData(postData){
    this.afs.collection('posts').add(postData).then(docRef=> {
      
      this.toastr.success('data Insert Successfully..!');
      this.router.navigate(['/posts']);
    })
    
  }
  loadData():Observable<Object>{
    return this.afs.collection('posts').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, data }
      })
    })

  )

 }

}


