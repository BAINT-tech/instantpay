import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye, EyeOff, Send, Download, Plus, Bell, Menu, Smartphone, Zap, Droplet, Tv, User, Settings, LogOut, Copy, Check, X } from 'lucide-react';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [currentUser, setCurrentUser] = useState(null);
  const [showBalance, setShowBalance] = useState(true);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [bills, setBills] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [tempData, setTempData] = useState({});

  // Initialize demo data
  useEffect(() => {
    const demoUsers = [
      {
        id: '1',
        full_name: 'Adaeze Ude',
        phone: '08012345678',
        email: 'adaeze@example.com',
        pin: '1234',
        balance: 10500,
        referral_code: 'ADE123',
        referred_by: null,
        created_at: new Date(),
        is_verified: true
      }
    ];
    setUsers(demoUsers);
  }, []);

  const generateReferralCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({length: 6}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

  const addNotification = (userId, title, message, actionType = 'transaction') => {
    const newNotif = {
      id: Date.now().toString(),
      user_id: userId,
      title,
      message,
      is_read: false,
      timestamp: new Date(),
      action_type: actionType
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const Splash = () => {
    useEffect(() => {
      const timer = setTimeout(() => {
        setCurrentScreen('onboarding');
      }, 2000);
      return () => clearTimeout(timer);
    }, []);

    return (
      <div className="h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex flex-col items-center justify-center text-white">
        <div className="text-8xl mb-4 animate-pulse">⚡</div>
        <h1 className="text-5xl font-bold mb-2">InstantPay</h1>
        <p className="text-blue-200">Payment made easy</p>
      </div>
    );
  };

  const Onboarding = () => {
    const [slide, setSlide] = useState(0);
    const slides = [
      { emoji: '💸', title: 'Send Money Instantly', desc: 'Transfer money to anyone in seconds' },
      { emoji: '📄', title: 'Pay All Your Bills', desc: 'Airtime, electricity, TV subscriptions' },
      { emoji: '🎁', title: 'Earn With Referrals', desc: 'Get ₦100 for every 3 referrals' }
    ];

    return (
      <div className="h-screen bg-white flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="text-8xl mb-8">{slides[slide].emoji}</div>
          <h2 className="text-3xl font-bold mb-4 text-center">{slides[slide].title}</h2>
          <p className="text-gray-600 text-center mb-8">{slides[slide].desc}</p>
          <div className="flex gap-2 mb-8">
            {slides.map((_, i) => (
              <div key={i} className={`h-2 rounded-full transition-all ${i === slide ? 'w-8 bg-blue-600' : 'w-2 bg-gray-300'}`} />
            ))}
          </div>
        </div>
        <div className="p-6 space-y-3">
          {slide < 2 ? (
            <button onClick={() => setSlide(slide + 1)} className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700">
              Next
            </button>
          ) : (
            <button onClick={() => setCurrentScreen('signup')} className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700">
              Get Started
            </button>
          )}
          <button onClick={() => setCurrentScreen('login')} className="w-full text-gray-600 py-4">
            Already have an account? <span className="text-blue-600 font-semibold">Login</span>
          </button>
        </div>
      </div>
    );
  };

  const Signup = () => {
    const [formData, setFormData] = useState({
      full_name: '',
      phone: '',
      email: '',
      pin: '',
      referral_code: ''
    });
    const [errors, setErrors] = useState({});

    const validate = () => {
      const newErrors = {};
      if (!formData.full_name.trim()) newErrors.full_name = 'Name is required';
      if (!/^0\d{10}$/.test(formData.phone)) newErrors.phone = 'Invalid phone (11 digits)';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
      if (!/^\d{4}$/.test(formData.pin)) newErrors.pin = 'PIN must be 4 digits';
      if (users.find(u => u.phone === formData.phone)) newErrors.phone = 'Phone already registered';
      if (users.find(u => u.email === formData.email)) newErrors.email = 'Email already registered';
      if (formData.referral_code && !users.find(u => u.referral_code === formData.referral_code)) {
        newErrors.referral_code = 'Invalid referral code';
      }
      return newErrors;
    };

    const handleSignup = () => {
      const validationErrors = validate();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      const newUser = {
        id: Date.now().toString(),
        ...formData,
        balance: 1000,
        referral_code: generateReferralCode(),
        referred_by: formData.referral_code || null,
        created_at: new Date(),
        is_verified: false
      };

      setUsers(prev => [...prev, newUser]);

      if (formData.referral_code) {
        const referrer = users.find(u => u.referral_code === formData.referral_code);
        if (referrer) {
          const newReferral = {
            id: Date.now().toString(),
            referrer_id: referrer.id,
            referred_user_id: newUser.id,
            bonus_amount: 100,
            status: 'pending',
            timestamp: new Date()
          };
          setReferrals(prev => [...prev, newReferral]);

          const referrerReferrals = referrals.filter(r => r.referrer_id === referrer.id && r.status === 'pending');
          if (referrerReferrals.length + 1 >= 3) {
            setUsers(prev => prev.map(u => 
              u.id === referrer.id ? {...u, balance: u.balance + 100} : u
            ));
            setReferrals(prev => prev.map(r => 
              referrerReferrals.map(rr => rr.id).includes(r.id) ? {...r, status: 'earned'} : r
            ));
            addNotification(referrer.id, 'Referral Bonus!', '₦100 credited for 3 referrals', 'referral');
          }
        }
      }

      addNotification(newUser.id, 'Welcome to InstantPay!', '₦1,000 welcome bonus credited', 'deposit');
      setCurrentUser(newUser);
      setCurrentScreen('otp');
    };

    return (
      <div className="h-screen bg-gray-50 flex flex-col">
        <div className="bg-white p-4 flex items-center gap-4 border-b">
          <ArrowLeft className="w-6 h-6 cursor-pointer" onClick={() => setCurrentScreen('onboarding')} />
          <h1 className="text-xl font-semibold">Sign Up</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
              {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="08012345678"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Create 4-Digit PIN</label>
              <input
                type="password"
                maxLength="4"
                value={formData.pin}
                onChange={(e) => setFormData({...formData, pin: e.target.value.replace(/\D/g, '')})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="****"
              />
              {errors.pin && <p className="text-red-500 text-xs mt-1">{errors.pin}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Referral Code (Optional)</label>
              <input
                type="text"
                value={formData.referral_code}
                onChange={(e) => setFormData({...formData, referral_code: e.target.value.toUpperCase()})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ABC123"
              />
              {errors.referral_code && <p className="text-red-500 text-xs mt-1">{errors.referral_code}</p>}
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border-t space-y-3">
          <button onClick={handleSignup} className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700">
            Create Account
          </button>
          <button onClick={() => setCurrentScreen('login')} className="w-full text-gray-600">
            Already have an account? <span className="text-blue-600 font-semibold">Login</span>
          </button>
        </div>
      </div>
    );
  };

  const OTP = () => {
    const [otp, setOtp] = useState(['', '', '', '']);

    const handleVerify = () => {
      const updatedUser = {...currentUser, is_verified: true};
      setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
      setCurrentUser(updatedUser);
      addNotification(currentUser.id, 'Account Verified!', 'Your InstantPay account is ready', 'account');
      setCurrentScreen('dashboard');
    };

    return (
      <div className="h-screen bg-white flex flex-col">
        <div className="bg-white p-4 flex items-center gap-4 border-b">
          <ArrowLeft className="w-6 h-6 cursor-pointer" onClick={() => setCurrentScreen('signup')} />
          <h1 className="text-xl font-semibold">Verify Phone</h1>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="text-6xl mb-8">📱</div>
          <h2 className="text-2xl font-bold mb-2">Enter verification code</h2>
          <p className="text-gray-600 mb-8 text-center">
            Code sent to {currentUser?.phone}
          </p>

          <div className="flex gap-3 mb-8">
            {otp.map((digit, i) => (
              <input
                key={i}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => {
                  const newOtp = [...otp];
                  newOtp[i] = e.target.value;
                  setOtp(newOtp);
                }}
                className="w-16 h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ))}
          </div>

          <p className="text-gray-600 mb-8">
            Didn't receive code? <span className="text-blue-600 font-semibold cursor-pointer">Resend</span>
          </p>

          <button onClick={handleVerify} className="w-full max-w-sm bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700">
            Verify
          </button>
        </div>
      </div>
    );
  };

  const Login = () => {
    const [phone, setPhone] = useState('');
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
      const user = users.find(u => u.phone === phone && u.pin === pin);
      if (user) {
        setCurrentUser(user);
        setCurrentScreen('dashboard');
        setError('');
      } else {
        setError('Invalid phone or PIN');
      }
    };

    return (
      <div className="h-screen bg-gray-50 flex flex-col">
        <div className="bg-white p-4 flex items-center gap-4 border-b">
          <ArrowLeft className="w-6 h-6 cursor-pointer" onClick={() => setCurrentScreen('onboarding')} />
          <h1 className="text-xl font-semibold">Login</h1>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="text-6xl mb-4">⚡</div>
          <h2 className="text-3xl font-bold mb-8">InstantPay</h2>

          <div className="w-full max-w-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="08012345678"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">PIN</label>
              <input
                type="password"
                maxLength="4"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="****"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button onClick={handleLogin} className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700">
              Login
            </button>

            <p className="text-center text-gray-600">
              <span className="text-blue-600 font-semibold cursor-pointer">Forgot PIN?</span>
            </p>

            <button onClick={() => setCurrentScreen('signup')} className="w-full text-gray-600">
              Don't have an account? <span className="text-blue-600 font-semibold">Sign Up</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const Dashboard = () => {
    const userTransactions = transactions.filter(t => t.user_id === currentUser.id).slice(0, 5);
    const unreadNotifs = notifications.filter(n => n.user_id === currentUser.id && !n.is_read).length;

    return (
      <div className="h-screen bg-gray-50 flex flex-col">
        <div className="bg-white p-4 flex items-center justify-between border-b">
          <Menu className="w-6 h-6" />
          <h1 className="text-xl font-semibold">InstantPay</h1>
          <div className="relative cursor-pointer" onClick={() => setCurrentScreen('notifications')}>
            <Bell className="w-6 h-6" />
            {unreadNotifs > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {unreadNotifs}
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="bg-white p-6 mb-2">
            <p className="text-gray-600 mb-1">Hello, {currentUser.full_name.split(' ')[0]}! 👋</p>
            <p className="text-xs text-gray-400 mb-6">Last login: {new Date().toLocaleString()}</p>

            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white mb-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm opacity-90">Wallet Balance</p>
                <button onClick={() => setShowBalance(!showBalance)} className="p-1">
                  {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
              <h2 className="text-4xl font-bold">
                {showBalance ? `₦${currentUser.balance.toLocaleString()}` : '₦****'}
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <button onClick={() => setCurrentScreen('send')} className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-xl hover:bg-blue-100">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white">
                  <Send className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium">Send</span>
              </button>
              <button onClick={() => setCurrentScreen('bills')} className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-xl hover:bg-blue-100">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white">
                  <Zap className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium">Pay Bills</span>
              </button>
              <button onClick={() => setCurrentScreen('add-money')} className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-xl hover:bg-blue-100">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium">Add Money</span>
              </button>
            </div>

            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="grid grid-cols-4 gap-3">
              {[
                { icon: <Smartphone className="w-6 h-6 text-blue-600" />, label: 'Airtime', category: 'Airtime' },
                { icon: <Zap className="w-6 h-6 text-blue-600" />, label: 'Electricity', category: 'Electricity' },
                { icon: <Droplet className="w-6 h-6 text-blue-600" />, label: 'Data', category: 'Data' },
                { icon: <Tv className="w-6 h-6 text-blue-600" />, label: 'TV', category: 'TV' }
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setTempData({billCategory: item.category});
                    setCurrentScreen('bills');
                  }}
                  className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  {item.icon}
                  <span className="text-xs">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {userTransactions.length > 0 && (
            <div className="bg-white p-6">
              <h3 className="font-semibold mb-3">Recent Tran<p className="text-xs text-gray-500">{new Date(tx.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className={`font-semibold ${tx.type === 'receive' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type === 'receive' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <BottomNav active="home" />
      </div>
    );
  };

  const SendMoney = () => {
    const [step, setStep] = useState(1);
    const [recipientPhone, setRecipientPhone] = useState('');
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [pin, setPin] = useState('');
    const [recipient, setRecipient] = useState(null);
    const [error, setError] = useState('');

    const handleContinue = () => {
      setError('');
      const numAmount = parseFloat(amount);

      if (numAmount < 100) {
        setError('Minimum amount is ₦100');
        return;
      }
      if (numAmount > currentUser.balance) {
        setError('Insufficient balance');
        return;
      }
      if (recipientPhone === currentUser.phone) {
        setError('Cannot send to yourself');
        return;
      }

      const foundRecipient = users.find(u => u.phone === recipientPhone);
      if (!foundRecipient) {
        setError('Recipient not found');
        return;
      }

      setRecipient(foundRecipient);
      setStep(2);
    };

    const handleConfirm = () => {
      if (pin !== currentUser.pin) {
        setError('Incorrect PIN');
        return;
      }

      const numAmount = parseFloat(amount);
      const senderBalanceBefore = currentUser.balance;
      const recipientBalanceBefore = recipient.balance;

      const updatedSender = {...currentUser, balance: currentUser.balance - numAmount};
      const updatedRecipient = {...recipient, balance: recipient.balance + numAmount};

      setUsers(prev => prev.map(u => 
        u.id === currentUser.id ? updatedSender : 
        u.id === recipient.id ? updatedRecipient : u
      ));
      setCurrentUser(updatedSender);

      const senderTx = {
        id: Date.now().toString(),
        user_id: currentUser.id,
        type: 'send',
        amount: numAmount,
        recipient_phone: recipient.phone,
        recipient_name: recipient.full_name,
        note,
        status: 'success',
        balance_before: senderBalanceBefore,
        balance_after: updatedSender.balance,
        timestamp: new Date()
      };

      const recipientTx = {
        id: (Date.now() + 1).toString(),
        user_id: recipient.id,
        type: 'receive',
        amount: numAmount,
        recipient_phone: currentUser.phone,
        recipient_name: currentUser.full_name,
        note,
        status: 'success',
        balance_before: recipientBalanceBefore,
        balance_after: updatedRecipient.balance,
        timestamp: new Date()
      };

      setTransactions(prev => [senderTx, recipientTx, ...prev]);

      addNotification(currentUser.id, 'Money Sent', `₦${numAmount.toLocaleString()} sent to ${recipient.full_name}`);
      addNotification(recipient.id, 'Money Received', `₦${numAmount.toLocaleString()} from ${currentUser.full_name}`);

      setTempData({success: true, amount: numAmount, recipient: recipient.full_name});
      setCurrentScreen('success');
    };

    if (step === 2) {
      return (
        <div className="h-screen bg-gray-50 flex flex-col">
          <div className="bg-white p-4 flex items-center gap-4 border-b">
            <ArrowLeft className="w-6 h-6 cursor-pointer" onClick={() => setStep(1)} />
            <h1 className="text-xl font-semibold">Confirm Transaction</h1>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <p className="text-gray-600 mb-2">You are sending</p>
            <h2 className="text-5xl font-bold text-blue-600 mb-8">₦{parseFloat(amount).toLocaleString()}</h2>

            <div className="w-full max-w-sm bg-white rounded-2xl p-6 mb-8">
              <p className="text-gray-600 text-sm mb-1">To</p>
              <p className="font-bold text-lg">{recipient.full_name}</p>
              <p className="text-gray-600">{recipient.phone}</p>
              {note && (
                <>
                  <p className="text-gray-600 text-sm mt-4 mb-1">Note</p>
                  <p className="text-gray-800">{note}</p>
                </>
              )}
            </div>

            <div className="w-full max-w-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">Enter your PIN</label>
              <input
                type="password"
                maxLength="4"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-center text-2xl font-bold"
                placeholder="****"
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
          </div>

          <div className="p-6 bg-white border-t space-y-3">
            <button onClick={handleConfirm} className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700">
              Confirm & Send
            </button>
            <button onClick={() => setCurrentScreen('dashboard')} className="w-full text-gray-600 py-3">
              Cancel
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="h-screen bg-gray-50 flex flex-col">
        <div className="bg-white p-4 flex items-center gap-4 border-b">
          <ArrowLeft className="w-6 h-6 cursor-pointer" onClick={() => setCurrentScreen('dashboard')} />
          <h1 className="text-xl font-semibold">Send Money</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-600">Your Balance</p>
            <p className="text-2xl font-bold text-blue-600">₦{currentUser.balance.toLocaleString()}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Phone Number</label>
              <input
                type="tel"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="08012345678"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount to Send</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-lg">₦</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Note (Optional)</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="What's this for?"
              />
            </div>

            {amount && (
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h3 className="font-semibold mb-3">Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold">₦{parseFloat(amount || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fee:</span>
                    <span className="font-semibold text-green-600">₦0.00</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-lg">₦{parseFloat(amount || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
          </div>
        </div>

        <div className="p-6 bg-white border-t">
          <button onClick={handleContinue} className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700">
            Continue
          </button>
        </div>
      </div>
    );
  };

  const Bills = () => {
    const [selectedCategory, setSelectedCategory] = useState(tempData.billCategory || null);
    const [provider, setProvider] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [pin, setPin] = useState('');
    const [step, setStep] = useState(selectedCategory ? 2 : 1);
    const [error, setError] = useState('');

    const categories = [
      { name: 'Airtime', icon: <Smartphone className="w-8 h-8 text-blue-600" />, providers: ['MTN', 'Airtel', 'Glo', '9mobile'] },
      { name: 'Electricity', icon: <Zap className="w-8 h-8 text-blue-600" />, providers: ['IKEDC', 'EKEDC', 'AEDC', 'PHED'] },
      { name: 'Data', icon: <Droplet className="w-8 h-8 text-blue-600" />, providers: ['MTN Data', 'Airtel Data', 'Glo Data', '9mobile Data'] },
      { name: 'TV', icon: <Tv className="w-8 h-8 text-blue-600" />, providers: ['DSTV', 'GOTV', 'StarTimes'] }
    ];

    const handlePay = () => {
      if (pin !== currentUser.pin) {
        setError('Incorrect PIN');
        return;
      }

      const numAmount = parseFloat(amount);
      const fee = 50;
      const total = numAmount + fee;

      if (total > currentUser.balance) {
        setError('Insufficient balance');
        return;
      }

      const balanceBefore = currentUser.balance;
      const updatedUser = {...currentUser, balance: currentUser.balance - total};
      setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
      setCurrentUser(updatedUser);

      const newBill = {
        id: Date.now().toString(),
        user_id: currentUser.id,
        category: selectedCategory,
        provider,
        account_number: accountNumber,
        amount: numAmount,
        fee,
        status: 'success',
        timestamp: new Date()
      };
      setBills(prev => [newBill, ...prev]);

      const newTx = {
        id: Date.now().toString(),
        user_id: currentUser.id,
        type: 'bill',
        amount: total,
        category: selectedCategory,
        recipient_name: provider,
        status: 'success',
        balance_before: balanceBefore,
        balance_after: updatedUser.balance,
        timestamp: new Date()
      };
      setTransactions(prev => [newTx, ...prev]);

      addNotification(currentUser.id, 'Bill Payment Successful', `₦${numAmount.toLocaleString()} paid for ${selectedCategory}`);

      setTempData({success: true, amount: total, recipient: `${selectedCategory} - ${provider}`});
      setCurrentScreen('success');
    };

    if (step === 1) {
      return (
        <div className="h-screen bg-gray-50 flex flex-col">
          <div className="bg-white p-4 flex items-center gap-4 border-b">
            <ArrowLeft className="w-6 h-6 cursor-pointer" onClick={() => setCurrentScreen('dashboard')} />
            <h1 className="text-xl font-semibold">Pay Bills</h1>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4">Select Category</h2>
            <div className="grid grid-cols-2 gap-4">
              {categories.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    setStep(2);
                  }}
                  className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition"
                >
                  {cat.icon}
                  <span className="font-semibold">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          <BottomNav active="bills" />
        </div>
      );
    }

    const currentCategory = categories.find(c => c.name === selectedCategory);

    if (step === 2) {
      return (
        <div className="h-screen bg-gray-50 flex flex-col">
          <div className="bg-white p-4 flex items-center gap-4 border-b">
            <ArrowLeft className="w-6 h-6 cursor-pointer" onClick={() => setStep(1)} />
            <h1 className="text-xl font-semibold">{selectedCategory}</h1>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600">Your Balance</p>
              <p className="text-2xl font-bold text-blue-600">₦{currentUser.balance.toLocaleString()}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Provider</label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose provider</option>
                  {currentCategory.providers.map((p, i) => (
                    <option key={i} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {selectedCategory === 'Airtime' || selectedCategory === 'Data' ? 'Phone Number' : 
                   selectedCategory === 'Electricity' ? 'Meter Number' : 'Card Number'}
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-lg">₦</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {amount && (
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <h3 className="font-semibold mb-3">Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-semibold">₦{parseFloat(amount || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fee:</span>
                      <span className="font-semibold">₦50.00</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-semibold">Total:</span>
                      <span className="font-bold text-lg">₦{(parseFloat(amount || 0) + 50).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 bg-white border-t">
            <button 
              onClick={() => setStep(3)} 
              disabled={!provider || !accountNumber || !amount}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="h-screen bg-gray-50 flex flex-col">
        <div className="bg-white p-4 flex items-center gap-4 border-b">
          <ArrowLeft className="w-6 h-6 cursor-pointer" onClick={() => setStep(2)} />
          <h1 className="text-xl font-semibold">Confirm Payment</h1>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <p className="text-gray-600 mb-2">You are paying</p>
          <h2 className="text-5xl font-bold text-blue-600 mb-8">₦{(parseFloat(amount) + 50).toLocaleString()}</h2>

          <div className="w-full max-w-sm bg-white rounded-2xl p-6 mb-8">
            <div className="space-y-3">
              <div>
                <p className="text-gray-600 text-sm">Category</p>
                <p className="font-semibold">{selectedCategory}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Provider</p>
                <p className="font-semibold">{provider}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Account</p>
                <p className="font-semibold">{accountNumber}</p>
              </div>
            </div>
          </div>

          <div className="w-full max-w-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">Enter your PIN</label>
            <input
              type="password"
              maxLength="4"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-center text-2xl font-bold"
              placeholder="****"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        </div>

        <div className="p-6 bg-white border-t space-y-3">
          <button onClick={handlePay} className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700">
            Confirm & Pay
          </button>
          <button onClick={() => setCurrentScreen('dashboard')} className="w-full text-gray-600 py-3">
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const AddMoney = () => {
    const [amount, setAmount] = useState('');

    const handleAdd = () => {
      const numAmount = parseFloat(amount);
      if (numAmount < 100) return;

      const balanceBefore = currentUser.balance;
      const updatedUser = {...currentUser, balance: currentUser.balance + numAmount};
      setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
      setCurrentUser(updatedUser);

      const newTx = {
        id: Date.now().toString(),
        user_id: currentUser.id,
        type: 'deposit',
        amount: numAmount,
        status: 'success',
        balance_before: balanceBefore,
        balance_after: updatedUser.balance,
        timestamp: new Date()
      };
      setTransactions(prev => [newTx, ...prev]);

      addNotification(currentUser.id, 'Money Added', `₦${numAmount.toLocaleString()} added to wallet`);

      setTempData({success: true, amount: numAmount, recipient: 'Your Wallet'});
      setCurrentScreen('success');
    };

    return (
      <div className="h-screen bg-gray-50 flex flex-col">
        <div className="bg-white p-4 flex items-center gap-4 border-b">
          <ArrowLeft className="w-6 h-6 cursor-pointer" onClick={() => setCurrentScreen('dashboard')} />
          <h1 className="text-xl font-semibold">Add Money</h1>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="text-6xl mb-6">💳</div>
          <p className="text-gray-600 mb-8 text-center">This is a mock deposit for testing</p>

          <div className="w-full max-w-sm space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount to Add</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-lg">₦</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-2xl font-bold"
                  placeholder="0.00"
                />
              </div>
            </div>

            <button 
              onClick={handleAdd}
              disabled={!amount || parseFloat(amount) < 100}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-300"
            >
              Add to Wallet
            </button>
          </div>
        </div>
      </div>
    );
  };

  const Success = () => {
    const [copied, setCopied] = useState(false);

    return (
      <div className="h-screen bg-white flex flex-col items-center justify-center p-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Successful!</h2>
        <p className="text-gray-600 mb-8">
          ₦{tempData.amount?.toLocaleString()} to {tempData.recipient}
        </p>

        <div className="w-full max-w-sm bg-gray-50 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Transaction ID</span>
            <button 
              onClick={() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="text-blue-600 text-sm font-semibold flex items-center gap-1"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="font-mono text-sm">{Date.now()}</p>
        </div>

        <button 
          onClick={() => {
            setTempData({});
            setCurrentScreen('dashboard');
          }}
          className="w-full max-w-sm bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700"
        >
          Back to Home
        </button>
      </div>
    );
  };

  const Notifications = () => {
    const userNotifs = notifications.filter(n => n.user_id === currentUser.id);

    return (
      <div className="h-screen bg-gray-50 flex flex-col">
        <div className="bg-white p-4 flex items-center gap-4 border-b">
          <ArrowLeft className="w-6 h-6 cursor-pointer" onClick={() => setCurrentScreen('dashboard')} />
          <h1 className="text-xl font-semibold">Notifications</h1>
        </div>

        <div className="flex-1 overflow-y-auto">
          {userNotifs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Bell className="w-16 h-16 mb-4" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {userNotifs.map(notif => (
                <div key={notif.id} className={`p-4 ${notif.is_read ? 'bg-white' : 'bg-blue-50'}`}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bell className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{notif.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{notif.message}</p>
                      <p className="text-xs text-gray-400">{new Date(notif.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <BottomNav active="home" />
      </div>
    );
  };

  const Profile = () => {
    const [showReferral, setShowReferral] = useState(false);
    const userReferrals = referrals.filter(r => r.referrer_id === currentUser.id);
    const earnedReferrals = userReferrals.filter(r => r.status === 'earned').length;

    return (
      <div className="h-screen bg-gray-50 flex flex-col">
        <div className="bg-white p-4 flex items-center justify-between border-b">
          <h1 className="text-xl font-semibold">Profile</h1>
          <button onClick={() => {
            setCurrentUser(null);
            setCurrentScreen('login');
          }}>
            <LogOut className="w-6 h-6 text-red-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 text-center">
            <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
              {currentUser.full_name.charAt(0)}
            </div>
            <h2 className="text-2xl font-bold mb-1">{currentUser.full_name}</h2>
            <p className="text-blue-100">{currentUser.phone}</p>
            <p className="text-blue-100 text-sm">{currentUser.email}</p>
          </div>

          <div className="p-6 space-y-4">
            <div className="bg-white rounded-2xl p-6">
              <h3 className="font-semibold mb-4">Referral Program</h3>
              <div className="bg-blue-50 rounded-xl p-4 mb-4"><p className="text-sm text-gray-600 mb-1">Your Referral Code</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-blue-600">{currentUser.referral_code}</p>
                  <button 
                    onClick={() => setShowReferral(!showReferral)}
                    className="text-blue-600 text-sm font-semibold"
                  >
                    {showReferral ? 'Hide' : 'Share'}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-blue-600">{userReferrals.length}</p>
                  <p className="text-sm text-gray-600">Total Referrals</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-green-600">₦{earnedReferrals * 100}</p>
                  <p className="text-sm text-gray-600">Total Earned</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl divide-y">
              <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-600" />
                  <span>Personal Info</span>
                </div>
                <span className="text-gray-400">›</span>
              </button>
              <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-gray-600" />
                  <span>Change PIN</span>
                </div>
                <span className="text-gray-400">›</span>
              </button>
            </div>
          </div>
        </div>

        <BottomNav active="profile" />
      </div>
    );
  };

  const BottomNav = ({ active }) => (
    <div className="bg-white border-t flex justify-around py-2">
      <button 
        onClick={() => setCurrentScreen('dashboard')} 
        className={`flex flex-col items-center p-2 ${active === 'home' ? 'text-blue-600' : 'text-gray-400'}`}
      >
        <Send className="w-5 h-5" />
        <span className="text-xs mt-1">Home</span>
      </button>
      <button 
        onClick={() => {
          setTempData({});
          setCurrentScreen('bills');
        }}
        className={`flex flex-col items-center p-2 ${active === 'bills' ? 'text-blue-600' : 'text-gray-400'}`}
      >
        <Zap className="w-5 h-5" />
        <span className="text-xs mt-1">Bills</span>
      </button>
      <button 
        onClick={() => setCurrentScreen('profile')} 
        className={`flex flex-col items-center p-2 ${active === 'profile' ? 'text-blue-600' : 'text-gray-400'}`}
      >
        <User className="w-5 h-5" />
        <span className="text-xs mt-1">Profile</span>
      </button>
    </div>
  );

  return (
    <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen">
      {currentScreen === 'splash' && <Splash />}
      {currentScreen === 'onboarding' && <Onboarding />}
      {currentScreen === 'signup' && <Signup />}
      {currentScreen === 'otp' && <OTP />}
      {currentScreen === 'login' && <Login />}
      {currentScreen === 'dashboard' && <Dashboard />}
      {currentScreen === 'send' && <SendMoney />}
      {currentScreen === 'bills' && <Bills />}
      {currentScreen === 'add-money' && <AddMoney />}
      {currentScreen === 'success' && <Success />}
      {currentScreen === 'notifications' && <Notifications />}
      {currentScreen === 'profile' && <Profile />}
    </div>
  );
};

export default App;
