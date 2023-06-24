import { Component,  OnInit  } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';

import {NgIf} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {Router} from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {MatStepperModule} from '@angular/material/stepper';
import { MatStep } from '@angular/material/stepper';
import {MatExpansionModule} from '@angular/material/expansion';
import {ThemePalette} from '@angular/material/core';

import {NgFor} from '@angular/common';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImageUploadService} from '../services/image-upload.service';
import { ApiService} from '../services/api.service';

import {PersonalInfo} from '../personalInfo.model';

import { IdentityDetails} from '../identityDetails.model';
import { BankDetails} from '../bankDetails.model';







export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}



@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})


export class RegisterFormComponent implements OnInit{
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  preview = '';
 

  imageInfos?: Observable<any>;

  panelOpenState = false;
  panelOpenState1 = false;
  ApiService: any;

  province: any[] | undefined;
  district: any[] | undefined;
  area: any[] | undefined;
  


  
  

  

  

  registerForm!:FormGroup;
  isLinear = false;
  showError: boolean = false;
  
  

  constructor(private formBuilder:FormBuilder, private imageUpload:ImageUploadService, private http:HttpClient, private apiService:ApiService){
    

  
  }
  ngOnInit(): void {

    

    this.registerForm = this.formBuilder.group({
      user:this.formBuilder.group({
        email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
        contactPersonName: this.formBuilder.control('',Validators.required),
        contactNo: this.formBuilder.control('',[Validators.required,Validators.maxLength(10),Validators.minLength(10)]),
        storeName: this.formBuilder.control('',Validators.required)
      }),
      address:this.formBuilder.group({
        shipping: this.formBuilder.group({
        shippingProvinceId: this.formBuilder.control('',Validators.required),
        shippingDistrictId: this.formBuilder.control('',Validators.required),
        shippingAreaId: this.formBuilder.control('',Validators.required),
        shippingStreet1: this.formBuilder.control('',Validators.required),
        shippingStreet2: this.formBuilder.control(''),
        }),
        useShippingAddress: false,
        billing: this.formBuilder.group({
        shippingProvinceId: this.formBuilder.control('',Validators.required),
        shippingDistrictId: this.formBuilder.control('',Validators.required),
        shippingAreaId: this.formBuilder.control('',Validators.required),
        shippingStreet1: this.formBuilder.control('',Validators.required),
        shippingStreet2: this.formBuilder.control(''),
        })
      }),
      bank:this.formBuilder.group({
        citizenshipId: this.formBuilder.control('',Validators.required),
        businessRegisteredName: this.formBuilder.control('',Validators.required),
        businessRegisteredNo: this.formBuilder.control('',Validators.required),
        panVatNo: this.formBuilder.control('',Validators.required),
        accountName: this.formBuilder.control('',Validators.required),
        bankAccountNo: this.formBuilder.control('',Validators.required),
        bankName: this.formBuilder.control('',Validators.required),
        file: this.formBuilder.control('', [Validators.required]),
        citizenship: this.formBuilder.control('', [Validators.required]),
        panVat: this.formBuilder.control('', [Validators.required]),
        bankChequeImage: this.formBuilder.control('', [Validators.required]),


        fileSource: this.formBuilder.control('', [Validators.required])
      }),
    })



    

   
   

    this.fetchData();
   
  }


   //shipping address same as billing address
   copyShippingAddressToBillingAddress(event: any) {
    if (event.target.checked) {
      const shipping = this.registerForm.get('address.shipping')?.value;
      this.registerForm.get('address.billing')?.patchValue(shipping);
    } else {
      this.registerForm.get('address.billing')?.reset();
    }
  }
  
  
    

  



// Form Image upload

  // 
  

  urls:string[]=[];
  

  selectFiles(event:any){
    if (event.target.files){
      for(let i=0; i<2; i++){
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[i]);
        reader.onload=(event: any)=>{
          this.urls.push(event.target.result);
        };
      }
    }
  }

  imgs:string[]=[];

  selectImgs(event:any){
    if (event.target.files){
      for(let i=0; i<2; i++){
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[i]);
        reader.onload=(event: any)=>{
          this.imgs.push(event.target.result);
        };
      }
    }
  }

  images:{src:string}[]=[];

  selectImages(event:any){
    if (event.target.files){
      for(let i=0; i<2; i++){
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[i]);
        reader.onload=(event: any)=>{
          this.images.push(event.target.result);
        };
        
      }
    }
  }

 







  // post the form details in API
 
  // onSubmit() {
  //   const formValues = this.firstFormGroup.value;
  //   this.apiService.postFormData(formValues).subscribe({
  //     next: (response: any) => {
  //       console.log('Form data saved successfully!', response);
  //       this.firstFormGroup.reset();
  //     },
  //     error: (error: any) => {
  //       console.error('Error occurred while saving form data:', error);
  //     }
  //   });
  // }

  // onSubmitnextpage() {
  //   const formValues = this.secondFormGroup.value;
  //   this.apiService.postFormData(formValues).subscribe({
  //     next: (response: any) => {
  //       console.log('Form data saved successfully!', response);
  //       this.secondFormGroup.reset();
  //     },
  //     error: (error: any) => {
  //       console.error('Error occurred while saving form data:', error);
  //     }
  //   });
  // }
 


  //step control

  get userform(){
    return this.registerForm.get("user") as FormGroup;
  }
  get address(){
    return this.registerForm.get("address") as FormGroup;
  }
  get bankform(){
    return this.registerForm.get("bank") as FormGroup;
  }
 

  HandleSubmit(){
     if (this.registerForm.valid){
      console.log(this.registerForm.value)
     }
     const formValues = this.registerForm.value;

     this.apiService.postFormData(formValues).subscribe({
      next: (response: any) => {
        console.log('Form data saved successfully!', response);
        this.registerForm.reset();
      },
      error: (error: any) => {
        console.error('Error occurred while saving form data:', error);
      }
    });
    if (this.registerForm.invalid) {
      this.showError = true;
      // return;
    }
  }

  //fetching the data from API in [down menu]
  fetchData() {
    this.apiService.fetchData()
      .subscribe(response => {
        this.province = response;
      });

      this.apiService.fetchData()
      .subscribe(response => {
        this.district = response;
      });
      this.apiService.fetchData()
      .subscribe(response => {
        this.area = response;
      });
  }
 




}
