import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface Order {
  id: string;
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  items: any[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  paymentMethod: string;
  createdAt: any;
  deliveryDate: string;
  shippingAddress: any;
  internalNotes?: string;
}

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'messages'>('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingNotes, setEditingNotes] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const qOrders = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribeOrders = onSnapshot(qOrders, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(ordersData);
    }, (error) => {
      console.error("Error fetching orders:", error);
    });

    const qMessages = query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc'));
    const unsubscribeMessages = onSnapshot(qMessages, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messagesData);
    }, (error) => {
      console.error("Error fetching messages:", error);
    });

    setLoading(false);

    return () => {
      unsubscribeOrders();
      unsubscribeMessages();
    };
  }, []);

  // Stats Calculation
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((acc, curr) => acc + curr.total, 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const processingOrders = orders.filter(o => o.status === 'processing').length;
    return { totalRevenue, pendingOrders, processingOrders };
  }, [orders]);

  // Filtering Logic
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.orderId.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const filteredMessages = useMemo(() => {
    return messages.filter(msg => 
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [messages, searchQuery]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const saveNotes = async (orderId: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { internalNotes: editingNotes[orderId] });
      // Clear editing state for this order
      const newEditing = { ...editingNotes };
      delete newEditing[orderId];
      setEditingNotes(newEditing);
    } catch (error) {
      console.error("Error saving notes:", error);
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await deleteDoc(doc(db, 'orders', orderId));
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await deleteDoc(doc(db, 'contactMessages', messageId));
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-12 w-12 border-4 border-[#22d3ee] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header & Stats */}
      <div className="mb-12">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8">
          Management <span className="text-[#22d3ee]">Portal</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#1a1a1a] border border-white/5 p-6 rounded-2xl">
            <p className="text-[9px] font-black uppercase tracking-widest text-stone-500 mb-2">Total Revenue</p>
            <p className="text-2xl font-black text-white">JMD ${stats.totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-[#1a1a1a] border border-white/5 p-6 rounded-2xl">
            <p className="text-[9px] font-black uppercase tracking-widest text-stone-500 mb-2">Pending Orders</p>
            <p className="text-2xl font-black text-[#22d3ee]">{stats.pendingOrders}</p>
          </div>
          <div className="bg-[#1a1a1a] border border-white/5 p-6 rounded-2xl">
            <p className="text-[9px] font-black uppercase tracking-widest text-stone-500 mb-2">In Production</p>
            <p className="text-2xl font-black text-[#76c893]">{stats.processingOrders}</p>
          </div>
          <div className="bg-[#1a1a1a] border border-white/5 p-6 rounded-2xl">
            <p className="text-[9px] font-black uppercase tracking-widest text-stone-500 mb-2">New Messages</p>
            <p className="text-2xl font-black text-white">{messages.length}</p>
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div className="flex gap-6 border-b border-white/5 w-full md:w-auto">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`text-[10px] font-black uppercase tracking-widest pb-4 border-b-2 transition-all ${activeTab === 'orders' ? 'text-[#22d3ee] border-[#22d3ee]' : 'text-stone-500 border-transparent hover:text-white'}`}
          >
            Orders
          </button>
          <button 
            onClick={() => setActiveTab('messages')}
            className={`text-[10px] font-black uppercase tracking-widest pb-4 border-b-2 transition-all ${activeTab === 'messages' ? 'text-[#22d3ee] border-[#22d3ee]' : 'text-stone-500 border-transparent hover:text-white'}`}
          >
            Messages
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <input 
              type="text"
              placeholder="Search by name, email, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-black border border-white/10 rounded-xl px-4 py-2 text-xs text-white w-full md:w-64 focus:border-[#22d3ee] outline-none transition-all"
            />
          </div>
          {activeTab === 'orders' && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-black border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-[#22d3ee] outline-none transition-all"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'orders' ? (
          <motion.div
            key="orders-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 gap-6"
          >
            {filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                layout
                className="bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden hover:border-[#22d3ee]/20 transition-all"
              >
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#22d3ee]">
                          {order.orderId}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                          order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                          order.status === 'processing' ? 'bg-blue-500/10 text-blue-500' :
                          order.status === 'shipped' ? 'bg-purple-500/10 text-purple-500' :
                          'bg-green-500/10 text-green-500'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-white uppercase tracking-tight">
                        {order.customerName}
                      </h3>
                      <div className="flex flex-wrap gap-4 mt-2">
                        <a href={`mailto:${order.email}`} className="text-stone-500 text-xs hover:text-[#22d3ee] transition-colors">{order.email}</a>
                        <a href={`https://wa.me/${order.phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="text-stone-500 text-xs hover:text-[#22d3ee] transition-colors">{order.phone}</a>
                      </div>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-3xl font-black text-white">
                        JMD ${order.total.toLocaleString()}
                      </p>
                      <p className="text-[9px] text-stone-500 uppercase tracking-widest mt-1">
                        {order.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 'Cash on Delivery'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8 border-t border-white/5">
                    {/* Items */}
                    <div>
                      <h4 className="text-[9px] font-black uppercase tracking-widest text-stone-500 mb-4">Artisan Items</h4>
                      <div className="space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex gap-3 items-center">
                            <img src={item.image} alt="" className="w-10 h-10 rounded object-cover border border-white/5" />
                            <div className="flex-1">
                              <p className="text-xs text-stone-200 font-bold">{item.name}</p>
                              <p className="text-[10px] text-stone-500">{item.size} • Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Logistics */}
                    <div>
                      <h4 className="text-[9px] font-black uppercase tracking-widest text-stone-500 mb-4">Logistics</h4>
                      <div className="space-y-4">
                        <div>
                          <p className="text-[9px] text-stone-600 uppercase mb-1">Shipping Address</p>
                          <p className="text-xs text-stone-300 leading-relaxed">
                            {order.shippingAddress.address1}, {order.shippingAddress.address2 && `${order.shippingAddress.address2}, `} {order.shippingAddress.parish}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] text-stone-600 uppercase mb-1">Target Delivery</p>
                          <p className="text-xs text-[#22d3ee] font-bold">
                            {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Internal Notes & Actions */}
                    <div className="bg-black/20 p-6 rounded-xl border border-white/5">
                      <h4 className="text-[9px] font-black uppercase tracking-widest text-stone-500 mb-4">Internal Notes</h4>
                      <textarea
                        value={editingNotes[order.id] !== undefined ? editingNotes[order.id] : (order.internalNotes || '')}
                        onChange={(e) => setEditingNotes({ ...editingNotes, [order.id]: e.target.value })}
                        placeholder="Add private notes about this order..."
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-stone-300 h-24 focus:border-[#22d3ee] outline-none transition-all resize-none mb-3"
                      />
                      {editingNotes[order.id] !== undefined && (
                        <button 
                          onClick={() => saveNotes(order.id)}
                          className="w-full py-2 bg-[#22d3ee] text-black text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-[#76c893] transition-all mb-4"
                        >
                          Save Notes
                        </button>
                      )}
                      
                      <div className="flex flex-col gap-2">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-[10px] font-bold text-white focus:border-[#22d3ee] outline-none transition-all"
                        >
                          <option value="pending">Mark as Pending</option>
                          <option value="processing">Mark as Processing</option>
                          <option value="shipped">Mark as Shipped</option>
                          <option value="delivered">Mark as Delivered</option>
                        </select>
                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="w-full py-2 text-red-500/50 hover:text-red-500 text-[9px] font-black uppercase tracking-widest transition-all"
                        >
                          Delete Order
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {filteredOrders.length === 0 && (
              <div className="text-center py-20 bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
                <p className="text-stone-500 uppercase tracking-widest text-sm font-bold">No orders match your search</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="messages-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 gap-6"
          >
            {filteredMessages.map((msg) => (
              <motion.div
                key={msg.id}
                layout
                className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-8 hover:border-[#22d3ee]/20 transition-all"
              >
                <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-white uppercase tracking-tight">{msg.name}</h3>
                    <div className="flex gap-4 mt-2">
                      <a href={`mailto:${msg.email}`} className="text-stone-500 text-xs hover:text-[#22d3ee] transition-colors">{msg.email}</a>
                    </div>
                    <span className="inline-block mt-4 px-3 py-1 bg-[#22d3ee]/10 text-[#22d3ee] text-[9px] font-black uppercase tracking-widest rounded-full">
                      {msg.project_type}
                    </span>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-[10px] text-stone-500 uppercase tracking-widest font-bold">
                      Received: {msg.createdAt?.toDate().toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </p>
                    <div className="flex gap-3 mt-4 md:justify-end">
                      <a 
                        href={`mailto:${msg.email}?subject=Regarding your Jamwood Epoxy inquiry`}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all"
                      >
                        Reply via Email
                      </a>
                      <button
                        onClick={() => deleteMessage(msg.id)}
                        className="px-4 py-2 text-red-500/50 hover:text-red-500 text-[9px] font-black uppercase tracking-widest transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
                <div className="bg-black/40 p-8 rounded-2xl border border-white/5 relative">
                  <p className="text-base text-stone-300 leading-relaxed italic">"{msg.message}"</p>
                </div>
              </motion.div>
            ))}
            {filteredMessages.length === 0 && (
              <div className="text-center py-20 bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
                <p className="text-stone-500 uppercase tracking-widest text-sm font-bold">No messages match your search</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrders;
