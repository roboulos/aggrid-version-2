<![CDATA[<template>
  <div class="status-cell" :class="statusClass">
    <span class="status-dot"></span>
    <span class="status-text">{{ params.value }}</span>
  </div>
</template>

<script>
export default {
  name: 'StatusCellRenderer',
  props: {
    params: {
      type: Object,
      required: true
    }
  },
  computed: {
    statusClass() {
      const status = this.params.value?.toLowerCase();
      return {
        'status-active': status === 'active',
        'status-paused': status === 'paused',
        'status-out-of-stock': status === 'outofstock'
      };
    }
  }
}
</script>

<style scoped>
.status-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  width: fit-content;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-active {
  background: rgba(0, 200, 83, 0.1);
  color: rgb(0, 200, 83);
  .status-dot { background: rgb(0, 200, 83); }
}

.status-paused {
  background: rgba(255, 171, 0, 0.1);
  color: rgb(255, 171, 0);
  .status-dot { background: rgb(255, 171, 0); }
}

.status-out-of-stock {
  background: rgba(244, 67, 54, 0.1);
  color: rgb(244, 67, 54);
  .status-dot { background: rgb(244, 67, 54); }
}
</style>]]>
