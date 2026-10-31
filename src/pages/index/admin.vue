<template>
  <q-page class="bg-app q-pa-md">
    <div class="row q-col-gutter-sm q-mb-md">
      <div v-for="s in kpis" :key="s.label" class="col-6 col-md-3">
        <q-card flat bordered class="q-pa-md">
          <div class="text-caption text-grey-6">{{ s.label }}</div>
          <div class="text-h5 text-bold">{{ s.value }}</div>
        </q-card>
      </div>
    </div>

    <q-card flat bordered class="q-pa-md">
      <div class="text-h6 q-mb-md">Órdenes ({{ store.orders.length }})</div>
      <q-table
        flat
        :rows="store.orders"
        :columns="cols"
        row-key="id"
        :pagination="{ rowsPerPage: 8 }"
        no-data-label="Sin pedidos aún — haz una compra en la tienda"
      >
        <template #body-cell-total="p">
          <q-td :props="p" class="text-bold"
            >${{ p.row.total.toFixed(2) }}</q-td
          >
        </template>
        <template #body-cell-status="p">
          <q-td :props="p">
            <q-badge
              :color="
                {
                  Pagado: 'info',
                  Preparando: 'warning',
                  Enviado: 'primary',
                  Entregado: 'positive'
                }[p.row.status as Order['status']]
              "
              :label="p.row.status"
            />
          </q-td>
        </template>
        <template #body-cell-actions="p">
          <q-td :props="p">
            <q-btn
              dense
              flat
              no-caps
              size="sm"
              color="primary"
              icon="arrow_forward"
              :label="nextLabel(p.row.status)"
              :disable="p.row.status === 'Entregado'"
              @click="store.advanceStatus(p.row.id)"
            />
          </q-td>
        </template>
        <template #body-cell-items="p">
          <q-td :props="p">
            <div v-for="(it, i) in p.row.items" :key="i" class="text-caption">
              {{ it.qty }}× {{ it.name }} ({{ it.variant }})
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useShopStore } from "@/stores/shop";
import type { Order } from "@/data/catalog";
import type { QTableColumn } from "quasar";

const store = useShopStore();

const kpis = computed(() => [
  { label: "Ventas totales", value: `$${store.revenueToday.toFixed(2)}` },
  { label: "Pedidos", value: store.orders.length },
  {
    label: "Ticket medio",
    value: store.orders.length
      ? `$${(store.revenueToday / store.orders.length).toFixed(2)}`
      : "$0"
  },
  { label: "Productos", value: store.products.length }
]);

const cols: QTableColumn<Order>[] = [
  {
    name: "number",
    label: "Pedido",
    field: "number",
    align: "left",
    sortable: true
  },
  {
    name: "createdAt",
    label: "Fecha",
    field: "createdAt",
    align: "left",
    format: v => new Date(v).toLocaleString("es-ES")
  },
  {
    name: "customer",
    label: "Cliente",
    field: (r: Order) => r.customer.name,
    align: "left"
  },
  { name: "items", label: "Artículos", field: "id", align: "left" },
  {
    name: "shippingMethod",
    label: "Envío",
    field: "shippingMethod",
    align: "left"
  },
  { name: "total", label: "Total", field: "total", sortable: true },
  { name: "status", label: "Estado", field: "status" },
  { name: "actions", label: "", field: "id" }
];

function nextLabel(s: Order["status"]) {
  return {
    Pagado: "Preparar",
    Preparando: "Enviar",
    Enviado: "Entregar",
    Entregado: "OK"
  }[s];
}
</script>
