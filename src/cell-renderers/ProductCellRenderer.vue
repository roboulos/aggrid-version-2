<![CDATA[<template>
  <div class="product-cell">
    <img :src="params.data.image" :alt="params.value" class="product-image" />
    <div class="product-info">
      <div class="product-name">{{ params.value }}</div>
      <div class="product-sku">SKU: {{ params.data.sku }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductCellRenderer',
  props: {
    params: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.product-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
  height: 100%;
  padding: 0.5rem;
}

.product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.product-name {
  font-weight: 500;
}

.product-sku {
  font-size: 0.875rem;
  color: var(--ag-secondary-foreground-color);
}
</style>]]>
