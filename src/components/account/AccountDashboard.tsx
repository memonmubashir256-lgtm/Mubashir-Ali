import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { useCompliance } from '../../context/ComplianceContext';
import { useToast } from '../../context/ToastContext';
import { ShieldCheck, Package, LogOut, RefreshCw, Clock } from 'lucide-react';

interface AccountDashboardProps {
  onNavigateCatalog: () => void;
}

export const AccountDashboard: React.FC<AccountDashboardProps> = ({ onNavigateCatalog }) => {
  const { user, logout } = useAuth();
  const { orders } = useStore();
  const { settings, resetAgeVerification } = useCompliance();
  const { addToast } = useToast();

  if (!user) {
    return (
      <div className="py-24 max-w-md mx-auto px-4 text-center space-y-4">
        <p className="text-sm font-semibold text-[#F5F5F3]">Sign In Required</p>
        <p className="text-xs text-[#9298A2]">
          Please authenticate to review your profile and order receipts.
        </p>
      </div>
    );
  }

  // Filter orders matching current user
  const userOrders = orders.filter(
    (o) => o.userId === user.id || o.customerEmail.toLowerCase() === user.email.toLowerCase()
  );

  const handleResetAge = () => {
    resetAgeVerification();
    addToast('info', 'Age Session Reset', 'Statutory age gate will prompt on next action.');
  };

  return (
    <div className="py-12 bg-[#08090B] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A1D23] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#9298A2]">
              <span>Customer Portal</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#F5F5F3]">{user.role}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#F5F5F3] font-display mt-1">
              {user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.email}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={logout}
              className="px-4 py-2 bg-[#121419] hover:bg-[#1A1D23] border border-[#262A33] text-xs text-[#F5F5F3] rounded-lg flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Profile & Compliance Credentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-[#121419] border border-[#262A33] rounded-xl space-y-2">
            <span className="text-xs font-mono text-[#9298A2] uppercase tracking-wider">
              Email Address
            </span>
            <p className="text-sm font-semibold text-[#F5F5F3]">{user.email}</p>
            <p className="text-[11px] text-[#9298A2]">Registered Account Identifier</p>
          </div>

          <div className="p-6 bg-[#121419] border border-[#262A33] rounded-xl space-y-2">
            <span className="text-xs font-mono text-[#9298A2] uppercase tracking-wider">
              Statutory Verification
            </span>
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified {settings.minimumAge}+ Consumer</span>
            </div>
            <p className="text-[11px] text-[#9298A2]">
              Audit Passed {user.ageVerifiedAt ? new Date(user.ageVerifiedAt).toLocaleDateString() : 'Active'}
            </p>
          </div>

          <div className="p-6 bg-[#121419] border border-[#262A33] rounded-xl space-y-2">
            <span className="text-xs font-mono text-[#9298A2] uppercase tracking-wider">
              Security Actions
            </span>
            <button
              onClick={handleResetAge}
              className="text-xs text-[#C5CBD3] hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Statutory Age Gate</span>
            </button>
            <p className="text-[11px] text-[#9298A2]">Clears local jurisdiction cache</p>
          </div>
        </div>

        {/* Order History */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#F5F5F3] font-display flex items-center gap-2">
              <Package className="w-5 h-5 text-[#C5CBD3]" />
              <span>Order Receipts ({userOrders.length})</span>
            </h2>
          </div>

          {userOrders.length === 0 ? (
            <div className="p-12 text-center bg-[#121419] border border-[#262A33] rounded-xl space-y-3">
              <p className="text-sm text-[#F5F5F3] font-medium">No order history recorded</p>
              <p className="text-xs text-[#9298A2] max-w-sm mx-auto">
                Hardware orders placed during sandbox test commerce will appear here with itemized receipts.
              </p>
              <button
                onClick={onNavigateCatalog}
                className="mt-2 px-4 py-2 bg-[#F5F5F3] text-[#08090B] text-xs font-semibold rounded-lg hover:bg-[#C5CBD3]"
              >
                Browse Collection
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {userOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-6 bg-[#121419] border border-[#262A33] rounded-xl space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1A1D23] pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#F5F5F3] font-mono">
                          {order.orderNumber}
                        </span>
                        <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-[#1A1D23] text-emerald-400">
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#9298A2] flex items-center gap-1.5 mt-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold font-mono text-[#F5F5F3] tabular-nums">
                        ${order.total.toFixed(2)} USD
                      </span>
                      <p className="text-[11px] text-[#9298A2]">{order.paymentMethod}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="divide-y divide-[#1A1D23] text-xs">
                    {order.items.map((item) => (
                      <div key={item.id} className="py-2.5 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-[#F5F5F3]">{item.productName}</p>
                          <p className="text-[11px] font-mono text-[#9298A2]">
                            {item.variantTitle || 'Standard'} · Qty: {item.quantity} · SKU: {item.productSku}
                          </p>
                        </div>
                        <span className="font-mono text-[#F5F5F3] tabular-nums">
                          ${item.lineTotal.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-[#9298A2] border-t border-[#1A1D23] gap-2">
                    <p>
                      Shipped to: {order.shippingAddress.fullName}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                    </p>
                    <span className="font-mono text-emerald-400">
                      Audit Ref: {order.ageVerifiedMethod}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
