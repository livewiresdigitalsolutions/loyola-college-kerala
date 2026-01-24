// "use client";

// import { Program, Degree, Course, ExamCenter } from '@/types/admission';
// import { useEffect } from 'react';

// interface ProgramPersonalTabProps {
//   form: any;
//   programs: Program[];
//   degrees: Degree[];
//   courses: Course[];
//   examCenters: ExamCenter[];
//   isFormLocked: boolean;
//   handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
// }

// export default function ProgramPersonalTab({
//   form,
//   programs,
//   degrees,
//   courses,
//   examCenters,
//   isFormLocked,
//   handleChange,
// }: ProgramPersonalTabProps) {
  
//   // Auto-select program ID 1 on component mount
//   useEffect(() => {
//     if (!form.program_level_id && programs.length > 0) {
//       const event = {
//         target: {
//           name: 'program_level_id',
//           value: '1'
//         }
//       } as React.ChangeEvent<HTMLSelectElement>;
//       handleChange(event);
//     }
//   }, [programs]);

//   return (
//     <div className="space-y-8 animate-fadeIn">
//       {/* Program Selection */}
//       <div>
//         <h3 className="text-lg font-bold text-black mb-4 pb-2 border-b border-blue-200">
//           Program Selection
//         </h3>
//         <div className="grid md:grid-cols-2 gap-4 mt-4">
//           <div>
//             <label className="block text-sm font-semibold text-black mb-2">
//               Select Programme Level *
//             </label>
//             <select
//               name="program_level_id"
//               value="1"
//               onChange={handleChange}
//               disabled={true}
//               required
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-gray-100 text-black cursor-not-allowed"
//             >
//               <option value="">Select Level</option>
//               {programs.map((p) => (
//                 <option key={p.id} value={p.id}>
//                   {p.discipline}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-black mb-2">
//               Select Degree *
//             </label>
//             <select
//               name="degree_id"
//               value={form.degree_id}
//               onChange={handleChange}
//               disabled={isFormLocked}
//               required
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
//             >
//               <option value="">Select Degree</option>
//               {degrees.map((d) => (
//                 <option key={d.id} value={d.id}>
//                   {d.degree_name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-black mb-2">
//               Select Programme (1st Preference) *
//             </label>
//             <select
//               name="course_id"
//               value={form.course_id}
//               onChange={handleChange}
//               disabled={!form.degree_id || isFormLocked}
//               required
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
//             >
//               <option value="">Select Course</option>
//               {courses.map((c) => (
//                 <option key={c.id} value={c.id}>
//                   {c.course_name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-black mb-2">
//               Second Preference Programme (Optional)
//             </label>
//             <select
//               name="second_preference_course_id"
//               value={form.second_preference_course_id}
//               onChange={handleChange}
//               disabled={!form.degree_id || isFormLocked}
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
//             >
//               <option value="">Select Second Preference</option>
//               {courses
//                 .filter((c) => c.id.toString() !== form.course_id)
//                 .map((c) => (
//                   <option key={c.id} value={c.id}>
//                     {c.course_name}
//                   </option>
//                 ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-black mb-2">
//               Third Preference Programme (Optional)
//             </label>
//             <select
//               name="third_preference_course_id"
//               value={form.third_preference_course_id}
//               onChange={handleChange}
//               disabled={!form.degree_id || isFormLocked}
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
//             >
//               <option value="">Select Third Preference</option>
//               {courses
//                 .filter(
//                   (c) =>
//                     c.id.toString() !== form.course_id &&
//                     c.id.toString() !== form.second_preference_course_id
//                 )
//                 .map((c) => (
//                   <option key={c.id} value={c.id}>
//                     {c.course_name}
//                   </option>
//                 ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-black mb-2">
//               Select Exam Center *
//             </label>
//             <select
//               name="exam_center_id"
//               value={form.exam_center_id}
//               onChange={handleChange}
//               disabled={isFormLocked}
//               required
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
//             >
//               <option value="">Select Exam Center</option>
//               {examCenters.map((center) => (
//                 <option key={center.id} value={center.id}>
//                   {center.location
//                     ? `${center.centre_name} - ${center.location}`
//                     : center.centre_name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Personal Information */}
//       <div>
//         <h3 className="text-lg font-bold text-black mb-4 pb-2 border-b border-blue-200">
//           Personal Information
//         </h3>
//         <div className="grid md:grid-cols-2 gap-4 mt-4">
//           <div>
//             <label className="block text-sm font-semibold text-black mb-2">
//               Full Name *
//             </label>
//             <input
//               type="text"
//               name="full_name"
//               value={form.full_name}
//               onChange={handleChange}
//               disabled={isFormLocked}
//               required
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
//               placeholder="Enter your full name"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-black mb-2">
//               Gender *
//             </label>
//             <select
//               name="gender"
//               value={form.gender}
//               onChange={handleChange}
//               disabled={isFormLocked}
//               required
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
//             >
//               <option value="">Select Gender</option>
//               <option value="male">Male</option>
//               <option value="female">Female</option>
//               <option value="other">Other</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-black mb-2">
//               Date of Birth *
//             </label>
//             <input
//               type="date"
//               name="dob"
//               value={form.dob}
//               onChange={handleChange}
//               disabled={isFormLocked}
//               required
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-black mb-2">
//               Aadhaar Number *
//             </label>
//             <input
//               type="text"
//               name="aadhaar"
//               value={form.aadhaar}
//               onChange={handleChange}
//               disabled={isFormLocked}
//               required
//               maxLength={12}
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
//               placeholder="12-digit Aadhaar number"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-black mb-2">
//               Nationality *
//             </label>
//             <input
//               type="text"
//               name="nationality"
//               value={form.nationality}
//               onChange={handleChange}
//               disabled={isFormLocked}
//               required
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
//               placeholder="e.g., Indian"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-black mb-2">
//               Category *
//             </label>
//             <select
//               name="category"
//               value={form.category}
//               onChange={handleChange}
//               disabled={isFormLocked}
//               required
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
//             >
//               <option value="">Select Category</option>
//               <option value="general">General</option>
//               <option value="obc">OBC</option>
//               <option value="sc">SC</option>
//               <option value="st">ST</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-black mb-2">
//               Seat Reservation Quota *
//             </label>
//             <select
//               name="seat_reservation_quota"
//               value={form.seat_reservation_quota}
//               onChange={handleChange}
//               disabled={isFormLocked}
//               required
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
//             >
//               <option value="">Select Quota</option>
//               <option value="general">General</option>
//               <option value="sports">Sports</option>
//               <option value="pwd">PWD</option>
//               <option value="management">Management</option>
//               <option value="exservice">Ex-Service Men</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-black mb-2">
//               Caste *
//             </label>
//             <input
//               type="text"
//               name="caste"
//               value={form.caste}
//               onChange={handleChange}
//               disabled={isFormLocked}
//               required
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
//               placeholder="Enter your caste"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-black mb-2">
//               Mother Tongue *
//             </label>
//             <input
//               type="text"
//               name="mother_tongue"
//               value={form.mother_tongue}
//               onChange={handleChange}
//               disabled={isFormLocked}
//               required
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
//               placeholder="e.g., Tamil, Hindi"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-black mb-2">
//               Nativity *
//             </label>
//             <input
//               type="text"
//               name="nativity"
//               value={form.nativity}
//               onChange={handleChange}
//               disabled={isFormLocked}
//               required
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
//               placeholder="Your native place"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-black mb-2">
//               Religion (Optional)
//             </label>
//             <input
//               type="text"
//               name="religion"
//               value={form.religion || ''}
//               onChange={handleChange}
//               disabled={isFormLocked}
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
//               placeholder="Your religion"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-black mb-2">
//               Blood Group (Optional)
//             </label>
//             <select
//               name="blood_group"
//               value={form.blood_group || ''}
//               onChange={handleChange}
//               disabled={isFormLocked}
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
//             >
//               <option value="">Select Blood Group</option>
//               <option value="A+">A+</option>
//               <option value="A-">A-</option>
//               <option value="B+">B+</option>
//               <option value="B-">B-</option>
//               <option value="O+">O+</option>
//               <option value="O-">O-</option>
//               <option value="AB+">AB+</option>
//               <option value="AB-">AB-</option>
//             </select>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

















