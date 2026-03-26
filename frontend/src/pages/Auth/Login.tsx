import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Hospital,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ChevronRight,
    Activity,
    Heart,
    Stethoscope,
    Syringe,
    Microscope,
    Phone,
    MessageCircle,
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
    Loader2,
    User,
    Settings,
    Stethoscope as DoctorIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Floating Icons Component
const FloatingIcons = () => {
    const icons = [
        { Icon: Hospital, delay: 0, left: '5%', top: '10%', size: 48 },
        { Icon: Stethoscope, delay: 1, right: '8%', top: '15%', size: 56 },
        { Icon: ShieldCheck, delay: 2, left: '10%', bottom: '20%', size: 44 },
        { Icon: Syringe, delay: 1.5, right: '12%', bottom: '25%', size: 40 },
        { Icon: Microscope, delay: 0.5, left: '15%', top: '50%', size: 52 },
        { Icon: Heart, delay: 2.5, right: '15%', top: '60%', size: 48 },
    ];

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {icons.map(({ Icon, delay, size, ...style }, index) => (
                <motion.div
                    key={index}
                    className="absolute text-primary/10"
                    style={style}
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, -5, 0],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{
                        duration: 6,
                        delay,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <Icon size={size} strokeWidth={1.5} />
                </motion.div>
            ))}
        </div>
    );
};

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showWelcome, setShowWelcome] = useState(true);
    const [loginStep, setLoginStep] = useState(1);

    useEffect(() => {
        const timer = setTimeout(() => setShowWelcome(false), 2500);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setLoginStep(2);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Demo credentials (as requested)
            if (email === 'admin@hospital.com' && password === 'password') {
                setLoginStep(3);
                await new Promise(resolve => setTimeout(resolve, 800));
                toast.success('Login successful! Welcome back.');
                login({ email, password });
                navigate('/'); // Redirect to Home
            } else {
                setError('Invalid email or password');
                setLoginStep(1);
            }
        } catch (err) {
            setError('Login failed. Please try again.');
            setLoginStep(1);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickLogin = (role: string) => {
        switch (role) {
            case 'admin':
                setEmail('admin@hospital.com');
                setPassword('password');
                break;
            case 'doctor':
                setEmail('doctor@hospital.com');
                setPassword('password');
                break;
            case 'nurse':
                setEmail('nurse@hospital.com');
                setPassword('password');
                break;
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary-dark to-slate-900 font-sans">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute inset-0 bg-[url('/images/medical-pattern.svg')] repeat opacity-20"></div>
            </div>

            {/* Floating Icons */}
            <FloatingIcons />

            {/* Welcome Overlay */}
            <AnimatePresence>
                {showWelcome && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 flex flex-col items-center justify-center bg-primary z-[1000]"
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 100 }}
                            transition={{ duration: 0.8, type: 'spring', damping: 15 }}
                            className="bg-white/20 p-8 rounded-[2.5rem] backdrop-blur-xl border border-white/30 shadow-2xl mb-8"
                        >
                            <Hospital size={100} className="text-white" />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ delay: 0.3 }}
                            className="text-center"
                        >
                            <h2 className="text-5xl font-black text-white tracking-tight mb-2">PCC GENERAL HOSPITAL</h2>
                            <p className="text-xl text-white/70 font-medium">Empowering Healthcare Excellence</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Login Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="w-full max-w-[480px] relative z-10 px-6"
            >
                <div className="bg-white/95 backdrop-blur-2xl rounded-[3rem] p-10 md:p-12 shadow-[0_32px_80px_rgba(0,0,0,0.4)] border border-white/50 relative overflow-hidden group">

                    {/* Decorative Corner Gradients */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/20 transition-colors"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-light/10 rounded-full -ml-16 -mb-16 blur-2xl group-hover:bg-primary-light/20 transition-colors"></div>

                    {/* Logo & Header */}
                    <div className="text-center mb-10">
                        <motion.div
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="w-20 h-20 bg-gradient-to-tr from-primary to-primary-light rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30"
                        >
                            <Hospital className="text-white" size={40} />
                        </motion.div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
                        <p className="text-slate-500 font-medium text-sm">Sign in to access your dashboard</p>
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6"
                            >
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-center gap-3 text-red-600 text-sm font-semibold">
                                    <AlertCircle size={18} />
                                    <span>{error}</span>
                                    <button onClick={() => setError('')} className="ml-auto hover:bg-red-100 p-1 rounded-lg transition-colors">
                                        <Loader2 className="rotate-45" size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative group/field">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/field:text-primary transition-colors">
                                    <Mail size={20} />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400"
                                    required
                                />
                            </div>

                            <div className="relative group/field">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/field:text-primary transition-colors">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-14 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors p-1"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer group select-none">
                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${rememberMe ? 'bg-primary border-primary shadow-sm shadow-primary/30' : 'bg-white border-slate-300'}`}>
                                    {rememberMe && <CheckCircle2 size={14} className="text-white" />}
                                </div>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <span className="text-slate-600 font-medium group-hover:text-primary transition-colors">Remember me</span>
                            </label>
                            <button type="button" className="text-primary font-bold hover:underline">Forgot Password?</button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-primary to-primary-light hover:to-primary text-white font-bold py-5 rounded-[1.5rem] shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 relative overflow-hidden group/btn"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={24} />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ChevronRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Loading Steps Indicator */}
                    <AnimatePresence>
                        {loginStep >= 2 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 flex flex-col items-center gap-3"
                            >
                                <div className="flex gap-2">
                                    {[1, 2, 3].map((step) => (
                                        <motion.div
                                            key={step}
                                            animate={{
                                                scale: loginStep === step ? [1, 1.3, 1] : 1,
                                                backgroundColor: loginStep >= step ? '#9120e8' : '#e2e8f0',
                                            }}
                                            transition={{ duration: 0.8, repeat: loginStep === step ? Infinity : 0 }}
                                            className="w-2.5 h-2.5 rounded-full"
                                        />
                                    ))}
                                </div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                                    {loginStep === 2 ? 'Authenticating' : 'Finalizing'}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="my-10 relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-slate-400 font-bold tracking-widest">Quick Access</span></div>
                    </div>

                    <div className="flex justify-center gap-4">
                        {[
                            { id: 'admin', label: 'Admin', Icon: ShieldCheck, color: 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-600' },
                            { id: 'doctor', label: 'Doctor', Icon: DoctorIcon, color: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-600' },
                            { id: 'nurse', label: 'Nurse', Icon: Activity, color: 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-600' }
                        ].map(({ id, label, Icon, color }) => (
                            <button
                                key={id}
                                onClick={() => handleQuickLogin(id)}
                                className={`p-4 rounded-2xl border transition-all hover:text-white hover:scale-110 active:scale-95 group/quick relative ${color.split(' hover:')[0]} hover:${color.split(' hover:')[1]}`}
                                title={`Login as ${label}`}
                            >
                                <Icon size={24} />
                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase opacity-0 group-hover/quick:opacity-100 transition-opacity text-slate-400 tracking-tighter w-max">
                                    {label}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Footer Info */}
                    <div className="mt-14 text-center">
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-relaxed">
                            © 2026 Presbyterian Church in Cameroon<br />Health Services HMS v1.0
                        </p>
                        <div className="flex justify-center gap-3 mt-4">
                            <button className="text-slate-400 hover:text-primary transition-colors"><Phone size={14} /></button>
                            <button className="text-slate-400 hover:text-primary transition-colors"><Mail size={14} /></button>
                            <button className="text-slate-400 hover:text-green-500 transition-colors"><MessageCircle size={14} /></button>
                        </div>
                    </div>

                    {/* Cornerstone Heartbeat */}
                    <div className="absolute bottom-6 right-8 text-primary/10">
                        <motion.div
                            animate={{ scale: [1, 1.3, 1, 1.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity, times: [0, 0.1, 0.2, 0.3, 1] }}
                        >
                            <Heart size={40} fill="currentColor" />
                        </motion.div>
                    </div>

                </div>
            </motion.div>

            {/* Background Pulse Circles */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] aspect-square bg-radial from-primary/20 to-transparent rounded-full blur-[100px]"
                />
            </div>
        </div>
    );
};

export default LoginPage;
