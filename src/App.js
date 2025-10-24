import React, { useCallback, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
  DollarSign,
  Loader2,
  Send,
  ArrowLeft,
  ArrowRight,
  LogOut,
  LogIn,
  Settings,
} from 'lucide-react';

import LoginPage from './components/LoginPage';
import Alert from './components/Alert';
import AddressForm from './components/forms/AddressForm';
import PackageForm from './components/forms/PackageForm';
import Summary from './components/Summary';
import Stepper from './components/Stepper';
import AdminRoute from './components/admin/AdminRoute';
import AdminDashboard from './components/admin/AdminDashboard';
import { auth } from './lib/firebase';
import { deriveRoleFromClaims } from './utils/auth';
import { BACKEND_BASE_URL } from './constants';

const App = () => {
  const [userToken, setUserToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [shippingCost, setShippingCost] = useState(null);
  const [baseShippingCost, setBaseShippingCost] = useState(null);
  const [serviceFee, setServiceFee] = useState(3);
  const [appliedServiceFee, setAppliedServiceFee] = useState(0);
  const [orderSending, setOrderSending] = useState(false);
  const [orderSendSuccess, setOrderSendSuccess] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const steps = [{ name: 'Origin' }, { name: 'Destination & Package' }, { name: 'Confirm & Create' }];

  useEffect(() => {
    if (process.env.NODE_ENV === 'test') {
      setAuthLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        const claims = idTokenResult?.claims ?? {};
        const derivedRole = deriveRoleFromClaims(claims);
        const normalizedRole = derivedRole ? String(derivedRole).trim().toLowerCase() : null;

        setUserToken(idTokenResult.token);
        setUserRole(normalizedRole || 'b2c');
        setShowLogin(false);
      } else {
        setUserToken(null);
        setUserRole(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe && unsubscribe();
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith('/admin') && !userToken) {
      setShowLogin(true);
    }
  }, [location.pathname, userToken]);

  const handleAdminNavigation = () => {
    navigate(isAdminRoute ? '/' : '/admin');
  };

  const handleSignOut = () => {
    signOut(auth).catch((signOutError) => console.error('Sign out error', signOutError));
  };

  const getShipmentDetails = () => ({
    originName,
    originCompany,
    originStreet1,
    originStreet2,
    originCity,
    originState,
    originZip,
    destinationName,
    destinationCompany,
    destinationStreet1,
    destinationStreet2,
    destinationCity,
    destinationState,
    destinationZip,
    weight,
    length,
    width,
    height,
    carrierCode: selectedCarrierCode,
    carrierId: selectedCarrierId,
    serviceCode: selectedServiceCode,
    packageCode,
    isResidential,
    shippingCost,
    baseShippingCost,
    serviceFee: appliedServiceFee,
  });

  const handleApiRequest = async (endpoint, details, requireAuth = false) => {
    const headers = { 'Content-Type': 'application/json' };
    if (userToken) {
      headers.Authorization = `Bearer ${userToken}`;
    } else if (requireAuth) {
      setShowLogin(true);
      throw new Error('Login required');
    }

    const response = await fetch(`${BACKEND_BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(details),
    });

    let result;
    try {
      result = await response.json();
    } catch (parseError) {
      throw new Error('Server response was not valid JSON.');
    }

    if (!response.ok) {
      throw new Error(result.error || `Failed to ${endpoint}.`);
    }

    return result;
  };

  const fetchServiceFee = useCallback(async (role) => {
    if (process.env.NODE_ENV === 'test') return;

    try {
      const response = await fetch(`${BACKEND_BASE_URL}/settings/service-fee?role=${role}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch service fee: ${response.status}`);
      }

      let data;
      try {
        data = await response.json();
      } catch (err) {
        throw new Error('Service fee response was not valid JSON.');
      }

      if (typeof data.serviceFee === 'number') {
        setServiceFee(data.serviceFee);
      }
    } catch (err) {
      console.error('Error fetching service fee', err);
    }
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'test') return;
    const role = userRole || 'b2c';
    fetchServiceFee(role);
  }, [fetchServiceFee, userRole]);

  const handleCalculateShipping = async () => {
    setLoading(true);
    setError('');
    setWarning('');
    try {
      const result = await handleApiRequest('calculate-shipping', getShipmentDetails(), false);
      const apiBaseCost = Number(result.baseShippingCost ?? result.shippingCost ?? 0);
      const apiServiceFee = Number(result.serviceFee ?? result.service_fee ?? result.additionalFee ?? Number.NaN);

      const effectiveServiceFee = Number.isFinite(apiServiceFee)
        ? apiServiceFee
        : typeof serviceFee === 'number'
        ? serviceFee
        : parseFloat(serviceFee) || 0;
      const totalCost = apiBaseCost + (effectiveServiceFee || 0);

      setBaseShippingCost(apiBaseCost);
      setAppliedServiceFee(effectiveServiceFee);
      setShippingCost(totalCost);
    } catch (err) {
      setWarning(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    setOrderSending(true);
    setError('');
    setWarning('');
    try {
      const result = await handleApiRequest('create-shipstation-order', getShipmentDetails(), true);
      setOrderSendSuccess(`Order created successfully! Order Number: ${result.orderNumber}`);
      setShippingCost(null);
      setBaseShippingCost(null);
      setAppliedServiceFee(0);
    } catch (err) {
      if (err.message !== 'Login required') {
        setError(err.message);
      }
    } finally {
      setOrderSending(false);
    }
  };

  const nextStep = () => setStep((current) => current + 1);
  const prevStep = () => setStep((current) => current - 1);

  const handleCreateAnother = () => {
    setOriginName('');
    setOriginCompany('');
    setOriginStreet1('');
    setOriginStreet2('');
    setOriginCity('');
    setOriginState('');
    setOriginZip('');
    setDestinationName('');
    setDestinationCompany('');
    setDestinationStreet1('');
    setDestinationStreet2('');
    setDestinationCity('');
    setDestinationState('');
    setDestinationZip('');
    setIsResidential(true);
    setWeight('');
    setLength('');
    setWidth('');
    setHeight('');
    setSelectedServiceCode('');
    setPackageCode('');
    setShippingCost(null);
    setBaseShippingCost(null);
    setAppliedServiceFee(0);
    setOrderSendSuccess('');
    setStep(1);
  };

  const handleOptionChange = () => {
    setShippingCost(null);
    setBaseShippingCost(null);
    setAppliedServiceFee(0);
    setOrderSendSuccess('');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-sky-50 to-emerald-50">
        <Loader2 className="animate-spin h-12 w-12 text-sky-500" />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white via-sky-50 to-emerald-50 min-h-screen font-sans text-slate-700">
      <LoginPage show={showLogin} onClose={() => setShowLogin(false)} />

      <nav className="fixed top-0 left-0 right-0 bg-sky-900/95 backdrop-blur border-b border-sky-800 shadow-lg z-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <img src="/logo.png" alt="Company Logo" className="h-12 w-auto object-contain" />
            </div>
            <div className="flex items-center text-white">
              <h1 className="text-2xl lg:text-3xl font-bold hidden sm:block">Shipping Label Creator</h1>
              {userToken ? (
                <>
                  {userRole === 'admin' && (
                    <button
                      onClick={handleAdminNavigation}
                      className="ml-4 py-2 px-4 rounded-full font-semibold bg-sky-500 hover:bg-sky-400 flex items-center shadow-sm"
                    >
                      <Settings className="h-5 w-5 mr-2" />
                      {isAdminRoute ? 'Go to App' : 'Dashboard'}
                    </button>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="ml-4 p-2 rounded-full text-white/90 hover:bg-white/10 transition-colors"
                  >
                    <LogOut className="h-6 w-6" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="ml-4 py-2 px-4 rounded-full text-white font-semibold bg-sky-500 hover:bg-sky-400 flex items-center shadow-sm"
                >
                  <LogIn className="h-5 w-5 mr-2" /> Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-8">
        <div className="bg-white/90 p-6 sm:p-10 rounded-3xl shadow-xl w-full max-w-full md:max-w-4xl lg:max-w-6xl border border-sky-100 mx-auto backdrop-blur">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <div className="mb-12">
                    <Stepper currentStep={step - 1} steps={steps} />
                  </div>
                  <div className="overflow-hidden">
                    <div
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
                    >
                      <div className="w-full flex-shrink-0 px-1">
                        <div className="flex flex-col space-y-8">
                          <AddressForm
                            type="origin"
                            values={{
                              name: originName,
                              company: originCompany,
                              street1: originStreet1,
                              street2: originStreet2,
                              city: originCity,
                              state: originState,
                              zip: originZip,
                            }}
                            setters={{
                              setName: setOriginName,
                              setCompany: setOriginCompany,
                              setStreet1: setOriginStreet1,
                              setStreet2: setOriginStreet2,
                              setCity: setOriginCity,
                              setState: setOriginState,
                              setZip: setOriginZip,
                            }}
                          />
                          <button
                            onClick={nextStep}
                            className="w-full py-4 px-6 rounded-full font-semibold text-white bg-sky-500 hover:bg-sky-400 flex items-center justify-center text-lg active:scale-95 transition-transform shadow-sm"
                          >
                            Next: Destination <ArrowRight className="ml-2" />
                          </button>
                        </div>
                      </div>

                      <div className="w-full flex-shrink-0 px-1">
                        <div className="flex flex-col space-y-8">
                          <AddressForm
                            type="destination"
                            values={{
                              name: destinationName,
                              company: destinationCompany,
                              street1: destinationStreet1,
                              street2: destinationStreet2,
                              city: destinationCity,
                              state: destinationState,
                              zip: destinationZip,
                              isResidential,
                            }}
                            setters={{
                              setName: setDestinationName,
                              setCompany: setDestinationCompany,
                              setStreet1: setDestinationStreet1,
                              setStreet2: setDestinationStreet2,
                              setCity: setDestinationCity,
                              setState: setDestinationState,
                              setZip: setDestinationZip,
                              setIsResidential,
                            }}
                          />
                          <PackageForm
                            values={{ weight, length, width, height, selectedServiceCode, packageCode }}
                            setters={{
                              setWeight,
                              setLength,
                              setWidth,
                              setHeight,
                              setSelectedServiceCode,
                              setPackageCode,
                            }}
                            onOptionChange={handleOptionChange}
                          />
                          <div className="flex justify-between gap-4">
                            <button
                              onClick={prevStep}
                              className="flex-1 py-4 px-6 rounded-full font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-lg active:scale-95 transition-transform shadow-sm"
                            >
                              <ArrowLeft className="mr-2" /> Back
                            </button>
                            <button
                              onClick={nextStep}
                              className="flex-1 py-4 px-6 rounded-full font-semibold text-white bg-sky-500 hover:bg-sky-400 flex items-center justify-center text-lg active:scale-95 transition-transform shadow-sm"
                            >
                              Next: Review &amp; Create <ArrowRight className="ml-2" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="w-full flex-shrink-0 px-1">
                        <div className="grid lg:grid-cols-2 gap-8">
                          <div className="lg:col-span-1 flex flex-col space-y-8">
                            <Summary values={getShipmentDetails()} />
                            <button
                              onClick={prevStep}
                              className="w-full py-4 px-6 rounded-full font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-lg active:scale-95 transition-transform shadow-sm"
                            >
                              <ArrowLeft className="mr-2" /> Back to Edit
                            </button>
                          </div>
                          <div className="lg:col-span-1 flex flex-col space-y-8">
                            <Alert type="warning" message={warning} />
                            <Alert type="error" message={error} />
                            <Alert type="success" message={orderSendSuccess} />

                            {shippingCost === null && !orderSendSuccess && (
                              <button
                                onClick={handleCalculateShipping}
                                disabled={loading}
                                className="w-full py-4 px-6 rounded-full font-semibold text-white bg-sky-500 hover:bg-sky-400 flex items-center justify-center text-lg active:scale-95 transition-transform shadow-sm disabled:bg-slate-300 disabled:text-slate-500"
                              >
                                {loading ? (
                                  <>
                                    <Loader2 className="animate-spin mr-3" size={24} />Calculating...
                                  </>
                                ) : (
                                  <>
                                    <DollarSign className="mr-3" size={24} />Calculate Shipping
                                  </>
                                )}
                              </button>
                            )}

                            {shippingCost !== null && !orderSendSuccess && (
                              <div className="text-center p-6 bg-emerald-50 rounded-2xl border border-emerald-200 shadow-sm">
                                <h2 className="text-2xl font-bold text-emerald-700 mb-3">Total Estimated Cost</h2>
                                <p className="text-5xl font-extrabold text-emerald-800">${shippingCost.toFixed(2)}</p>
                                <div className="mt-4 text-emerald-700 space-y-1">
                                  <p>Base Rate: ${baseShippingCost?.toFixed(2) ?? '—'}</p>
                                  <p>Service Fee: ${appliedServiceFee.toFixed(2)}</p>
                                </div>
                                <button
                                  onClick={handleCreateOrder}
                                  disabled={orderSending}
                                  className="mt-6 w-full py-4 px-6 rounded-full font-semibold text-white bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center text-lg active:scale-95 transition-transform shadow-sm disabled:bg-slate-300 disabled:text-slate-500"
                                >
                                  {orderSending ? (
                                    <>
                                      <Loader2 className="animate-spin mr-3" size={24} />Processing...
                                    </>
                                  ) : (
                                    <>
                                      <Send className="mr-3" size={24} />Create Shipping Label
                                    </>
                                  )}
                                </button>
                              </div>
                            )}

                            {orderSendSuccess && (
                              <div className="text-center p-6 bg-emerald-50 rounded-2xl border border-emerald-200 shadow-sm">
                                <h2 className="text-2xl font-bold text-emerald-700 mb-3">Shipping Label Created!</h2>
                                <p className="text-emerald-700">{orderSendSuccess}</p>
                                <button
                                  onClick={handleCreateAnother}
                                  className="mt-6 w-full py-4 px-6 rounded-full font-semibold text-white bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center text-lg active:scale-95 transition-transform shadow-sm"
                                >
                                  Create Another Shipment
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute userRole={userRole} userToken={userToken}>
                  <AdminDashboard userToken={userToken} />
                </AdminRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default App;
