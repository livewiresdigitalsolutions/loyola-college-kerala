// "use client";

// import { toast } from 'react-hot-toast';

// interface ContactFamilyTabProps {
//   form: any;
//   isFormLocked: boolean;
//   handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
// }

// export default function ContactFamilyTab({
//   form,
//   isFormLocked,
//   handleChange,
// }: ContactFamilyTabProps) {
//   const copyCommunicationToPermanent = () => {
//     // This will be handled by parent component
//     toast.success("Address copied!");
//   };

//   return (
//     <div className="space-y-8 animate-fadeIn">
//       {/* Contact Information */}
//       <div>
//         <h3 className="text-lg font-bold text-black mb-4 pb-2 border-b border-blue-200">
//           Contact Information
//         </h3>
//         <div className="grid md:grid-cols-2 gap-4 mt-4">
//           <div>
//             <label className="block text-sm font-semibold text-black mb-2">
//               Mobile Number *
//             </label>
//             <input
//               type="tel"
//               name="mobile"
//               value={form.mobile}
//               onChange={handleChange}
//               disabled={isFormLocked}
//               required
//               maxLength={10}
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
//               placeholder="10-digit mobile number"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-black mb-2">
//               Email Address *
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//               disabled={isFormLocked}
//               required
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
//               placeholder="your.email@example.com"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Communication Address */}
//       <div>
//         <h3 className="text-lg font-bold text-black mb-4 pb-2 border-b border-blue-200">
//           Communication Address
//         </h3>
//         <div className="grid md:grid-cols-2 gap-4 mt-4">
//           <div className="md:col-span-2">
//             <label className="block text-sm font-semibold text-black mb-2">
//               Address *
//             </label>
//             <textarea
//               name="communication_address"
//               value={form.communication_address}
//               onChange={handleChange}
//               disabled={isFormLocked}
//               required
//               rows={3}
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
//               placeholder="Enter your full address"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-black mb-2">
//               City *
//             </label>
//             <input
//               type="text"
//               name="communication_city"
//               value={form.communication_city}
//               onChange={handleChange}
//               disabled={isFormLocked}
//               required
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-black mb-2">
//               District *
//             </label>
//             <input
//               type="text"
//               name="communication_district"
//               value={form.communication_district}
//               onChange={handleChange}
//               disabled={isFormLocked}
//               required
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-black mb-2">
//               State *
//             </label>
//             <input
//               type="text"
//               name="communication_state"
//               value={form.communication_state}
//               onChange={handleChange}
//               disabled={isFormLocked}
//               required
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-black mb-2">
//               PIN Code *
//             </label>
//             <input
//               type="text"
//               name="communication_pincode"
//               value={form.communication_pincode}
//               onChange={handleChange}
//               disabled={isFormLocked}
//               required
//               maxLength={6}
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
//               placeholder="6-digit PIN code"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-black mb-2">
//               Country *
//             </label>
//             <input
//               type="text"
//               name="communication_country"
//               value={form.communication_country}
//               onChange={handleChange}
//               disabled={isFormLocked}
//               required
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Permanent Address */}
//       <div>
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-lg font-bold text-black pb-2 border-b border-blue-200 flex-1">
//             Permanent Address
//           </h3>
//           {!isFormLocked && (
//             <button
//               type="button"
//               onClick={() => {
//                 // Trigger copy from parent
//                 const event = new CustomEvent('copyAddress');
//                 window.dispatchEvent(event);
//               }}
//               className="ml-4 text-sm text-blue-600 hover:text-blue-700 font-semibold"
//             >
//               Same as Communication Address
//             </button>
//           )}
//         </div>
        
//         <div className="grid md:grid-cols-2 gap-4 mt-4">
//           <div className="md:col-span-2">
//             <label className="block text-sm font-semibold text-black mb-2">
//               Address *
//             </label>
//             <textarea
//               name="permanent_address"
//               value={form.permanent_address}
//               onChange={handleChange}
//               disabled={isFormLocked}
//               required
//               rows={3}
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-black mb-2">
//               City *
//             </label>
//             <input
//               type="text"
//               name="permanent_city"
//               value={form.permanent_city}
//               onChange={handleChange}
//               disabled={isFormLocked}
//               required
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-black mb-2">
//               District *
//             </label>
//             <input
//               type="text"
//               name="permanent_district"
//               value={form.permanent_district}
//               onChange={handleChange}
//               disabled={isFormLocked}
//               required
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-black mb-2">
//               State *
//             </label>
//             <input
//               type="text"
//               name="permanent_state"
//               value={form.permanent_state}
//               onChange={handleChange}
//               disabled={isFormLocked}
//               required
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-black mb-2">
//               PIN Code *
//             </label>
//             <input
//               type="text"
//               name="permanent_pincode"
//               value={form.permanent_pincode}
//               onChange={handleChange}
//               disabled={isFormLocked}
//               required
//               maxLength={6}
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
//               placeholder="6-digit PIN code"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-black mb-2">
//               Country *
//             </label>
//             <input
//               type="text"
//               name="permanent_country"
//               value={form.permanent_country}
//               onChange={handleChange}
//               disabled={isFormLocked}
//               required
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Family Information */}
//       <div>
//         <h3 className="text-lg font-bold text-black mb-4 pb-2 border-b border-blue-200">
//           Family Information
//         </h3>
//         <div className="grid md:grid-cols-2 gap-4 mt-4">
//           {/* Father's Details */}
//           <div className="md:col-span-2">
//             <h4 className="font-semibold text-gray-700 mb-3">Father's Details</h4>
//           </div>
          
