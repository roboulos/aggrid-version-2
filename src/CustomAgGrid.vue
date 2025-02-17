<template>
  <div class="wrapper">
    <div class="container">
      <div class="exampleHeader">
        <!-- Status Tabs -->
        <div class="tabs">
          <button
            v-for="status in content.statusOptions"
            :key="status.value"
            :class="{ tabButton: true, active: activeTab === status.value }"
            @click="handleTabClick(status.value)"
          >
            {{ status.label }}
          </button>
        </div>

        <!-- Search Bar -->
        <div class="inputWrapper">
          <svg
            class="searchIcon"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M11.5014 7.00039C11.5014 7.59133 11.385 8.1765 11.1588 8.72246C10.9327 9.26843 10.6012 9.7645 10.1833 10.1824C9.76548 10.6002 9.2694 10.9317 8.72344 11.1578C8.17747 11.384 7.59231 11.5004 7.00136 11.5004C6.41041 11.5004 5.82525 11.384 5.27929 11.1578C4.73332 10.9317 4.23725 10.6002 3.81938 10.1824C3.40152 9.7645 3.07005 9.26843 2.8439 8.72246C2.61776 8.1765 2.50136 7.59133 2.50136 7.00039C2.50136 5.80691 2.97547 4.66232 3.81938 3.81841C4.6633 2.97449 5.80789 2.50039 7.00136 2.50039C8.19484 2.50039 9.33943 2.97449 10.1833 3.81841C11.0273 4.66232 11.5014 5.80691 11.5014 7.00039ZM10.6814 11.7404C9.47574 12.6764 7.95873 13.1177 6.43916 12.9745C4.91959 12.8314 3.51171 12.1145 2.50211 10.9698C1.49252 9.8251 0.957113 8.33868 1.0049 6.81314C1.05268 5.28759 1.68006 3.83759 2.75932 2.75834C3.83857 1.67908 5.28856 1.0517 6.81411 1.00392C8.33966 0.956136 9.82608 1.49154 10.9708 2.50114C12.1154 3.51073 12.8323 4.91862 12.9755 6.43819C13.1187 7.95775 12.6773 9.47476 11.7414 10.6804L14.5314 13.4704C14.605 13.539 14.6642 13.6218 14.7051 13.7138C14.7461 13.8058 14.7682 13.9052 14.77 14.0059C14.7717 14.1066 14.7532 14.2066 14.7155 14.3C14.6778 14.3934 14.6216 14.4782 14.5504 14.5494C14.4792 14.6206 14.3943 14.6768 14.301 14.7145C14.2076 14.7522 14.1075 14.7708 14.0068 14.769C13.9061 14.7672 13.8068 14.7452 13.7148 14.7042C13.6228 14.6632 13.54 14.6041 13.4714 14.5304L10.6814 11.7404Z"
              fill="currentColor"
            />
          </svg>

          <input
            type="text"
            v-model="quickFilterText"
            placeholder="Search product..."
          />
        </div>
      </div>

      <!-- AG Grid -->
      <div class="grid" :class="themeClass">
        <ag-grid-vue
          style="height: 100%"
          @grid-ready="onGridReady"
          :theme="theme"
          :columnDefs="columnDefs"
          :rowData="rowData"
          :defaultColDef="defaultColDef"
          :rowHeight="content.rowHeight"
          :autoSizeStrategy="autoSizeStrategy"
          :pagination="content.pagination"
          :paginationPageSize="content.paginationPageSize"
          :masterDetail="content.masterDetail"
          :detailRowAutoHeight="content.detailRowAutoHeight"
          :detailCellRendererParams="detailCellRendererParams"
          :quickFilterText="quickFilterText"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { AgGridVue } from 'ag-grid-vue3';
import { themeQuartz } from 'ag-grid-community';
import { debounce } from 'lodash';

// Import custom cell renderers
import ProductCellRenderer from './cell-renderers/ProductCellRenderer.vue';
import StatusCellRenderer from './cell-renderers/StatusCellRenderer.vue';
import StockCellRenderer from './cell-renderers/StockCellRenderer.vue';

