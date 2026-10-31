<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="v => $emit('update:modelValue', v)"
  >
    <q-card v-if="p" style="max-width: 680px; width: 100%">
      <div class="row">
        <div class="col-12 col-sm-5 q-pa-md bg-soft flex flex-center">
          <img :src="p.image" class="full-img" />
        </div>
        <div class="col-12 col-sm-7 q-pa-md">
          <div class="text-caption text-grey-6">{{ p.category }}</div>
          <div class="text-h6">{{ p.name }}</div>
          <div class="row items-center q-gutter-x-xs">
            <q-rating
              :model-value="p.rating"
              size="16px"
              color="amber"
              readonly
            />
            <span class="text-caption text-grey-6"
              >{{ p.rating }} · {{ p.reviews }} reseñas</span
            >
          </div>
          <div class="row items-baseline q-gutter-x-sm q-mt-xs">
            <span class="text-h5 text-bold">${{ p.price.toFixed(2) }}</span>
            <span v-if="p.compareAt" class="text-grey-5 text-strike"
              >${{ p.compareAt.toFixed(2) }}</span
            >
          </div>
          <p class="text-body2 text-grey-8 q-mt-sm">{{ p.description }}</p>

          <div class="text-caption text-grey-7 q-mb-xs">Color</div>
          <div class="row q-gutter-xs q-mb-sm">
            <q-btn
              v-for="c in colors"
              :key="c"
              :label="c"
              dense
              no-caps
              :unelevated="color === c"
              :outline="color !== c"
              :color="color === c ? 'primary' : 'grey-6'"
              @click="color = c"
            />
          </div>
          <div class="text-caption text-grey-7 q-mb-xs">Talla</div>
          <div class="row q-gutter-xs q-mb-sm">
            <q-btn
              v-for="v in variantsForColor"
              :key="v.id"
              :label="`${v.size}`"
              dense
              :unelevated="variantId === v.id"
              :outline="variantId !== v.id"
              :color="variantId === v.id ? 'primary' : 'grey-6'"
              :disable="v.stock === 0"
              @click="variantId = v.id"
            >
              <q-tooltip v-if="v.stock === 0">Sin stock</q-tooltip>
            </q-btn>
          </div>
          <div
            v-if="stockLeft !== null && stockLeft <= 5"
            class="text-caption text-warning"
          >
            ¡Solo quedan {{ stockLeft }}!
          </div>

          <div class="row q-gutter-sm q-mt-md">
            <q-input
              v-model.number="qty"
              type="number"
              dense
              outlined
              style="width: 90px"
              :min="1"
            />
            <q-btn
              color="primary"
              unelevated
              icon="add_shopping_cart"
              label="Añadir al carrito"
              no-caps
              class="col"
              @click="add"
            />
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { Product } from "@/data/catalog";
import { useShopStore } from "@/stores/shop";

const props = defineProps<{ modelValue: boolean; p: Product | null }>();
const emit = defineEmits<{ "update:modelValue": [v: boolean] }>();
const store = useShopStore();

const color = ref("");
const variantId = ref("");
const qty = ref(1);

const colors = computed(() =>
  props.p ? [...new Set(props.p.variants.map(v => v.color))] : []
);
const variantsForColor = computed(() =>
  props.p ? props.p.variants.filter(v => v.color === color.value) : []
);
const stockLeft = computed(
  () => props.p?.variants.find(v => v.id === variantId.value)?.stock ?? null
);

watch(
  () => [props.modelValue, props.p?.id],
  () => {
    if (props.modelValue && props.p) {
      color.value = colors.value[0] ?? "";
      variantId.value =
        variantsForColor.value.find(v => v.stock > 0)?.id ??
        variantsForColor.value[0]?.id ??
        "";
      qty.value = 1;
    }
  },
  { immediate: true }
);

function add() {
  if (!props.p || !variantId.value) return;
  store.addToCart(props.p.id, variantId.value, qty.value);
  emit("update:modelValue", false);
  store.cartOpen = true;
}
</script>

<style scoped>
.full-img {
  width: 100%;
  max-height: 280px;
  object-fit: contain;
}
</style>
