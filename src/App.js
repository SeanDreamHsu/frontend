import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Package, MapPin, DollarSign, Loader2, Send, AlertTriangle, CheckCircle, XCircle, ArrowLeft, ArrowRight, LogOut, LogIn, Settings } from 'lucide-react';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// --- Firebase Configuration ---
// ⚠️ IMPORTANT: Replace this with your actual Firebase config object.
const firebaseConfig = {
  apiKey: "AIzaSyAa6QY_SBpbn9vkRq6VQ8lFl4-oNyWKAks",
  authDomain: "shippingbackend.firebaseapp.com",
  projectId: "shippingbackend",
  storageBucket: "shippingbackend.firebasestorage.app",
  messagingSenderId: "671906577144",
  appId: "1:671906577144:web:1798cdf8981fd0ac8ed90d",
  measurementId: "G-K92DCKVR4Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// --- Configuration & Constants ---
const BACKEND_BASE_URL = 'https://backend-23qh.onrender.com/api';

const carrierDetailsMap = {
  "fedex": {
    name: "FedEx",
    services: [
      { 
        name: "FedEx 2Day", 
        serviceCode: "fedex_2day",
        packages: [
            { name: "Package", code: "package" },
            { name: "FedEx Envelope", code: "fedex_envelope" },
            { name: "FedEx Pak", code: "fedex_pak" },
            { name: "FedEx Small Box", code: "fedex_small_box" },
            { name: "FedEx Medium Box", code: "fedex_medium_box" },
            { name: "FedEx Large Box", code: "fedex_large_box" },
        ]
      },
      { 
        name: "FedEx First Overnight", 
        serviceCode: "fedex_first_overnight",
        packages: [
            { name: "Package", code: "package" },
            { name: "FedEx Envelope", code: "fedex_envelope" },
            { name: "FedEx Pak", code: "fedex_pak" },
        ]
      },
      { 
        name: "FedEx Priority Overnight", 
        serviceCode: "fedex_priority_overnight",
        packages: [
            { name: "Package", code: "package" },
            { name: "FedEx Envelope", code: "fedex_envelope" },
            { name: "FedEx Pak", code: "fedex_pak" },
            { name: "FedEx Small Box", code: "fedex_small_box" },
            { name: "FedEx Medium Box", code: "fedex_medium_box" },
            { name: "FedEx Large Box", code: "fedex_large_box" },
        ]
      },
      { 
        name: "FedEx Standard Overnight", 
        serviceCode: "fedex_standard_overnight",
        packages: [
            { name: "Package", code: "package" },
            { name: "FedEx Envelope", code: "fedex_envelope" },
            { name: "FedEx Pak", code: "fedex_pak" },
        ]
      },
      { 
        name: "FedEx Express Saver", 
        serviceCode: "fedex_express_saver",
        packages: [
            { name: "Package", code: "package" },
            { name: "FedEx Envelope", code: "fedex_envelope" },
        ]
      },
      { 
        name: "FedEx Ground", 
        serviceCode: "fedex_ground",
        packages: [
            { name: "Package", code: "package" }
        ]
      },
      { 
        name: "FedEx Home Delivery", 
        serviceCode:"fedex_home_delivery",
        packages: [
            { name: "Package", code: "package" }
        ]
      },
      { 
        name: "FedEx International Priority", 
        serviceCode: "fedex_international_priority",
        packages: [
            { name: "Package", code: "package" },
            { name: "FedEx Envelope", code: "fedex_envelope" },
            { name: "FedEx Pak", code: "fedex_pak" },
            { name: "FedEx Small Box", code: "fedex_small_box" },
            { name: "FedEx Medium Box", code: "fedex_medium_box" },
            { name: "FedEx Large Box", code: "fedex_large_box" },
        ]
      },
      { 
        name: "FedEx International Economy", 
        serviceCode: "fedex_international_economy",
        packages: [
            { name: "Package", code: "package" }
        ]
      },
      { 
        name: "FedEx International Ground", 
        serviceCode: "fedex_international_ground",
        packages: [
            { name: "Package", code: "package" }
        ]
      }
    ]
  }
};

const usStates = [
    { name: 'Alabama', abbreviation: 'AL' }, { name: 'Alaska', abbreviation: 'AK' },
    { name: 'Arizona', abbreviation: 'AZ' }, { name: 'Arkansas', abbreviation: 'AR' },
    { name: 'California', abbreviation: 'CA' }, { name: 'Colorado', abbreviation: 'CO' },
    { name: 'Connecticut', abbreviation: 'CT' }, { name: 'Delaware', abbreviation: 'DE' },
    { name: 'Florida', abbreviation: 'FL' }, { name: 'Georgia', abbreviation: 'GA' },
    { name: 'Hawaii', abbreviation: 'HI' }, { name: 'Idaho', abbreviation: 'ID' },
    { name: 'Illinois', abbreviation: 'IL' }, { name: 'Indiana', abbreviation: 'IN' },
    { name: 'Iowa', abbreviation: 'IA' }, { name: 'Kansas', abbreviation: 'KS' },
    { name: 'Kentucky', abbreviation: 'KY' }, { name: 'Louisiana', abbreviation: 'LA' },
    { name: 'Maine', abbreviation: 'ME' }, { name: 'Maryland', abbreviation: 'MD' },
    { name: 'Massachusetts', abbreviation: 'MA' }, { name: 'Michigan', abbreviation: 'MI' },
    { name: 'Minnesota', abbreviation: 'MN' }, { name: 'Mississippi', abbreviation: 'MS' },
    { name: 'Missouri', abbreviation: 'MO' }, { name: 'Montana', abbreviation: 'MT' },
    { name: 'Nebraska', abbreviation: 'NE' }, { name: 'Nevada', abbreviation: 'NV' },
    { name: 'New Hampshire', abbreviation: 'NH' }, { name: 'New Jersey', abbreviation: 'NJ' },
    { name: 'New Mexico', abbreviation: 'NM' }, { name: 'New York', abbreviation: 'NY' },
    { name: 'North Carolina', abbreviation: 'NC' }, { name: 'North Dakota', abbreviation: 'ND' },
    { name: 'Ohio', abbreviation: 'OH' }, { name: 'Oklahoma', abbreviation: 'OK' },
    { name: 'Oregon', abbreviation: 'OR' }, { name: 'Pennsylvania', abbreviation: 'PA' },
    { name: 'Rhode Island', abbreviation: 'RI' }, { name: 'South Carolina', abbreviation: 'SC' },
    { name: 'South Dakota', abbreviation: 'SD' }, { name: 'Tennessee', abbreviation: 'TN' },
    { name: 'Texas', abbreviation: 'TX' }, { name: 'Utah', abbreviation: 'UT' },
    { name: 'Vermont', abbreviation: 'VT' }, { name: 'Virginia', abbreviation: 'VA' },
    { name: 'Washington', abbreviation: 'WA' }, { name: 'West Virginia', abbreviation: 'WV' },
    { name: 'Wisconsin', abbreviation: 'WI' }, { name: 'Wyoming', abbreviation: 'WY' }
];

// --- Utility Functions ---
const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
};

