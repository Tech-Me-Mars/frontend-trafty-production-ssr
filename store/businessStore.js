import { defineStore } from 'pinia';

export const useFormStore = defineStore('form', {
  state: () => ({
    activePage: 1,
    service_type_id: null,
    business_type_id: null,
    business_model_id:null,
    business_name: null,
    business_person: null,
    business_address: null,
    business_contact: null,
    business_email: null,
    business_list: [],
    shop_name: null,
    shop_address: null,
    shop_days: [],
    shop_time: '',
    shop_phone: '',
    shop_details: null,
    latitude:null,
    longitude:null,

    image_cover: '',
    image_profile: '',
    business_img: [],
    social_media: [],
    business_list:[]
  }),
  actions: {
    setFormStart(service_type_id) {
      this.service_type_id = service_type_id;
    },
    setForm1(business_type_id) {
      this.business_type_id = business_type_id;
    },
    setForm2(business_model_id){
      this.business_model_id=business_model_id;
    },
    setForm3(business_name, business_person, business_address, business_contact, business_email, business_list) {
      this.business_name = business_name;
      this.business_person = business_person;
      this.business_address = business_address;
      this.business_contact = business_contact;
      this.business_email = business_email;
      this.business_list = business_list;
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
