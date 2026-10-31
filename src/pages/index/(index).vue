<template>
  <q-page class="bg-app">
    <div class="hero q-pa-lg">
      <div class="text-h4 text-bold">Colección 2026</div>
      <div class="text-subtitle2 opacity-85"
        >Storefront headless · Vue 3 + adapter Shopify/Firestore</div
      >
    </div>

    <div class="q-pa-md">
      <q-card flat bordered class="q-pa-sm q-mb-md">
        <div class="row q-col-gutter-sm items-center">
          <q-input
            v-model="store.q"
            dense
            outlined
            placeholder="Buscar productos…"
            class="col-12 col-md-4"
          >
            <template #prepend><q-icon name="search" /></template>
          </q-input>
          <q-select
            v-model="store.category"
            :options="['Hombre', 'Mujer', 'Calzado', 'Accesorios']"
            dense
            outlined
            label="Categoría"
            clearable
            class="col-6 col-md-2"
          />
          <q-select
            v-model="store.sort"
            :options="sortOpts"
            dense
            outlined
            label="Ordenar"
            emit-value
            map-options
            class="col-6 col-md-3"
          />
          <div class="col-12 col-md-3">
            <q-slider
              :model-value="store.maxPrice"
              :min="15"
              :max="220"
              :step="5"
              label
              :label-value="`≤ $${store.maxPrice}`"
              color="primary"
              @update:model-value="v => (store.maxPrice = v ?? 220)"
            />
          </div>
        </div>
      </q-card>

      <div class="row q-col-gutter-md">
        <div
          v-for="p in store.filtered"
          :key="p.id"
          class="col-6 col-sm-4 col-md-3"
        >
          <ProductCard :p="p" @quick="quick = p" />
        </div>
        <div
          v-if="!store.filtered.length"
          class="col-12 text-center text-grey-6 q-pa-xl"
        >
          <q-icon name="search_off" size="48px" />
          <div>Sin productos con estos filtros</div>
        </div>
      </div>
    </div>

    <QuickView v-model="quickOpen" :p="quick" />
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import ProductCard from "@/components/ProductCard.vue";
import QuickView from "@/components/QuickView.vue";
import { useShopStore } from "@/stores/shop";
import type { Product } from "@/data/catalog";

const store = useShopStore();
const quick = ref<Product | null>(null);
const quickOpen = computed({
  get: () => quick.value !== null,
  set: v => {
    if (!v) quick.value = null;
  }
});

const sortOpts = [
  { label: "Relevancia", value: "relevance" },
  { label: "Precio ↑", value: "priceAsc" },
  { label: "Precio ↓", value: "priceDesc" },
  { label: "Mejor valorados", value: "rating" }
];
</script>

<style scoped>
.hero {
  background: linear-gradient(120deg, #f9dceb, #e8def9 55%, #d9f3e9);
  color: #3d3654;
}
</style>
