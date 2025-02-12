<![CDATA[<template>
  <div class="stock-cell">
    <div class="stock-bar-wrapper">
      <div class="stock-bar" :style="{ width: stockPercentage + '%', backgroundColor: stockColor }"></div>
    </div>
    <div class="stock-text">{{ params.value }} in stock</div>
  </div>
</template>

<script>
export default {
  name: 'StockCellRenderer',
  props: {
    params: {
      type: Object,
      required: true
    }
  },
  computed: {
    stockPercentage() {
      const stock = this.params.value;
      const maxStock = 100; // You can make this configurable
      return Math.min(100, (stock / maxStock) * 100);
    },
    stockColor() {
      const stock = this.params.value;
      if (stock <= 0) return '#f44336';
      if (stock <= 20) return '#ffab00';
      return '#00c853';
    }
  }
}
</script>

<style scoped>
.stock-cell {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
}

.stock-bar-wrapper {
  width: 100%;
  height: 6px;
  background: var(--ag-border-color);
  border-radius: 3px;
  overflow: hidden;
}

.stock-bar {
  height: 100%;
  transition: width 0.3s ease;
}

.stock-text {
  font-size: 0.875rem;
  color: var(--ag-secondary-foreground-color);
}
</style>]]>
