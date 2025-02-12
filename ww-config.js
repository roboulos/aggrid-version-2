// Example themeParams that produce a custom theme:
// {
//   "accentColor": "#0086F4",
//   "backgroundColor": "#F1EDE1",
//   "borderColor": "#98968F",
//   "borderRadius": 0,
//   "browserColorScheme": "light",
//   "chromeBackgroundColor": { "ref": "backgroundColor" },
//   "fontFamily": { "googleFont": "Pixelify Sans" },
//   "fontSize": 15,
//   "foregroundColor": "#605E57",
//   "headerBackgroundColor": "#E4DAD1",
//   "headerFontSize": 15,
//   "headerFontWeight": 700,
//   "headerTextColor": "#3C3A35",
//   "rowVerticalPaddingScale": 1.2,
//   "spacing": 5,
//   "wrapperBorderRadius": 0
// }

export default {
  name: "AG Grid Inventory",
  editor: {
    label: { en: 'AG Grid Inventory' },
    icon: 'table'
  },
  properties: {
    tableData: {
      label: { en: 'Table Data' },
      type: 'Array',
      section: 'settings',
      bindable: true,
      defaultValue: [
        {
          product: 'Wireless Earbuds',
          sku: 'WE-001',
          image: 'https://example.com/images/earbuds.jpg',
          status: 'active',
          stock: 85,
          price: 129.99
        },
        {
          product: 'Smart Watch',
          sku: 'SW-002',
          image: 'https://example.com/images/watch.jpg',
          status: 'active',
          stock: 42,
          price: 199.99
        },
        {
          product: 'Bluetooth Speaker',
          sku: 'BS-003',
          image: 'https://example.com/images/speaker.jpg',
          status: 'outofstock',
          stock: 0,
          price: 79.99
        },
        {
          product: 'Noise-Canceling Headphones',
          sku: 'NC-004',
          image: 'https://example.com/images/headphones.jpg',
          status: 'paused',
          stock: 15,
          price: 299.99
        }
      ],
      bindingValidation: {
        type: 'Array',
        tooltip: 'Data array for the grid'
      },
      propertyHelp: { tooltip: 'The data to display in the grid' }
    },
    statusOptions: {
      label: { en: 'Status Options' },
      type: 'Array',
      section: 'settings',
      defaultValue: [
        { value: 'all', label: 'All Products' },
        { value: 'active', label: 'Active' },
        { value: 'paused', label: 'Paused' },
        { value: 'outofstock', label: 'Out of Stock' }
      ],
      propertyHelp: { tooltip: 'Status filter options' }
    },

    columnDefs: {
      label: { en: 'Column Definitions' },
      type: 'Array',
      section: 'settings',
      defaultValue: [
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
      ],
      propertyHelp: { tooltip: 'Define the columns of the grid' }
    },
    // Grid features
    rowHeight: {
      label: { en: 'Row Height' },
      type: 'Number',
      section: 'settings',
      defaultValue: 80
    },
    masterDetail: {
      label: { en: 'Master Detail' },
      type: 'OnOff',
      section: 'settings',
      defaultValue: true
    },
    detailRowAutoHeight: {
      label: { en: 'Auto Height Detail Rows' },
      type: 'OnOff',
      section: 'settings',
      defaultValue: true
    },
    // Pagination
    pagination: {
      label: { en: 'Enable Pagination' },
      type: 'OnOff',
      section: 'settings',
      defaultValue: true
    },
    paginationPageSize: {
      label: { en: 'Page Size' },
      type: 'Number',
      section: 'settings',
      defaultValue: 10
    },
    // Status filter
    statusOptions: {
      label: { en: 'Status Options' },
      type: 'Array',
      section: 'settings',
      defaultValue: [
        { value: 'all', label: 'All' },
        { value: 'active', label: 'Active' },
        { value: 'paused', label: 'On Hold' },
        { value: 'outOfStock', label: 'Out of Stock' }
      ]
    },
    // Theme
    isDarkMode: {
      label: { en: 'Dark Mode' },
      type: 'OnOff',
      section: 'settings',
      defaultValue: false
    },
    gridTheme: {
      label: { en: 'Grid Theme' },
      type: 'TextSelect',
      section: 'settings',
      defaultValue: 'ag-theme-quartz',
      options: {
        options: [
          { value: 'ag-theme-quartz', label: 'Quartz' },
          { value: 'ag-theme-alpine', label: 'Alpine' },
          { value: 'ag-theme-balham', label: 'Balham' },
          { value: 'ag-theme-material', label: 'Material' }
        ]
      }
    },
    // Search functionality
    showSearch: {
      label: { en: 'Show Search' },
      type: 'OnOff',
      section: 'settings',
      defaultValue: true,
      propertyHelp: { tooltip: 'Show search bar above the grid' }
    },
    searchPlaceholder: {
      label: { en: 'Search Placeholder' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'Search...',
      propertyHelp: { tooltip: 'Placeholder text for the search bar' }
    },
    // Status tabs
    showStatusTabs: {
      label: { en: 'Show Status Tabs' },
      type: 'OnOff',
      section: 'settings',
      defaultValue: false,
      propertyHelp: { tooltip: 'Show status filter tabs above the grid' }
    },
    statusField: {
      label: { en: 'Status Field' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'status',
      propertyHelp: { tooltip: 'Field name to use for status filtering' },
      hidden: content => !content.showStatusTabs
    },
    // Master-detail view
    enableMasterDetail: {
      label: { en: 'Enable Master Detail' },
      type: 'OnOff',
      section: 'settings',
      defaultValue: false,
      propertyHelp: { tooltip: 'Enable expandable detail rows' }
    },
    detailRowHeight: {
      label: { en: 'Detail Row Height' },
      type: 'Number',
      section: 'settings',
      defaultValue: 200,
      propertyHelp: { tooltip: 'Height of detail rows in pixels' },
      hidden: content => !content.enableMasterDetail
    },
    columnDefs: {
      label: { en: 'Column Definitions' },
      type: 'Array',
      section: 'settings',
      bindable: true,
      defaultValue: [],
      options: {
        expandable: true,
        getItemLabel(_, index) { return `Column ${index + 1}`; },
        item: {
          type: 'Object',
          defaultValue: {
            field: '',
            headerName: '',
            editable: true,
            width: 100,
            sortable: true,
            filter: true,
            dataType: 'text',
            dropdownOptions: []
          },
          options: {
            item: {
              field: { label: 'Field', type: 'Text', options: { placeholder: 'Data field name' } },
              headerName: { label: 'Header', type: 'Text', options: { placeholder: 'Column header name' } },
              editable: { label: 'Editable', type: 'Boolean' },
              width: { label: 'Width', type: 'Number', options: { min: 50, max: 500 } },
              sortable: { label: 'Sortable', type: 'Boolean' },
              filter: { label: 'Filter', type: 'Boolean' },
              dataType: {
                label: 'Data Type',
                type: 'TextSelect',
                defaultValue: 'text',
                options: {
                  options: [
                    { value: 'text', label: 'Text' },
                    { value: 'timestamp', label: 'Timestamp' },
                    { value: 'boolean', label: 'Boolean' },
                    { value: 'checkbox', label: 'Checkbox' },
                    { value: 'dropdown', label: 'Dropdown' }
                  ]
                }
              },
              dropdownOptions: {
                label: 'Dropdown Options',
                type: 'Array',
                defaultValue: [],
                options: {
                  expandable: true,
                  getItemLabel(item, index) { return `Option ${index + 1}`; },
                  item: { type: 'Text' }
                }
              }
            }
          }
        }
      },
      bindingValidation: {
        type: 'Array',
        tooltip: 'Array of column definitions for the grid'
      },
      propertyHelp: { tooltip: 'Define the columns to display in the grid' }
    },
    xanoEndpoint: {
      label: { en: 'Xano Update Endpoint' },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: '',
      bindingValidation: {
        type: 'string',
        tooltip: 'The Xano API endpoint URL for updating records'
      },
      propertyHelp: { tooltip: 'Enter the full URL of your Xano update endpoint' }
    },
    xanoHeaders: {
      label: { en: 'Xano Headers' },
      type: 'Object',
      section: 'settings',
      bindable: true,
      defaultValue: {},
      bindingValidation: {
        type: 'object',
        tooltip: 'Custom headers to send with Xano requests'
      },
      propertyHelp: { tooltip: 'Additional headers for Xano API calls (e.g., authorization)' }
    },
    // Display settings
    fontFamily: {
      label: { en: 'Grid Font Family' },
      type: 'Text',
      section: 'style',
      bindable: true,
      defaultValue: 'Arial, sans-serif',
      bindingValidation: {
        type: 'string',
        tooltip: 'Set the font family for the grid'
      },
      propertyHelp: { tooltip: 'Customize the font used in the grid' }
    },
    rowHeight: {
      label: { en: 'Row Height' },
      type: 'Number',
      section: 'settings',
      bindable: true,
      defaultValue: 25,
      options: { min: 10, max: 200, step: 1 },
      bindingValidation: {
        type: 'number',
        tooltip: 'Row height in pixels'
      },
      propertyHelp: { tooltip: 'Set the height for each row in the grid' }
    },
    pageSize: {
      label: { en: 'Page Size' },
      type: 'Number',
      section: 'settings',
      bindable: true,
      defaultValue: 25,
      options: { min: 1, max: 1000, step: 1 },
      bindingValidation: {
        type: 'number',
        tooltip: 'Number of rows to display per page'
      },
      propertyHelp: { tooltip: 'Set how many rows to show on each page' }
    },
    enableFiltering: {
      label: { en: 'Enable Filtering' },
      type: 'OnOff',
      section: 'settings',
      bindable: true,
      defaultValue: true,
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Enable or disable column filtering'
      },
      propertyHelp: { tooltip: 'Allow users to filter data in columns' }
    },
    enableSorting: {
      label: { en: 'Enable Sorting' },
      type: 'OnOff',
      section: 'settings',
      bindable: true,
      defaultValue: true,
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Enable or disable column sorting'
      },
      propertyHelp: { tooltip: 'Allow users to sort data in columns' }
    },
    loadingMessage: {
      label: { en: 'Loading Message' },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: 'Updating...',
      bindingValidation: {
        type: 'string',
        tooltip: 'Message to display during updates'
      },
      propertyHelp: { tooltip: 'Customize the loading message shown during updates' }
    },
    // NEW: Auto Size Columns flag: if true, auto-size columns on grid ready.
    autoSizeColumns: {
      label: { en: 'Auto Size Columns' },
      type: 'OnOff',
      section: 'settings',
      bindable: true,
      defaultValue: false
    },
    // Theme override properties (for CSS-based overrides)
    accentColor: {
      label: { en: 'Accent Color' },
      type: 'Color',
      section: 'theme',
      bindable: true,
      defaultValue: '#2196F3'
    },
    backgroundColor: {
      label: { en: 'Background Color' },
      type: 'Color',
      section: 'theme',
      bindable: true,
      defaultValue: '#FFFFFF'
    },
    headerBackgroundColor: {
      label: { en: 'Header Background Color' },
      type: 'Color',
      section: 'theme',
      bindable: true,
      defaultValue: '#F5F5F5'
    },
    headerTextColor: {
      label: { en: 'Header Text Color' },
      type: 'Color',
      section: 'theme',
      bindable: true,
      defaultValue: '#000000'
    },
    borderColor: {
      label: { en: 'Border Color' },
      type: 'Color',
      section: 'theme',
      bindable: true,
      defaultValue: '#E0E0E0'
    },
    // NEW: Selected row background color override.
    selectedRowBackgroundColor: {
      label: { en: 'Selected Row Background Color' },
      type: 'Color',
      section: 'theme',
      bindable: true,
      defaultValue: ''
    },
    // Legacy theme selector fallback
    theme: {
      label: { en: 'Grid Theme' },
      type: 'TextSelect',
      section: 'style',
      bindable: true,
      defaultValue: 'quartz',
      options: {
        options: [
          { value: 'quartz', label: 'Quartz' },
          { value: 'alpine', label: 'Alpine' },
          { value: 'balham', label: 'Balham' }
        ]
      },
      bindingValidation: {
        type: 'string',
        tooltip: 'The visual theme for the grid (for legacy CSS usage)'
      },
      propertyHelp: { tooltip: 'Select the visual style for the grid if not using custom theme parameters' }
    },
    // Allow full custom theme object from the user (if desired)
    customTheme: {
      label: { en: 'Custom Theme' },
      type: 'Object',
      section: 'style',
      bindable: true,
      defaultValue: null,
      bindingValidation: {
        type: 'object',
        tooltip: 'Pass a custom AG Grid theme object (generated via the Theme Builder/Theming API)'
      },
      propertyHelp: { tooltip: 'Import a theme object such as one generated from the AG Grid Theme Builder' }
    },
    // Allow overriding individual theme parameters.
    themeParams: {
      label: { en: 'Theme Parameters' },
      type: 'Object',
      section: 'style',
      bindable: true,
      defaultValue: {},
      bindingValidation: {
        type: 'object',
        tooltip: 'Theme parameter overrides for AG Grid (e.g., accentColor, headerTextColor)'
      },
      propertyHelp: { tooltip: 'Provide custom theme parameters to merge with the default theme' }
    }
  },
  triggerEvents: [
    {
      name: 'cellValueChanged',
      label: { en: 'On cell value changed' },
      event: { field: '', oldValue: null, newValue: null, rowData: {} }
    },
    {
      name: 'rowSelected',
      label: { en: 'On row selected' },
      event: { rowData: {} }
    },
    {
      name: 'error',
      label: { en: 'On error' },
      event: { message: '', type: '' }
    },
    {
      name: 'updateStart',
      label: { en: 'On update start' },
      event: { rowData: {} }
    },
    {
      name: 'updateComplete',
      label: { en: 'On update complete' },
      event: { success: true, data: {} }
    }
  ],
  actions: [
    {
      name: 'refreshData',
      label: { en: 'Refresh Data' },
      action: 'refreshData'
    },
    {
      name: 'exportToCSV',
      label: { en: 'Export to CSV' },
      action: 'exportToCSV'
    },
    {
      name: 'clearSelection',
      label: { en: 'Clear Selection' },
      action: 'clearSelection'
    },
    {
      name: 'retryUpdate',
      label: { en: 'Retry Update' },
      action: 'retryUpdate'
    }
  ]
};

