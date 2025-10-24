import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Loader2, MapPin } from 'lucide-react';
import { fetchAddressSuggestions } from '../../services/address';
import { usStates } from '../../constants';
import debounce from '../../utils/debounce';

const AddressForm = ({ type, values, setters }) => {
  const title = type.charAt(0).toUpperCase() + type.slice(1);
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const suggestionsRef = useRef(null);

  const debouncedFetch = useCallback(
    debounce(async (query) => {
      if (query.length < 3) {
        setSuggestions([]);
        setIsSearching(false);
        return;
      }
      setIsSearching(true);
      const result = await fetchAddressSuggestions(query);
      setSuggestions(result);
      setIsSearching(false);
    }, 500),
    []
  );

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
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section className="p-6 bg-white/90 rounded-2xl border border-sky-100 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-700 mb-6 flex items-center">
        <MapPin className="mr-3 text-sky-500" size={24} /> {title} Info
      </h2>
      <div className="grid grid-cols-1 gap-6">
        <input
          required
          value={values.name}
          onChange={(e) => setters.setName(e.target.value)}
          placeholder="Name"
          className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
        />
        <input
          value={values.company}
          onChange={(e) => setters.setCompany(e.target.value)}
          placeholder="Company (Optional)"
          className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
        />
        <div className="relative" ref={suggestionsRef}>
          <input
            required
            value={values.street1}
            onChange={handleStreet1Change}
            placeholder="Street 1"
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
          />
          {isSearching && <Loader2 className="animate-spin absolute right-3 top-3 h-5 w-5 text-sky-500" />}
          {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-sky-100 rounded-xl mt-1 shadow-lg max-h-60 overflow-y-auto">
              {suggestions.map((s, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(s)}
                  className="p-3 hover:bg-sky-50 cursor-pointer"
                >
                  {s.description}
                </li>
              ))}
            </ul>
          )}
        </div>
        <input
          value={values.street2}
          onChange={(e) => setters.setStreet2(e.target.value)}
          placeholder="Street 2"
          className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <input
            required
            value={values.city}
            onChange={(e) => setters.setCity(e.target.value)}
            placeholder="City"
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
          />
          <select
            required
            value={values.state}
            onChange={(e) => setters.setState(e.target.value)}
            className="w-full p-3 border border-slate-200 rounded-xl bg-white text-base focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
          >
            <option value="">Select State</option>
            {usStates.map((state) => (
              <option key={state.abbreviation} value={state.abbreviation}>
                {state.abbreviation}
              </option>
            ))}
          </select>
          <input
            required
            value={values.zip}
            onChange={(e) => setters.setZip(e.target.value)}
            placeholder="Zip Code"
            pattern="[0-9]{5}"
            title="Enter a 5-digit zip code"
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
          />
        </div>
        {type === 'destination' && (
          <div className="mt-4">
            <label className="block text-base font-medium text-slate-600 mb-2">Address Type</label>
            <div className="flex items-center">
              <button
                type="button"
                role="switch"
                aria-checked={!values.isResidential}
                onClick={() => setters.setIsResidential(!values.isResidential)}
                className={`${!values.isResidential ? 'bg-sky-500' : 'bg-slate-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-200 focus:ring-offset-2`}
              >
                <span
                  aria-hidden="true"
                  className={`${!values.isResidential ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
              <span className="ml-3 text-base font-medium text-slate-700">Commercial</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AddressForm;
