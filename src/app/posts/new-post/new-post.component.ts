import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/models/post';
import { CategoriesService } from 'src/app/services/categories.service';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent {
permalink: string='';
imgSrc: any ='./assets/images.jpg'
selectedImg: any;
categories: any;
postForm: FormGroup;


constructor(
  private categoryService: CategoriesService,
  private fb: FormBuilder,
  private postService: PostsService,
  private route: ActivatedRoute
) {
  this.postForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(10)]],
    permalink: ['', Validators.required],
    excerpt: ['', [Validators.required, Validators.minLength(5)]],
    category: ['', Validators.required],
    postImg: ['', Validators.required],
    content: ['', Validators.required],
  });
}

ngOnInit(): void {
  this.categoryService.loadData().subscribe((val)=> {
    this.categories = val;
  });
}

  onTitleChanged($event){
    console.log($event.target.value);
    const title=$event.target.value;
    this.permalink = title.replace(/\s/g, '-');
 }

 showPreview($event){
  const reader = new FileReader();
  reader.onload = (e) => {
    this.imgSrc = e.target.result;
  };
  reader.readAsDataURL($event.target.files[0]);
  this.selectedImg = $event.target.files[0];
 }
 
 onSumbit() {
  console.log(this.postForm.value);
  let splitted = this.postForm.value.category.split('-');
  console.log(splitted);

  const postData: Post = {
    title: this.postForm.value.title,
    permalink: this.postForm.value.permalink,
    category: {
      categoryId: splitted[0],
      category: splitted[1]
    },
    postImgPath: '',
    excerpt: this.postForm.value.excerpt,
    content: this.postForm.value.content,
    isFeatured: false,
    views: 0,
    status: 'new',
    createdAt: new Date()
  };
  this.postService.uploadImage(
    this.selectedImg,
    postData,
    // this.formStatus,
    // this.docId
  );

}
}

