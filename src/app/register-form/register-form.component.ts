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
import {MatCheckboxChange, MatCheckboxModule} from '@angular/material/checkbox';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiService} from '../services/api.service';

import {PersonalInfo} from '../personalInfo.model';

import { IdentityDetails} from '../identityDetails.model';
import { BankDetails} from '../bankDetails.model';

import * as CryptoJS from 'crypto-js';
import { EncryptedValue } from '../encryptedValue.model';
import { AES } from 'crypto-js';


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
 

 

  panelOpenState = false;
  panelOpenState1 = false;
  ApiService: any;

  province: any[] = [];
  district: any[] = [];
  area: any[] = [];
  


  
  

  

  

  registerForm!:FormGroup;
  isLinear = false;
  showError: boolean = false;

  fileName = '';
  file2Name = '';
  file3Name = '';


 
  

  constructor(private formBuilder:FormBuilder, private http:HttpClient, private apiService:ApiService){
    

  
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
          shippingProvinceId: ['',Validators.required],
          shippingDistrictId: ['',Validators.required],
          shippingAreaId: ['',Validators.required],
          shippingStreet1: ['',Validators.required],
          shippingStreet2: [''],
          }),
          useShippingAddress: false,
          billing: this.formBuilder.group({
          billingProvinceId: ['',Validators.required],
          billingDistrictId: ['',Validators.required],
          billingAreaId: ['',Validators.required],
          billingStreet1: ['',Validators.required],
          billingStreet2: [''],
       
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

   // Patch each individual control in the billing form group
  copyShippingAddressToBillingAddress(event:MatCheckboxChange): void {
    if (event.checked) {
      const shipping = this.registerForm.get('address.shipping')?.value;
      console.log(shipping);
      const billing = this.registerForm.get('address.billing');
      console.log(billing);
      
   
      if (shipping && billing) {
        billing.get('billingProvinceId')?.setValue(shipping.shippingProvinceId);
        billing.get('billingDistrictId')?.setValue(shipping.shippingDistrictId);
        billing.get('billingAreaId')?.setValue(shipping.shippingAreaId);
        billing.get('billingStreet1')?.setValue(shipping.shippingStreet1);
        billing.get('billingStreet2')?.setValue(shipping.shippingStreet2);
      


        console.log(billing)
      }
      

    } else {
      
      this.registerForm.get('address.billing')?.reset();
    }
  }
  
  
// Form Image upload

  urls:string[]=[];
  encryptedUrls: string[] = [];
  decryptedUrls: string[] = [];
  

  selectFiles(event:any){
    const file:File = event.target.files[0];

    if (file) {

        this.fileName = file.name;

        const formData = new FormData();

        formData.append("thumbnail", file);

        const upload$ = this.http.post("/api/thumbnail-upload", formData);

        upload$.subscribe();
    }
    if (event && event.target && event.target.files) {     
      console.log(event.target.files); // Check if files are present in the console 
      for(let i=0; i<event.target.files.length; i++){
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[i]);
        reader.onload=(event: any)=>{

          const dataUrlString = event.target.result.toString(); // Convert data URL to string          
          // Encrypt the dataUrlString using AES
          const secretKey = 'ABCDEabcde012345'; // Replace with your secret key
          const encryptedUrl = AES.encrypt(dataUrlString, secretKey).toString();


          this.urls.push(dataUrlString);
          this.encryptedUrls.push(encryptedUrl);


          console.log(dataUrlString);
          console.log('Encrypted Url:'+ encryptedUrl);
          
         
        };
      }
    }
  }

  imgs:string[]=[];
  encryptedimgs: string[] = [];
  decryptedimgs: string[] = [];

  selectImgs(event:any){
    const file:File = event.target.files[0];

    if (file) {

        this.file2Name = file.name;

        const formData = new FormData();

        formData.append("thumbnail", file);

        const upload$ = this.http.post("/api/thumbnail-upload", formData);

        upload$.subscribe();
    }
    if (event && event.target && event.target.files) {  
      console.log(event.target.files); // Check if files are present in the console 
   
      for(let i=0; i<event.target.files.length; i++){
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[i]);
        reader.onload=(event: any)=>{
          
          const dataimgString = event.target.result.toString(); // Convert data URL to string          
           // Encrypt the dataUrlString using AES
           const secretKey = 'ABCDEabcde012345'; // Replace with your secret key
           const encryptedimg = AES.encrypt(dataimgString, secretKey).toString();
          
           this.imgs.push(dataimgString);
           this.encryptedimgs.push(encryptedimg);


          console.log(dataimgString);
          console.log('Encrypted img:'+ encryptedimg);
         
          
        };
      }
    }
  }



  images:string[]=[];
  encryptedimages: string[] = [];
  decryptedimages: string[] = [];

  selectImages(event:any){
    const file:File = event.target.files[0];

    if (file) {

        this.file3Name = file.name;

        const formData = new FormData();

        formData.append("thumbnail", file);

        const upload$ = this.http.post("/api/thumbnail-upload", formData);

        upload$.subscribe();
    }
    if (event && event.target && event.target.files) {     
      console.log(event.target.files); // Check if files are present in the console 


      for(let i=0; i<event.target.files.length; i++){
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[i]);
        reader.onload=(event: any)=>{
          const dataimageString = event.target.result.toString(); // Convert data URL to string          
           // Encrypt the dataUrlString using AES
          const secretKey = 'ABCDEabcde012345'; // Replace with your secret key
          const encryptedimage = AES.encrypt(dataimageString, secretKey).toString();


          this.images.push(dataimageString);
          this.encryptedimages.push(encryptedimage);


          console.log(dataimageString);
          console.log('Encrypted image:'+ encryptedimage);
        
        };
        
      }
    }
  }




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