// --- API Calls ---
const fetchAddressSuggestions = async (query) => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/places-autocomplete?input=${encodeURIComponent(query)}`);
    if (!response.ok) {
      console.error("Failed to fetch address suggestions from backend.");
      return [];
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error calling address suggestions API:", error);
    return [];
  }
};

// --- Reusable UI Components ---

const Alert = ({ type, message }) => {
    const styleConfig = {
        warning: { bg: 'bg-yellow-100', border: 'border-yellow-500', text: 'text-yellow-700', Icon: AlertTriangle },
        error: { bg: 'bg-red-100', border: 'border-red-500', text: 'text-red-700', Icon: XCircle },
        success: { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-700', Icon: CheckCircle }
    };
    const { bg, border, text, Icon } = styleConfig[type] || styleConfig.warning;
    if (!message) return null;
    return (
        <div className={`${bg} border-l-4 ${border} ${text} p-4 rounded-md`} role="alert">
            <div className="flex">
                <div className="py-1"><Icon className="h-5 w-5 mr-3" /></div>
                <div><p className="whitespace-pre-wrap">{message}</p></div>
            </div>
        </div>
    );
};

const LoginPage = ({ show, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoginView, setIsLoginView] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!show) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (isLoginView) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-blue-200 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                    <XCircle size={24} />
                </button>
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-800">
                        {isLoginView ? 'Welcome Back' : 'Create Account'}
                    </h1>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email">Email Address</label>
                        <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 p-3 border rounded-lg"/>
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input id="password" type="password" required minLength="6" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 p-3 border rounded-lg"/>
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 rounded-lg text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400">
                        {loading ? 'Processing...' : (isLoginView ? 'Sign In' : 'Sign Up')}
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <button onClick={() => setIsLoginView(!isLoginView)} className="font-medium text-blue-600 hover:text-blue-500">
                        {isLoginView ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                    </button>
                </div>
            </div>
        </div>
    );
};

const AdminDashboard = ({ userToken }) => {
    const [settings, setSettings] = useState({ service_fee_b2c: 0, service_fee_b2b: 0 });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const settingsRes = await fetch(`${BACKEND_BASE_URL}/admin/settings`, {
                headers: { 'Authorization': `Bearer ${userToken}` }
            });
            if (!settingsRes.ok) {
                const body = await settingsRes.text();
                throw new Error(`Settings request failed: ${settingsRes.status} ${settingsRes.statusText} - ${body}`);
            }
            const settingsData = await settingsRes.json();
            setSettings(settingsData);

            const usersRes = await fetch(`${BACKEND_BASE_URL}/admin/users`, {
                headers: { 'Authorization': `Bearer ${userToken}` }
            });
            if (!usersRes.ok) {
                const body = await usersRes.text();
                throw new Error(`Users request failed: ${usersRes.status} ${usersRes.statusText} - ${body}`);
            }
            const usersData = await usersRes.json();
            setUsers(usersData);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [userToken]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSaveSettings = async () => {
        alert('Saving settings...');
    };

    const handleRoleChange = async (userId, newRole) => {
        alert(`Changing user ${userId} to ${newRole}`);
    };

    if (loading) {
        return <div className="flex justify-center items-center p-8"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>;
    }

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
            <Alert type="error" message={error} />
            <Alert type="success" message={success} />
            
            <section className="p-6 bg-gray-50 rounded-xl border">
                <h3 className="text-xl font-semibold mb-4">Service Fee Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="b2c_fee" className="block text-sm font-medium text-gray-700">B2C Service Fee ($)</label>
                        <input type="number" step="0.01" id="b2c_fee" value={settings.service_fee_b2c} onChange={e => setSettings({...settings, service_fee_b2c: e.target.value})} className="w-full mt-1 p-3 border rounded-lg" />
                    </div>
                    <div>
                        <label htmlFor="b2b_fee" className="block text-sm font-medium text-gray-700">B2B Service Fee ($)</label>
                        <input type="number" step="0.01" id="b2b_fee" value={settings.service_fee_b2b} onChange={e => setSettings({...settings, service_fee_b2b: e.target.value})} className="w-full mt-1 p-3 border rounded-lg" />
                    </div>
                </div>
                <div className="mt-6 text-right">
                    <button onClick={handleSaveSettings} className="py-2 px-6 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700">Save Settings</button>
                </div>
            </section>

            <section className="p-6 bg-gray-50 rounded-xl border">
                 <h3 className="text-xl font-semibold mb-4">User Management</h3>
                 <div className="overflow-x-auto">
                     <table className="min-w-full divide-y divide-gray-200">
                         <thead className="bg-gray-100">
                             <tr>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                             </tr>
                         </thead>
                         <tbody className="bg-white divide-y divide-gray-200">
                             {users.map(user => (
                                 <tr key={user.uid}>
                                     <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                     <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                                     <td className="px-6 py-4 whitespace-nowrap">
                                         <select onChange={(e) => handleRoleChange(user.uid, e.target.value)} defaultValue={user.role} className="p-2 border rounded-lg">
                                             <option value="b2c">B2C</option>
                                             <option value="b2b">B2B</option>
                                             <option value="admin">Admin</option>
                                         </select>
                                     </td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                 </div>
            </section>
        </div>
    );
};

const AddressForm = ({ type, values, setters }) => {
    const title = type.charAt(0).toUpperCase() + type.slice(1);
    const [suggestions, setSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const suggestionsRef = useRef(null);

    const debouncedFetch = useCallback(debounce(async (query) => {
        if (query.length < 3) { setSuggestions([]); setIsSearching(false); return; }
        setIsSearching(true);
        const result = await fetchAddressSuggestions(query);
        setSuggestions(result);
        setIsSearching(false);
    }, 500), []);

    const handleStreet1Change = (e) => {
        const value = e.target.value;
        setters.setStreet1(value);
        debouncedFetch(value);
    };

    const handleSuggestionClick = (suggestion) => {
        setters.setStreet1(suggestion.street || '');
        setters.setCity(suggestion.city || '');
        setters.setState(suggestion.state || '');
        setters.setZip(suggestion.zip || '');
        setSuggestions([]);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
                setSuggestions([]);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [suggestionsRef]);

    return (
        <section className="p-6 bg-blue-50 rounded-xl border border-blue-100">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center"><MapPin className="mr-3 text-blue-500" size={24} /> {title} Info</h2>
            <div className="grid grid-cols-1 gap-6">
                <input required value={values.name} onChange={e => setters.setName(e.target.value)} placeholder="Name" className="w-full p-3 border rounded-lg" />
                <input value={values.company} onChange={e => setters.setCompany(e.target.value)} placeholder="Company (Optional)" className="w-full p-3 border rounded-lg" />
                <div className="relative" ref={suggestionsRef}>
                    <input required value={values.street1} onChange={handleStreet1Change} placeholder="Street 1" className="w-full p-3 border rounded-lg" />
                    {isSearching && <Loader2 className="animate-spin absolute right-3 top-3 text-gray-400" />}
                    {suggestions.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
                            {suggestions.map((s, index) => (
                                <li key={index} onClick={() => handleSuggestionClick(s)} className="p-3 hover:bg-gray-100 cursor-pointer">{s.description}</li>
                            ))}
                        </ul>
                    )}
                </div>
                <input value={values.street2} onChange={e => setters.setStreet2(e.target.value)} placeholder="Street 2" className="w-full p-3 border rounded-lg" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <input required value={values.city} onChange={e => setters.setCity(e.target.value)} placeholder="City" className="w-full p-3 border rounded-lg" />
                    <select required value={values.state} onChange={e => setters.setState(e.target.value)} className="w-full p-3 border rounded-lg bg-white text-base">
                        <option value="">Select State</option>
                        {usStates.map(state => <option key={state.abbreviation} value={state.abbreviation}>{state.abbreviation}</option>)}
                    </select>
                    <input required value={values.zip} onChange={e => setters.setZip(e.target.value)} placeholder="Zip Code" pattern="[0-9]{5}" title="Enter a 5-digit zip code" className="w-full p-3 border rounded-lg" />
                </div>
                {type === 'destination' && (
                    <div className="mt-4">
                      <label className="block text-base font-medium text-gray-700 mb-2">Address Type</label>
                      <div className="flex items-center">
                        <button type="button" role="switch" aria-checked={!values.isResidential} onClick={() => setters.setIsResidential(!values.isResidential)} className={`${!values.isResidential ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}>
                          <span aria-hidden="true" className={`${!values.isResidential ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
                        </button>
                        <span className="ml-3 text-base font-medium text-gray-900">Commercial</span>
                      </div>
                    </div>
                )}
            </div>
        </section>
    );
};

const PackageForm = ({ values, setters, onOptionChange }) => {
    const availablePackages = carrierDetailsMap.fedex.services.find(s => s.serviceCode === values.selectedServiceCode)?.packages || [];

    const handleServiceChange = (e) => {
        setters.setSelectedServiceCode(e.target.value);
        onOptionChange();
    };

    const handlePackageChange = (e) => {
        setters.setPackageCode(e.target.value);
        onOptionChange();
    };

    return (
        <section className="p-6 bg-blue-50 rounded-xl border border-blue-100">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center"><Package className="mr-3 text-blue-500" size={24} /> Package & Carrier</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="relative">
                    <input required min="0.1" value={values.weight} onChange={e => setters.setWeight(e.target.value)} placeholder="Weight" type="number" className="w-full p-3 border rounded-lg pr-12" />
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">lbs</span>
                </div>
                <div className="relative">
                    <input required min="1" value={values.length} onChange={e => setters.setLength(e.target.value)} placeholder="Length" type="number" className="w-full p-3 border rounded-lg pr-10" />
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">in</span>
                </div>
                <div className="relative">
                    <input required min="1" value={values.width} onChange={e => setters.setWidth(e.target.value)} placeholder="Width" type="number" className="w-full p-3 border rounded-lg pr-10" />
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">in</span>
                </div>
                <div className="relative">
                    <input required min="1" value={values.height} onChange={e => setters.setHeight(e.target.value)} placeholder="Height" type="number" className="w-full p-3 border rounded-lg pr-10" />
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">in</span>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
                <div className="flex items-center bg-white p-3 border rounded-lg sm:col-span-1">
                    <img src="/Fedex-logo.png" alt="FedEx logo"/>
                    <span className="text-base font-medium text-gray-700">{carrierDetailsMap.fedex.name}</span>
                </div>
                <select required value={values.selectedServiceCode} onChange={handleServiceChange} className="w-full p-3 border rounded-lg text-base bg-white sm:col-span-1">
                    <option value="">Select Service</option>
                    {carrierDetailsMap.fedex.services.map(s => <option key={s.serviceCode} value={s.serviceCode}>{s.name}</option>)}
                </select>
                <select required value={values.packageCode} onChange={handlePackageChange} className="w-full p-3 border rounded-lg text-base bg-white sm:col-span-1">
                    <option value="">Select Package Type</option>
                    {availablePackages.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                </select>
            </div>
        </section>
    );
};

const Summary = ({ values }) => (
    <section className="p-6 bg-gray-50 rounded-xl border">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Summary</h2>
        <div className="space-y-4 text-gray-600">
            <div>
                <h3 className="font-semibold text-gray-800">Origin</h3>
                <p>{values.originName}, {values.originStreet1}, {values.originCity}, {values.originState} {values.originZip}</p>
            </div>
            <div>
                <h3 className="font-semibold text-gray-800">Destination</h3>
                <p>{values.destinationName}, {values.destinationStreet1}, {values.destinationCity}, {values.destinationState} {values.destinationZip}</p>
            </div>
            <div>
                <h3 className="font-semibold text-gray-800">Package</h3>
                <p>{values.weight} lbs, {values.length}x{values.width}x{values.height} in</p>
            </div>
             <div>
                <h3 className="font-semibold text-gray-800">Service</h3>
                <p>{carrierDetailsMap.fedex.services.find(s => s.serviceCode === values.selectedServiceCode)?.name || 'N/A'}</p>
            </div>
        </div>
    </section>
);

const Stepper = ({ currentStep, steps }) => (
    <nav aria-label="Progress" className="pt-4">
        <ol role="list" className="space-y-4">
            <div className="flex items-center">
                {steps.map((step, stepIdx) => (
                    <li key={step.name} className={`flex-1 ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                        <div className={`text-center text-sm font-medium ${stepIdx <= currentStep ? 'text-blue-600' : 'text-gray-500'}`}>
                            {step.name}
                        </div>
                    </li>
                ))}
            </div>
            <div className="flex items-center">
                {steps.map((step, stepIdx) => (
                    <li key={step.name + '_icon'} className={`relative ${stepIdx !== steps.length - 1 ? 'flex-1' : ''}`}>
                        {stepIdx < currentStep ? (
                            <>
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="h-0.5 w-full bg-blue-600" />
                                </div>
                                <span className="relative flex h-8 w-8 items-center justify-center bg-blue-600 rounded-full text-white mx-auto">
                                    <CheckCircle className="h-5 w-5" />
                                </span>
                            </>
                        ) : stepIdx === currentStep ? (
                            <>
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="h-0.5 w-full bg-gray-200" />
                                </div>
                                <span className="relative flex h-8 w-8 items-center justify-center bg-white border-2 border-blue-600 rounded-full mx-auto">
                                    <span className="h-2.5 w-2.5 bg-blue-600 rounded-full" />
                                </span>
                            </>
                        ) : (
                            <>
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="h-0.5 w-full bg-gray-200" />
                                </div>
                                <span className="relative flex h-8 w-8 items-center justify-center bg-white border-2 border-gray-300 rounded-full mx-auto" />
                            </>
                        )}
                    </li>
                ))}
            </div>
        </ol>
    </nav>
);


