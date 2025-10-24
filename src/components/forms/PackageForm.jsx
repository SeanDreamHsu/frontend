import React from 'react';
import { Package } from 'lucide-react';
import { carrierDetailsMap } from '../../constants';

const PackageForm = ({ values, setters, onOptionChange }) => {
  const availablePackages =
    carrierDetailsMap.fedex.services.find((s) => s.serviceCode === values.selectedServiceCode)?.packages || [];

  const handleServiceChange = (e) => {
    setters.setSelectedServiceCode(e.target.value);
    onOptionChange();
  };

  const handlePackageChange = (e) => {
    setters.setPackageCode(e.target.value);
    onOptionChange();
  };

  return (
    <section className="p-6 bg-white/90 rounded-2xl border border-sky-100 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-700 mb-6 flex items-center">
        <Package className="mr-3 text-sky-500" size={24} /> Package &amp; Carrier
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <div className="relative">
          <input
            required
            min="0.1"
            value={values.weight}
            onChange={(e) => setters.setWeight(e.target.value)}
            placeholder="Weight"
            type="number"
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 pr-12 focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
          />
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">lbs</span>
        </div>
        <div className="relative">
          <input
            required
            min="1"
            value={values.length}
            onChange={(e) => setters.setLength(e.target.value)}
            placeholder="Length"
            type="number"
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 pr-10 focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
          />
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">in</span>
        </div>
        <div className="relative">
          <input
            required
            min="1"
            value={values.width}
            onChange={(e) => setters.setWidth(e.target.value)}
            placeholder="Width"
            type="number"
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 pr-10 focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
          />
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">in</span>
        </div>
        <div className="relative">
          <input
            required
            min="1"
            value={values.height}
            onChange={(e) => setters.setHeight(e.target.value)}
            placeholder="Height"
            type="number"
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 pr-10 focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
          />
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">in</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
        <div className="flex items-center bg-white/80 p-3 border border-slate-200 rounded-xl sm:col-span-1">
          <img src="/Fedex-logo.png" alt="FedEx logo" />
          <span className="ml-3 text-base font-medium text-slate-600">{carrierDetailsMap.fedex.name}</span>
        </div>
        <select
          required
          value={values.selectedServiceCode}
          onChange={handleServiceChange}
          className="w-full p-3 border border-slate-200 rounded-xl text-base bg-white focus:ring-2 focus:ring-sky-200 focus:border-sky-400 sm:col-span-1"
        >
          <option value="">Select Service</option>
          {carrierDetailsMap.fedex.services.map((s) => (
            <option key={s.serviceCode} value={s.serviceCode}>
              {s.name}
            </option>
          ))}
        </select>
        <select
          required
          value={values.packageCode}
          onChange={handlePackageChange}
          className="w-full p-3 border border-slate-200 rounded-xl text-base bg-white focus:ring-2 focus:ring-sky-200 focus:border-sky-400 sm:col-span-1"
        >
          <option value="">Select Package Type</option>
          {availablePackages.map((p) => (
            <option key={p.code} value={p.code}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
};

export default PackageForm;
