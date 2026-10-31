<template>
  <q-dialog
    :model-value="modelValue"
    persistent
    @update:model-value="v => $emit('update:modelValue', v)"
  >
    <q-card style="max-width: 560px; width: 100%">
      <q-card-section class="row items-center">
        <div class="text-h6">Checkout</div>
        <q-space />
        <q-btn
          v-if="step !== 3"
          flat
          round
          dense
          icon="close"
          @click="$emit('update:modelValue', false)"
        />
      </q-card-section>

      <q-stepper v-model="step" flat animated header-nav class="q-pt-none">
        <!-- Paso 1: envío -->
        <q-step :name="1" title="Envío" icon="local_shipping" :done="step > 1">
          <div class="row q-col-gutter-sm">
            <q-input
              v-model="customer.name"
              label="Nombre completo"
              filled
              dense
              class="col-12"
            />
            <q-input
              v-model="customer.email"
              label="Email"
              filled
              dense
              class="col-12"
            />
            <q-input
              v-model="customer.address"
              label="Dirección"
              filled
              dense
              class="col-12"
            />
            <q-input
              v-model="customer.city"
              label="Ciudad"
              filled
              dense
              class="col-6"
            />
            <q-input
              v-model="customer.zip"
              label="Código postal"
              filled
              dense
              class="col-6"
            />
          </div>
          <q-stepper-navigation>
            <q-btn
              color="primary"
              label="Continuar"
              :disable="!step1Ok"
              @click="step = 2"
            />
          </q-stepper-navigation>
        </q-step>

        <!-- Paso 2: método + pago -->
        <q-step :name="2" title="Pago" icon="credit_card" :done="step > 2">
          <q-option-group
            v-model="shipMethod"
            :options="[
              { label: 'Estándar (3-5 días)', value: 'Estandar' },
              { label: 'Exprés 24h (+$9.90)', value: 'Express' }
            ]"
            class="q-mb-md"
          />
          <q-banner rounded class="bg-secondary text-dark q-mb-sm">
            <q-icon name="science" class="q-mr-sm" />Modo prueba: usa la tarjeta
            demo en 1 clic.
          </q-banner>
          <q-input
            v-model="card"
            label="Tarjeta"
            filled
            dense
            readonly
            class="q-mb-sm"
          >
            <template #append><q-icon name="credit_card" /></template>
          </q-input>
          <q-btn
            flat
            dense
            no-caps
            icon="bolt"
            label="Rellenar tarjeta demo"
            @click="fillDemo"
          />
          <q-stepper-navigation class="q-mt-sm">
            <q-btn
              color="primary"
              label="Pagar ${{ payTotal.toFixed(2) }}"
              :loading="paying"
              @click="pay"
            />
            <q-btn flat label="Atrás" class="q-ml-sm" @click="step = 1" />
          </q-stepper-navigation>
        </q-step>

        <!-- Paso 3: confirmación -->
        <q-step :name="3" title="Confirmación" icon="check_circle">
          <div v-if="order" class="text-center q-pa-md">
            <q-icon name="check_circle" size="64px" color="positive" />
            <div class="text-h6 q-mt-sm">¡Pedido confirmado!</div>
            <div class="text-subtitle1 text-bold q-mt-xs">{{
              order.number
            }}</div>
            <div class="text-caption text-grey-7">
              Total pagado: ${{ order.total.toFixed(2) }} ·
              {{ order.items.length }} artículos
            </div>
            <q-banner rounded class="bg-grey-2 text-left q-mt-md">
              Recibo enviado a {{ order.customer.email }}. Puedes ver el pedido
              en la <b>vista Admin</b> del menú superior.
            </q-banner>
          </div>
          <q-stepper-navigation>
            <q-btn color="primary" label="Seguir comprando" @click="finish" />
          </q-stepper-navigation>
        </q-step>
      </q-stepper>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useShopStore } from "@/stores/shop";
import type { Order } from "@/data/catalog";

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{ "update:modelValue": [v: boolean] }>();
const store = useShopStore();
void props;

const step = ref(1);
const paying = ref(false);
const order = ref<Order | null>(null);
const shipMethod = ref("Estandar");
const card = ref("");
const customer = ref({ name: "", email: "", address: "", city: "", zip: "" });

const step1Ok = computed(
  () =>
    customer.value.name &&
    customer.value.email &&
    customer.value.address &&
    customer.value.city
);
const payTotal = computed(
  () => store.total + (shipMethod.value === "Express" ? 9.9 : 0)
);

function fillDemo() {
  card.value = "4242 4242 4242 4242 · 12/28 · CVC 123";
}
async function pay() {
  paying.value = true;
  await new Promise(r => setTimeout(r, 900));
  order.value = store.placeOrder(
    {
      name: customer.value.name,
      email: customer.value.email,
      address: `${customer.value.address}, ${customer.value.city} ${customer.value.zip}`,
      city: customer.value.city
    },
    shipMethod.value
  );
  if (shipMethod.value === "Express") order.value.total += 9.9;
  paying.value = false;
  step.value = 3;
}
function finish() {
  emit("update:modelValue", false);
  step.value = 1;
  order.value = null;
}
</script>
