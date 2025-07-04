import { defineStore } from 'pinia';

export const useFormStore = defineStore('form', {
  state: () => ({
    activePage: 1,
    serviceTypeId: null,
    serviceTypeName: '',
    businessTypeId: null,
    businessTypeName: '',
    business_model_id:null,
    business_model_name:'',
    is_corporation: null,
    business_name: '',
    business_person: '',
    business_address: '',
    business_contact: '',
    business_email: '',
    listFiles: [],
    shop_name: '',
    shop_address: '',
    shop_days: [],
    shop_time: '',
    shop_phone: '',
    shop_details: '',
    latitude:null,
    longitude:null,

    image_cover: '',
    image_profile: '',
    business_img: [],
    social_media: [],
    business_list:[]
  }),
  actions: {
    setFormStart(serviceTypeId, serviceTypeName) {
      this.serviceTypeId = serviceTypeId;
      this.serviceTypeName = serviceTypeName;
    },
    setForm1(businessTypeId, businessTypeName) {
      this.businessTypeId = businessTypeId;
      this.businessTypeName = businessTypeName;
    },
    setForm2(business_model_id,business_model_name,is_corporation){
      this.business_model_id=business_model_id;
      this.business_model_name = business_model_name;
      this.is_corporation = is_corporation
    },
    setForm3(business_name, business_person, business_address, business_contact, business_email, listFiles) {
      this.business_name = business_name;
      this.business_person = business_person;
      this.business_address = business_address;
      this.business_contact = business_contact;
      this.business_email = business_email;
      this.listFiles = listFiles;
    },
    setForm4(shop_name, shop_address, shop_days, shop_time, shop_phone, shop_details, image_cover, image_profile, business_img, social_media,latitude,longitude) {
      this.shop_name = shop_name;
      this.shop_address = shop_address;
      this.shop_days = shop_days;
      this.shop_time = shop_time;
      this.shop_phone = shop_phone;
      this.shop_details = shop_details;
      this.image_cover = image_cover;
      this.image_profile = image_profile;
      this.business_img = business_img;
      this.social_media = social_media;
      this.latitude = latitude,
      this.longitude = longitude
    },

    setForm5(newBusiness) {
      this.business_list.push(newBusiness); // เพิ่มข้อมูลใหม่เข้าไปใน array
    },
    nextPage() {
      // if (this.activePage < 7) {
        this.activePage += 1;
      // }
    },
    prevPage() {
      if (this.activePage > 1) {
        this.activePage -= 1;
      }
    },
    goToPage(pageNumber) {
      this.activePage = pageNumber;
    }
  }
});
