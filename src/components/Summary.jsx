import React from 'react';
import { carrierDetailsMap } from '../constants';

const Summary = ({ values }) => (
  <section className="p-6 bg-white/90 rounded-2xl border border-sky-100 shadow-sm">
    <h2 className="text-2xl font-semibold text-slate-700 mb-6">Summary</h2>
    <div className="space-y-4 text-slate-600">
      <div>
        <h3 className="font-semibold text-slate-700">Origin</h3>
        <p>
          {values.originName}, {values.originStreet1}, {values.originCity}, {values.originState}{' '}
          {values.originZip}
        </p>
      </div>
      <div>
        <h3 className="font-semibold text-slate-700">Destination</h3>
        <p>
          {values.destinationName}, {values.destinationStreet1}, {values.destinationCity},{' '}
          {values.destinationState} {values.destinationZip}
        </p>
      </div>
      <div>
        <h3 className="font-semibold text-slate-700">Package</h3>
        <p>
          {values.weight} lbs, {values.length}x{values.width}x{values.height} in
        </p>
      </div>
      <div>
        <h3 className="font-semibold text-slate-700">Service</h3>
        <p>
          {carrierDetailsMap.fedex.services.find((s) => s.serviceCode === values.selectedServiceCode)?.name || 'N/A'}
        </p>
      </div>
    </div>
  </section>
);

export default Summary;
