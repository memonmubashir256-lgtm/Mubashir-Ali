import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { useCompliance } from '../../context/ComplianceContext';
import { useToast } from '../../context/ToastContext';
import { Product, OrderStatus, CommerceMode } from '../../types';
import {
  Package,
  Boxes,
  AlertTriangle,
  History,
  Settings,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  Eye,
  Sliders,
  DollarSign,
  Users,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    categories,
    orders,
    auditLogs,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    addAuditLog,
  } = useStore();

  const { user } = useAuth();
  const { settings, updateSettings } = useCompliance();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'logs' | 'settings'>('overview');

  // Product Edit/Create State
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [prodFormName, setProdFormName] = useState('');
  const [prodFormSku, setProdFormSku] = useState('');
  const [prodFormCategory, setProdFormCategory] = useState(categories[0]?.id || 'cat-devices');
  const [prodFormPrice, setProdFormPrice] = useState('99.00');
  const [prodFormStock, setProdFormStock] = useState('50');
  const [prodFormTagline, setProdFormTagline] = useState('');
  const [prodFormDesc, setProdFormDesc] = useState('');

  // Settings form states
  const [settingsMode, setSettingsMode] = useState<CommerceMode>(settings.commerceMode);
  const [settingsMinAge, setSettingsMinAge] = useState(settings.minimumAge);
  const [settingsAnnouncement, setSettingsAnnouncement] = useState(settings.announcementText);
  const [settingsAgeGate, setSettingsAgeGate] = useState(settings.enableAgeGate);

  // Overview metrics
  const totalCatalogItems = products.length;
  const publishedCount = products.filter((p) => p.isPublished).length;
  const lowStockProducts = products.filter((p) => p.stock < 30);
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const handleOpenCreateProduct = () => {
    setEditingId(null);
    setProdFormName('');
    setProdFormSku(`VYRO-${Math.floor(100 + Math.random() * 900)}`);
    setProdFormCategory(categories[0]?.id || 'cat-devices');
    setProdFormPrice('89.00');
    setProdFormStock('40');
    setProdFormTagline('Precision engineered pod hardware.');
    setProdFormDesc('Monolithic aircraft-grade alloy chassis with custom ceramic vaporization geometry.');
    setIsEditingProduct(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingId(prod.id);
    setProdFormName(prod.name);
    setProdFormSku(prod.sku);
    setProdFormCategory(prod.categoryId);
    setProdFormPrice(prod.price.toString());
    setProdFormStock(prod.stock.toString());
    setProdFormTagline(prod.tagline);
    setProdFormDesc(prod.description);
    setIsEditingProduct(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categories.find((c) => c.id === prodFormCategory);

    if (editingId) {
      updateProduct(editingId, {
        name: prodFormName,
        sku: prodFormSku,
        categoryId: prodFormCategory,
        categoryName: cat?.name || 'Accessories',
        categorySlug: cat?.slug || 'accessories',
        price: parseFloat(prodFormPrice) || 0,
        stock: parseInt(prodFormStock, 10) || 0,
        tagline: prodFormTagline,
        description: prodFormDesc,
      });
      addToast('success', 'Product Updated', `Saved changes for ${prodFormName}.`);
    } else {
      addProduct({
        sku: prodFormSku,
        slug: prodFormName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: prodFormName,
        tagline: prodFormTagline,
        description: prodFormDesc,
        price: parseFloat(prodFormPrice) || 0,
        categoryId: prodFormCategory,
        categoryName: cat?.name || 'Accessories',
        categorySlug: cat?.slug || 'accessories',
        isPublished: true,
        isFeatured: false,
        stock: parseInt(prodFormStock, 10) || 0,
        specifications: {
          materials: 'Anodized Monolithic Aluminum',
          warranty: '2 Years Manufacturer',
        },
        images: [
          {
            url: '/src/assets/images/hero_vyro_device_1792505074590.jpg',
            altText: prodFormName,
          },
        ],
        variants: [],
      });
      addToast('success', 'Product Created', `Added ${prodFormName} to catalog.`);
    }

    setIsEditingProduct(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      commerceMode: settingsMode,
      minimumAge: settingsMinAge,
      announcementText: settingsAnnouncement,
      enableAgeGate: settingsAgeGate,
    });
    addAuditLog(
      'UPDATE_SITE_SETTINGS',
      'SiteSettings',
      `Commerce Mode set to ${settingsMode}, Minimum Age: ${settingsMinAge}, Age Gate: ${settingsAgeGate}`
    );
    addToast('success', 'Settings Applied', 'Compliance parameters and commerce mode updated.');
  };

  return (
    <div className="py-10 bg-[#08090B] min-h-screen text-[#F5F5F3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1A1D23] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#9298A2]">
              <span>Executive System Control</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-mono">AUTHORIZED OPERATOR</span>
            </div>
            <h1 className="text-3xl font-bold font-display text-[#F5F5F3] mt-1">
              VYRO Operations Console
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-3 py-1 bg-[#121419] border border-[#262A33] rounded text-[#9298A2]">
              Session: {user?.email || 'admin@vyro.luxury'}
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#1A1D23] pb-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'overview'
                ? 'bg-[#F5F5F3] text-[#08090B] font-semibold'
                : 'bg-[#121419] text-[#9298A2] hover:text-[#F5F5F3]'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Overview & Metrics</span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'products'
                ? 'bg-[#F5F5F3] text-[#08090B] font-semibold'
                : 'bg-[#121419] text-[#9298A2] hover:text-[#F5F5F3]'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Product Catalog ({totalCatalogItems})</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'orders'
                ? 'bg-[#F5F5F3] text-[#08090B] font-semibold'
                : 'bg-[#121419] text-[#9298A2] hover:text-[#F5F5F3]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Order Logs ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'logs'
                ? 'bg-[#F5F5F3] text-[#08090B] font-semibold'
                : 'bg-[#121419] text-[#9298A2] hover:text-[#F5F5F3]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit Trail ({auditLogs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'settings'
                ? 'bg-[#F5F5F3] text-[#08090B] font-semibold'
                : 'bg-[#121419] text-[#9298A2] hover:text-[#F5F5F3]'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Compliance & Settings</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-[#121419] border border-[#262A33] rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs text-[#9298A2]">
                  <span className="font-mono uppercase">Total Hardware SKUs</span>
                  <Package className="w-4 h-4 text-[#C5CBD3]" />
                </div>
                <p className="text-3xl font-bold font-mono text-[#F5F5F3] tabular-nums">
                  {totalCatalogItems}
                </p>
                <p className="text-[11px] text-[#9298A2]">
                  {publishedCount} Published · {totalCatalogItems - publishedCount} Archived
                </p>
              </div>

              <div className="p-6 bg-[#121419] border border-[#262A33] rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs text-[#9298A2]">
                  <span className="font-mono uppercase">Low Stock Alerts</span>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-3xl font-bold font-mono text-[#F5F5F3] tabular-nums">
                  {lowStockProducts.length}
                </p>
                <p className="text-[11px] text-amber-400/80">
                  {lowStockProducts.length > 0 ? 'Requires warehouse restock' : 'Inventory optimal'}
                </p>
              </div>

              <div className="p-6 bg-[#121419] border border-[#262A33] rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs text-[#9298A2]">
                  <span className="font-mono uppercase">Orders Reconciled</span>
                  <Users className="w-4 h-4 text-[#C5CBD3]" />
                </div>
                <p className="text-3xl font-bold font-mono text-[#F5F5F3] tabular-nums">
                  {orders.length}
                </p>
                <p className="text-[11px] text-[#9298A2]">All verified via ID Assertion</p>
              </div>

              <div className="p-6 bg-[#121419] border border-[#262A33] rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs text-[#9298A2]">
                  <span className="font-mono uppercase">Simulated Gross Total</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-3xl font-bold font-mono text-[#F5F5F3] tabular-nums">
                  ${totalRevenue.toFixed(2)}
                </p>
                <p className="text-[11px] text-[#9298A2]">Sandbox test volume</p>
              </div>
            </div>

            {/* Quick Actions & Low Stock Highlight */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-6 bg-[#121419] border border-[#262A33] rounded-xl space-y-4">
                <h3 className="text-sm font-bold text-[#F5F5F3] uppercase tracking-wider font-mono">
                  Inventory Alerts (&lt; 30 Units)
                </h3>
                {lowStockProducts.length === 0 ? (
                  <p className="text-xs text-[#9298A2]">All products have sufficient reserve stocks.</p>
                ) : (
                  <div className="divide-y divide-[#1A1D23] text-xs">
                    {lowStockProducts.map((p) => (
                      <div key={p.id} className="py-3 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-[#F5F5F3]">{p.name}</p>
                          <p className="text-[11px] font-mono text-[#9298A2]">{p.sku}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-amber-400 tabular-nums">
                            {p.stock} units
                          </span>
                          <button
                            onClick={() => {
                              updateProduct(p.id, { stock: p.stock + 25 });
                              addToast('success', 'Stock replenished', `Added +25 units to ${p.name}.`);
                            }}
                            className="px-2.5 py-1 bg-[#1A1D23] hover:bg-[#262A33] text-xs text-[#F5F5F3] rounded border border-[#262A33]"
                          >
                            +25 Units
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Current Policy State */}
              <div className="p-6 bg-[#121419] border border-[#262A33] rounded-xl space-y-4">
                <h3 className="text-sm font-bold text-[#F5F5F3] uppercase tracking-wider font-mono">
                  Jurisdiction Compliance Guard
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-2 border-b border-[#1A1D23]">
                    <span className="text-[#9298A2]">Platform Mode</span>
                    <span className="font-mono text-emerald-400 font-semibold">
                      {settings.commerceMode}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#1A1D23]">
                    <span className="text-[#9298A2]">Minimum Age Threshold</span>
                    <span className="font-mono text-[#F5F5F3]">{settings.minimumAge}+ Years</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#1A1D23]">
                    <span className="text-[#9298A2]">Enforced Age Gate</span>
                    <span className="font-mono text-[#F5F5F3]">
                      {settings.enableAgeGate ? 'Enabled' : 'Bypassed'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-[#9298A2]">Disclaimers</span>
                    <span className="font-mono text-[#F5F5F3]">FDA & TPD Compliant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCT MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <p className="text-xs font-mono uppercase tracking-wider text-[#9298A2]">
                Catalog Items ({products.length})
              </p>
              <button
                onClick={handleOpenCreateProduct}
                className="px-4 py-2 bg-[#F5F5F3] hover:bg-[#C5CBD3] text-[#08090B] font-semibold text-xs rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-[#121419] border border-[#262A33] rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#1A1D23] border-b border-[#262A33] text-[#9298A2] uppercase font-mono">
                  <tr>
                    <th className="p-4">Item</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">SKU</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Reserve Stock</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1D23]">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-[#1A1D23]/50 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={prod.images[0]?.url}
                          alt={prod.name}
                          className="w-10 h-10 object-cover rounded bg-[#08090B]"
                        />
                        <div>
                          <p className="font-semibold text-[#F5F5F3]">{prod.name}</p>
                          <p className="text-[11px] text-[#9298A2] line-clamp-1">{prod.tagline}</p>
                        </div>
                      </td>
                      <td className="p-4 text-[#9298A2]">{prod.categoryName}</td>
                      <td className="p-4 font-mono text-[#C5CBD3]">{prod.sku}</td>
                      <td className="p-4 font-mono font-bold text-[#F5F5F3] tabular-nums">
                        ${prod.price.toFixed(2)}
                      </td>
                      <td className="p-4 font-mono tabular-nums">
                        <span
                          className={prod.stock < 30 ? 'text-amber-400 font-bold' : 'text-[#F5F5F3]'}
                        >
                          {prod.stock} units
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => {
                            updateProduct(prod.id, { isPublished: !prod.isPublished });
                            addToast(
                              'info',
                              'Status Updated',
                              `${prod.name} is now ${!prod.isPublished ? 'Published' : 'Archived'}.`
                            );
                          }}
                          className={`flex items-center gap-1 font-mono text-[11px] ${
                            prod.isPublished ? 'text-emerald-400' : 'text-[#9298A2]'
                          }`}
                        >
                          {prod.isPublished ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          <span>{prod.isPublished ? 'Published' : 'Archived'}</span>
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditProduct(prod)}
                            className="p-1.5 text-[#9298A2] hover:text-[#F5F5F3] rounded hover:bg-[#262A33]"
                            aria-label="Edit product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete product ${prod.name}?`)) {
                                deleteProduct(prod.id);
                                addToast('info', 'Product Deleted', `${prod.name} removed from catalog.`);
                              }
                            }}
                            className="p-1.5 text-[#9298A2] hover:text-rose-400 rounded hover:bg-[#262A33]"
                            aria-label="Delete product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDER LOGS */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <p className="text-xs font-mono uppercase tracking-wider text-[#9298A2]">
              All Orders ({orders.length})
            </p>

            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-6 bg-[#121419] border border-[#262A33] rounded-xl space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1A1D23] pb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono font-bold text-[#F5F5F3]">
                          {ord.orderNumber}
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#1A1D23] text-emerald-400">
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#9298A2] mt-1">
                        Customer: {ord.customerEmail} · Date: {new Date(ord.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                        className="bg-[#08090B] border border-[#262A33] text-xs text-[#F5F5F3] rounded px-3 py-1.5 focus:outline-none"
                      >
                        <option value="PENDING_AGE_VERIFICATION">Pending Age Verification</option>
                        <option value="AGE_VERIFIED">Age Verified</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>

                      <span className="font-mono font-bold text-sm text-[#F5F5F3] tabular-nums">
                        ${ord.total.toFixed(2)} USD
                      </span>
                    </div>
                  </div>

                  {/* Line Items */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {ord.items.map((item) => (
                      <div key={item.id} className="p-2.5 bg-[#08090B] border border-[#262A33] rounded flex justify-between">
                        <div>
                          <p className="font-semibold text-[#F5F5F3]">{item.productName}</p>
                          <p className="text-[11px] text-[#9298A2] font-mono">
                            Qty: {item.quantity} · SKU: {item.productSku}
                          </p>
                        </div>
                        <span className="font-mono text-[#F5F5F3]">${item.lineTotal.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-[11px] text-[#9298A2] pt-2 flex flex-col sm:flex-row justify-between border-t border-[#1A1D23] gap-2">
                    <p>
                      Ship to: {ord.shippingAddress.fullName}, {ord.shippingAddress.street}, {ord.shippingAddress.city}, {ord.shippingAddress.state} {ord.shippingAddress.postalCode}
                    </p>
                    <span className="font-mono text-emerald-400">
                      Method: {ord.ageVerifiedMethod}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: AUDIT TRAIL */}
        {activeTab === 'logs' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <p className="text-xs font-mono uppercase tracking-wider text-[#9298A2]">
              Security & Compliance Audit Trail ({auditLogs.length})
            </p>
            <div className="bg-[#121419] border border-[#262A33] rounded-xl divide-y divide-[#1A1D23]">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#F5F5F3]">{log.action}</span>
                      <span className="text-[#9298A2]">on</span>
                      <span className="font-mono text-[#C5CBD3]">{log.entity}</span>
                    </div>
                    <p className="text-xs text-[#9298A2]">{log.details}</p>
                  </div>
                  <div className="text-right sm:text-right text-[11px] font-mono text-[#9298A2] shrink-0">
                    <p>{log.userEmail}</p>
                    <p>{new Date(log.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: COMPLIANCE & SETTINGS */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="space-y-8 animate-in fade-in duration-200 max-w-3xl">
            <div className="p-6 bg-[#121419] border border-[#262A33] rounded-xl space-y-6">
              <h3 className="text-base font-bold text-[#F5F5F3] font-display">
                Commerce Mode & Regulatory Governance
              </h3>

              {/* Mode Selector */}
              <div>
                <label className="block text-xs font-mono uppercase text-[#9298A2] mb-2">
                  Operating Commerce Mode
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setSettingsMode('DEMO_INFORMATIONAL')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      settingsMode === 'DEMO_INFORMATIONAL'
                        ? 'border-[#C5CBD3] bg-[#1A1D23] shadow-md'
                        : 'border-[#262A33] bg-[#08090B] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <p className="text-xs font-bold text-[#F5F5F3]">Demo Informational</p>
                    <p className="text-[11px] text-[#9298A2] mt-1">
                      Direct purchases locked. Specifications & legal disclosures only.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSettingsMode('SANDBOX_COMMERCE')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      settingsMode === 'SANDBOX_COMMERCE'
                        ? 'border-[#C5CBD3] bg-[#1A1D23] shadow-md'
                        : 'border-[#262A33] bg-[#08090B] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <p className="text-xs font-bold text-emerald-400">Sandbox Commerce</p>
                    <p className="text-[11px] text-[#9298A2] mt-1">
                      Enables simulated age verification & test sandbox checkout.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSettingsMode('LIVE_AUTHORIZED')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      settingsMode === 'LIVE_AUTHORIZED'
                        ? 'border-[#C5CBD3] bg-[#1A1D23] shadow-md'
                        : 'border-[#262A33] bg-[#08090B] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <p className="text-xs font-bold text-[#F5F5F3]">Live Authorized</p>
                    <p className="text-[11px] text-[#9298A2] mt-1">
                      Production integration mode (requires certified processor webhook).
                    </p>
                  </button>
                </div>
              </div>

              {/* Minimum Age */}
              <div>
                <label className="block text-xs font-mono uppercase text-[#9298A2] mb-1">
                  Jurisdiction Minimum Age Policy
                </label>
                <select
                  value={settingsMinAge}
                  onChange={(e) => setSettingsMinAge(parseInt(e.target.value, 10))}
                  className="w-full bg-[#08090B] border border-[#262A33] rounded px-3 py-2 text-xs text-[#F5F5F3] focus:outline-none"
                >
                  <option value={21}>21+ Years (United States / Federal Tobacco 21)</option>
                  <option value={18}>18+ Years (United Kingdom & European Union TPD)</option>
                </select>
              </div>

              {/* Age Gate Enforce */}
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={settingsAgeGate}
                  onChange={(e) => setSettingsAgeGate(e.target.checked)}
                  className="rounded border-[#262A33] bg-[#08090B] text-[#C5CBD3] focus:ring-0"
                />
                <span className="text-xs text-[#F5F5F3]">
                  Enforce strict pre-entry statutory age gate modal
                </span>
              </label>

              {/* Announcement */}
              <div>
                <label className="block text-xs font-mono uppercase text-[#9298A2] mb-1">
                  Top Announcement Strip Text
                </label>
                <input
                  type="text"
                  value={settingsAnnouncement}
                  onChange={(e) => setSettingsAnnouncement(e.target.value)}
                  className="w-full bg-[#08090B] border border-[#262A33] rounded px-3 py-2 text-xs text-[#F5F5F3] focus:outline-none focus:border-[#C5CBD3]"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#F5F5F3] text-[#08090B] text-xs font-semibold rounded-lg hover:bg-[#C5CBD3] transition-colors"
              >
                Save Compliance Parameters
              </button>
            </div>
          </form>
        )}

        {/* Product Create/Edit Modal */}
        {isEditingProduct && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          >
            <div className="relative w-full max-w-xl bg-[#08090B] border border-[#262A33] rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-[#262A33] flex items-center justify-between">
                <h3 className="text-base font-bold text-[#F5F5F3]">
                  {editingId ? 'Edit Product Specification' : 'Add New Hardware SKU'}
                </h3>
                <button
                  onClick={() => setIsEditingProduct(false)}
                  className="text-[#9298A2] hover:text-[#F5F5F3]"
                  aria-label="Close modal"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#9298A2] mb-1">
                    Product Title
                  </label>
                  <input
                    type="text"
                    value={prodFormName}
                    onChange={(e) => setProdFormName(e.target.value)}
                    required
                    className="w-full bg-[#121419] border border-[#262A33] rounded px-3 py-2 text-xs text-[#F5F5F3] focus:border-[#C5CBD3] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#9298A2] mb-1">
                      SKU
                    </label>
                    <input
                      type="text"
                      value={prodFormSku}
                      onChange={(e) => setProdFormSku(e.target.value)}
                      required
                      className="w-full bg-[#121419] border border-[#262A33] rounded px-3 py-2 text-xs text-[#F5F5F3] focus:border-[#C5CBD3] focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#9298A2] mb-1">
                      Category
                    </label>
                    <select
                      value={prodFormCategory}
                      onChange={(e) => setProdFormCategory(e.target.value)}
                      className="w-full bg-[#121419] border border-[#262A33] rounded px-3 py-2 text-xs text-[#F5F5F3] focus:outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#9298A2] mb-1">
                      Price (USD)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={prodFormPrice}
                      onChange={(e) => setProdFormPrice(e.target.value)}
                      required
                      className="w-full bg-[#121419] border border-[#262A33] rounded px-3 py-2 text-xs text-[#F5F5F3] focus:border-[#C5CBD3] focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#9298A2] mb-1">
                      Initial Reserve Stock
                    </label>
                    <input
                      type="number"
                      value={prodFormStock}
                      onChange={(e) => setProdFormStock(e.target.value)}
                      required
                      className="w-full bg-[#121419] border border-[#262A33] rounded px-3 py-2 text-xs text-[#F5F5F3] focus:border-[#C5CBD3] focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#9298A2] mb-1">
                    Tagline (One-line summary)
                  </label>
                  <input
                    type="text"
                    value={prodFormTagline}
                    onChange={(e) => setProdFormTagline(e.target.value)}
                    required
                    className="w-full bg-[#121419] border border-[#262A33] rounded px-3 py-2 text-xs text-[#F5F5F3] focus:border-[#C5CBD3] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#9298A2] mb-1">
                    Technical Description
                  </label>
                  <textarea
                    rows={4}
                    value={prodFormDesc}
                    onChange={(e) => setProdFormDesc(e.target.value)}
                    required
                    className="w-full bg-[#121419] border border-[#262A33] rounded px-3 py-2 text-xs text-[#F5F5F3] focus:border-[#C5CBD3] focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditingProduct(false)}
                    className="px-4 py-2 bg-[#1A1D23] text-xs text-[#F5F5F3] rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#F5F5F3] text-xs font-semibold text-[#08090B] rounded-lg hover:bg-[#C5CBD3]"
                  >
                    Save Specification
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