// --- Main App Component ---
const App = () => {
  // Authentication State
  const [userToken, setUserToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [currentView, setCurrentView] = useState('shipping');

  // Form State
  const [step, setStep] = useState(1);
  const [originName, setOriginName] = useState('');
  const [originCompany, setOriginCompany] = useState('');
  const [originStreet1, setOriginStreet1] = useState('');
  const [originStreet2, setOriginStreet2] = useState('');
  const [originCity, setOriginCity] = useState('');
  const [originState, setOriginState] = useState('');
  const [originZip, setOriginZip] = useState('');
  
  const [destinationName, setDestinationName] = useState('');
  const [destinationCompany, setDestinationCompany] = useState('');
  const [destinationStreet1, setDestinationStreet1] = useState('');
  const [destinationStreet2, setDestinationStreet2] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [destinationState, setDestinationState] = useState('');
  const [destinationZip, setDestinationZip] = useState('');
  const [isResidential, setIsResidential] = useState(true);
  
  const [weight, setWeight] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  
  const [selectedCarrierCode] = useState('fedex');
  const [selectedCarrierId] = useState(371370); 
  const [selectedServiceCode, setSelectedServiceCode] = useState('');
  const [packageCode, setPackageCode] = useState('');

  // UI/Flow State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [shippingCost, setShippingCost] = useState(null);
  const [orderSending, setOrderSending] = useState(false);
  const [orderSendSuccess, setOrderSendSuccess] = useState('');
  
  // Authentication Listener
  useEffect(() => {
    if (process.env.NODE_ENV === 'test') {
      setAuthLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        setUserToken(idTokenResult.token);
        setUserRole(idTokenResult.claims.role || 'b2c');
        setShowLogin(false);
      } else {
        setUserToken(null);
        setUserRole(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe && unsubscribe();
  }, []);

  // Ensure only admins can access the admin dashboard
  useEffect(() => {
    if (currentView === 'admin' && userRole !== 'admin') {
      setCurrentView('shipping');
    }
  }, [currentView, userRole]);

  const handleSignOut = () => {
    signOut(auth).catch((error) => console.error("Sign out error", error));
  };

  const getShipmentDetails = () => ({
    originName, originCompany, originStreet1, originStreet2, originCity, originState, originZip,
    destinationName, destinationCompany, destinationStreet1, destinationStreet2, destinationCity, destinationState, destinationZip,
    weight, length, width, height,
    carrierCode: selectedCarrierCode,
    carrierId: selectedCarrierId,
    serviceCode: selectedServiceCode,
    packageCode: packageCode,
    isResidential,
    shippingCost,
  });

  const handleApiRequest = async (endpoint, details, requireAuth = false) => {
    const headers = { 'Content-Type': 'application/json' };
    if (userToken) {
        headers['Authorization'] = `Bearer ${userToken}`;
    } else if (requireAuth) {
        setShowLogin(true);
        throw new Error("Login required");
    }

    const response = await fetch(`${BACKEND_BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(details),
    });
    
    let result;
    try { result = await response.json(); } catch (e) { throw new Error("Server response was not valid JSON."); }
    if (!response.ok) throw new Error(result.error || `Failed to ${endpoint}.`);
    
    return result;
  };

  const handleCalculateShipping = async () => {
    setLoading(true);
    setError(''); setWarning('');
    try {
        const result = await handleApiRequest('calculate-shipping', getShipmentDetails(), false);
        setShippingCost(result.shippingCost);
    } catch (err) {
        setWarning(err.message);
    } finally {
        setLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    setOrderSending(true);
    setError(''); setWarning('');
    try {
        const result = await handleApiRequest('create-shipstation-order', getShipmentDetails(), true);
        setOrderSendSuccess(`Order created successfully! Order Number: ${result.orderNumber}`);
        setShippingCost(null);
    } catch (err) {
        if (err.message !== "Login required") {
            setError(err.message);
        }
    } finally {
        setOrderSending(false);
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);
  const steps = [{name: 'Origin'}, {name: 'Destination & Package'}, {name: 'Confirm & Create'}];

  const handleCreateAnother = () => {
    setOriginName(''); setOriginCompany(''); setOriginStreet1(''); setOriginStreet2(''); setOriginCity(''); setOriginState(''); setOriginZip('');
    setDestinationName(''); setDestinationCompany(''); setDestinationStreet1(''); setDestinationStreet2(''); setDestinationCity(''); setDestinationState(''); setDestinationZip('');
    setWeight(''); setLength(''); setWidth(''); setHeight('');
    setShippingCost(null);
    setOrderSendSuccess('');
    setStep(1);
  };

  const handleOptionChange = () => {
    setShippingCost(null);
    setOrderSendSuccess('');
  };


  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-12 w-12 text-blue-600" /></div>;
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen font-sans">
      <LoginPage show={showLogin} onClose={() => setShowLogin(false)} />

      <nav className="fixed top-0 left-0 right-0 bg-gray-700 shadow-md z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
                <div className="flex-shrink-0">
                     <img src="/logo.png" alt="Shipping Label Creator logo" className="h-12 w-auto object-contain"/>
                </div>
                <div className="flex items-center">
                    <h1 className="text-2xl lg:text-3xl font-bold text-white hidden sm:block">
                        Shipping Label Creator
                    </h1>
                    {userToken ? (
                        <>
                           {userRole === 'admin' && (
                                <button onClick={() => setCurrentView(currentView === 'admin' ? 'shipping' : 'admin')} className="ml-4 p-2 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 flex items-center">
                                    <Settings className="h-5 w-5 mr-2" />
                                    {currentView === 'admin' ? 'Go to App' : 'Dashboard'}
                                </button>
                           )}
                            <button onClick={handleSignOut} className="ml-4 p-2 rounded-full text-white hover:bg-gray-600">
                                <LogOut className="h-6 w-6" />
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setShowLogin(true)} className="ml-4 p-2 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 flex items-center">
                            <LogIn className="h-5 w-5 mr-2" /> Login
                        </button>
                    )}
                </div>
            </div>
        </div>
      </nav>
      
      <main className="pt-28 pb-8">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-full md:max-w-4xl lg:max-w-6xl border border-blue-200 mx-auto">
            {currentView === 'admin' && userRole === 'admin' ? (
                <AdminDashboard userToken={userToken} />
            ) : (
                <>
                    <div className="mb-12">
                        <Stepper currentStep={step - 1} steps={steps} />
                    </div>
                    <div className="overflow-hidden">
                        <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${(step - 1) * 100}%)` }}>
                            <div className="w-full flex-shrink-0 px-1">
                                <div className="flex flex-col space-y-8">
                                    <AddressForm 
                                        type="origin" 
                                        values={{ name: originName, company: originCompany, street1: originStreet1, street2: originStreet2, city: originCity, state: originState, zip: originZip }}
                                        setters={{ setName: setOriginName, setCompany: setOriginCompany, setStreet1: setOriginStreet1, setStreet2: setOriginStreet2, setCity: setOriginCity, setState: setOriginState, setZip: setOriginZip }}
                                    />
                                    <button onClick={nextStep} className="w-full py-4 px-6 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-lg active:scale-95 transition-transform">
                                        Next: Destination <ArrowRight className="ml-2" />
                                    </button>
                                </div>
                            </div>

                            <div className="w-full flex-shrink-0 px-1">
                                <div className="flex flex-col space-y-8">
                                    <AddressForm 
                                        type="destination" 
                                        values={{ name: destinationName, company: destinationCompany, street1: destinationStreet1, street2: destinationStreet2, city: destinationCity, state: destinationState, zip: destinationZip, isResidential: isResidential }}
                                        setters={{ setName: setDestinationName, setCompany: setDestinationCompany, setStreet1: setDestinationStreet1, setStreet2: setDestinationStreet2, setCity: setDestinationCity, setState: setDestinationState, setZip: setDestinationZip, setIsResidential: setIsResidential }}
                                    />
                                    <PackageForm 
                                        values={{ weight, length, width, height, selectedServiceCode, packageCode }}
                                        setters={{ setWeight, setLength, setWidth, setHeight, setSelectedServiceCode, setPackageCode }}
                                        onOptionChange={handleOptionChange}
                                    />
                                    <div className="flex justify-between">
                                        <button onClick={prevStep} className="py-4 px-6 rounded-lg font-bold text-gray-700 bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-lg active:scale-95 transition-transform">
                                            <ArrowLeft className="mr-2" /> Back
                                        </button>
                                        <button onClick={nextStep} className="py-4 px-6 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-lg active:scale-95 transition-transform">
                                            Next: Review & Create <ArrowRight className="ml-2" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="w-full flex-shrink-0 px-1">
                                 <div className="grid lg:grid-cols-2 gap-8">
                                    <div className="lg:col-span-1 flex flex-col space-y-8">
                                        <Summary values={getShipmentDetails()} />
                                        <button onClick={prevStep} className="w-full py-4 px-6 rounded-lg font-bold text-gray-700 bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-lg active:scale-95 transition-transform">
                                            <ArrowLeft className="mr-2" /> Back to Edit
                                        </button>
                                    </div>
                                     <div className="lg:col-span-1 flex flex-col space-y-8">
                                        <Alert type="warning" message={warning} />
                                        <Alert type="error" message={error} />
                                        <Alert type="success" message={orderSendSuccess} />
                                        
                                        {!shippingCost && !orderSendSuccess && (
                                             <button onClick={handleCalculateShipping} disabled={loading} className="w-full py-4 px-6 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-lg active:scale-95 transition-transform">
                                                {loading ? <><Loader2 className="animate-spin mr-3" size={24} />Calculating...</> : <><DollarSign className="mr-3" size={24} />Calculate Shipping</>}
                                            </button>
                                        )}

                                        {shippingCost && !orderSendSuccess && (
                                            <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
                                                <h2 className="text-2xl font-bold text-green-700 mb-3">Total Estimated Cost</h2>
                                                <p className="text-5xl font-extrabold text-green-800">${shippingCost.toFixed(2)}</p>
                                                
                                                {userToken ? (
                                                    <button onClick={handleCreateOrder} disabled={orderSending} className="mt-6 w-full py-4 px-6 rounded-lg font-bold text-white bg-purple-600 hover:bg-purple-700">
                                                        {orderSending ? 'Creating Order...' : 'Create Shipping Label'}
                                                    </button>
                                                ) : (
                                                    <button onClick={() => setShowLogin(true)} className="mt-6 w-full py-4 px-6 rounded-lg font-bold text-white bg-green-600 hover:bg-green-700">
                                                        Login to Create Label
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                        
                                        {orderSendSuccess && (
                                            <button onClick={handleCreateAnother} className="w-full py-4 px-6 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-lg active:scale-95 transition-transform">
                                                Create Another Shipment
                                            </button>
                                        )}
                                      </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
      </main>
    </div>
  );
};
export default App;
