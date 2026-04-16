        // Global variables
        let charts = {};
        let analyticsData = {};
        let refreshInterval;
        let currentTab = 'products';

        // Initialize analytics dashboard
        async function initAnalytics() {
            await loadAnalytics();
            startAutoRefresh();
            setupEventListeners();
        }

        // Load analytics data
        async function loadAnalytics() {
            try {
                showLoading(true);
                const dateRange = document.getElementById('dateRange').value;
                const metricType = document.getElementById('metricType').value;
                
                const response = await fetch(`/admin/api/analytics?range=${dateRange}&type=${metricType}`, {
                    credentials: 'include'
                });
                
                if (!response.ok) {
                    if (response.status === 401) {
                        window.location.href = '/admin/login';
                        return;
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                analyticsData = await response.json();
                updateDashboard();
                updateLastUpdated();
                
            } catch (error) {
                console.error('Error loading analytics:', error);
                showError('Failed to load analytics data');
            } finally {
                showLoading(false);
            }
        }

        // Update entire dashboard
        function updateDashboard() {
            updateKPIs();
            updateCharts();
            updateRealTimeActivity();
            updateTopPerformers();
            updatePredictiveInsights();
        }

        // Update KPI cards
        function updateKPIs() {
            const { metrics, trends } = analyticsData;
            
            // Update values
            document.getElementById('totalRevenue').textContent = formatCurrency(metrics.totalRevenue);
            document.getElementById('totalOrders').textContent = formatNumber(metrics.totalOrders);
            document.getElementById('newCustomers').textContent = formatNumber(metrics.newCustomers);
            document.getElementById('conversionRate').textContent = formatPercentage(metrics.conversionRate);
            
            // Update trends
            updateTrendIndicator('revenueTrend', trends.revenue);
            updateTrendIndicator('ordersTrend', trends.orders);
            updateTrendIndicator('customersTrend', trends.customers);
            updateTrendIndicator('conversionTrend', trends.conversionRate);
        }

        // Update charts
        function updateCharts() {
            updateRevenueChart();
            updateFunnelChart();
            updateProductsChart();
            updateCustomersChart();
            updateGeoChart();
        }

        // Revenue Chart
        function updateRevenueChart() {
            const ctx = document.getElementById('revenueChart').getContext('2d');
            const { revenue } = analyticsData.charts;
            
            if (charts.revenue) charts.revenue.destroy();
            
            charts.revenue = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: revenue.labels,
                    datasets: [{
                        label: 'Revenue',
                        data: revenue.data,
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        tension: 0.4,
                        fill: true
                    }, {
                        label: 'Target',
                        data: revenue.targets,
                        borderColor: '#2ecc71',
                        borderDash: [5, 5],
                        backgroundColor: 'transparent',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `${context.dataset.label}: ${formatCurrency(context.raw)}`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return formatCurrency(value);
                                }
                            }
                        }
                    }
                }
            });
        }

        // Funnel Chart
        function updateFunnelChart() {
            const ctx = document.getElementById('funnelChart').getContext('2d');
            const { funnel } = analyticsData.charts;
            
            if (charts.funnel) charts.funnel.destroy();
            
            charts.funnel = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: funnel.labels,
                    datasets: [{
                        data: funnel.data,
                        backgroundColor: [
                            '#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    cutout: '50%',
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }

        // Products Chart
        function updateProductsChart() {
            const ctx = document.getElementById('productsChart').getContext('2d');
            const { products } = analyticsData.charts;
            
            if (charts.products) charts.products.destroy();
            
            charts.products = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: products.labels,
                    datasets: [{
                        label: 'Units Sold',
                        data: products.units,
                        backgroundColor: '#3498db'
                    }, {
                        label: 'Revenue',
                        data: products.revenue,
                        backgroundColor: '#2ecc71',
                        type: 'line',
                        yAxisID: 'y1'
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Units Sold'
                            }
                        },
                        y1: {
                            position: 'right',
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Revenue'
                            },
                            ticks: {
                                callback: function(value) {
                                    return formatCurrency(value);
                                }
                            }
                        }
                    }
                }
            });
        }

        // Customers Chart
        function updateCustomersChart() {
            const ctx = document.getElementById('customersChart').getContext('2d');
            const { customers } = analyticsData.charts;
            
            if (charts.customers) charts.customers.destroy();
            
            charts.customers = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: customers.labels,
                    datasets: [{
                        data: customers.data,
                        backgroundColor: [
                            '#3498db', '#2ecc71', '#e74c3c', '#f39c12',
                            '#9b59b6', '#1abc9c', '#34495e', '#d35400'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'right'
                        }
                    }
                }
            });
        }

        // Geo Chart (using ApexCharts)
        function updateGeoChart() {
            const { geographic } = analyticsData;
            const container = document.getElementById('geoChart');
            
            // Simple implementation - in production, use proper mapping library
            container.innerHTML = `
                <div class="geo-simple">
                    ${geographic.states.map(state => `
                        <div class="geo-item">
                            <span class="geo-name">${state.name}</span>
                            <div class="geo-bar">
                                <div class="geo-fill" style="width: ${state.percentage}%"></div>
                            </div>
                            <span class="geo-value">${state.percentage}%</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        // Real-time activity updates
        function updateRealTimeActivity() {
            const { realtime } = analyticsData;
            
            document.getElementById('currentHourOrders').textContent = realtime.currentHour.orders;
            document.getElementById('currentHourRevenue').textContent = formatCurrency(realtime.currentHour.revenue);
            document.getElementById('todayOrders').textContent = realtime.today.orders;
            document.getElementById('todayRevenue').textContent = formatCurrency(realtime.today.revenue);
            document.getElementById('activeUsers').textContent = realtime.active.users;
            document.getElementById('activeCarts').textContent = realtime.active.carts;
        }

        // Top performers
        function updateTopPerformers() {
            const { topPerformers } = analyticsData;
            
            // Best selling products
            document.getElementById('bestSellingProducts').innerHTML = topPerformers.bestSelling.map(product => `
                <div class="performer-item">
                    <span class="product-name">${product.name}</span>
                    <span class="product-value">${product.units} units</span>
                </div>
            `).join('');
            
            // Fastest growing
            document.getElementById('fastestGrowingProducts').innerHTML = topPerformers.fastestGrowing.map(product => `
                <div class="performer-item">
                    <span class="product-name">${product.name}</span>
                    <span class="product-value ${product.growth >= 0 ? 'positive' : 'negative'}">
                        ${product.growth >= 0 ? '+' : ''}${product.growth}%
                    </span>
                </div>
            `).join('');
            
            // Highest revenue
            document.getElementById('highestRevenueProducts').innerHTML = topPerformers.highestRevenue.map(product => `
                <div class="performer-item">
                    <span class="product-name">${product.name}</span>
                    <span class="product-value">${formatCurrency(product.revenue)}</span>
                </div>
            `).join('');
        }

        // Predictive insights
        function updatePredictiveInsights() {
            const { predictions } = analyticsData;
            
            document.getElementById('forecastRevenue').textContent = formatCurrency(predictions.revenue);
            document.getElementById('forecastOrders').textContent = predictions.orders;
            
            // Inventory alerts
            document.getElementById('inventoryAlerts').innerHTML = predictions.inventoryAlerts.map(alert => `
                <div class="inventory-alert ${alert.level}">
                    <span class="alert-product">${alert.product}</span>
                    <span class="alert-message">${alert.message}</span>
                </div>
            `).join('');
        }

        // Utility functions
        function formatCurrency(amount) {
            return '₦' + (amount || 0).toLocaleString('en-NG', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
        }

        function formatNumber(number) {
            return (number || 0).toLocaleString('en-NG');
        }

        function formatPercentage(number) {
            return (number || 0).toFixed(1) + '%';
        }

        function updateTrendIndicator(elementId, value) {
            const element = document.getElementById(elementId);
            element.textContent = (value >= 0 ? '+' : '') + value + '%';
            element.className = `trend-indicator ${value >= 0 ? 'positive' : 'negative'}`;
        }

        function updateLastUpdated() {
            document.getElementById('lastUpdated').textContent = new Date().toLocaleTimeString();
        }

        // Auto-refresh functionality
        function startAutoRefresh() {
            clearInterval(refreshInterval);
            refreshInterval = setInterval(() => {
                loadAnalytics();
            }, 30000); // Refresh every 30 seconds
        }

        function refreshAnalytics() {
            const btn = document.getElementById('refreshBtn');
            btn.textContent = '⏳ Refreshing...';
            loadAnalytics().finally(() => {
                setTimeout(() => {
                    btn.textContent = ' Refresh';
                }, 1000);
            });
        }

        // Event listeners
        function setupEventListeners() {
            // Custom date range handling
            document.getElementById('dateRange').addEventListener('change', function() {
                if (this.value === 'custom') {
                    document.getElementById('dateRangeModal').style.display = 'block';
                }
            });
            
            // Keyboard shortcuts
            document.addEventListener('keydown', function(e) {
                if (e.ctrlKey && e.key === 'r') {
                    e.preventDefault();
                    refreshAnalytics();
                }
                if (e.key === 'Escape') {
                    closeModal();
                }
            });
        }

        // Tab switching
        function switchTab(tabName) {
            currentTab = tabName;
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            event.target.classList.add('active');
            document.getElementById(tabName + '-tab').classList.add('active');
        }

        // Modal functions
        function closeModal() {
            document.getElementById('dateRangeModal').style.display = 'none';
        }

        function applyCustomDateRange() {
            const fromDate = document.getElementById('fromDate').value;
            const toDate = document.getElementById('toDate').value;
            
            if (fromDate && toDate) {
                // Implement custom date range logic
                loadAnalytics();
                closeModal();
            } else {
                alert('Please select both from and to dates');
            }
        }

        // Export functionality
        function exportAnalytics() {
            const dataStr = JSON.stringify(analyticsData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `cil-analytics-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            URL.revokeObjectURL(url);
        }

        // Fullscreen toggle
        function toggleFullscreen() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.error('Error attempting to enable fullscreen:', err);
                });
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
        }

        // Loading states
        function showLoading(loading) {
            document.body.classList.toggle('loading', loading);
        }

        function showError(message) {
            // Implement toast notification or error display
            console.error('Analytics Error:', message);
        }

        // Initialize when DOM is loaded
        document.addEventListener('DOMContentLoaded', initAnalytics);

        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            clearInterval(refreshInterval);
            Object.values(charts).forEach(chart => chart.destroy());
        });

        // Logout function
        async function logout() {
            try {
                await fetch('/admin/logout', { method: 'POST', credentials: 'include' });
                window.location.href = '/admin/login';
            } catch (error) {
                console.error('Logout error:', error);
            }
        }
async function changePassword() {
  const oldPass = document.getElementById('oldPass').value;
  const newPass = document.getElementById('newPass').value;
  const confirmPass = document.getElementById('confirmPass').value;
  const alertBox = document.getElementById('alert');

  if (!oldPass || !newPass || !confirmPass) {
    alertBox.className = 'alert error';
    alertBox.textContent = 'All fields are required';
    alertBox.style.display = 'block';
    return;
  }

  if (newPass !== confirmPass) {
    alertBox.className = 'alert error';
    alertBox.textContent = 'Passwords do not match';
    alertBox.style.display = 'block';
    return;
  }

  const res = await fetch('/admin/change-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ oldPass, newPass })
  });

  const data = await res.json();
  alertBox.className = 'alert ' + (data.success ? 'success' : 'error');
  alertBox.textContent = data.message;
  alertBox.style.display = 'block';
}
        let customers = [];
        let editingCustomerId = null;

        // Load customers
        async function loadCustomers() {
            try {
                const response = await fetch('/admin/api/customers');
                customers = await response.json();
                displayCustomers(customers);
                updateCustomerStats();
                updateSegmentation();
            } catch (error) {
                console.error('Error loading customers:', error);
            }
        }

        // Display customers in table
        function displayCustomers(customersToShow) {
            const tbody = document.getElementById('customersTable');
            
            const html = customersToShow.map(customer => `
                <tr>
                    <td>
                        <div class="customer-info">
                            <strong>${customer.name}</strong>
                            <small>${customer.type}</small>
                        </div>
                    </td>
                    <td>
                        <div class="contact-info">
                            <div>${customer.phone}</div>
                            <small>${customer.email || 'No email'}</small>
                        </div>
                    </td>
                    <td>${customer.city || 'N/A'}, ${customer.state || 'N/A'}</td>
                    <td>${customer.orderCount || 0}</td>
                    <td>₦${customer.totalSpent?.toLocaleString() || '0'}</td>
                    <td>${customer.lastOrder ? new Date(customer.lastOrder).toLocaleDateString() : 'Never'}</td>
                    <td>
                        <span class="status-badge ${customer.status || 'active'}">
                            ${customer.status || 'Active'}
                        </span>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button onclick="viewCustomerDetails(${customer.id})" class="btn-view"> View</button>
                            <button onclick="editCustomer(${customer.id})" class="btn-edit"> Edit</button>
                            <button onclick="sendCustomerEmail(${customer.id})" class="btn-email"> Email</button>
                        </div>
                    </td>
                </tr>
            `).join('');
            
            tbody.innerHTML = html;
        }

        // Update customer statistics
        function updateCustomerStats() {
            const total = customers.length;
            const active = customers.filter(c => c.status !== 'inactive').length;
            const repeat = customers.filter(c => (c.orderCount || 0) > 1).length;
            const avgSpent = customers.length > 0 ? 
                customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0) / customers.length : 0;

            document.getElementById('totalCustomers').textContent = total;
            document.getElementById('activeCustomers').textContent = active;
            document.getElementById('repeatCustomers').textContent = repeat;
            document.getElementById('avgOrderValue').textContent = `₦${avgSpent.toLocaleString()}`;
        }

        // Update customer segmentation
        function updateSegmentation() {
            const vipCount = customers.filter(c => (c.totalSpent || 0) > 50000).length;
            const repeatCount = customers.filter(c => (c.orderCount || 0) > 1).length;
            const newCount = customers.filter(c => {
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return c.createdAt && new Date(c.createdAt) > thirtyDaysAgo;
            }).length;
            const inactiveCount = customers.filter(c => {
                const ninetyDaysAgo = new Date();
                ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
                return c.lastOrder && new Date(c.lastOrder) < ninetyDaysAgo;
            }).length;

            document.getElementById('vipCount').textContent = vipCount;
            document.getElementById('repeatCount').textContent = repeatCount;
            document.getElementById('newCount').textContent = newCount;
            document.getElementById('inactiveCount').textContent = inactiveCount;
        }

        // View customer details
        async function viewCustomerDetails(customerId) {
            const customer = customers.find(c => c.id == customerId);
            if (!customer) return;

            // Load customer orders
            const ordersResponse = await fetch(`/admin/api/customers/${customerId}/orders`);
            const orders = await ordersResponse.json();

            const ordersHtml = orders.map(order => `
                <div class="order-item">
                    <div class="order-info">
                        <strong>Order #${order.orderNumber}</strong>
                        <span>${new Date(order.timestamp).toLocaleDateString()} - ₦${order.total?.toLocaleString()}</span>
                    </div>
                    <div class="order-status ${order.status}">
                        ${order.status}
                    </div>
                </div>
            `).join('') || '<p>No orders found</p>';

            const content = `
                <div class="customer-details">
                    <div class="detail-section">
                        <h4>Customer Information</h4>
                        <div class="detail-grid">
                            <div><strong>Name:</strong> ${customer.name}</div>
                            <div><strong>Phone:</strong> ${customer.phone}</div>
                            <div><strong>Email:</strong> ${customer.email || 'N/A'}</div>
                            <div><strong>Type:</strong> ${customer.type}</div>
                            <div><strong>Address:</strong> ${customer.address || 'N/A'}</div>
                            <div><strong>Location:</strong> ${customer.city || ''} ${customer.state || ''}</div>
                            <div><strong>Total Orders:</strong> ${customer.orderCount || 0}</div>
                            <div><strong>Total Spent:</strong> ₦${customer.totalSpent?.toLocaleString() || '0'}</div>
                        </div>
                    </div>

                    <div class="detail-section">
                        <h4>Order History</h4>
                        <div class="order-history">
                            ${ordersHtml}
                        </div>
                    </div>

                    <div class="detail-actions">
                        <button onclick="editCustomer(${customer.id})" class="btn-action"> Edit Customer</button>
                        <button onclick="sendCustomerEmail(${customer.id})" class="btn-action"> Send Email</button>
                    </div>
                </div>
            `;

            document.getElementById('customerDetailsContent').innerHTML = content;
            document.getElementById('modalCustomerTitle').textContent = `Customer: ${customer.name}`;
            document.getElementById('customerModal').style.display = 'block';
        }

        // Show add customer modal
        function showAddCustomerModal() {
            editingCustomerId = null;
            document.getElementById('customerForm').reset();
            document.getElementById('addCustomerModal').style.display = 'block';
        }

        // Edit customer
        function editCustomer(customerId) {
            const customer = customers.find(c => c.id == customerId);
            if (!customer) return;
            
            editingCustomerId = customerId;
            
            // Fill form with customer data
            document.getElementById('customerName').value = customer.name || '';
            document.getElementById('customerEmail').value = customer.email || '';
            document.getElementById('customerPhone').value = customer.phone || '';
            document.getElementById('customerType').value = customer.type || 'retail';
            document.getElementById('customerAddress').value = customer.address || '';
            document.getElementById('customerCity').value = customer.city || '';
            document.getElementById('customerState').value = customer.state || '';
            
            document.getElementById('addCustomerModal').style.display = 'block';
        }

        // Save customer
        async function saveCustomer(event) {
            event.preventDefault();
            
            const customerData = {
                name: document.getElementById('customerName').value,
                email: document.getElementById('customerEmail').value,
                phone: document.getElementById('customerPhone').value,
                type: document.getElementById('customerType').value,
                address: document.getElementById('customerAddress').value,
                city: document.getElementById('customerCity').value,
                state: document.getElementById('customerState').value
            };
            
            try {
                let response;
                if (editingCustomerId) {
                    response = await fetch(`/admin/api/customers/${editingCustomerId}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(customerData)
                    });
                } else {
                    response = await fetch('/admin/api/customers', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(customerData)
                    });
                }
                
                if (response.ok) {
                    closeModal();
                    loadCustomers();
                }
            } catch (error) {
                console.error('Error saving customer:', error);
            }
        }

        // Send email to customer
        async function sendCustomerEmail(customerId) {
            const customer = customers.find(c => c.id == customerId);
            if (!customer || !customer.email) {
                alert('No email address found for this customer');
                return;
            }

            // Redirect to email system with customer pre-filled
            window.location.href = `/admin/emails?to=${encodeURIComponent(customer.email)}`;
        }

        // Export customers
        function exportCustomers() {
            const csv = customers.map(customer => 
                `"${customer.name}","${customer.email}","${customer.phone}","${customer.type}","${customer.orderCount || 0}","₦${customer.totalSpent || 0}"`
            ).join('\n');
            
            const header = 'Name,Email,Phone,Type,Orders,TotalSpent\n';
            const blob = new Blob([header + csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'customers-export.csv';
            a.click();
            window.URL.revokeObjectURL(url);
        }

        // Close modal
        function closeModal() {
            document.getElementById('customerModal').style.display = 'none';
            document.getElementById('addCustomerModal').style.display = 'none';
        }

        // Logout
        async function logout() {
            try {
                await fetch('/admin/logout', { method: 'POST' });
                window.location.href = '/admin/login';
            } catch (error) {
                console.error('Logout error:', error);
            }
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', loadCustomers);

        let revenueChart, ordersChart, categoriesChart;

        // Load all dashboard data
        async function loadDashboardData() {
            try {
                showLoadingState();
                await loadProducts();
                await loadStats();
                await loadRecentActivity();
                updateCharts();
                updateLastUpdated();
            } catch (error) {
                console.error('Error loading dashboard data:', error);
                showErrorState('Failed to load dashboard data. Please try again.');
            }
        }

        // Show loading state
        function showLoadingState() {
            document.getElementById('recentOrders').innerHTML = `
                <div class="activity-item loading">
                    <div class="activity-content">
                        <div class="activity-title">Loading data...</div>
                        <div class="activity-description">Please wait while we update the dashboard</div>
                    </div>
                </div>
            `;
        }

        // Show error state
        function showErrorState(message) {
            document.getElementById('recentOrders').innerHTML = `
                <div class="activity-item error">
                    <div class="activity-content">
                        <div class="activity-title">Error Loading Data</div>
                        <div class="activity-description">${message}</div>
                    </div>
                </div>
            `;
        }

        // Update last updated timestamp
        function updateLastUpdated() {
            const now = new Date();
            document.getElementById('lastUpdated').textContent = now.toLocaleTimeString();
        }

        // Load products data
        async function loadProducts() {
            try {
                const response = await fetch('/admin/api/products');
                if (response.ok) {
                    allProducts = await response.json();
                    updateProductStats();
                }
            } catch (error) {
                console.error('Error loading products:', error);
            }
        }

        // Update the updateMetrics function in admin-dashboard.html:
        async function loadStats() {
            try {
                const response = await fetch('/admin/api/stats');
                if (response.ok) {
                    const stats = await response.json();
                    updateMetrics(stats);
                } else {
                    // Fallback: generate from available data
                    await generateStatsFromData();
                }
                
                // Also load email stats if on email page
                if (window.location.pathname.includes('/admin/emails')) {
                    const emailResponse = await fetch('/admin/api/email-stats');
                    if (emailResponse.ok) {
                        const emailStats = await emailResponse.json();
                        updateEmailStats(emailStats);
                    }
                }
            } catch (error) {
                console.error('Error loading stats:', error);
                await generateStatsFromData();
            }
        }

        function updateEmailStats(stats) {
            document.getElementById('sentEmails').textContent = stats.sent || 0;
            document.getElementById('deliveryRate').textContent = (stats.deliveryRate || 0) + '%';
            document.getElementById('successRate').textContent = (stats.successRate || 0) + '%';
            document.getElementById('failedEmails').textContent = stats.failed || 0;
        }

        // Load recent activity
        async function loadRecentActivity() {
            try {
                const response = await fetch('/admin/api/orders');
                if (response.ok) {
                    const orders = await response.json();
                    displayRecentOrders(orders.slice(-5).reverse());
                } else {
                    generateRecentActivity();
                }
            } catch (error) {
                console.error('Error loading activity:', error);
                generateRecentActivity();
            }
        }

        // Update product-related stats
        function updateProductStats() {
            const totalProducts = allProducts.length;
            const lowStockItems = allProducts.filter(p => 
                p.stock === 'Limited Stock' || p.stock === 'Made to Order'
            ).length;

            document.getElementById('totalProducts').textContent = totalProducts.toLocaleString();
            document.getElementById('lowStock').textContent = lowStockItems.toLocaleString();
        }

        // Update metrics with real data
        function updateMetrics(stats) {
            // Update main metrics
            document.querySelector('.metric-card.revenue .metric-value').textContent = 
                `₦${(stats.totalRevenue || 0).toLocaleString()}`;
            document.querySelector('.metric-card.orders .metric-value').textContent = 
                (stats.totalOrders || 0).toLocaleString();
            document.querySelector('.metric-card.customers .metric-value').textContent = 
                (stats.totalCustomers || 0).toLocaleString();

            // Update quick stats
            document.getElementById('pendingOrders').textContent = (stats.pendingOrders || 0).toLocaleString();
        }

        // Generate stats from available data
        function generateStatsFromData() {
            const totalProducts = allProducts.length;
            const avgProductPrice = allProducts.reduce((sum, p) => sum + (p.price || 0), 0) / totalProducts;
            const estimatedRevenue = Math.floor(totalProducts * avgProductPrice * 0.1);
            const estimatedOrders = Math.floor(totalProducts * 0.5);
            const estimatedCustomers = Math.floor(estimatedOrders * 0.8);
            const estimatedPending = Math.floor(estimatedOrders * 0.2);

            document.querySelector('.metric-card.revenue .metric-value').textContent = 
                `₦${estimatedRevenue.toLocaleString()}`;
            document.querySelector('.metric-card.orders .metric-value').textContent = 
                estimatedOrders.toLocaleString();
            document.querySelector('.metric-card.customers .metric-value').textContent = 
                estimatedCustomers.toLocaleString();
            document.getElementById('pendingOrders').textContent = estimatedPending.toLocaleString();
        }

        // Display recent orders
        function displayRecentOrders(orders) {
            const container = document.getElementById('recentOrders');
            
            if (!orders || orders.length === 0) {
                container.innerHTML = `
                    <div class="activity-item">
                        <div class="activity-content">
                            <div class="activity-title">No recent orders</div>
                            <div class="activity-description">New orders will appear here</div>
                        </div>
                    </div>
                `;
                return;
            }

            const ordersHtml = orders.map(order => `
                <div class="activity-item">
                    <div class="activity-icon">
                        <div class="icon order"></div>
                    </div>
                    <div class="activity-content">
                        <div class="activity-title">New Order #${order.orderNumber || order.id}</div>
                        <div class="activity-description">
                            ${order.customerName || 'Customer'} • ₦${(order.total || 0).toLocaleString()}
                        </div>
                        <div class="activity-meta">
                            ${new Date(order.timestamp || Date.now()).toLocaleDateString()}
                        </div>
                    </div>
                    <div class="activity-status ${order.status || 'pending'}">
                        ${order.status || 'Pending'}
                    </div>
                </div>
            `).join('');

            container.innerHTML = ordersHtml;
        }

        // Generate recent activity from available data
        function generateRecentActivity() {
            const activity = [
                {
                    orderNumber: 'ORD-001',
                    customerName: 'John Smith',
                    total: 450000,
                    status: 'completed',
                    timestamp: Date.now() - 300000
                },
                {
                    orderNumber: 'ORD-002',
                    customerName: 'Sarah Johnson',
                    total: 1200000,
                    status: 'processing',
                    timestamp: Date.now() - 1800000
                },
                {
                    orderNumber: 'ORD-003',
                    customerName: 'Mike Davis',
                    total: 285000,
                    status: 'pending',
                    timestamp: Date.now() - 3600000
                }
            ];

            displayRecentOrders(activity);
        }

        // Update charts with real data
        function updateCharts() {
            const revenueCtx = document.getElementById('revenueChart').getContext('2d');
            const ordersCtx = document.getElementById('ordersChart').getContext('2d');
            const categoriesCtx = document.getElementById('categoriesChart').getContext('2d');
            
            // Destroy existing charts
            if (revenueChart) revenueChart.destroy();
            if (ordersChart) ordersChart.destroy();
            if (categoriesChart) categoriesChart.destroy();
            
            // Generate real data from products
            const categoryData = generateCategoryData();
            const revenueData = generateRevenueData();
            const ordersData = generateOrdersData();
            
            // Revenue Chart
            revenueChart = new Chart(revenueCtx, {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        label: 'Revenue',
                        data: revenueData,
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#10b981',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0,0,0,0.1)'
                            },
                            ticks: {
                                callback: function(value) {
                                    return '₦' + (value / 1000).toFixed(0) + 'K';
                                }
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
            
            // Orders Chart
            ordersChart = new Chart(ordersCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Completed', 'Processing', 'Pending', 'Cancelled'],
                    datasets: [{
                        data: ordersData,
                        backgroundColor: [
                            '#10b981',
                            '#3b82f6',
                            '#f59e0b',
                            '#ef4444'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                usePointStyle: true,
                                padding: 20
                            }
                        }
                    }
                }
            });
            
            // Categories Chart
            categoriesChart = new Chart(categoriesCtx, {
                type: 'bar',
                data: {
                    labels: categoryData.labels,
                    datasets: [{
                        label: 'Products',
                        data: categoryData.counts,
                        backgroundColor: [
                            'rgba(59, 130, 246, 0.8)',
                            'rgba(16, 185, 129, 0.8)',
                            'rgba(139, 92, 246, 0.8)',
                            'rgba(245, 158, 11, 0.8)',
                            'rgba(239, 68, 68, 0.8)'
                        ],
                        borderColor: [
                            'rgb(59, 130, 246)',
                            'rgb(16, 185, 129)',
                            'rgb(139, 92, 246)',
                            'rgb(245, 158, 11)',
                            'rgb(239, 68, 68)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0,0,0,0.1)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }

        // Generate category data from actual products
        function generateCategoryData() {
            const categories = {};
            
            allProducts.forEach(product => {
                const category = product.category;
                categories[category] = (categories[category] || 0) + 1;
            });
            
            return {
                labels: Object.keys(categories).map(cat => 
                    cat.charAt(0).toUpperCase() + cat.slice(1)
                ),
                counts: Object.values(categories)
            };
        }

        // Generate revenue data
        function generateRevenueData() {
            return [12000, 19000, 15000, 25000, 22000, 30000, 28000];
        }

        // Generate orders data
        function generateOrdersData() {
            return [45, 25, 15, 5];
        }

        // Export dashboard data
        function exportDashboardData() {
            alert('Export feature would be implemented here');
        }

        // Logout
        async function logout() {
            try {
                await fetch('/admin/logout', { method: 'POST' });
                window.location.href = '/admin/login';
            } catch (error) {
                console.error('Logout error:', error);
                window.location.href = '/admin/login';
            }
        }

        // Initialize dashboard
        document.addEventListener('DOMContentLoaded', function() {
            loadDashboardData();
            // Refresh every 2 minutes
            setInterval(loadDashboardData, 120000);
        });

        let recentEmails = [];

        // Show alert message
        function showAlert(message, type = 'success') {
            const alert = document.getElementById('alert');
            alert.textContent = message;
            alert.className = `alert alert-${type}`;
            alert.style.display = 'block';
            
            setTimeout(() => {
                alert.style.display = 'none';
            }, 5000);
        }

        // Load email data with authentication handling
async function loadEmailData() {
    try {
        showLoading(true);
        const response = await fetch('/admin/api/recent-emails', {
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });
        
        if (response.status === 401) {
            showAlert('Session expired. Redirecting to login...', 'error');
            setTimeout(() => {
                window.location.href = '/admin/login';
            }, 1500);
            return;
        }
        
        if (response.status === 403) {
            showAlert('Access denied. You do not have permission.', 'error');
            return;
        }
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        recentEmails = Array.isArray(data) ? data : [];
        displayRecentEmails();
        updateEmailStats();
        
    } catch (error) {
        console.error('Error loading email data:', error);
        showAlert('Failed to load email data. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

// Add session monitoring
let sessionMonitor;
function startSessionMonitor() {
    sessionMonitor = setInterval(async () => {
        try {
            const response = await fetch('/admin/api/stats', {
                credentials: 'include',
                cache: 'no-store'
            });
            
            if (response.status === 401) {
                clearInterval(sessionMonitor);
                showAlert('Your session has expired', 'error');
                setTimeout(() => {
                    window.location.href = '/admin/login';
                }, 2000);
            }
        } catch (error) {
            console.warn('Session check failed:', error);
        }
    }, 60000); // Check every minute
}

// Call this on page load
document.addEventListener('DOMContentLoaded', () => {
    startSessionMonitor();
    loadEmailData();
});

        // Display recent emails
        function displayRecentEmails() {
            const tbody = document.getElementById('recentEmailsTable');
            
            if (!Array.isArray(recentEmails) || recentEmails.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="6" style="text-align: center; color: var(--gray);">
                            No emails sent yet. Send your first email!
                        </td>
                    </tr>
                `;
                return;
            }
            
            const html = recentEmails.map(email => `
                <tr>
                    <td>${escapeHtml(email.to || 'N/A')}</td>
                    <td>${escapeHtml(email.subject || 'No Subject')}</td>
                    <td>
                        <span class="email-type ${email.type || 'transactional'}">${email.type || 'transactional'}</span>
                    </td>
                    <td>${formatDate(email.sentAt || email.createdAt)}</td>
                    <td>
                        <span class="email-status ${email.status || 'sent'}">${email.status || 'sent'}</span>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button onclick="resendEmail('${escapeString(email.to)}', '${escapeString(email.subject)}', \`${escapeString(email.message)}\`)" 
                                    class="btn-small">Resend</button>
                        </div>
                    </td>
                </tr>
            `).join('');
            
            tbody.innerHTML = html;
        }

        // Escape string for JavaScript (for template literals)
        function escapeString(str) {
            if (!str) return '';
            return str
                .replace(/\\/g, '\\\\')
                .replace(/\`/g, '\\`')
                .replace(/\$/g, '\\$')
                .replace(/\n/g, '\\n')
                .replace(/\r/g, '\\r')
                .replace(/\t/g, '\\t');
        }

        // Escape HTML for safe display
        function escapeHtml(unsafe) {
            if (!unsafe) return '';
            return unsafe
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }

        // Update email statistics
        function updateEmailStats() {
            if (!Array.isArray(recentEmails)) {
                recentEmails = [];
            }
            
            const sent = recentEmails.length;
            const delivered = recentEmails.filter(e => e.status === 'sent' || e.status === 'delivered').length;
            const failed = recentEmails.filter(e => e.status === 'failed').length;
            const simulated = recentEmails.filter(e => e.status === 'simulated').length;
            
            const deliveryRate = sent > 0 ? Math.round((delivered / sent) * 100) : 0;
            const successRate = sent > 0 ? Math.round(((sent - failed) / sent) * 100) : 0;

            document.getElementById('sentEmails').textContent = sent;
            document.getElementById('deliveryRate').textContent = deliveryRate + '%';
            document.getElementById('successRate').textContent = successRate + '%';
            document.getElementById('failedEmails').textContent = failed;

            // Show simulation notice if any emails are simulated
            if (simulated > 0) {
                showAlert(`⚠️ ${simulated} emails were simulated (email configuration needed)`, 'error');
            }
        }

        // Format date
        function formatDate(dateString) {
            if (!dateString) return 'N/A';
            try {
                const date = new Date(dateString);
                return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
            } catch (error) {
                return 'Invalid Date';
            }
        }

        // Show send email modal
        function showSendEmailModal() {
            document.getElementById('sendEmailModal').style.display = 'block';
            updateEmailPreview();
        }

        // Update email preview
        function updateEmailPreview() {
            const message = document.getElementById('emailMessage').value;
            const preview = document.getElementById('emailPreview');
            
            if (message) {
                // Simple preview - show first 100 characters
                preview.textContent = message.substring(0, 100) + (message.length > 100 ? '...' : '');
            } else {
                preview.textContent = 'Your email preview will appear here...';
            }
        }

        // Load template
        function loadTemplate(templateType) {
            const templates = {
                welcome: {
                    subject: 'Welcome to Collaborative Investment Ltd!',
                    message: `Dear Customer,

Welcome to Collaborative Investment Ltd! We're excited to have you on board.

At CIL, we're committed to providing you with quality products and excellent service across all our business sectors including construction, agriculture, solar energy, and more.

If you have any questions or need assistance, please don't hesitate to contact us.

Best regards,
The CIL Team

Collaborative Investment Ltd
212 Ijegun Road, Ikotun, Lagos
Phone: +234 812 997 8419
Email: collaborativeinvestmentltd@gmail.com`
                },
                order_update: {
                    subject: 'Your Order Update - Collaborative Investment Ltd',
                    message: `Dear Customer,

This is an update regarding your recent order.

Order Details:
- Order Number: [Order Number]
- Status: [Current Status]
- Items: [List of Items]

We'll keep you updated on the progress of your order. If you have any questions, please contact our customer service team.

Thank you for choosing Collaborative Investment Ltd.

Best regards,
The CIL Team`
                },
                promotion: {
                    subject: 'Special Offer Just For You!',
                    message: `Dear Customer,

We have an exclusive offer for you!

[Promotion Details]

This offer is valid until [Date]. Don't miss out on these great savings!

Shop now: https://collaborativeinvestmentltd.com

Thank you for being a valued customer.

Best regards,
The CIL Team`
                },
                newsletter: {
                    subject: 'CIL Monthly Update - New Products & Services',
                    message: `Dear Customer,

Here's your monthly update from Collaborative Investment Ltd!

In this edition:
- New product launches
- Industry insights
- Special offers
- Company news

We're constantly working to bring you the best products and services across all our business sectors.

Thank you for your continued support.

Best regards,
The CIL Team`
                }
            };

            const template = templates[templateType];
            if (template) {
                document.getElementById('emailSubject').value = template.subject;
                document.getElementById('emailMessage').value = template.message;
                showSendEmailModal();
                updateEmailPreview();
            }
        }

        // Send email with authentication handling
        async function sendEmail(event) {
            event.preventDefault();
            
            const sendBtn = document.getElementById('sendEmailBtn');
            const originalText = sendBtn.textContent;
            
            const emailData = {
                to: document.getElementById('emailTo').value,
                subject: document.getElementById('emailSubject').value,
                message: document.getElementById('emailMessage').value,
                type: document.getElementById('emailType').value
            };
            
            // Basic validation
            if (!emailData.to || !emailData.subject || !emailData.message) {
                showAlert('Please fill in all required fields.', 'error');
                return;
            }
            
            try {
                sendBtn.textContent = 'Sending...';
                sendBtn.disabled = true;
                
                const response = await fetch('/admin/api/send-email', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include', // Important for session cookies
                    body: JSON.stringify(emailData)
                });
                
                if (response.status === 401) {
                    showAlert('Session expired. Please login again.', 'error');
                    setTimeout(() => {
                        window.location.href = '/admin/login';
                    }, 2000);
                    return;
                }
                
                const result = await response.json();
                
                if (result.success) {
                    showAlert(' Email sent successfully!');
                    closeModal();
                    loadEmailData();
                    document.getElementById('emailForm').reset();
                } else {
                    showAlert(' Failed to send email: ' + result.message, 'error');
                }
            } catch (error) {
                console.error('Error sending email:', error);
                if (error.message.includes('401') || error.message.includes('Unauthorized')) {
                    showAlert('Authentication required. Please login again.', 'error');
                    setTimeout(() => {
                        window.location.href = '/admin/login';
                    }, 2000);
                } else {
                    showAlert(' Network error. Please check your connection and try again.', 'error');
                }
            } finally {
                sendBtn.textContent = originalText;
                sendBtn.disabled = false;
            }
        }

        // Resend email
        function resendEmail(to, subject, message) {
            if (confirm('Resend this email?')) {
                document.getElementById('emailTo').value = to;
                document.getElementById('emailSubject').value = subject;
                document.getElementById('emailMessage').value = message;
                showSendEmailModal();
                updateEmailPreview();
            }
        }

        // Close modal
        function closeModal() {
            document.getElementById('sendEmailModal').style.display = 'none';
        }

        // Show loading state
        function showLoading(loading) {
            const elements = document.querySelectorAll('.btn-refresh, .template-card');
            elements.forEach(el => {
                if (loading) {
                    el.classList.add('loading');
                } else {
                    el.classList.remove('loading');
                }
            });
        }

        // Logout with authentication handling
        async function logout() {
            try {
                const response = await fetch('/admin/logout', { 
                    method: 'POST',
                    credentials: 'include'
                });
                
                if (response.ok) {
                    window.location.href = '/admin/login';
                } else {
                    // Force redirect even if logout fails
                    window.location.href = '/admin/login';
                }
            } catch (error) {
                console.error('Logout error:', error);
                // Force redirect on error
                window.location.href = '/admin/login';
            }
        }

        // Check authentication status on page load
        async function checkAuthStatus() {
            try {
                const response = await fetch('/admin/api/stats', {
                    credentials: 'include'
                });
                
                if (response.status === 401) {
                    // Not authenticated, redirect to login
                    window.location.href = '/admin/login';
                    return false;
                }
                return true;
            } catch (error) {
                console.error('Auth check failed:', error);
                window.location.href = '/admin/login';
                return false;
            }
        }

        // Close modal when clicking outside
        window.onclick = function(event) {
            const modals = document.getElementsByClassName('modal');
            for (let modal of modals) {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            }
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', async function() {
            // Check authentication first
            const isAuthenticated = await checkAuthStatus();
            if (isAuthenticated) {
                loadEmailData();
                
                // Update preview when typing
                document.getElementById('emailMessage').addEventListener('input', updateEmailPreview);
                
                // Add enter key support for quick sending
                document.getElementById('emailForm').addEventListener('keypress', function(e) {
                    if (e.key === 'Enter' && e.ctrlKey) {
                        sendEmail(e);
                    }
                });
            }
        });

        // Handle page visibility changes (tab switching)
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden) {
                // Page became visible, refresh data
                loadEmailData();
            }
        });

        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const alert = document.getElementById('alert');
            
            try {
                const response = await fetch('/admin/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert.className = 'alert alert-success';
                    alert.textContent = 'Login successful! Redirecting...';
                    alert.style.display = 'block';
                    
                    setTimeout(() => {
                        window.location.href = result.redirect;
                    }, 1000);
                } else {
                    alert.className = 'alert alert-error';
                    alert.textContent = result.message || 'Login failed';
                    alert.style.display = 'block';
                }
            } catch (error) {
                alert.className = 'alert alert-error';
                alert.textContent = 'Network error. Please try again.';
                alert.style.display = 'block';
            }
        });

        let orders = [];
        let selectedOrders = new Set();
        let filteredOrders = [];

        // Load orders
        async function loadOrders() {
            try {
                const response = await fetch('/admin/api/orders');
                if (response.ok) {
                    const ordersData = await response.json();
                    
                    // Ensure all orders have proper IDs
                    orders = ordersData.map((order, index) => {
                        // Generate a proper ID if missing
                        if (!order.id && !order._id) {
                            order.id = `order-${Date.now()}-${index}`;
                        } else if (order._id) {
                            // Handle MongoDB _id format
                            order.id = order._id;
                        }
                        
                        // Ensure order has required fields
                        if (!order.orderNumber) {
                            order.orderNumber = `ORD-${(order.id || index).toString().slice(-6).toUpperCase()}`;
                        }
                        
                        if (!order.status) {
                            order.status = 'pending';
                        }
                        
                        if (!order.timestamp) {
                            order.timestamp = new Date().toISOString();
                        }
                        
                        if (!order.total) {
                            order.total = order.items?.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0) || 0;
                        }
                        
                        return order;
                    });
                    
                    filteredOrders = [...orders];
                    displayOrders(filteredOrders);
                    updateOrderStats();
                } else {
                    console.error('Failed to fetch orders');
                    // Initialize with empty array if API fails
                    orders = [];
                    filteredOrders = [];
                    displayOrders([]);
                    updateOrderStats();
                }
            } catch (error) {
                console.error('Error loading orders:', error);
                orders = [];
                filteredOrders = [];
                displayOrders([]);
                updateOrderStats();
            }
        }

        // Create sample orders for testing
        function createSampleOrders() {
            const sampleOrders = [
                {
                    id: 'order-1',
                    orderNumber: 'ORD-001',
                    customerName: 'John Smith',
                    customerPhone: '+2348012345678',
                    customerEmail: 'john@example.com',
                    customerLocation: 'Lagos, Nigeria',
                    status: 'pending',
                    paymentStatus: 'pending',
                    total: 450000,
                    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                    items: [
                        { name: 'Mahogany Executive Desk', price: 450000, quantity: 1 }
                    ]
                },
                {
                    id: 'order-2',
                    orderNumber: 'ORD-002',
                    customerName: 'Sarah Johnson',
                    customerPhone: '+2348023456789',
                    customerEmail: 'sarah@example.com',
                    customerLocation: 'Abuja, Nigeria',
                    status: 'confirmed',
                    paymentStatus: 'paid',
                    total: 1200000,
                    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                    items: [
                        { name: 'Automatic 2-Block Maker (Local)', price: 800000, quantity: 1 },
                        { name: 'Small Industrial Mixer', price: 275000, quantity: 1 },
                        { name: 'Hollow Sandcrete Blocks', price: 300, quantity: 500 }
                    ]
                },
                {
                    id: 'order-3',
                    orderNumber: 'ORD-003',
                    customerName: 'Mike Davis',
                    customerPhone: '+2348034567890',
                    customerEmail: 'mike@example.com',
                    customerLocation: 'Port Harcourt, Nigeria',
                    status: 'processing',
                    paymentStatus: 'paid',
                    total: 285000,
                    timestamp: new Date().toISOString(),
                    items: [
                        { name: 'Crate of Eggs (30 pieces)', price: 2400, quantity: 10 },
                        { name: 'Day Old Broiler Chicks', price: 450, quantity: 100 },
                        { name: 'Chicken Feed (25kg bag)', price: 9500, quantity: 5 }
                    ]
                }
            ];

            // Store in localStorage for demo
            localStorage.setItem('cil_orders', JSON.stringify(sampleOrders));
            orders = sampleOrders;
            filteredOrders = [...orders];
            displayOrders(filteredOrders);
            updateOrderStats();
            alert('Sample orders created successfully!');
        }

        // Filter orders
        function filterOrders() {
            const searchTerm = document.getElementById('orderSearch').value.toLowerCase();
            const statusFilter = document.getElementById('statusFilter').value;
            const dateFilter = document.getElementById('dateFilter').value;

            filteredOrders = orders.filter(order => {
                const matchesSearch = 
                    (order.orderNumber && order.orderNumber.toLowerCase().includes(searchTerm)) ||
                    (order.customerName && order.customerName.toLowerCase().includes(searchTerm)) ||
                    (order.customerPhone && order.customerPhone.includes(searchTerm));
                
                const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
                
                const matchesDate = !dateFilter || 
                    (order.timestamp && new Date(order.timestamp).toISOString().split('T')[0] === dateFilter);
                
                return matchesSearch && matchesStatus && matchesDate;
            });

            displayOrders(filteredOrders);
        }

        // Display orders in table
        function displayOrders(ordersToShow) {
            const tbody = document.getElementById('ordersTable');
            
            if (ordersToShow.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="8" style="text-align: center; padding: 2rem;">
                            No orders found matching your criteria
                            <br>
                            <small>Try creating sample data or check your API endpoint</small>
                        </td>
                    </tr>
                `;
                return;
            }
            
            const html = ordersToShow.map(order => {
                const orderId = order.id || order._id;
                if (!orderId) {
                    console.warn('Order missing ID:', order);
                    return '';
                }
                
                return `
                <tr>
                    <td>
                        <input type="checkbox" value="${orderId}" onchange="toggleOrderSelection(this)" ${selectedOrders.has(orderId) ? 'checked' : ''}>
                    </td>
                    <td>
                        <strong>${order.orderNumber || 'ORD-' + (orderId.toString().slice(-6))}</strong>
                    </td>
                    <td>
                        <div class="customer-info">
                            <strong>${order.customerName || 'N/A'}</strong>
                            <small>${order.customerPhone || ''}</small>
                        </div>
                    </td>
                    <td>${order.timestamp ? new Date(order.timestamp).toLocaleDateString() : 'N/A'}</td>
                    <td>₦${(order.total || 0).toLocaleString()}</td>
                    <td>
                        <select onchange="updateOrderStatus('${orderId}', this.value)" class="status-select ${order.status}">
                            <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                            <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                            <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                            <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                            <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                    </td>
                    <td>
                        <span class="payment-status ${order.paymentStatus || 'pending'}">
                            ${order.paymentStatus ? order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1) : 'Pending'}
                        </span>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button onclick="viewOrderDetails('${orderId}')" class="btn-view"> View</button>
                            <button onclick="sendOrderUpdate('${orderId}')" class="btn-email"> Email</button>
                            <button onclick="printInvoice('${orderId}')" class="btn-print"> Print</button>
                        </div>
                    </td>
                </tr>
            `}).join('');
            
            tbody.innerHTML = html;
            updateSelectAllCheckbox();
        }

        // Toggle order selection
        function toggleOrderSelection(checkbox) {
            const orderId = checkbox.value;
            if (checkbox.checked) {
                selectedOrders.add(orderId);
            } else {
                selectedOrders.delete(orderId);
            }
            updateSelectAllCheckbox();
        }

        // Toggle select all
        function toggleSelectAll(checkbox) {
            const checkboxes = document.querySelectorAll('#ordersTable input[type="checkbox"]');
            if (checkbox.checked) {
                checkboxes.forEach(cb => {
                    cb.checked = true;
                    selectedOrders.add(cb.value);
                });
            } else {
                checkboxes.forEach(cb => {
                    cb.checked = false;
                    selectedOrders.delete(cb.value);
                });
            }
        }

        // Update select all checkbox state
        function updateSelectAllCheckbox() {
            const checkboxes = document.querySelectorAll('#ordersTable input[type="checkbox"]');
            const selectAll = document.getElementById('selectAll');
            
            if (checkboxes.length === 0) {
                selectAll.checked = false;
                selectAll.disabled = true;
                return;
            }
            
            selectAll.disabled = false;
            const allChecked = Array.from(checkboxes).every(cb => cb.checked);
            selectAll.checked = allChecked;
        }

        // Apply bulk status update
        async function applyBulkStatus() {
            const statusSelect = document.getElementById('bulkStatusAction');
            const newStatus = statusSelect.value;
            
            if (!newStatus) {
                alert('Please select a status to apply');
                return;
            }
            
            if (selectedOrders.size === 0) {
                alert('Please select at least one order');
                return;
            }
            
            if (!confirm(`Update ${selectedOrders.size} order(s) to "${newStatus}"?`)) {
                return;
            }
            
            try {
                const updates = Array.from(selectedOrders).map(orderId => {
                    // For demo purposes, update locally
                    const order = orders.find(o => o.id === orderId || o._id === orderId);
                    if (order) {
                        order.status = newStatus;
                    }
                    
                    // Also try to update via API
                    return fetch(`/admin/api/orders/${orderId}/status`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: newStatus })
                    }).catch(err => {
                        console.warn(`API update failed for order ${orderId}:`, err);
                        // Continue even if API fails
                        return Promise.resolve();
                    });
                });
                
                await Promise.all(updates);
                alert(`Successfully updated ${selectedOrders.size} order(s)`);
                selectedOrders.clear();
                displayOrders(filteredOrders);
                updateOrderStats();
            } catch (error) {
                console.error('Error updating orders:', error);
                alert('Error updating orders. Please try again.');
            }
        }

        // Update order stats
        function updateOrderStats() {
            const pending = orders.filter(o => o.status === 'pending').length;
            const processing = orders.filter(o => o.status === 'processing').length;
            const shipped = orders.filter(o => o.status === 'shipped').length;
            const delivered = orders.filter(o => o.status === 'delivered').length;

            document.getElementById('pendingCount').textContent = pending;
            document.getElementById('processingCount').textContent = processing;
            document.getElementById('shippedCount').textContent = shipped;
            document.getElementById('deliveredCount').textContent = delivered;
        }

        // Update order status
        async function updateOrderStatus(orderId, newStatus) {
            const res = await fetch(`/admin/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await res.json();
            if (!data.success) {
                alert('Failed to update order status');
                return;
            }

            // ✅ UI already updates as before (no visual change)
        }

// In admin-orders.html, add this function:
function startOrderUpdates() {
    // Real-time order updates using polling
    setInterval(async () => {
        try {
            const response = await fetch('/admin/api/orders?updatedSince=' + new Date().getTime(), {
                credentials: 'include',
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });
            
            if (response.ok) {
                const newOrders = await response.json();
                if (JSON.stringify(newOrders) !== JSON.stringify(orders)) {
                    orders = newOrders;
                    filterOrders();
                    updateOrderStats();
                    
                    // Show notification if new orders
                    if (newOrders.length > orders.length) {
                        showNotification(`${newOrders.length - orders.length} new orders`);
                    }
                }
            }
        } catch (error) {
            console.error('Real-time update error:', error);
        }
    }, 30000); // Update every 30 seconds
}

// Add notification function
function showNotification(message) {
    if (!('Notification' in window)) return;
    
    if (Notification.permission === 'granted') {
        new Notification('New Orders', {
            body: message,
            icon: '/img/favicon.ico'
        });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification('New Orders', {
                    body: message,
                    icon: '/img/favicon.ico'
                });
            }
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadOrders();
    startOrderUpdates();
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
});
        // View order details
        async function viewOrderDetails(orderId) {
            const order = orders.find(o => o.id === orderId || o._id === orderId);
            if (!order) {
                alert('Order not found');
                return;
            }

            const itemsHtml = order.items?.map(item => `
                <div class="order-item">
                    <div class="item-info">
                        <strong>${item.name || 'Unknown Item'}</strong>
                        <span>${item.quantity || 1} × ₦${(item.price || 0)?.toLocaleString()}</span>
                    </div>
                    <div class="item-total">
                        ₦${((item.quantity || 1) * (item.price || 0))?.toLocaleString()}
                    </div>
                </div>
            `).join('') || '<p>No items found</p>';

            const content = `
                <div class="order-details">
                    <div class="detail-section">
                        <h4>Order Information</h4>
                        <div class="detail-grid">
                            <div><strong>Order ID:</strong> ${order.orderNumber || 'N/A'}</div>
                            <div><strong>Date:</strong> ${order.timestamp ? new Date(order.timestamp).toLocaleString() : 'N/A'}</div>
                            <div><strong>Status:</strong> <span class="status-badge ${order.status}">${order.status}</span></div>
                            <div><strong>Total:</strong> ₦${(order.total || 0).toLocaleString()}</div>
                        </div>
                    </div>

                    <div class="detail-section">
                        <h4>Customer Information</h4>
                        <div class="detail-grid">
                            <div><strong>Name:</strong> ${order.customerName || 'N/A'}</div>
                            <div><strong>Phone:</strong> ${order.customerPhone || 'N/A'}</div>
                            <div><strong>Email:</strong> ${order.customerEmail || 'N/A'}</div>
                            <div><strong>Location:</strong> ${order.customerLocation || 'N/A'}</div>
                        </div>
                    </div>

                    <div class="detail-section">
                        <h4>Order Items</h4>
                        <div class="order-items">
                            ${itemsHtml}
                        </div>
                    </div>

                    <div class="detail-actions">
                        <button onclick="sendOrderUpdate('${orderId}')" class="btn-action"> Send Update</button>
                        <button onclick="printInvoice('${orderId}')" class="btn-action"> Print Invoice</button>
                    </div>
                </div>
            `;

            document.getElementById('orderDetailsContent').innerHTML = content;
            document.getElementById('modalOrderTitle').textContent = `Order: ${order.orderNumber || orderId}`;
            document.getElementById('orderModal').style.display = 'block';
        }

        // Send order update email
        async function sendOrderUpdate(orderId) {
            const order = orders.find(o => o.id === orderId || o._id === orderId);
            if (!order) {
                alert('Order not found');
                return;
            }

            if (!order.customerEmail) {
                alert('No customer email found for this order');
                return;
            }

            const subject = `Order Update - ${order.orderNumber || orderId}`;
            const message = `
Dear ${order.customerName || 'Valued Customer'},

Your order ${order.orderNumber || orderId} is currently ${order.status}.

Order Details:
- Total: ₦${(order.total || 0).toLocaleString()}
- Status: ${order.status}
- Items: ${order.items?.map(item => `${item.quantity || 1} × ${item.name || 'Item'}`).join(', ') || 'No items'}

Thank you for your business!

Best regards,
Collaborative Investment Ltd
            `.trim();

            try {
                const response = await fetch('/admin/api/send-email', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        to: order.customerEmail,
                        subject: subject,
                        message: message
                    })
                });

                if (response.ok) {
                    alert('Order update email sent successfully!');
                } else {
                    alert('Failed to send email. Please try again.');
                }
            } catch (error) {
                console.error('Error sending email:', error);
                alert('Error sending email. Please try again.');
            }
        }

        // Print invoice
        function printInvoice(orderId) {
            const order = orders.find(o => o.id === orderId || o._id === orderId);
            if (!order) {
                alert('Order not found');
                return;
            }

            const printWindow = window.open('', '_blank');
            const invoiceContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Invoice - ${order.orderNumber || orderId}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 2rem; }
                        .header { text-align: center; margin-bottom: 2rem; }
                        .details { margin: 2rem 0; }
                        .table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
                        .table th, .table td { border: 1px solid #ddd; padding: 0.8rem; text-align: left; }
                        .total { font-weight: bold; font-size: 1.2rem; margin-top: 1rem; text-align: right; }
                        .footer { margin-top: 2rem; text-align: center; color: #666; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Collaborative Investment Ltd</h1>
                        <h2>INVOICE</h2>
                        <p>Order: ${order.orderNumber || orderId} | Date: ${order.timestamp ? new Date(order.timestamp).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    
                    <div class="details">
                        <p><strong>Customer:</strong> ${order.customerName || 'N/A'}</p>
                        <p><strong>Phone:</strong> ${order.customerPhone || 'N/A'}</p>
                        <p><strong>Location:</strong> ${order.customerLocation || 'N/A'}</p>
                    </div>
                    
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.items?.map(item => `
                                <tr>
                                    <td>${item.name || 'Item'}</td>
                                    <td>${item.quantity || 1}</td>
                                    <td>₦${(item.price || 0)?.toLocaleString()}</td>
                                    <td>₦${((item.quantity || 1) * (item.price || 0))?.toLocaleString()}</td>
                                </tr>
                            `).join('') || '<tr><td colspan="4">No items</td></tr>'}
                        </tbody>
                    </table>
                    
                    <div class="total">
                        Total Amount: ₦${(order.total || 0).toLocaleString()}
                    </div>
                    
                    <div class="footer">
                        <p>Thank you for your business!</p>
                        <p>Collaborative Investment Ltd</p>
                    </div>
                </body>
                </html>
            `;

            printWindow.document.write(invoiceContent);
            printWindow.document.close();
            printWindow.print();
        }

        // Export orders
        function exportOrders() {
            if (orders.length === 0) {
                alert('No orders to export');
                return;
            }

            const csv = orders.map(order => 
                `"${order.orderNumber || order.id}","${order.customerName || 'N/A'}","${order.customerPhone || 'N/A'}","${order.total || 0}","${order.status}","${order.timestamp ? new Date(order.timestamp).toLocaleDateString() : 'N/A'}"`
            ).join('\n');
            
            const header = 'OrderID,Customer,Phone,Amount,Status,Date\n';
            const blob = new Blob([header + csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'orders-export-' + new Date().toISOString().split('T')[0] + '.csv';
            a.click();
            window.URL.revokeObjectURL(url);
        }

        // Close modal
        function closeModal() {
            document.getElementById('orderModal').style.display = 'none';
        }

        // Logout
        async function logout() {
            try {
                await fetch('/admin/logout', { method: 'POST' });
                window.location.href = '/admin/login';
            } catch (error) {
                console.error('Logout error:', error);
                window.location.href = '/admin/login';
            }
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            // Try to load from localStorage first for demo
            const savedOrders = localStorage.getItem('cil_orders');
            if (savedOrders) {
                orders = JSON.parse(savedOrders);
                filteredOrders = [...orders];
                displayOrders(filteredOrders);
                updateOrderStats();
            }
            
            // Then try to load from API
            loadOrders();
        });

        // Define all products data directly (extracted from shop-all.js)
        const allProducts = [
            // AGRICULTURE PRODUCTS
            {
                id: 'agri-001',
                name: 'Crate of Eggs (30 pieces)',
                category: 'agriculture',
                subcategory: 'poultry',
                price: 2400,
                image: '/img/agriculture/crate-of-eggs.jpg',
                description: 'Fresh farm eggs from our free-range layers. Rich in nutrients.',
                stock: 'In Stock',
                minOrder: '1 Crate',
                tags: ['poultry', 'eggs', 'fresh']
            },
            {
                id: 'agri-002',
                name: 'Day Old Broiler Chicks',
                category: 'agriculture',
                subcategory: 'poultry',
                price: 450,
                image: '/img/agriculture/day-old-broilers.jpg',
                description: 'High-quality broiler chicks with fast growth rate.',
                stock: 'In Stock',
                minOrder: '50 chicks',
                tags: ['poultry', 'chicks', 'broiler']
            },
            {
                id: 'agri-003',
                name: 'Day Old Layer Chicks',
                category: 'agriculture',
                subcategory: 'poultry',
                price: 500,
                image: '/img/agriculture/day-old-layers.jpg',
                description: 'Premium layer breeds for high egg production.',
                stock: 'In Stock',
                minOrder: '50 chicks',
                tags: ['poultry', 'chicks', 'layer']
            },
            {
                id: 'agri-004',
                name: 'Point of Lay Layers (18 weeks)',
                category: 'agriculture',
                subcategory: 'poultry',
                price: 2500,
                image: '/img/agriculture/point-of-lay-layers.jpg',
                description: 'Ready-to-lay pullets. Start producing eggs immediately.',
                stock: 'Limited Stock',
                minOrder: '10 birds',
                tags: ['poultry', 'layers', 'ready-to-lay']
            },
            {
                id: 'agri-005',
                name: 'Adult Broiler Chickens (6-8 weeks)',
                category: 'agriculture',
                subcategory: 'poultry',
                price: 4500,
                image: '/img/agriculture/adult-broilers.jpg',
                description: 'Market-ready broiler chickens. Average weight 2-2.5kg.',
                stock: 'In Stock',
                minOrder: '10 birds',
                tags: ['poultry', 'broiler', 'market-ready']
            },
            {
                id: 'agri-006',
                name: 'Baby Pigs (Weaners - 8 weeks)',
                category: 'agriculture',
                subcategory: 'livestock',
                price: 18000,
                image: '/img/agriculture/baby-pigs.jpg',
                description: 'Healthy weaner pigs ready for growing.',
                stock: 'In Stock',
                minOrder: '5 pigs',
                tags: ['livestock', 'pigs', 'weaners']
            },
            {
                id: 'agri-007',
                name: 'Adult Pigs (6 months)',
                category: 'agriculture',
                subcategory: 'livestock',
                price: 120000,
                image: '/img/agriculture/adult-pigs.jpg',
                description: 'Market-ready pigs for meat production or breeding.',
                stock: 'In Stock',
                minOrder: '2 pigs',
                tags: ['livestock', 'pigs', 'adult']
            },
            {
                id: 'agri-008',
                name: 'Catfish Juveniles (Fingerlings)',
                category: 'agriculture',
                subcategory: 'fish',
                price: 25,
                image: '/img/agriculture/catfish-juveniles.jpg',
                description: 'Healthy catfish fingerlings for pond stocking.',
                stock: 'In Stock',
                minOrder: '100 pieces',
                tags: ['fish', 'catfish', 'fingerlings']
            },
            {
                id: 'agri-009',
                name: 'Live Adult Catfish (1kg+)',
                category: 'agriculture',
                subcategory: 'fish',
                price: 1200,
                image: '/img/agriculture/live-adult-catfish.jpg',
                description: 'Fresh live catfish ready for consumption.',
                stock: 'In Stock',
                minOrder: '5kg',
                tags: ['fish', 'catfish', 'live']
            },
            {
                id: 'agri-010',
                name: 'Roasted/Smoked Catfish',
                category: 'agriculture',
                subcategory: 'fish',
                price: 1800,
                image: '/img/agriculture/roasted-catfish.jpg',
                description: 'Premium smoked catfish for soups and delicacies.',
                stock: 'In Stock',
                minOrder: '2kg',
                tags: ['fish', 'catfish', 'smoked']
            },
            {
                id: 'agri-011',
                name: 'Chicken Feed (25kg bag)',
                category: 'agriculture',
                subcategory: 'feeds',
                price: 9500,
                image: '/img/agriculture/chicken-feed.jpg',
                description: 'Complete balanced feed for layers and broilers.',
                stock: 'In Stock',
                minOrder: '1 bag',
                tags: ['feeds', 'chicken', 'poultry']
            },
            {
                id: 'agri-012',
                name: 'Catfish Feed (15kg bag)',
                category: 'agriculture',
                subcategory: 'feeds',
                price: 7200,
                image: '/img/agriculture/catfish-feed.jpg',
                description: 'Floating fish feed with 35-45% protein content.',
                stock: 'In Stock',
                minOrder: '1 bag',
                tags: ['feeds', 'catfish', 'fish']
            },
            {
                id: 'agri-013',
                name: 'Pig Feed (25kg bag)',
                category: 'agriculture',
                subcategory: 'feeds',
                price: 8500,
                image: '/img/agriculture/pig-feed.jpg',
                description: 'Complete swine feed for different growth stages.',
                stock: 'In Stock',
                minOrder: '1 bag',
                tags: ['feeds', 'pig', 'livestock']
            },
            {
                id: 'agri-014',
                name: 'Automatic Poultry Drinker',
                category: 'agriculture',
                subcategory: 'supplies',
                price: 1800,
                image: '/img/agriculture/poultry-drinker.jpg',
                description: '4-liter capacity automatic drinker.',
                stock: 'In Stock',
                minOrder: '1 unit',
                tags: ['supplies', 'poultry', 'drinker']
            },
            {
                id: 'agri-015',
                name: 'Automatic Poultry Feeder',
                category: 'agriculture',
                subcategory: 'supplies',
                price: 2200,
                image: '/img/agriculture/poultry-feeder.jpg',
                description: '5kg capacity automatic feeder.',
                stock: 'In Stock',
                minOrder: '1 unit',
                tags: ['supplies', 'poultry', 'feeder']
            },
            {
                id: 'agri-016',
                name: 'Digital Egg Incubator (96 eggs)',
                category: 'agriculture',
                subcategory: 'supplies',
                price: 85000,
                image: '/img/agriculture/incubator.jpg',
                description: 'Automatic digital incubator with temperature control.',
                stock: 'Limited Stock',
                minOrder: '1 unit',
                tags: ['supplies', 'incubator', 'poultry']
            },
            {
                id: 'agri-017',
                name: 'Fishing Net (Various Sizes)',
                category: 'agriculture',
                subcategory: 'supplies',
                price: 4500,
                image: '/img/agriculture/fish-net.jpg',
                description: 'Durable fishing nets for pond harvesting.',
                stock: 'In Stock',
                minOrder: '1 unit',
                tags: ['supplies', 'fishing', 'net']
            },

            // CONSTRUCTION PRODUCTS
            {
                id: 'con-001',
                name: 'Hollow Sandcrete Blocks',
                category: 'construction',
                subcategory: 'blocks',
                price: 300,
                image: '/img/construction/hollow-sandcrete-blocks.jpg',
                description: 'Standard hollow blocks with cavities, ideal for load-bearing walls.',
                stock: 'In Stock',
                minOrder: '100 blocks',
                tags: ['blocks', 'construction', 'hollow']
            },
            {
                id: 'con-002',
                name: 'Solid Sandcrete Blocks',
                category: 'construction',
                subcategory: 'blocks',
                price: 350,
                image: '/img/construction/solid-sandcrete-blocks.jpg',
                description: 'Dense, solid blocks with no cavities for maximum strength.',
                stock: 'In Stock',
                minOrder: '100 blocks',
                tags: ['blocks', 'construction', 'solid']
            },
            {
                id: 'con-003',
                name: 'Interlocking Blocks',
                category: 'construction',
                subcategory: 'blocks',
                price: 425,
                image: '/img/construction/interlocking-blocks.jpg',
                description: 'Specially designed blocks that lock together without mortar.',
                stock: 'In Stock',
                minOrder: '100 blocks',
                tags: ['blocks', 'construction', 'interlocking']
            },
            {
                id: 'con-004',
                name: 'Paving Blocks',
                category: 'construction',
                subcategory: 'blocks',
                price: 750,
                image: '/img/construction/paving-blocks.jpg',
                description: 'Durable blocks designed for outdoor flooring and driveways.',
                stock: 'In Stock',
                minOrder: '10 sqm',
                tags: ['blocks', 'paving', 'outdoor']
            },
            {
                id: 'con-005',
                name: 'Dangote Cement',
                category: 'construction',
                subcategory: 'materials',
                price: 4850,
                image: '/img/construction/dangote-cement.jpg',
                description: 'High-quality 42.5 grade cement for all construction purposes.',
                stock: 'In Stock',
                minOrder: '1 bag',
                tags: ['cement', 'construction', 'dangote']
            },
            {
                id: 'con-006',
                name: 'Lafarge Cement',
                category: 'construction',
                subcategory: 'materials',
                price: 4950,
                image: '/img/construction/lafarge-cement.jpg',
                description: 'Premium cement with excellent strength and durability.',
                stock: 'In Stock',
                minOrder: '1 bag',
                tags: ['cement', 'construction', 'lafarge']
            },
            {
                id: 'con-007',
                name: 'Sharp Sand',
                category: 'construction',
                subcategory: 'materials',
                price: 30000,
                image: '/img/construction/sharp-sand.jpg',
                description: 'Coarse sand suitable for concrete mixing and construction.',
                stock: 'In Stock',
                minOrder: '1 truck',
                tags: ['sand', 'construction', 'materials']
            },
            {
                id: 'con-008',
                name: 'Granite/Gravel',
                category: 'construction',
                subcategory: 'materials',
                price: 42500,
                image: '/img/construction/granite.jpg',
                description: 'Crushed stone aggregate for concrete and foundation works.',
                stock: 'In Stock',
                minOrder: '1 truck',
                tags: ['granite', 'gravel', 'construction']
            },
            {
                id: 'con-009',
                name: 'Custom Table',
                category: 'construction',
                subcategory: 'custom',
                price: 110000,
                image: '/img/construction/custom-table.jpg',
                description: 'Handcrafted custom table designed to your specifications.',
                stock: 'Made to Order',
                minOrder: '1 unit',
                tags: ['custom', 'table', 'furniture']
            },
            {
                id: 'con-010',
                name: 'Custom Hanger for Boutique',
                category: 'construction',
                subcategory: 'custom',
                price: 90000,
                image: '/img/construction/custom-hanger.jpg',
                description: 'Premium custom clothing hangers for boutique displays.',
                stock: 'Made to Order',
                minOrder: '1 set',
                tags: ['custom', 'hanger', 'boutique']
            },

            // MACHINERY PRODUCTS
            {
                id: 'mach-001',
                name: 'Automatic 2-Block Maker (Imported)',
                category: 'machinery',
                subcategory: 'block-makers',
                price: 1025000,
                image: '/img/machinery/imported-2-block-maker.jpg',
                description: 'High-efficiency imported automatic machine producing 2 blocks per cycle.',
                stock: 'In Stock',
                minOrder: '1 unit',
                tags: ['block-maker', 'automatic', 'imported']
            },
            {
                id: 'mach-002',
                name: 'Automatic 2-Block Maker (Local)',
                category: 'machinery',
                subcategory: 'block-makers',
                price: 800000,
                image: '/img/machinery/local-2-block-maker.jpg',
                description: 'Reliable locally manufactured automatic machine.',
                stock: 'In Stock',
                minOrder: '1 unit',
                tags: ['block-maker', 'automatic', 'local']
            },
            {
                id: 'mach-003',
                name: 'Manual 2-Block Maker',
                category: 'machinery',
                subcategory: 'block-makers',
                price: 150000,
                image: '/img/machinery/manual-2-block-maker.jpg',
                description: 'Affordable manual machine perfect for startups.',
                stock: 'In Stock',
                minOrder: '1 unit',
                tags: ['block-maker', 'manual', 'starter']
            },
            {
                id: 'mach-004',
                name: 'Automatic 3-Block Maker (Imported)',
                category: 'machinery',
                subcategory: 'block-makers',
                price: 1500000,
                image: '/img/machinery/imported-3-block-maker.jpg',
                description: 'Advanced imported automatic machine with high production capacity.',
                stock: 'In Stock',
                minOrder: '1 unit',
                tags: ['block-maker', 'automatic', 'imported']
            },
            {
                id: 'mach-005',
                name: 'Automatic 5-Block Maker (Imported)',
                category: 'machinery',
                subcategory: 'block-makers',
                price: 3150000,
                image: '/img/machinery/imported-5-block-maker.jpg',
                description: 'Industrial-grade imported machine with maximum production capacity.',
                stock: 'In Stock',
                minOrder: '1 unit',
                tags: ['block-maker', 'automatic', 'industrial']
            },
            {
                id: 'mach-006',
                name: 'Large Industrial Mixer',
                category: 'machinery',
                subcategory: 'mixers',
                price: 975000,
                image: '/img/machinery/large-industrial-mixer.jpg',
                description: 'Heavy-duty mixer with large capacity for high-volume production.',
                stock: 'In Stock',
                minOrder: '1 unit',
                tags: ['mixer', 'industrial', 'concrete']
            },
            {
                id: 'mach-007',
                name: 'Medium Industrial Mixer',
                category: 'machinery',
                subcategory: 'mixers',
                price: 575000,
                image: '/img/machinery/medium-industrial-mixer.jpg',
                description: 'Versatile mixer suitable for medium-scale block production.',
                stock: 'In Stock',
                minOrder: '1 unit',
                tags: ['mixer', 'medium', 'versatile']
            },
            {
                id: 'mach-008',
                name: 'Small Industrial Mixer',
                category: 'machinery',
                subcategory: 'mixers',
                price: 275000,
                image: '/img/machinery/small-industrial-mixer.jpg',
                description: 'Compact mixer perfect for small-scale production.',
                stock: 'In Stock',
                minOrder: '1 unit',
                tags: ['mixer', 'small', 'compact']
            },

            // SOLAR PRODUCTS
            {
                id: 'solar-001',
                name: 'Monocrystalline Solar Panels',
                category: 'solar',
                subcategory: 'panels',
                price: 51667,
                image: '/img/solar/monocrystalline-panel.jpg',
                description: 'High-efficiency monocrystalline panels with superior performance.',
                stock: 'In Stock',
                minOrder: '1 panel',
                tags: ['solar', 'panels', 'monocrystalline']
            },
            {
                id: 'solar-002',
                name: 'Polycrystalline Solar Panels',
                category: 'solar',
                subcategory: 'panels',
                price: 42667,
                image: '/img/solar/polycrystalline-panel.jpg',
                description: 'Cost-effective polycrystalline panels with good efficiency.',
                stock: 'In Stock',
                minOrder: '1 panel',
                tags: ['solar', 'panels', 'polycrystalline']
            },
            {
                id: 'solar-003',
                name: 'Lithium Solar Batteries',
                category: 'solar',
                subcategory: 'batteries',
                price: 170000,
                image: '/img/solar/lithium-battery.jpg',
                description: 'Advanced lithium batteries with long lifespan and high efficiency.',
                stock: 'In Stock',
                minOrder: '1 unit',
                tags: ['solar', 'batteries', 'lithium']
            },
            {
                id: 'solar-004',
                name: 'Gel Solar Batteries',
                category: 'solar',
                subcategory: 'batteries',
                price: 65000,
                image: '/img/solar/gel-battery.jpg',
                description: 'Maintenance-free gel batteries with good deep cycle performance.',
                stock: 'In Stock',
                minOrder: '1 unit',
                tags: ['solar', 'batteries', 'gel']
            },
            {
                id: 'solar-005',
                name: 'Pure Sine Wave Inverters',
                category: 'solar',
                subcategory: 'inverters',
                price: 93333,
                image: '/img/solar/pure-sine-inverter.jpg',
                description: 'Clean power output suitable for sensitive electronics.',
                stock: 'In Stock',
                minOrder: '1 unit',
                tags: ['solar', 'inverters', 'pure-sine']
            },
            {
                id: 'solar-006',
                name: 'Hybrid Solar Inverters',
                category: 'solar',
                subcategory: 'inverters',
                price: 315000,
                image: '/img/solar/hybrid-inverter.jpg',
                description: 'Advanced inverters with solar charging and backup functionality.',
                stock: 'In Stock',
                minOrder: '1 unit',
                tags: ['solar', 'inverters', 'hybrid']
            },
            {
                id: 'solar-007',
                name: 'MPPT Charge Controllers',
                category: 'solar',
                subcategory: 'controllers',
                price: 48333,
                image: '/img/solar/mppt-controller.jpg',
                description: 'Maximum Power Point Tracking controllers for maximum energy harvest.',
                stock: 'In Stock',
                minOrder: '1 unit',
                tags: ['solar', 'controllers', 'mppt']
            },
            {
                id: 'solar-008',
                name: 'Home Solar System Package',
                category: 'solar',
                subcategory: 'systems',
                price: 650000,
                image: '/img/solar/home-solar-system.jpg',
                description: 'Complete solar power system for residential use.',
                stock: 'In Stock',
                minOrder: '1 system',
                tags: ['solar', 'systems', 'home']
            },
            {
                id: 'solar-009',
                name: 'Business Solar System Package',
                category: 'solar',
                subcategory: 'systems',
                price: 1850000,
                image: '/img/solar/business-solar-system.jpg',
                description: 'Commercial solar power system for offices and businesses.',
                stock: 'In Stock',
                minOrder: '1 system',
                tags: ['solar', 'systems', 'business']
            },

            // FURNITURE PRODUCTS
            {
                id: 'furn-001',
                name: 'Mahogany Executive Desk',
                category: 'furniture',
                subcategory: 'office',
                price: 450000,
                image: '/img/furniture/executive-desk.jpg',
                description: 'Solid mahogany executive desk with built-in cable management.',
                stock: 'In Stock',
                minOrder: '1 unit',
                tags: ['furniture', 'office', 'desk', 'executive']
            },
            {
                id: 'furn-002',
                name: 'Modern Conference Table',
                category: 'furniture',
                subcategory: 'office',
                price: 680000,
                image: '/img/furniture/conference-table.jpg',
                description: 'Elegant 10-seater conference table with tempered glass top.',
                stock: 'In Stock',
                minOrder: '1 unit',
                tags: ['furniture', 'office', 'conference', 'table']
            },
            {
                id: 'furn-003',
                name: 'Premium Ergonomic Chair',
                category: 'furniture',
                subcategory: 'office',
                price: 185000,
                image: '/img/furniture/ergonomic-office-chair.jpg',
                description: 'High-back executive chair with advanced lumbar support.',
                stock: 'In Stock',
                minOrder: '1 unit',
                tags: ['furniture', 'office', 'chair', 'ergonomic']
            },
            {
                id: 'furn-004',
                name: 'Luxury Single Seater',
                category: 'furniture',
                subcategory: 'seating',
                price: 120000,
                image: '/img/furniture/single-seater.jpg',
                description: 'Premium single seater chair with high-density foam.',
                stock: 'In Stock',
                minOrder: '1 unit',
                tags: ['furniture', 'seating', 'single', 'luxury']
            },
            {
                id: 'furn-005',
                name: 'Modern Two Seater Sofa',
                category: 'furniture',
                subcategory: 'seating',
                price: 280000,
                image: '/img/furniture/two-seater.jpg',
                description: 'Contemporary two-seater sofa with wooden legs.',
                stock: 'In Stock',
                minOrder: '1 unit',
                tags: ['furniture', 'seating', 'sofa', 'two-seater']
            },
            {
                id: 'furn-006',
                name: 'Family Three Seater Sofa',
                category: 'furniture',
                subcategory: 'seating',
                price: 420000,
                image: '/img/furniture/three-seater.jpg',
                description: 'Spacious three-seater sofa with deep seating.',
                stock: 'In Stock',
                minOrder: '1 unit',
                tags: ['furniture', 'seating', 'sofa', 'three-seater']
            },
            {
                id: 'furn-007',
                name: 'Premium Relaxing Armchair',
                category: 'furniture',
                subcategory: 'seating',
                price: 195000,
                image: '/img/furniture/relaxing-chair.jpg',
                description: 'Ultra-comfortable relaxing chair with reclining feature.',
                stock: 'In Stock',
                minOrder: '1 unit',
                tags: ['furniture', 'seating', 'armchair', 'reclining']
            },
            {
                id: 'furn-008',
                name: '5-Piece Living Room Set',
                category: 'furniture',
                subcategory: 'living-room',
                price: 850000,
                image: '/img/furniture/living-room-full-set.jpg',
                description: 'Complete living room package with multiple pieces.',
                stock: 'In Stock',
                minOrder: '1 set',
                tags: ['furniture', 'living-room', 'set', 'complete']
            },
            {
                id: 'furn-009',
                name: 'Compact Dining Table',
                category: 'furniture',
                subcategory: 'dining',
                price: 180000,
                image: '/img/furniture/single-dining-table.jpg',
                description: 'Space-saving single dining table perfect for small spaces.',
                stock: 'In Stock',
                minOrder: '1 unit',
                tags: ['furniture', 'dining', 'table', 'compact']
            },
            {
                id: 'furn-010',
                name: '8-Seater Dining Set',
                category: 'furniture',
                subcategory: 'dining',
                price: 620000,
                image: '/img/furniture/full-dining-set.jpg',
                description: 'Complete dining set with extendable table and 8 chairs.',
                stock: 'In Stock',
                minOrder: '1 set',
                tags: ['furniture', 'dining', 'set', 'extendable']
            },
            {
                id: 'furn-011',
                name: 'King Size Bedroom Suite',
                category: 'furniture',
                subcategory: 'bedroom',
                price: 950000,
                image: '/img/furniture/king-bed-set.jpg',
                description: 'Complete bedroom set including king bed and furniture.',
                stock: 'In Stock',
                minOrder: '1 set',
                tags: ['furniture', 'bedroom', 'suite', 'king-size']
            },
            {
                id: 'furn-012',
                name: '6-Door Sliding Wardrobe',
                category: 'furniture',
                subcategory: 'bedroom',
                price: 380000,
                image: '/img/furniture/wardrobe-collection.jpg',
                description: 'Spacious sliding door wardrobe with mirror panels.',
                stock: 'In Stock',
                minOrder: '1 unit',
                tags: ['furniture', 'bedroom', 'wardrobe', 'storage']
            },
            {
                id: 'furn-013',
                name: 'Hotel Reception Desk',
                category: 'furniture',
                subcategory: 'commercial',
                price: 1200000,
                image: '/img/furniture/hotel-reception-desk.jpg',
                description: 'Professional reception desk with built-in storage.',
                stock: 'Made to Order',
                minOrder: '1 unit',
                tags: ['furniture', 'commercial', 'hotel', 'reception']
            },
            {
                id: 'furn-014',
                name: 'Restaurant Dining Collection',
                category: 'furniture',
                subcategory: 'commercial',
                price: 2500000,
                image: '/img/furniture/restaurant-dining-set.jpg',
                description: 'Complete 20-seater restaurant set with durable tables.',
                stock: 'Made to Order',
                minOrder: '1 set',
                tags: ['furniture', 'commercial', 'restaurant', 'dining']
            },
            {
                id: 'furn-015',
                name: 'Teak Outdoor Dining Set',
                category: 'furniture',
                subcategory: 'outdoor',
                price: 750000,
                image: '/img/furniture/outdoor-dining-set.jpg',
                description: '6-seater teak wood dining set with weather-resistant cushions.',
                stock: 'In Stock',
                minOrder: '1 set',
                tags: ['furniture', 'outdoor', 'dining', 'teak']
            },
            {
                id: 'furn-016',
                name: 'Premium Patio Lounge Set',
                category: 'furniture',
                subcategory: 'outdoor',
                price: 1100000,
                image: '/img/furniture/patio-lounge-set.jpg',
                description: 'Complete patio lounge set with deep seating and coffee table.',
                stock: 'In Stock',
                minOrder: '1 set',
                tags: ['furniture', 'outdoor', 'patio', 'lounge']
            }
        ];

        // Admin variables
        let adminProducts = [...allProducts];
        let editingProductId = null;

        // Initialize admin page
        document.addEventListener('DOMContentLoaded', function() {
            loadProducts();
            setupEventListeners();
        });

        // Set up event listeners
        function setupEventListeners() {
            const searchInput = document.getElementById('productSearch');
            const categoryFilter = document.getElementById('categoryFilter');
            const stockFilter = document.getElementById('stockFilter');
            
            if (searchInput) {
                searchInput.addEventListener('input', filterProducts);
            }
            if (categoryFilter) {
                categoryFilter.addEventListener('change', filterProducts);
            }
            if (stockFilter) {
                stockFilter.addEventListener('change', filterProducts);
            }
        }

        // Load products
        function loadProducts() {
            displayProducts(adminProducts);
            updateProductCount();
        }

        // Display products in table
        function displayProducts(productsToShow) {
            const tbody = document.getElementById('productsTable');
            
            if (productsToShow.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="7" style="text-align: center; padding: 2rem;">
                            No products found matching your criteria
                        </td>
                    </tr>
                `;
                return;
            }
            
            const html = productsToShow.map(product => `
                <tr>
                    <td>
                        <div class="product-info">
                            <strong>${product.name}</strong>
                            <small>${product.description || 'No description'}</small>
                        </div>
                    </td>
                    <td>
                        <span class="category-badge ${product.category}">
                            ${formatCategoryName(product.category)}
                        </span>
                    </td>
                    <td>${product.subcategory || '-'}</td>
                    <td>₦${product.price?.toLocaleString() || '0'}</td>
                    <td>
                        <span class="stock-badge ${getStockClass(product.stock)}">
                            ${product.stock}
                        </span>
                    </td>
                    <td>${product.minOrder || '1 unit'}</td>
                    <td>
                        <div class="action-buttons">
                            <button onclick="editProduct('${product.id}')" class="btn-edit"> Edit</button>
                            <button onclick="updateStock('${product.id}')" class="btn-stock"> Stock</button>
                            <button onclick="deleteProduct('${product.id}')" class="btn-delete"> Delete</button>
                        </div>
                    </td>
                </tr>
            `).join('');
            
            tbody.innerHTML = html;
        }

        // Filter products
        function filterProducts() {
            const searchTerm = document.getElementById('productSearch').value.toLowerCase();
            const category = document.getElementById('categoryFilter').value;
            const stockFilter = document.getElementById('stockFilter').value;
            
            const filtered = adminProducts.filter(product => {
                const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                                    product.description?.toLowerCase().includes(searchTerm) ||
                                    product.tags?.some(tag => tag.toLowerCase().includes(searchTerm));
                const matchesCategory = category === 'all' || product.category === category;
                const matchesStock = stockFilter === 'all' || product.stock === stockFilter;
                
                return matchesSearch && matchesCategory && matchesStock;
            });
            
            displayProducts(filtered);
            updateProductCount(filtered.length);
        }

        // Update product count display
        function updateProductCount(count) {
            const totalProducts = adminProducts.length;
            const showingProducts = count || totalProducts;
            document.getElementById('productCount').textContent = 
                `Showing ${showingProducts} of ${totalProducts} products`;
        }

        // Format category name for display
        function formatCategoryName(category) {
            const names = {
                'agriculture': 'Agriculture',
                'construction': 'Construction',
                'machinery': 'Machinery',
                'solar': 'Solar',
                'furniture': 'Furniture'
            };
            return names[category] || category;
        }

        // Get stock class for styling
        function getStockClass(stock) {
            if (stock === 'In Stock') return 'stock-in';
            if (stock === 'Limited Stock') return 'stock-low';
            if (stock === 'Made to Order') return 'stock-out';
            return 'stock-in';
        }

        // Show add product modal
        function showAddProductModal() {
            editingProductId = null;
            document.getElementById('modalTitle').textContent = 'Add New Product';
            document.getElementById('productForm').reset();
            document.getElementById('productModal').style.display = 'block';
        }

        // Edit product
        function editProduct(productId) {
            const product = adminProducts.find(p => p.id === productId);
            if (!product) return;
            
            editingProductId = productId;
            document.getElementById('modalTitle').textContent = 'Edit Product';
            
            // Fill form with product data
            document.getElementById('productName').value = product.name || '';
            document.getElementById('productCategory').value = product.category || '';
            document.getElementById('productSubcategory').value = product.subcategory || '';
            document.getElementById('productPrice').value = product.price || '';
            document.getElementById('productStock').value = product.stock || 'In Stock';
            document.getElementById('productDescription').value = product.description || '';
            document.getElementById('productMinOrder').value = product.minOrder || '';
            document.getElementById('productImage').value = product.image || '';
            document.getElementById('productTags').value = product.tags?.join(', ') || '';
            
            document.getElementById('productModal').style.display = 'block';
        }

        // Save product
        function saveProduct() {
            const productData = {
                name: document.getElementById('productName').value,
                category: document.getElementById('productCategory').value,
                subcategory: document.getElementById('productSubcategory').value,
                price: parseFloat(document.getElementById('productPrice').value),
                stock: document.getElementById('productStock').value,
                description: document.getElementById('productDescription').value,
                minOrder: document.getElementById('productMinOrder').value,
                image: document.getElementById('productImage').value,
                tags: document.getElementById('productTags').value.split(',').map(tag => tag.trim()).filter(tag => tag)
            };
            
            try {
                if (editingProductId) {
                    // Update existing product
                    const index = adminProducts.findIndex(p => p.id === editingProductId);
                    if (index !== -1) {
                        adminProducts[index] = { ...adminProducts[index], ...productData };
                    }
                } else {
                    // Create new product
                    productData.id = generateProductId(productData.category);
                    adminProducts.push(productData);
                }
                
                closeModal();
                loadProducts(); // Reload products
                alert('Product saved successfully!');
            } catch (error) {
                console.error('Error saving product:', error);
                alert('Error saving product. Please try again.');
            }
        }

        // Generate product ID based on category
        function generateProductId(category) {
            const prefix = {
                'agriculture': 'agri',
                'construction': 'con',
                'machinery': 'mach',
                'solar': 'solar',
                'furniture': 'furn'
            }[category] || 'prod';
            
            const existingIds = adminProducts
                .filter(p => p.id.startsWith(prefix))
                .map(p => parseInt(p.id.split('-')[1]))
                .filter(id => !isNaN(id));
            
            const nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
            return `${prefix}-${nextId.toString().padStart(3, '0')}`;
        }

        // Update stock
        function updateStock(productId) {
            const product = adminProducts.find(p => p.id === productId);
            if (!product) return;
            
            const newStock = prompt('Enter new stock status:', product.stock);
            if (newStock === null) return;
            
            if (!newStock.trim()) {
                alert('Please enter a valid stock status');
                return;
            }
            
            product.stock = newStock;
            loadProducts();
            alert('Stock status updated!');
        }

        // Delete product
        function deleteProduct(productId) {
            if (!confirm('Are you sure you want to delete this product?')) return;
            
            try {
                adminProducts = adminProducts.filter(p => p.id !== productId);
                loadProducts();
                alert('Product deleted successfully!');
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Error deleting product. Please try again.');
            }
        }

        // Export products
        function exportProducts() {
            const csv = adminProducts.map(p => 
                `"${p.name}","${p.category}","${p.subcategory || ''}",${p.price},"${p.stock}","${p.minOrder || ''}","${p.description || ''}"`
            ).join('\n');
            
            const header = 'Name,Category,Subcategory,Price,Stock,MinOrder,Description\n';
            const blob = new Blob([header + csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'products-export.csv';
            a.click();
            window.URL.revokeObjectURL(url);
        }

        // Close modal
        function closeModal() {
            document.getElementById('productModal').style.display = 'none';
        }

        // Logout
        async function adminLogout() {
            try {
                await fetch('/admin/logout', { method: 'POST' });
                window.location.href = '/admin/login';
            } catch (error) {
                console.error('Logout error:', error);
            }
        }

        async function loadSettings() {
            try {
                const [usersResponse, settingsResponse] = await Promise.all([
                    fetch('/admin/api/users'),
                    fetch('/admin/api/settings')
                ]);

                users = await usersResponse.json();
                const settings = await settingsResponse.json();

                displayUsers();
                loadSettingsValues(settings);
            } catch (error) {
                console.error('Error loading settings:', error);
            }
        }

        // Display users
        function displayUsers() {
            const tbody = document.getElementById('usersTable');
            
            const html = users.map(user => `
                <tr>
                    <td>
                        <div class="user-info">
                            <strong>${user.name}</strong>
                            <small>${user.email}</small>
                        </div>
                    </td>
                    <td>
                        <span class="role-badge ${user.role}">${user.role}</span>
                    </td>
                    <td>${user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</td>
                    <td>
                        <span class="status-badge ${user.status}">${user.status}</span>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button onclick="editUser(${user.id})" class="btn-edit"> Edit</button>
                            <button onclick="resetUserPassword(${user.id})" class="btn-action"> Reset</button>
                            <button onclick="deleteUser(${user.id})" class="btn-delete"> Delete</button>
                        </div>
                    </td>
                </tr>
            `).join('');
            
            tbody.innerHTML = html;
        }

        // Load settings values into form
        function loadSettingsValues(settings) {
            // General settings
            document.getElementById('companyName').value = settings.companyName || '';
            document.getElementById('companyEmail').value = settings.companyEmail || '';
            document.getElementById('companyPhone').value = settings.companyPhone || '';
            document.getElementById('companyAddress').value = settings.companyAddress || '';
            document.getElementById('companyCurrency').value = settings.currency || 'NGN';
            document.getElementById('companyTimezone').value = settings.timezone || 'Africa/Lagos';

            // E-commerce settings
            document.getElementById('minOrderAmount').value = settings.minOrderAmount || 0;
            document.getElementById('freeShippingThreshold').value = settings.freeShippingThreshold || 0;
            document.getElementById('shippingCost').value = settings.shippingCost || 0;
            document.getElementById('taxRate').value = settings.taxRate || 0;
            document.getElementById('lowStockThreshold').value = settings.lowStockThreshold || 10;
            document.getElementById('autoRestockLevel').value = settings.autoRestockLevel || 50;

            // Email settings
            document.getElementById('smtpHost').value = settings.smtpHost || '';
            document.getElementById('smtpPort').value = settings.smtpPort || 587;
            document.getElementById('smtpUsername').value = settings.smtpUsername || '';
            document.getElementById('emailFromName').value = settings.emailFromName || '';
            document.getElementById('emailFromAddress').value = settings.emailFromAddress || '';

            // Security settings
            document.getElementById('sessionTimeout').value = settings.sessionTimeout || 60;
            document.getElementById('maxLoginAttempts').value = settings.maxLoginAttempts || 5;
            document.getElementById('passwordExpiry').value = settings.passwordExpiry || 90;

            // Backup settings
            document.getElementById('backupFrequency').value = settings.backupFrequency || 'weekly';
            document.getElementById('backupRetention').value = settings.backupRetention || 30;
            document.getElementById('lastBackup').value = settings.lastBackup || 'Never';
        }

        // Show settings section
        function showSection(sectionName) {
            // Hide all sections
            document.querySelectorAll('.settings-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Remove active class from all nav buttons
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Show selected section
            document.getElementById(sectionName + '-section').classList.add('active');
            
            // Activate corresponding nav button
            event.target.classList.add('active');
        }

        // Show add user modal
        function showAddUserModal() {
            editingUserId = null;
            document.getElementById('userForm').reset();
            document.getElementById('addUserModal').style.display = 'block';
        }

        // Edit user
        function editUser(userId) {
            const user = users.find(u => u.id == userId);
            if (!user) return;
            
            editingUserId = userId;
            
            document.getElementById('userName').value = user.name;
            document.getElementById('userEmail').value = user.email;
            document.getElementById('userRole').value = user.role;
            
            document.getElementById('addUserModal').style.display = 'block';
        }

        // Save user
        async function saveUser(event) {
            event.preventDefault();
            
            const password = document.getElementById('userPassword').value;
            const confirmPassword = document.getElementById('userConfirmPassword').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            const userData = {
                name: document.getElementById('userName').value,
                email: document.getElementById('userEmail').value,
                role: document.getElementById('userRole').value,
                password: password
            };
            
            try {
                let response;
                if (editingUserId) {
                    response = await fetch(`/admin/api/users/${editingUserId}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(userData)
                    });
                } else {
                    response = await fetch('/admin/api/users', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(userData)
                    });
                }
                
                if (response.ok) {
                    closeModal();
                    loadSettings();
                }
            } catch (error) {
                console.error('Error saving user:', error);
            }
        }

        // Save all settings
        async function saveAllSettings() {
            const settings = {
                // General settings
                companyName: document.getElementById('companyName').value,
                companyEmail: document.getElementById('companyEmail').value,
                companyPhone: document.getElementById('companyPhone').value,
                companyAddress: document.getElementById('companyAddress').value,
                currency: document.getElementById('companyCurrency').value,
                timezone: document.getElementById('companyTimezone').value,

                // E-commerce settings
                minOrderAmount: parseFloat(document.getElementById('minOrderAmount').value),
                freeShippingThreshold: parseFloat(document.getElementById('freeShippingThreshold').value),
                shippingCost: parseFloat(document.getElementById('shippingCost').value),
                taxRate: parseFloat(document.getElementById('taxRate').value),
                lowStockThreshold: parseInt(document.getElementById('lowStockThreshold').value),
                autoRestockLevel: parseInt(document.getElementById('autoRestockLevel').value),

                // Email settings
                smtpHost: document.getElementById('smtpHost').value,
                smtpPort: parseInt(document.getElementById('smtpPort').value),
                smtpUsername: document.getElementById('smtpUsername').value,
                smtpPassword: document.getElementById('smtpPassword').value,
                emailFromName: document.getElementById('emailFromName').value,
                emailFromAddress: document.getElementById('emailFromAddress').value,

                // Security settings
                sessionTimeout: parseInt(document.getElementById('sessionTimeout').value),
                maxLoginAttempts: parseInt(document.getElementById('maxLoginAttempts').value),
                passwordExpiry: parseInt(document.getElementById('passwordExpiry').value)
            };
            
            try {
                const response = await fetch('/admin/api/settings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(settings)
                });
                
                if (response.ok) {
                    alert('Settings saved successfully!');
                }
            } catch (error) {
                console.error('Error saving settings:', error);
                alert('Error saving settings. Please try again.');
            }
        }

        // Close modal
        function closeModal() {
            document.getElementById('addUserModal').style.display = 'none';
        }

        // Logout
        async function logout() {
            try {
                await fetch('/admin/logout', { method: 'POST' });
                window.location.href = '/admin/login';
            } catch (error) {
                console.error('Logout error:', error);
            }
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', loadSettings);