import { defineStore } from 'pinia';

export const useFormStore = defineStore('form', {
  state: () => ({
    activePage: 1,
    service_type_id: null,
    business_type_id: null,
    business_model_id:null,
    business_name_i18n: null,
    business_person_i18n: null,
    business_address_i18n: null,
    business_province_id: null,
    business_district_id: null,
    business_subdistrict_id: null,
    business_contact_i18n: null,
    business_email_i18n: null,
    business_documents: [],
    shop_name_i18n: null,
    shop_address_i18n: null,
    shop_province_id:null,
    shop_district_id:null,
    shop_subdistrict_id:null,
    business_open_date: [],
    shop_time_i18n: '',
    shop_phone_i18n: null,
    shop_details_i18n: null,
    latitude_i18n:null,
    longitude_i18n:null,

    image_cover: '',
    image_profile: '',
    business_img: [],
    business_social_media: [],
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
    setForm3(business_name_i18n, business_person_i18n, business_address_i18n,business_province_id,business_district_id,business_subdistrict_id, business_contact_i18n, business_email_i18n, business_documents) {
      this.business_name_i18n = business_name_i18n;
      this.business_person_i18n = business_person_i18n;
      this.business_address_i18n = business_address_i18n;
      this.business_province_id = business_province_id;
      this.business_district_id = business_district_id;
      this.business_subdistrict_id = business_subdistrict_id;
      this.business_contact_i18n = business_contact_i18n;
      this.business_email_i18n = business_email_i18n;
      this.business_documents = business_documents;
    },
    setForm4(shop_name_i18n, shop_address_i18n,shop_province_id,shop_district_id,shop_subdistrict_id, business_open_date, shop_time_i18n, shop_phone_i18n, shop_details_i18n, image_cover, image_profile, business_img, business_social_media,latitude_i18n,longitude_i18n) {
      this.shop_name_i18n = shop_name_i18n;
      this.shop_address_i18n = shop_address_i18n;
      this.shop_province_id = shop_province_id;
      this.shop_district_id = shop_district_id;
      this.shop_subdistrict_id = shop_subdistrict_id;
      this.business_open_date = business_open_date;
      this.shop_time_i18n = shop_time_i18n;
      this.shop_phone_i18n = shop_phone_i18n;
      this.shop_details_i18n = shop_details_i18n;
      this.image_cover = image_cover;
      this.image_profile = image_profile;
      this.business_img = business_img;
      this.business_social_media = business_social_media;
      this.latitude_i18n = latitude_i18n,
      this.longitude_i18n = longitude_i18n
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