export default {
  name: "CustomAgGrid",
  components: {
    AgGridVue,
    ProductCellRenderer,
    StatusCellRenderer,
    StockCellRenderer
  },
  props: {
    content: { type: Object, required: true },
    uid: { type: String, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
    customTheme: { type: Object, required: false }
  },
  emits: ['trigger-event'],
  setup(props, { emit }) {
    const gridApi = ref(null);
    const columnApi = ref(null);
    const quickFilterText = ref('');
    const activeTab = ref('all');
    const theme = computed(() => {
      return props.customTheme && props.customTheme.themeName ? props.customTheme.themeName : 'ag-theme-alpine';
    });
    const themeClass = theme;

    // Column definitions
    const columnDefs = computed(() => [
      {
        field: 'product',
        headerName: 'Product',
        cellRenderer: 'ProductCellRenderer',
        flex: 2,
        minWidth: 300
      },
      {
        field: 'status',
        headerName: 'Status',
        cellRenderer: 'StatusCellRenderer',
        flex: 1,
        minWidth: 150,
        filter: true
      },
      {
        field: 'stock',
        headerName: 'Stock',
        cellRenderer: 'StockCellRenderer',
        flex: 1,
        minWidth: 150,
        filter: 'agNumberColumnFilter'
      },
      {
        field: 'price',
        headerName: 'Price',
        valueFormatter: params => `$${params.value.toFixed(2)}`,
        flex: 1,
        minWidth: 120,
        filter: 'agNumberColumnFilter'
      }
    ]);

    // Default column definition
    const defaultColDef = computed(() => ({
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1
    }));

    // Auto-size strategy
    const autoSizeStrategy = computed(() => ({
      type: 'fitGridWidth',
      defaultMinWidth: 100
    }));

    // Handle grid ready event
    function onGridReady(params) {
      gridApi.value = params.api;
      columnApi.value = params.columnApi;
      params.api.sizeColumnsToFit();
    }

    // Handle tab click
    function handleTabClick(status) {
      activeTab.value = status;
      if (!gridApi.value) return;

      if (status === 'all') {
        gridApi.value.setFilterModel(null);
      } else {
        gridApi.value.setFilterModel({
          status: {
            type: 'equals',
            filter: status
          }
        });
      }
    }

    // Watch for data changes
    watch(() => props.content.tableData, (newData) => {
      if (gridApi.value) {
        gridApi.value.setRowData(newData);
      }
    });

    return {
      quickFilterText,
      activeTab,
      columnDefs,
      defaultColDef,
      autoSizeStrategy,
      themeClass,
      onGridReady,
      handleTabClick,
      rowData: props.content.tableData || [],
      theme: props.content.theme || 'quartz'
    };
    const agGridElement = ref(null);
    let gridApi = null;
    let gridColumnApi = null;
    let isUpdating = false;
    const MAX_RETRY = 3;
    const lastFailedUpdate = ref(null);

    // Use WeWeb helper variable for component state.
    const { value: gridState, setValue: setGridState } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'gridState',
      defaultValue: {
        lastUpdate: null,
        errorMessage: null,
        isLoading: false,
        scriptLoaded: false,
        cssLoaded: false,
        filterModel: null,
        sortModel: null
      }
    });
    
    // Compute legacy theme class based on "theme" property.
    const gridThemeClass = computed(() => `ag-theme-${props.content?.theme || 'quartz'}`);
    
    // Compute inline style overrides from theme properties.
    const gridCustomStyles = computed(() => ({
      '--ag-accent-color': props.content.accentColor || '#2196F3',
      '--ag-background-color': props.content.backgroundColor || '#FFFFFF',
      '--ag-header-background-color': props.content.headerBackgroundColor || '#F5F5F5',
      '--ag-header-text-color': props.content.headerTextColor || '#000000',
      '--ag-border-color': props.content.borderColor || '#E0E0E0',
      '--ag-row-border-color': props.content.borderColor || '#E0E0E0',
      '--ag-selected-row-background-color': props.content.selectedRowBackgroundColor || 'rgba(33, 150, 243, 0.1)',
      width: '100%',
      height: '100%',
      'min-height': '400px'
    }));

    // Search functionality
    const searchText = ref('');
    watch(searchText, (newValue) => {
      if (gridApi) {
        gridApi.setQuickFilter(newValue);
      }
    });

    // Status filtering
    const currentStatus = ref('all');
    const statusOptions = computed(() => {
      if (!props.content.showStatusTabs || !props.content.tableData || !props.content.tableData.length) {
        return [];
      }
      const statusField = props.content.statusField || 'status';
      const uniqueStatuses = new Set(props.content.tableData.map(item => item[statusField]));
      return [
        { value: 'all', label: 'All' },
        ...Array.from(uniqueStatuses).map(status => ({ value: status, label: status }))
      ];
    });

    function setStatusFilter(status) {
      currentStatus.value = status;
      if (!gridApi) return;

      const statusField = props.content.statusField || 'status';
      if (status === 'all') {
        gridApi.setFilterModel(null);
      } else {
        gridApi.setFilterModel({
          [statusField]: {
            type: 'equals',
            filter: status
          }
        });
      }
    }
    
    // Inject dynamic CSS overrides via a <style> element.
    function applyThemeOverrides() {
      const css = `
        /* Grid background override */
        .${gridThemeClass.value} .ag-root-wrapper {
          background-color: ${props.content.backgroundColor || '#FFFFFF'} !important;
        }
        /* Header background override */
        .${gridThemeClass.value} .ag-header {
          background-color: ${props.content.headerBackgroundColor || '#F5F5F5'} !important;
        }
        /* Header text override */
        .${gridThemeClass.value} .ag-header-cell,
        .${gridThemeClass.value} .ag-header-cell-label {
          color: ${props.content.headerTextColor || '#000000'} !important;
        }
        /* Border override */
        .${gridThemeClass.value} .ag-cell,
        .${gridThemeClass.value} .ag-row,
        .${gridThemeClass.value} .ag-header-cell,
        .${gridThemeClass.value} .ag-root-wrapper {
          border-color: ${props.content.borderColor || '#E0E0E0'} !important;
        }
        /* Accent color override */
        .${gridThemeClass.value} .ag-icon,
        .${gridThemeClass.value} .ag-action-icon,
        .${gridThemeClass.value} .ag-accent {
          color: ${props.content.accentColor || '#2196F3'} !important;
        }
        /* Selected row background override */
        ${props.content.selectedRowBackgroundColor ? `
          .${gridThemeClass.value} .ag-row-selected {
            background-color: ${props.content.selectedRowBackgroundColor} !important;
          }
        ` : ''}
      `;
      let styleEl = document.getElementById('custom-theme-overrides');
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'custom-theme-overrides';
        document.head.appendChild(styleEl);
      }
      styleEl.innerHTML = css;
    }
    
    // Watch for changes in theme properties and reapply overrides.
    watch(() => [
      props.content.accentColor,
      props.content.backgroundColor,
      props.content.headerBackgroundColor,
      props.content.headerTextColor,
      props.content.borderColor,
      props.content.selectedRowBackgroundColor
    ], applyThemeOverrides, { immediate: true });
    
    // Compute active theme using AG Grid theming API.
    const activeTheme = computed(() => {
      if (props.customTheme && typeof props.customTheme.withParams === 'function') {
        return props.customTheme;
      }
      if (props.content && props.content.themeParams && Object.keys(props.content.themeParams).length > 0) {
        return themeQuartz.withParams(props.content.themeParams);
      }
      return themeQuartz;
    });
    
    // Process column definitions for custom formatting.
    const processedColumnDefs = computed(() => {
      const cols = props.content?.columnDefs || [];
      return cols.map(colDef => {
        const newColDef = { ...colDef };
        switch (newColDef.dataType) {
          case 'timestamp':
            newColDef.valueFormatter = params => {
              if (!params.value) return '';
              return new Date(params.value).toLocaleString();
            };
            break;
          case 'boolean':
            newColDef.valueFormatter = params => (params.value ? 'Yes' : 'No');
            break;
          case 'checkbox':
            newColDef.cellEditor = 'agCheckboxCellEditor';
            break;
          case 'dropdown':
            newColDef.cellEditor = 'agSelectCellEditor';
            if (newColDef.dropdownOptions && Array.isArray(newColDef.dropdownOptions)) {
              newColDef.cellEditorParams = { values: newColDef.dropdownOptions };
            }
            break;
          default:
          // Default text formatting: nothing extra.
        }
        return newColDef;
      });
    });
    
    // Debounced update to preserve grid state.
    const debouncedGridUpdate = debounce((operation, showLoadingOverlay = false) => {
      if (!gridApi) return;
      if (showLoadingOverlay) setGridState({ ...gridState.value, isLoading: true });
      const currentFilterModel = gridApi.getFilterModel();
      const currentSortModel = gridColumnApi.getColumnState();
      operation();
      setTimeout(() => {
        if (gridApi && currentFilterModel) gridApi.setFilterModel(currentFilterModel);
        if (gridColumnApi && currentSortModel) gridColumnApi.applyColumnState({ state: currentSortModel });
        if (showLoadingOverlay) {
          setGridState({
            ...gridState.value,
            isLoading: false,
            filterModel: currentFilterModel,
            sortModel: currentSortModel
          });
        }
      }, 100);
    }, 150);
    
    // Load AG Grid resources.
    function loadAgGridResources() {
      console.log('Loading AG Grid resources');
      if (!window.__agGridResourcesLoaded) {
        window.__agGridResourcesLoaded = true;
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/ag-grid-community@31.0.3/dist/ag-grid-community.min.noStyle.js';
        document.body.appendChild(script);
        const styleGrid = document.createElement('link');
        styleGrid.rel = 'stylesheet';
        styleGrid.href = 'https://cdn.jsdelivr.net/npm/ag-grid-community@31.0.3/styles/ag-grid.css';
        document.head.appendChild(styleGrid);
      }
      // Only load legacy theme CSS if no custom theme parameters or customTheme is provided.
      if (!(props.content.themeParams && Object.keys(props.content.themeParams).length > 0) && !props.customTheme) {
        const themeName = props.content?.theme || 'quartz';
        const existingThemeLink = document.querySelector('link[data-ag-theme]');
        if (existingThemeLink) existingThemeLink.parentNode.removeChild(existingThemeLink);
        const styleTheme = document.createElement('link');
        styleTheme.rel = 'stylesheet';
        styleTheme.href = `https://cdn.jsdelivr.net/npm/ag-grid-community@31.0.3/styles/ag-theme-${themeName}.css`;
        styleTheme.setAttribute('data-ag-theme', themeName);
        document.head.appendChild(styleTheme);
      }
    }
    
    // Initialize AG Grid.
    function initializeAgGrid() {
      if (!window.agGrid) {
        console.warn('AG Grid not loaded yet, retrying...');
        return;
      }
      const gridDiv = agGridElement.value;
      if (!gridDiv) {
        console.warn('Grid element not found');
        return;
      }
      console.log('Initializing AG Grid');
      const gridOptions = {
        columnDefs: processedColumnDefs.value,
        defaultColDef: {
          editable: true,
          sortable: props.content?.enableSorting ?? true,
          filter: props.content?.enableFiltering ?? true,
          resizable: true,
          minWidth: 150,
          autoHeight: true,
          wrapText: true,
          suppressKeyboardEvent: params => gridState.value.isLoading,
          filterParams: {
            debounceMs: 200,
            suppressAndOrCondition: true,
            newRowsAction: 'keep'
          }
        },
        // Master Detail settings
        masterDetail: props.content.enableMasterDetail,
        detailRowHeight: props.content.detailRowHeight || 200,
        detailCellRenderer: props.content.enableMasterDetail ? 'agDetailCellRenderer' : undefined,
        detailCellRendererParams: props.content.enableMasterDetail ? {
          detailGridOptions: {
            columnDefs: processedColumnDefs.value,
            defaultColDef: {
              flex: 1,
              sortable: true,
              filter: true
            }
          },
          getDetailRowData: params => {
            params.successCallback([params.data]);
          }
        } : undefined,
        rowData: props.content?.tableData || [],
        pagination: true,
        paginationPageSize: props.content?.pageSize || 25,
        rowSelection: 'multiple',
        enableRangeSelection: true,
        domLayout: 'autoHeight',
        animateRows: true,
        rowHeight: props.content?.rowHeight || 25,
        onGridReady: (params) => {
          gridApi = params.api;
          gridColumnApi = params.columnApi;
          if (gridState.value.filterModel) gridApi.setFilterModel(gridState.value.filterModel);
          if (gridState.value.sortModel) gridColumnApi.applyColumnState({ state: gridState.value.sortModel });
          // Auto-size columns if enabled.
          if (props.content.autoSizeColumns) {
            params.api.sizeColumnsToFit();
          }
        },
        onFilterChanged: () => {
          if (!gridApi) return;
          const newFilterModel = gridApi.getFilterModel();
          gridApi.redrawRows();
          setGridState({ ...gridState.value, filterModel: newFilterModel });
        },
        onSortChanged: () => {
          if (!gridColumnApi) return;
          const newSortModel = gridColumnApi.getColumnState();
          setGridState({ ...gridState.value, sortModel: newSortModel });
        },
        onCellValueChanged: handleCellValueChanged,
        onRowSelected: (event) => {
          if (event.node.isSelected()) {
            emit('trigger-event', {
              name: 'rowSelected',
              event: { rowData: event.data }
            });
          }
        },
        theme: activeTheme.value
      };
      
      try {
        if (typeof window.agGrid.createGrid === 'function') {
          window.agGrid.createGrid(agGridElement.value, gridOptions);
        } else if (typeof window.agGrid.Grid === 'function') {
          new window.agGrid.Grid(agGridElement.value, gridOptions);
        } else {
          throw new Error('AG Grid initialization method not found');
        }
        console.log('Grid initialized successfully');
      } catch (error) {
        console.error('Failed to initialize grid:', error);
        setGridState({ ...gridState.value, errorMessage: 'Failed to initialize grid' });
        emit('trigger-event', {
          name: 'error',
          event: { message: 'Failed to initialize grid', type: 'error' }
        });
      }
    }
    
    const handleCellValueChanged = async (event) => {
      if (!props.content?.xanoEndpoint || isUpdating || gridState.value.isLoading) return;
      const updatedData = { ...event.data };
      const originalValue = event.oldValue;
      const field = event.column.colId;
      isUpdating = true;
      try {
        setGridState({ ...gridState.value, isLoading: true });
        emit('trigger-event', { name: 'updateStart', event: { rowData: updatedData } });
        const headers = {
          'Content-Type': 'application/json',
          ...(props.content.xanoHeaders || {})
        };
        const response = await fetch(props.content.xanoEndpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(updatedData)
        });
        if (!response.ok) throw new Error(`Update failed: ${response.statusText}`);
        const result = await response.json();
        emit('trigger-event', {
          name: 'cellValueChanged',
          event: { field, oldValue: originalValue, newValue: event.newValue, rowData: result }
        });
        setGridState({ ...gridState.value, lastUpdate: new Date(), isLoading: false });
      } catch (error) {
        event.node.setDataValue(field, originalValue);
        setGridState({ ...gridState.value, errorMessage: error.message || 'Update failed', isLoading: false });
        emit('trigger-event', { name: 'error', event: { message: error.message || 'Update failed', type: 'error' } });
      } finally {
        isUpdating = false;
      }
    };
    
    watch(() => props.content?.tableData, (newData) => {
      if (gridApi && newData && !isUpdating) {
        debouncedGridUpdate(() => gridApi.setRowData(newData));
      }
    }, { deep: true });
    
    watch(() => props.content?.pageSize, (newSize) => {
      if (gridApi && newSize) {
        debouncedGridUpdate(() => gridApi.paginationSetPageSize(newSize));
      }
    });
    
    const refreshData = () => {
      if (gridApi) {
        debouncedGridUpdate(() => gridApi.refreshCells({ force: true }));
      }
    };
    const exportToCSV = () => {
      if (gridApi) {
        gridApi.exportDataAsCsv({
          fileName: `export-${new Date().toISOString().split('T')[0]}.csv`
        });
      }
    };
    const clearSelection = () => {
      if (gridApi) {
        debouncedGridUpdate(() => gridApi.deselectAll());
      }
    };
    const retryUpdate = async () => {
      if (lastFailedUpdate.value) {
        if (lastFailedUpdate.value.retryCount > MAX_RETRY) {
          console.error('Maximum retry attempts reached.');
          emit('trigger-event', { name: 'error', event: { message: 'Maximum retry attempts reached', type: 'error' } });
          return;
        }
        const { eventData, originalValue, field } = lastFailedUpdate.value;
        await attemptUpdate({ ...eventData.data }, originalValue, field, eventData);
      }
    };
    
    onMounted(() => {
      console.log('Vue component mounted');
      loadAgGridResources();
      applyThemeOverrides();
      const checkInterval = setInterval(() => {
        if (window.agGrid) {
          clearInterval(checkInterval);
          setGridState({ ...gridState.value, scriptLoaded: true });
          initializeAgGrid();
        }
      }, 100);
      setTimeout(() => clearInterval(checkInterval), 5000);
    });
    
    onBeforeUnmount(() => {
      if (gridApi) gridApi.destroy();
      const styleEl = document.getElementById('custom-theme-overrides');
      if (styleEl && styleEl.parentNode) {
        styleEl.parentNode.removeChild(styleEl);
      }
      const legacyThemeLink = document.querySelector('link[data-ag-theme]');
      if (legacyThemeLink && legacyThemeLink.parentNode) {
        legacyThemeLink.parentNode.removeChild(legacyThemeLink);
      }
    });
    
    return {
      agGridElement,
      gridState,
      gridThemeClass,
      gridCustomStyles,
      refreshData,
      exportToCSV,
      clearSelection,
      retryUpdate
    };
  }
};
</script>
  
