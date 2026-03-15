'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Loader2, Eye, Download, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Payment {
  _id: string;
  textId: string;
  screenshotPath: string;
  paymentStatus: 'pending' | 'approved' | 'rejected';
  amount: number;
  network: string;
  paymentNumber: string;
  paymentName: string;
  createdAt: string;
  approvedAt?: string;
  rejectionReason?: string;
}

export default function AdminDashboard() {
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // For production, use proper authentication (JWT, OAuth, etc.)
  const handleAdminLogin = () => {
    if (adminKey === (process.env.NEXT_PUBLIC_ADMIN_KEY || 'admin_key_change_in_production')) {
      setIsAuthenticated(true);
      toast.success('Authenticated as admin');
      fetchPayments();
    } else {
      toast.error('Invalid admin key');
    }
  };

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/payments', {
        headers: {
          'x-admin-key': adminKey,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payments');
      }

      const data = await response.json();
      setPayments(data.payments || []);
    } catch (err) {
      toast.error('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePayment = async (paymentId: string) => {
    try {
      const response = await fetch('/api/payment/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({
          paymentId,
          action: 'approve',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to approve payment');
      }

      toast.success('Payment approved successfully');
      setSelectedPayment(null);
      fetchPayments();
    } catch (err: any) {
      toast.error(err.message || 'Failed to approve payment');
    }
  };

  const handleRejectPayment = async (paymentId: string) => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      const response = await fetch('/api/payment/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({
          paymentId,
          action: 'reject',
          rejectionReason,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reject payment');
      }

      toast.success('Payment rejected');
      setSelectedPayment(null);
      setRejectionReason('');
      fetchPayments();
    } catch (err: any) {
      toast.error(err.message || 'Failed to reject payment');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-black flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8">
            <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
            <p className="text-gray-400 text-sm mb-6">Verify and approve user payments</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Admin Secret Key
                </label>
                <input
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Enter admin key..."
                  className="w-full px-4 py-2.5 text-sm bg-black/40 text-white border border-white/10 rounded-lg outline-none focus:border-[#00D1FF] focus:ring-2 focus:ring-[#00D1FF]/10 transition-all duration-200"
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Check .env.local for ADMIN_SECRET_KEY
                </p>
              </div>

              <button
                onClick={handleAdminLogin}
                className="w-full py-2.5 bg-gradient-to-r from-[#00D1FF] to-[#00B8D4] text-black font-bold rounded-lg hover:shadow-lg hover:shadow-[#00D1FF]/20 transition-all duration-200"
              >
                Login as Admin
              </button>
            </div>

            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex gap-3">
                <AlertCircle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-yellow-700">
                  <p className="font-semibold mb-1">Development Mode</p>
                  <p>Default key: check .env.local ADMIN_SECRET_KEY</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-black px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Review and approve user payment screenshots</p>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => {
            setIsAuthenticated(false);
            setAdminKey('');
            setPayments([]);
          }}
          className="mb-6 px-4 py-2 text-sm bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all duration-200"
        >
          Logout
        </button>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={32} className="text-[#00D1FF] animate-spin" />
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-12 bg-[#111] border border-white/10 rounded-2xl">
            <p className="text-gray-400">No pending payments at this time</p>
            <button
              onClick={fetchPayments}
              className="mt-4 px-4 py-2 text-sm bg-[#00D1FF]/10 text-[#00D1FF] rounded-lg hover:bg-[#00D1FF]/20 transition-all"
            >
              Refresh
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment._id}
                className="bg-[#111] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Text ID</p>
                    <p className="text-white font-mono text-sm break-all">{payment.textId}</p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      payment.paymentStatus === 'pending'
                        ? 'bg-yellow-500/10 text-yellow-400'
                        : payment.paymentStatus === 'approved'
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}
                  >
                    {payment.paymentStatus.toUpperCase()}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">Amount</p>
                    <p className="text-white font-semibold">GHS {payment.amount}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Network</p>
                    <p className="text-white font-semibold">{payment.network}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Date</p>
                    <p className="text-white font-semibold">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Payment #</p>
                    <p className="text-white font-semibold text-xs">{payment.paymentNumber}</p>
                  </div>
                </div>

                {payment.paymentStatus === 'pending' ? (
                  <div className="flex gap-2">
                    <a
                      href={payment.screenshotPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#00D1FF]/10 text-[#00D1FF] rounded-lg hover:bg-[#00D1FF]/20 transition-all font-semibold text-sm"
                    >
                      <Eye size={16} />
                      View Screenshot
                    </a>
                    <button
                      onClick={() => setSelectedPayment(payment)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-all font-semibold text-sm"
                    >
                      <CheckCircle2 size={16} />
                      Approve
                    </button>
                    <button
                      onClick={() => setSelectedPayment(payment)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all font-semibold text-sm"
                    >
                      <XCircle size={16} />
                      Reject
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm">
                    {payment.paymentStatus === 'approved' ? (
                      <>
                        <CheckCircle2 size={16} className="text-green-400" />
                        <span className="text-green-400">Approved</span>
                      </>
                    ) : (
                      <>
                        <XCircle size={16} className="text-red-400" />
                        <span className="text-red-400">Rejected</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-white mb-4">
              {selectedPayment.paymentStatus === 'pending' ? 'Review Payment' : 'Payment Details'}
            </h2>

            <a
              href={selectedPayment.screenshotPath}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full mb-4 p-4 bg-black/40 border border-white/10 rounded-lg text-center text-[#00D1FF] hover:border-[#00D1FF]/50 transition-all"
            >
              <Download size={16} className="mx-auto mb-2" />
              Download Screenshot
            </a>

            {selectedPayment.paymentStatus === 'pending' ? (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Rejection Reason (if rejecting)
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="E.g., 'Invalid transaction amount', 'Screenshot unclear'..."
                    className="w-full px-4 py-2.5 text-sm bg-black/40 text-white border border-white/10 rounded-lg outline-none focus:border-[#00D1FF] focus:ring-2 focus:ring-[#00D1FF]/10 transition-all duration-200 resize-none"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprovePayment(selectedPayment._id)}
                    className="flex-1 py-2.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg hover:bg-green-500/20 font-semibold transition-all"
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => handleRejectPayment(selectedPayment._id)}
                    className="flex-1 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 font-semibold transition-all"
                  >
                    ✕ Reject
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPayment(null);
                      setRejectionReason('');
                    }}
                    className="flex-1 py-2.5 bg-gray-500/10 text-gray-400 border border-gray-500/20 rounded-lg hover:bg-gray-500/20 font-semibold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-300 mb-4">
                  {selectedPayment.paymentStatus === 'approved'
                    ? '✓ Payment has been approved'
                    : `✕ Reason: ${selectedPayment.rejectionReason}`}
                </p>
                <button
                  onClick={() => {
                    setSelectedPayment(null);
                    setRejectionReason('');
                  }}
                  className="w-full py-2.5 bg-gray-500/10 text-gray-400 rounded-lg hover:bg-gray-500/20 font-semibold transition-all"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