//           <div>
//             <label className="block text-sm font-semibold text-black mb-2">
//               Father's Name *
//             </label>
//             <input
//               type="text"
//               name="father_name"
//               value={form.father_name}
//               onChange={handleChange}
//               disabled={isFormLocked}
//               required
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-black mb-2">
//               Father's Mobile *
//             </label>
//             <input
//               type="tel"
//               name="father_mobile"
//               value={form.father_mobile}
//               onChange={handleChange}
//               disabled={isFormLocked}
//               required
//               maxLength={10}
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-black mb-2">
//               Father's Education *
//             </label>
//             <input
//               type="text"
//               name="father_education"
//               value={form.father_education}
//               onChange={handleChange}
//               disabled={isFormLocked}
//               required
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-black mb-2">
//               Father's Occupation *
//             </label>
//             <input
//               type="text"
//               name="father_occupation"
//               value={form.father_occupation}
//               onChange={handleChange}
//               disabled={isFormLocked}
//               required
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
//             />
//           </div>

//           {/* Mother's Details */}
//           <div className="md:col-span-2 mt-4">
//             <h4 className="font-semibold text-gray-700 mb-3">Mother's Details</h4>
//           </div>
          
//           <div>
//             <label className="block text-sm font-semibold text-black mb-2">
//               Mother's Name *
//             </label>
//             <input
//               type="text"
//               name="mother_name"
//               value={form.mother_name}
//               onChange={handleChange}
//               disabled={isFormLocked}
//               required
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-black mb-2">
//               Mother's Mobile *
//             </label>
//             <input
//               type="tel"
//               name="mother_mobile"
//               value={form.mother_mobile}
//               onChange={handleChange}
//               disabled={isFormLocked}
//               required
//               maxLength={10}
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-black mb-2">
//               Mother's Education *
//             </label>
//             <input
//               type="text"
//               name="mother_education"
//               value={form.mother_education}
//               onChange={handleChange}
//               disabled={isFormLocked}
//               required
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-black mb-2">
//               Mother's Occupation *
//             </label>
//             <input
//               type="text"
//               name="mother_occupation"
//               value={form.mother_occupation}
//               onChange={handleChange}
//               disabled={isFormLocked}
//               required
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-black mb-2">
//               Annual Family Income *
//             </label>
//             <input
//               type="text"
//               name="annual_family_income"
//               value={form.annual_family_income}
//               onChange={handleChange}
//               disabled={isFormLocked}
//               required
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
//               placeholder="e.g., 500000"
//             />
//           </div>

//           {/* Emergency Contact */}
//           <div className="md:col-span-2 mt-4">
//             <h4 className="font-semibold text-gray-700 mb-3">Emergency Contact</h4>
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-black mb-2">
//               Emergency Contact Name *
//             </label>
//             <input
//               type="text"
//               name="emergency_contact_name"
//               value={form.emergency_contact_name}
//               onChange={handleChange}
//               disabled={isFormLocked}
//               required
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-black mb-2">
//               Relation *
//             </label>
//             <input
//               type="text"
//               name="emergency_contact_relation"
//               value={form.emergency_contact_relation}
//               onChange={handleChange}
//               disabled={isFormLocked}
//               required
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
//               placeholder="e.g., Uncle, Aunt"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-black mb-2">
//               Emergency Contact Mobile *
//             </label>
//             <input
//               type="tel"
//               name="emergency_contact_mobile"
//               value={form.emergency_contact_mobile}
//               onChange={handleChange}
//               disabled={isFormLocked}
//               required
//               maxLength={10}
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }














"use client";

import { toast } from 'react-hot-toast';

interface ContactFamilyTabProps {
  form: any;
  isFormLocked: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

// Indian States and Union Territories List
const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
];

