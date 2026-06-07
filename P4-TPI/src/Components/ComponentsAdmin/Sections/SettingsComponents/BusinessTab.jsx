import React from 'react';
import { IconMail, IconPhone, IconMapPin, IconGlobe, IconInstagram } from './SettingsIcons';
import { IconEdit } from '../ManagmentBusinessComponents/Icons';

const BusinessTab = () => {
  return (
    <div className="bg-white rounded-2xl border border-[#e2ddd8] p-6 max-w-3xl">
      <h2 className="text-lg font-semibold text-[#1a1a2e]">Business Information</h2>
      <p className="text-sm text-[#9a9a9a] mb-6 mt-1">Edit all the data of your business profile.</p>
      
      {/* Form Grid */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
        <div>
          <label className="block text-xs font-semibold text-[#1a1a2e] mb-2">Business name</label>
          <input 
            type="text" 
            defaultValue="Barber Home" 
            className="w-full border-b border-[#e2ddd8] pb-2 text-sm text-[#1a1a2e] focus:outline-none focus:border-[#1a1a2e] transition-colors bg-transparent" 
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#1a1a2e] mb-2">Category</label>
          <input 
            type="text" 
            defaultValue="Barbershop" 
            className="w-full border-b border-[#e2ddd8] pb-2 text-sm text-[#1a1a2e] focus:outline-none focus:border-[#1a1a2e] transition-colors bg-transparent" 
          />
        </div>
        
        <div className="col-span-2 relative">
          <label className="block text-xs font-semibold text-[#1a1a2e] mb-2">Description</label>
          <div className="relative">
            <textarea 
              defaultValue="Barber Home es una cadena de barberías que trabaja en la estética masculina. Estamos en el rubro desde hace 8 años formando equipos de profesionales en constante capacitación con el fin de brindar un servicio de alta calidad." 
              className="w-full border-b border-[#e2ddd8] pb-2 pr-6 text-sm text-[#5a5a6e] focus:outline-none focus:border-[#1a1a2e] transition-colors resize-none h-16 bg-transparent" 
            />
            <div className="absolute bottom-2 right-0 text-[#9a9a9a]">
              <IconEdit />
            </div>
          </div>
        </div>
        
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-[#1a1a2e] mb-2">
            <IconMail /> Email
          </label>
          <input 
            type="email" 
            defaultValue="contacto@barberhome.com" 
            className="w-full border-b border-[#e2ddd8] pb-2 text-sm text-[#1a1a2e] focus:outline-none focus:border-[#1a1a2e] transition-colors bg-transparent" 
          />
        </div>
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-[#1a1a2e] mb-2">
            <IconPhone /> Phone
          </label>
          <input 
            type="text" 
            defaultValue="+54 341 6504040" 
            className="w-full border-b border-[#e2ddd8] pb-2 text-sm text-[#1a1a2e] focus:outline-none focus:border-[#1a1a2e] transition-colors bg-transparent" 
          />
        </div>
        
        <div className="col-span-2">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-[#1a1a2e] mb-2">
            <IconMapPin /> Address
          </label>
          <input 
            type="text" 
            defaultValue="Italia 123, Centro, Rosario, Argentina" 
            className="w-full border-b border-[#e2ddd8] pb-2 text-sm text-[#1a1a2e] focus:outline-none focus:border-[#1a1a2e] transition-colors bg-transparent" 
          />
        </div>
        
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-[#1a1a2e] mb-2">
            <IconGlobe /> Website
          </label>
          <input 
            type="text" 
            defaultValue="www.barberhome.com" 
            className="w-full border-b border-[#e2ddd8] pb-2 text-sm text-[#1a1a2e] focus:outline-none focus:border-[#1a1a2e] transition-colors bg-transparent" 
          />
        </div>
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-[#1a1a2e] mb-2">
            <IconInstagram /> Instagram
          </label>
          <input 
            type="text" 
            defaultValue="@barberhome" 
            className="w-full border-b border-[#e2ddd8] pb-2 text-sm text-[#1a1a2e] focus:outline-none focus:border-[#1a1a2e] transition-colors bg-transparent" 
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-3 mt-10">
        <button className="px-4 py-2 text-sm font-semibold text-[#1a1a2e] bg-[#f0ede8] rounded-xl hover:bg-[#e2ddd8] transition-colors">
          Cancel
        </button>
        <button className="px-4 py-2 text-sm font-semibold text-white bg-[#1a1a2e] rounded-xl hover:bg-[#2d2d44] transition-colors">
          Save changes
        </button>
      </div>
    </div>
  );
};

export default BusinessTab;