<style lang="scss">
.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;

  .container {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    height: 100%;
    min-height: 400px;
  }

  .exampleHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding-bottom: 1rem;
  }

  .tabs {
    display: flex;
    gap: 0.5rem;
  }

  .tabButton {
    padding: 0.5rem 1rem;
    border: none;
    background: none;
    color: #666;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }

    &.active {
      background: rgba(33, 150, 243, 0.1);
      color: #2196f3;
    }
  }

  .inputWrapper {
    position: relative;
    width: 300px;

    .searchIcon {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: #666;
    }

    input {
      width: 100%;
      padding: 0.5rem 1rem 0.5rem 2.5rem;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      background: #fff;

      &::placeholder {
        color: #999;
      }

      &:focus {
        outline: none;
        border-color: #2196f3;
      }
    }
  }

  .grid {
    flex: 1;
    width: 100%;
    height: calc(100% - 4rem);
    min-height: 300px;
  }
}
.wrapper {
  .grid-controls {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1rem;
    padding: 1rem;
    background: var(--ag-background-color, #fff);
    border: 1px solid var(--ag-border-color, #e0e0e0);
    border-radius: 4px;

    .status-tabs {
      display: flex;
      gap: 0.5rem;
      
      .status-tab {
        padding: 0.5rem 1rem;
        border: 1px solid var(--ag-border-color, #e0e0e0);
        border-radius: 4px;
        background: transparent;
        color: var(--ag-header-text-color, #000);
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: var(--ag-header-background-color, #f5f5f5);
        }

        &.active {
          background: var(--ag-accent-color, #2196F3);
          color: white;
          border-color: var(--ag-accent-color, #2196F3);
        }
      }
    }

    .search-bar {
      display: flex;
      align-items: center;
      padding: 0.5rem;
      border: 1px solid var(--ag-border-color, #e0e0e0);
      border-radius: 4px;
      background: white;

      .search-icon {
        margin-right: 0.5rem;
        color: var(--ag-header-text-color, #000);
        opacity: 0.5;
      }

      .search-input {
        flex: 1;
        border: none;
        outline: none;
        font-size: 1rem;
        color: var(--ag-header-text-color, #000);
        background: transparent;

        &::placeholder {
          color: var(--ag-header-text-color, #000);
          opacity: 0.5;
        }
      }
    }
  }


  width: 100%;
  height: 100%;
  min-height: 400px;
  position: relative;
  overflow: hidden;
}
.ag-grid-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: auto;
  &.is-loading {
    pointer-events: none;
    opacity: 0.7;
    transition: opacity 0.3s ease-in-out;
  }
}
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.loading-content {
  background: white;
  padding: 1rem 2rem;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