export default function ContactFamilyTab({
  form,
  isFormLocked,
  handleChange,
}: ContactFamilyTabProps) {
  const copyCommunicationToPermanent = () => {
    // This will be handled by parent component
    toast.success("Address copied!");
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-bold text-black mb-4 pb-2 border-b border-blue-200">
          Contact Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Mobile Number *
            </label>
            <input
              type="tel"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              maxLength={10}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="10-digit mobile number"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="your.email@example.com"
            />
          </div>
        </div>
      </div>

      {/* Communication Address */}
      <div>
        <h3 className="text-lg font-bold text-black mb-4 pb-2 border-b border-blue-200">
          Communication Address
        </h3>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-black mb-2">
              Address *
            </label>
            <textarea
              name="communication_address"
              value={form.communication_address}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Enter your full address"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              City *
            </label>
            <input
              type="text"
              name="communication_city"
              value={form.communication_city}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              District *
            </label>
            <input
              type="text"
              name="communication_district"
              value={form.communication_district}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              State *
            </label>
            <select
              name="communication_state"
              value={form.communication_state}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select State *</option>
              {INDIAN_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              PIN Code *
            </label>
            <input
              type="text"
              name="communication_pincode"
              value={form.communication_pincode}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              maxLength={6}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="6-digit PIN code"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Country *
            </label>
            <input
              type="text"
              name="communication_country"
              value={form.communication_country}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Permanent Address */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-black pb-2 border-b border-blue-200 flex-1">
            Permanent Address
          </h3>
          {!isFormLocked && (
            <button
              type="button"
              onClick={() => {
                // Trigger copy from parent
                const event = new CustomEvent('copyAddress');
                window.dispatchEvent(event);
              }}
              className="ml-4 text-sm text-blue-600 hover:text-blue-700 font-semibold"
            >
              Same as Communication Address
            </button>
          )}
        </div>
        
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-black mb-2">
              Address *
            </label>
            <textarea
              name="permanent_address"
              value={form.permanent_address}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              City *
            </label>
            <input
              type="text"
              name="permanent_city"
              value={form.permanent_city}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              District *
            </label>
            <input
              type="text"
              name="permanent_district"
              value={form.permanent_district}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              State *
            </label>
            <select
              name="permanent_state"
              value={form.permanent_state}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select State *</option>
              {INDIAN_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              PIN Code *
            </label>
            <input
              type="text"
              name="permanent_pincode"
              value={form.permanent_pincode}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              maxLength={6}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="6-digit PIN code"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Country *
            </label>
            <input
              type="text"
              name="permanent_country"
              value={form.permanent_country}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Family Information */}
      <div>
        <h3 className="text-lg font-bold text-black mb-4 pb-2 border-b border-blue-200">
          Family Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {/* Father's Details */}
          <div className="md:col-span-2">
            <h4 className="font-semibold text-gray-700 mb-3">Father's Details</h4>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Father's Name *
            </label>
            <input
              type="text"
              name="father_name"
              value={form.father_name}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Father's Mobile *
            </label>
            <input
              type="tel"
              name="father_mobile"
              value={form.father_mobile}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              maxLength={10}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Father's Education *
            </label>
            <input
              type="text"
              name="father_education"
              value={form.father_education}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Father's Occupation *
            </label>
            <input
              type="text"
              name="father_occupation"
              value={form.father_occupation}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* Mother's Details */}
          <div className="md:col-span-2 mt-4">
            <h4 className="font-semibold text-gray-700 mb-3">Mother's Details</h4>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Mother's Name *
            </label>
            <input
              type="text"
              name="mother_name"
              value={form.mother_name}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Mother's Mobile *
            </label>
            <input
              type="tel"
              name="mother_mobile"
              value={form.mother_mobile}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              maxLength={10}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Mother's Education *
            </label>
            <input
              type="text"
              name="mother_education"
              value={form.mother_education}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Mother's Occupation *
            </label>
            <input
              type="text"
              name="mother_occupation"
              value={form.mother_occupation}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Annual Family Income *
            </label>
            <input
              type="text"
              name="annual_family_income"
              value={form.annual_family_income}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="e.g., 500000"
            />
          </div>

          {/* Emergency Contact */}
          <div className="md:col-span-2 mt-4">
            <h4 className="font-semibold text-gray-700 mb-3">Emergency Contact</h4>
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Emergency Contact Name *
            </label>
            <input
              type="text"
              name="emergency_contact_name"
              value={form.emergency_contact_name}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Relation *
            </label>
            <input
              type="text"
              name="emergency_contact_relation"
              value={form.emergency_contact_relation}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="e.g., Uncle, Aunt"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Emergency Contact Mobile *
            </label>
            <input
              type="tel"
              name="emergency_contact_mobile"
              value={form.emergency_contact_mobile}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              maxLength={10}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
