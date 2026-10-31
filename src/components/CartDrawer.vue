<template>
  <q-drawer
    :model-value="store.cartOpen"
    side="right"
    overlay
    bordered
    :width="380"
    @update:model-value="v => (store.cartOpen = v)"
  >
    <div class="q-pa-md column full-height">
      <div class="row items-center">
        <div class="text-h6">Carrito ({{ store.cartCount }})</div>
        <q-space />
        <q-btn flat round dense icon="close" @click="store.cartOpen = false" />
      </div>

      <!-- envío gratis -->
      <div class="q-my-sm">
        <div class="text-caption text-grey-7 q-mb-xs">
          <template v-if="missing > 0"
            >Te faltan <b>${{ missing.toFixed(2) }}</b> para envío
            gratis</template
          >
          <template v-else
            ><b class="text-positive">¡Envío gratis conseguido!</b></template
          >
        </div>
        <q-linear-progress :value="shipProgress" color="positive" rounded />
      </div>

      <q-scroll-area class="col">
        <q-list separator>
          <q-item
            v-for="l in store.cartLines"
            :key="l.line.variantId"
            class="q-px-none"
          >
            <q-item-section avatar>
              <img :src="l.product.image" class="line-img" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ l.product.name }}</q-item-label>
              <q-item-label caption
                >{{ l.variant.size }} / {{ l.variant.color }}</q-item-label
              >
              <q-item-label class="text-bold"
                >${{ (l.product.price * l.line.qty).toFixed(2) }}</q-item-label
              >
            </q-item-section>
            <q-item-section side>
              <div class="row items-center">
                <q-btn
                  dense
                  flat
                  round
                  size="sm"
                  icon="remove"
                  @click="
                    store.setQty(l.product.id, l.variant.id, l.line.qty - 1)
                  "
                />
                <span class="q-mx-xs">{{ l.line.qty }}</span>
                <q-btn
                  dense
                  flat
                  round
                  size="sm"
                  icon="add"
                  @click="
                    store.setQty(l.product.id, l.variant.id, l.line.qty + 1)
                  "
                />
              </div>
            </q-item-section>
          </q-item>
          <div
            v-if="!store.cartLines.length"
            class="text-center text-grey-6 q-pa-lg"
          >
            <q-icon name="shopping_cart" size="40px" />
            <div>Tu carrito está vacío</div>
          </div>
        </q-list>
      </q-scroll-area>

      <div v-if="store.cartLines.length">
        <q-input
          v-model="store.coupon"
          dense
          outlined
          placeholder="Cupón (prueba DEMO20)"
          class="q-mb-sm"
        >
          <template #append><q-icon name="sell" /></template>
        </q-input>
        <div class="row text-caption"
          ><span>Subtotal</span><q-space /><span
            >${{ store.subtotal.toFixed(2) }}</span
          ></div
        >
        <div v-if="store.discount" class="row text-caption text-positive"
          ><span>Cupón DEMO20</span><q-space /><span
            >-${{ store.discount.toFixed(2) }}</span
          ></div
        >
        <div class="row text-caption"
          ><span>Envío</span><q-space /><span>{{
            store.shipping ? `$${store.shipping.toFixed(2)}` : "Gratis"
          }}</span></div
        >
        <div class="row text-caption"
          ><span>Impuestos</span><q-space /><span
            >${{ store.tax.toFixed(2) }}</span
          ></div
        >
        <q-separator class="q-my-xs" />
        <div class="row text-subtitle1 text-bold"
          ><span>Total</span><q-space /><span
            >${{ store.total.toFixed(2) }}</span
          ></div
        >
        <q-btn
          color="primary"
          unelevated
          class="full-width q-mt-sm"
          label="Ir al checkout"
          icon="lock"
          no-caps
          @click="$emit('checkout')"
        />
      </div>
    </div>
  </q-drawer>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useShopStore, FREE_SHIPPING } from "@/stores/shop";

defineEmits<{ checkout: [] }>();
const store = useShopStore();

const missing = computed(() =>
  Math.max(0, FREE_SHIPPING - (store.subtotal - store.discount))
);
const shipProgress = computed(() =>
  Math.min(1, (store.subtotal - store.discount) / FREE_SHIPPING)
);
</script>

<style scoped>
.line-img {
  width: 56px;
  height: 56px;
  object-fit: contain;
  background: #f6f3fa;
  border-radius: 8px;
}
</style>
