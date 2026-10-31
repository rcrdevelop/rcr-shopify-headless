<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-secondary text-dark">
      <q-toolbar>
        <q-toolbar-title class="row items-center q-gutter-sm">
          <q-icon name="storefront" color="primary" />
          <span class="text-bold"
            >Shop<span class="text-primary">RCR</span></span
          >
          <q-badge color="primary" label="headless" />
        </q-toolbar-title>

        <q-tabs shrink stretch active-color="primary">
          <q-route-tab to="/" label="Tienda" icon="storefront" exact />
          <q-route-tab to="/admin" label="Vendedor" icon="dashboard" exact />
        </q-tabs>

        <q-btn flat round dense icon="favorite_border" class="q-mx-xs">
          <q-badge v-if="store.wishlist.length" floating color="negative">{{
            store.wishlist.length
          }}</q-badge>
          <q-tooltip>Wishlist</q-tooltip>
        </q-btn>
        <q-btn
          flat
          round
          dense
          icon="shopping_cart"
          @click="store.cartOpen = true"
        >
          <q-badge v-if="store.cartCount" floating color="primary">{{
            store.cartCount
          }}</q-badge>
        </q-btn>
      </q-toolbar>
    </q-header>

    <CartDrawer
      @checkout="
        checkoutOpen = true;
        store.cartOpen = false;
      "
    />
    <CheckoutDialog v-model="checkoutOpen" />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import CartDrawer from "@/components/CartDrawer.vue";
import CheckoutDialog from "@/components/CheckoutDialog.vue";
import { useShopStore } from "@/stores/shop";

const store = useShopStore();
const checkoutOpen = ref(false);
</script>
