<template>
  <q-card class="prod cursor-pointer" flat bordered>
    <div class="img" @click="$emit('quick', p)">
      <img :src="p.image" :alt="p.name" loading="lazy" />
      <q-badge v-if="p.compareAt" color="negative" class="sale"
        >-{{ pctOff }}%</q-badge
      >
      <q-btn
        round
        dense
        flat
        class="wish"
        :icon="wished ? 'favorite' : 'favorite_border'"
        :color="wished ? 'negative' : 'grey-7'"
        @click.stop="store.toggleWish(p.id)"
      />
    </div>
    <q-card-section class="q-pa-sm" @click="$emit('quick', p)">
      <div class="text-caption text-grey-6">{{ p.category }}</div>
      <div class="text-subtitle2 ellipsis">{{ p.name }}</div>
      <div class="row items-center q-gutter-x-xs">
        <q-rating :model-value="p.rating" size="14px" color="amber" readonly />
        <span class="text-caption text-grey-6">({{ p.reviews }})</span>
      </div>
      <div class="row items-baseline q-gutter-x-sm q-mt-xs">
        <span class="text-subtitle1 text-bold">${{ p.price.toFixed(2) }}</span>
        <span v-if="p.compareAt" class="text-caption text-grey-5 text-strike">
          ${{ p.compareAt.toFixed(2) }}
        </span>
      </div>
    </q-card-section>
    <q-card-actions class="q-pa-sm q-pt-none">
      <q-btn
        color="primary"
        unelevated
        dense
        class="full-width"
        icon="add_shopping_cart"
        label="Añadir"
        no-caps
        @click="quickAdd"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useQuasar } from "quasar";
import type { Product } from "@/data/catalog";
import { useShopStore } from "@/stores/shop";

const props = defineProps<{ p: Product }>();
defineEmits<{ quick: [p: Product] }>();
const store = useShopStore();
const $q = useQuasar();

const wished = computed(() => store.wishlist.includes(props.p.id));
const pctOff = computed(() =>
  props.p.compareAt
    ? Math.round((1 - props.p.price / props.p.compareAt) * 100)
    : 0
);

function quickAdd() {
  const v = props.p.variants.find(x => x.stock > 0) ?? props.p.variants[0];
  if (!v) return;
  store.addToCart(props.p.id, v.id, 1);
  store.cartOpen = true;
  $q.notify({
    type: "positive",
    message: `${props.p.name} añadido`,
    timeout: 900
  });
}
</script>

<style scoped>
.prod {
  border-radius: 12px;
  overflow: hidden;
}
.img {
  position: relative;
  height: 170px;
  background: #f6f3fa;
}
.img img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.sale {
  position: absolute;
  top: 8px;
  left: 8px;
}
.wish {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(255, 255, 255, 0.85);
}
</style>
