<template>
  <i @click="drawervisible = true" class="fa-solid fa-bars" style="color: white; font-size: 22px;"></i>

  <Drawer v-model:visible="drawervisible" header="Menu" class="w-64 !bg-zinc-300">
    <template #header>
      <div class="flex items-center gap-2">
        <img src="/image/logo_erp.png" style="width: 50px;" alt="" />
        <span class="font-bold">Menu</span>
      </div>
    </template>

    <ul class="menu-list space-y-4">
      <li v-for="menu in listMenu" :key="menu.id || menu.label" class="menu-item flex flex-col gap-1 cursor-pointer">
        <!-- Main Level -->
        <div @click="navigateTo(menu.path)" class="flex items-center gap-3 hover:bg-gray-200 p-2 rounded-md">
          <i :class="menu.icon"></i>
          <span>{{ menu.label }}</span>
        </div>

        <!-- Sub Level -->
        <ul v-if="menu.items" class="ml-6 space-y-2">
          <li v-for="subItem in menu.items" :key="subItem.label"
            @click="navigateTo(subItem.path); drawervisible = false"
            class="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
            <span>{{ subItem.label }}</span>
          </li>
        </ul>
      </li>
    </ul>
  </Drawer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDecryptedCookie } from '~/composables/useEncryptedCookie'

const { t } = useI18n()
const drawervisible = ref(false)

const baseMenu = ref([
])

const listMenu = ref([])

onMounted(async () => {
  await conditionAppendMenu()
})

const conditionAppendMenu = async () => {
  try {
    const role_name = await useDecryptedCookie('role_name')
    const token = await useDecryptedCookie('token')

    const dynamicMenu = [...baseMenu.value]
    dynamicMenu.push({
      id: 0,
      label: t('หน้าแรก'),
      icon: '',
      path: '/'
    })

    dynamicMenu.push(
      {
        label: t('รายการโปรด'),
        icon: '',
        path: '/profile/favorite'
      }
    )

    if (role_name == 'business' || role_name == 'police' || role_name == 'Admin') {
      dynamicMenu.push({
        label: t('ธุรกิจของฉัน'),
        icon: '',
        path: '/vendor/my-business'
      })
    } if (role_name == 'police' || role_name == 'Admin') {
      dynamicMenu.push({
        label: t('ตรวจสอบข้อมูล'),
        icon: '',
        path: '/inspector/home'
      })
    }

    const logoutMenu = {
      label: token ? t('ออกจากระบบ') : t('เข้าสู่ระบบ'),
      icon: '',
      path: '/auth/login'
    }
    const setting = {
      label: t('ตั้งค่า'),
      icon: '',
      path: '/profile'
    }

    listMenu.value = [...dynamicMenu, setting, logoutMenu]
  } catch (error) {
    console.error(error)
  }
}
</script>

<style scoped>
.menu-item i {
  color: #281c74;
}

.menu-item:hover i {
  color: #7d6be3;
}
</style>