"use client";

import { Program, Degree, Course, ExamCenter } from '@/types/admission';
import { useEffect } from 'react';

interface ProgramPersonalTabProps {
  form: any;
  programs: Program[];
  degrees: Degree[];
  courses: Course[];
  secondPreferenceCourses: Course[];
  thirdPreferenceCourses: Course[];
  examCenters: ExamCenter[];
  isFormLocked: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export default function ProgramPersonalTab({
  form,
  programs,
  degrees,
  courses,
  secondPreferenceCourses,
  thirdPreferenceCourses,
  examCenters,
  isFormLocked,
  handleChange,
}: ProgramPersonalTabProps) {
  
  // Auto-select program ID 1 on component mount
  useEffect(() => {
    if (!form.program_level_id && programs.length > 0) {
      const event = {
        target: {
          name: 'program_level_id',
          value: '1'
        }
      } as React.ChangeEvent<HTMLSelectElement>;
      handleChange(event);
    }
  }, [programs]);

  // Helper function to get courses for second preference
  const getSecondPreferenceCourses = () => {
    // If a specific degree is selected, show its courses
    if (form.second_preference_degree_id) {
      return secondPreferenceCourses;
    }
    // Otherwise, show courses from the first degree
    return courses;
  };

  // Helper function to get courses for third preference
  const getThirdPreferenceCourses = () => {
    // If a specific degree is selected, show its courses
    if (form.third_preference_degree_id) {
      return thirdPreferenceCourses;
    }
    // Otherwise, show courses from the first degree
    return courses;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Program Selection */}
      <div>
        <h3 className="text-lg font-bold text-black mb-4 pb-2 border-b border-blue-200">
          Program Selection
        </h3>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Select Programme Level *
            </label>
            <select
              name="program_level_id"
              value="1"
              onChange={handleChange}
              disabled={true}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-gray-100 text-black cursor-not-allowed"
            >
              <option value="">Select Level</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.discipline}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Select Degree *
            </label>
            <select
              name="degree_id"
              value={form.degree_id}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select Degree</option>
              {degrees.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.degree_name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-black mb-2">
              Select Programme (1st Preference) *
            </label>
            <select
              name="course_id"
              value={form.course_id}
              onChange={handleChange}
              disabled={!form.degree_id || isFormLocked}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select Course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.course_name}
                </option>
              ))}
            </select>
          </div>

          {/* Second Preference Section */}
          <div className="md:col-span-2 mt-6">
            <h4 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2">
              Second Preference (Optional)
            </h4>
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Select Degree (Optional)
            </label>
            <select
              name="second_preference_degree_id"
              value={form.second_preference_degree_id || ''}
              onChange={handleChange}
              disabled={!form.program_level_id || isFormLocked}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Same as 1st Preference Degree</option>
              {degrees
                .filter(d => d.id.toString() !== form.degree_id)
                .map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.degree_name}
                  </option>
                ))}
            </select>
            {!form.second_preference_degree_id && form.degree_id && (
              <p className="text-xs text-gray-500 mt-1">
                Showing courses from {degrees.find(d => d.id.toString() === form.degree_id)?.degree_name || 'first degree'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Select Programme
            </label>
            <select
              name="second_preference_course_id"
              value={form.second_preference_course_id || ''}
              onChange={handleChange}
              disabled={!form.degree_id || isFormLocked}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select Course (Optional)</option>
              {getSecondPreferenceCourses()
                .filter((c) => c.id.toString() !== form.course_id)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.course_name}
                  </option>
                ))}
            </select>
          </div>

          {/* Third Preference Section */}
          <div className="md:col-span-2 mt-6">
            <h4 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2">
              Third Preference (Optional)
            </h4>
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Select Degree (Optional)
            </label>
            <select
              name="third_preference_degree_id"
              value={form.third_preference_degree_id || ''}
              onChange={handleChange}
              disabled={!form.program_level_id || isFormLocked}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Same as 1st Preference Degree</option>
              {degrees
                .filter(d => 
                  d.id.toString() !== form.degree_id
                  
                )
                .map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.degree_name}
                  </option>
                ))}
            </select>
            {!form.third_preference_degree_id && form.degree_id && (
              <p className="text-xs text-gray-500 mt-1">
                Showing courses from {degrees.find(d => d.id.toString() === form.degree_id)?.degree_name || 'first degree'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Select Programme
            </label>
            <select
              name="third_preference_course_id"
              value={form.third_preference_course_id || ''}
              onChange={handleChange}
              disabled={!form.degree_id || isFormLocked}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select Course (Optional)</option>
              {getThirdPreferenceCourses()
                .filter(
                  (c) =>
                    c.id.toString() !== form.course_id &&
                    c.id.toString() !== form.second_preference_course_id
                )
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.course_name}
                  </option>
                ))}
            </select>
          </div>

          <div className="md:col-span-2 mt-6">
            <label className="block text-sm font-semibold text-black mb-2">
              Select Exam Center *
            </label>
            <select
              name="exam_center_id"
              value={form.exam_center_id}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select Exam Center</option>
              {examCenters.map((center) => (
                <option key={center.id} value={center.id}>
                  {center.location
                    ? `${center.centre_name} - ${center.location}`
                    : center.centre_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div>
        <h3 className="text-lg font-bold text-black mb-4 pb-2 border-b border-blue-200">
          Personal Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Gender *
            </label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Date of Birth *
            </label>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Aadhaar Number *
            </label>
            <input
              type="text"
              name="aadhaar"
              value={form.aadhaar}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              maxLength={12}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="12-digit Aadhaar number"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Nationality *
            </label>
            <input
              type="text"
              name="nationality"
              value={form.nationality}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="e.g., Indian"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Category *
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select Category</option>
              <option value="general">General</option>
              <option value="obc">OBC</option>
              <option value="sc">SC</option>
              <option value="st">ST</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Seat Reservation Quota *
            </label>
            <select
              name="seat_reservation_quota"
              value={form.seat_reservation_quota}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select Quota</option>
              <option value="general">General</option>
              <option value="sports">Sports</option>
              <option value="pwd">PWD</option>
              <option value="management">Management</option>
              <option value="exservice">Ex-Service Men</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Caste *
            </label>
            <input
              type="text"
              name="caste"
              value={form.caste}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Enter your caste"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Mother Tongue *
            </label>
            <input
              type="text"
              name="mother_tongue"
              value={form.mother_tongue}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="e.g., Tamil, Hindi"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Nativity *
            </label>
            <input
              type="text"
              name="nativity"
              value={form.nativity}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Your native place"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Religion (Optional)
            </label>
            <input
              type="text"
              name="religion"
              value={form.religion || ''}
              onChange={handleChange}
              disabled={isFormLocked}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Your religion"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Blood Group (Optional)
            </label>
            <select
              name="blood_group"
              value={form.blood_group || ''}
              onChange={handleChange}
              disabled={isFormLocked}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
