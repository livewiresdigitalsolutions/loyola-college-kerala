// import { useState, useCallback } from 'react';
// import { toast } from 'react-hot-toast';
// import { CompleteFormData, AcademicMark } from '@/types/admission';

// export const useAdmissionForm = (userEmail: string | null) => {
//   const [isLoading, setIsLoading] = useState(false);

//   // Save to basic info table
//   const saveBasicInfo = useCallback(async (data: any) => {
//     if (!userEmail) return { success: false, error: 'No email' };

//     try {
//       const response = await fetch('/api/admission-form/basic', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email: userEmail, data }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('Basic info save error:', errorText);
//         return { success: false, error: `HTTP ${response.status}: ${errorText}` };
//       }

//       const text = await response.text();
//       if (!text) {
//         console.error('Empty response from basic info API');
//         return { success: false, error: 'Empty response from server' };
//       }

//       const result = JSON.parse(text);
//       return { success: true, data: result.data, error: result.error };
//     } catch (error: any) {
//       console.error('Save basic info error:', error);
//       return { success: false, error: error.message || 'Network error' };
//     }
//   }, [userEmail]);

//   // Save to personal info table
//   const savePersonalInfo = useCallback(async (admissionId: number, data: any) => {
//     try {
//       const response = await fetch('/api/admission-form/personal', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ admission_id: admissionId, data }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('Personal info save error:', errorText);
        
//         // Try to parse error for better message
//         try {
//           const errorJson = JSON.parse(errorText);
//           return { success: false, error: errorJson.error || `HTTP ${response.status}` };
//         } catch {
//           return { success: false, error: errorText || `HTTP ${response.status}` };
//         }
//       }

//       const text = await response.text();
//       if (!text) {
//         return { success: false, error: 'Empty response' };
//       }

//       const result = JSON.parse(text);
//       return { success: true, error: result.error };
//     } catch (error: any) {
//       console.error('Save personal info error:', error);
//       return { success: false, error: error.message || 'Network error' };
//     }
//   }, []);

//   // Save to family info table
//   const saveFamilyInfo = useCallback(async (admissionId: number, data: any) => {
//     try {
//       const response = await fetch('/api/admission-form/family', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ admission_id: admissionId, data }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('Family info save error:', errorText);
        
//         try {
//           const errorJson = JSON.parse(errorText);
//           return { success: false, error: errorJson.error || `HTTP ${response.status}` };
//         } catch {
//           return { success: false, error: errorText || `HTTP ${response.status}` };
//         }
//       }

//       const text = await response.text();
//       if (!text) {
//         return { success: false, error: 'Empty response' };
//       }

//       const result = JSON.parse(text);
//       return { success: true, error: result.error };
//     } catch (error: any) {
//       console.error('Save family info error:', error);
//       return { success: false, error: error.message || 'Network error' };
//     }
//   }, []);

//   // Save to address info table
//   const saveAddressInfo = useCallback(async (admissionId: number, data: any) => {
//     try {
//       const response = await fetch('/api/admission-form/address', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ admission_id: admissionId, data }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('Address info save error:', errorText);
        
//         try {
//           const errorJson = JSON.parse(errorText);
//           return { success: false, error: errorJson.error || `HTTP ${response.status}` };
//         } catch {
//           return { success: false, error: errorText || `HTTP ${response.status}` };
//         }
//       }

//       const text = await response.text();
//       if (!text) {
//         return { success: false, error: 'Empty response' };
//       }

//       const result = JSON.parse(text);
//       return { success: true, error: result.error };
//     } catch (error: any) {
//       console.error('Save address info error:', error);
//       return { success: false, error: error.message || 'Network error' };
//     }
//   }, []);

//   // Save academic marks
//   const saveAcademicMarks = useCallback(async (admissionId: number, marks: AcademicMark[]) => {
//     try {
//       const response = await fetch('/api/admission-form/academic', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ admission_form_id: admissionId, marks }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('Academic marks save error:', errorText);
        
//         try {
//           const errorJson = JSON.parse(errorText);
//           return { success: false, error: errorJson.error || `HTTP ${response.status}` };
//         } catch {
//           return { success: false, error: errorText || `HTTP ${response.status}` };
//         }
//       }

//       const text = await response.text();
//       if (!text) {
//         return { success: false, error: 'Empty response' };
//       }

//       const result = JSON.parse(text);
//       return { success: true, error: result.error };
//     } catch (error: any) {
//       console.error('Save academic marks error:', error);
//       return { success: false, error: error.message || 'Network error' };
//     }
//   }, []);

//   // Load complete form data
//   const loadCompleteForm = useCallback(async (): Promise<CompleteFormData | null> => {
//     if (!userEmail) return null;

//     setIsLoading(true);
//     try {
//       console.log('Loading form data for:', userEmail);
      
//       const response = await fetch(`/api/admission-form/complete?email=${encodeURIComponent(userEmail)}`);
      
//       console.log('Load response status:', response.status);
      
//       // Handle 404 gracefully (no existing form)
//       if (response.status === 404) {
//         console.log('No existing form found - starting fresh');
//         return null;
//       }

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('Load form error response:', errorText);
//         return null;
//       }

//       const text = await response.text();
//       console.log('Load response text length:', text.length);
      
//       if (!text) {
//         console.error('Empty response when loading form');
//         return null;
//       }

//       const result = JSON.parse(text);
//       console.log('Parsed result:', { hasData: !!result.data, keys: result.data ? Object.keys(result.data).length : 0 });
      
//       if (result.data) {
//         return result.data;
//       }
      
//       console.log('Result has no data property');
//       return null;
//     } catch (error: any) {
//       console.error('Load form error:', error);
//       return null;
//     } finally {
//       setIsLoading(false);
//     }
//   }, [userEmail]);

//   // Save complete form (all sections)
//   const saveCompleteForm = useCallback(async (
//     formData: CompleteFormData,
//     admissionId?: number
//   ) => {
//     setIsLoading(true);
    
//     try {
//       console.log('Starting save with data:', { admissionId, hasEmail: !!userEmail });

//       // Step 1: Save basic info
//       const basicResult = await saveBasicInfo({
//         program_level_id: formData.program_level_id,
//         degree_id: formData.degree_id,
//         course_id: formData.course_id,
//         second_preference_course_id: formData.second_preference_course_id,
//         third_preference_course_id: formData.third_preference_course_id,
//         exam_center_id: formData.exam_center_id,
//         form_status: formData.form_status,
//       });

//       console.log('Basic info result:', basicResult);

//       if (!basicResult.success) {
//         throw new Error(basicResult.error || 'Failed to save basic info');
//       }

//       // FIX: Always prioritize the ID from basic result
//       let currentAdmissionId = basicResult.data?.id || admissionId;
      
//       console.log('Admission IDs:', {
//         fromBasicResult: basicResult.data?.id,
//         passedAdmissionId: admissionId,
//         usingId: currentAdmissionId
//       });

//       if (!currentAdmissionId) {
//         throw new Error('No admission ID available after saving basic info');
//       }

//       // Step 2: Save personal info
//       console.log('Saving personal info for admission ID:', currentAdmissionId);
//       const personalResult = await savePersonalInfo(currentAdmissionId, {
//         full_name: formData.full_name,
//         gender: formData.gender,
//         dob: formData.dob,
//         mobile: formData.mobile,
//         email: formData.email,
//         aadhaar: formData.aadhaar,
//         nationality: formData.nationality,
//         religion: formData.religion,
//         category: formData.category,
//         seat_reservation_quota: formData.seat_reservation_quota,
//         caste: formData.caste,
//         mother_tongue: formData.mother_tongue,
//         nativity: formData.nativity,
//         blood_group: formData.blood_group,
//       });

//       console.log('Personal info result:', personalResult);

//       if (!personalResult.success) {
//         throw new Error(personalResult.error || 'Failed to save personal info');
//       }

//       // Step 3: Save family info
//       console.log('Saving family info...');
//       const familyResult = await saveFamilyInfo(currentAdmissionId, {
//         father_name: formData.father_name,
//         father_mobile: formData.father_mobile,
//         father_education: formData.father_education,
//         father_occupation: formData.father_occupation,
//         mother_name: formData.mother_name,
//         mother_mobile: formData.mother_mobile,
//         mother_education: formData.mother_education,
//         mother_occupation: formData.mother_occupation,
//         annual_family_income: formData.annual_family_income,
//         is_disabled: formData.is_disabled,
//         disability_type: formData.disability_type,
//         disability_percentage: formData.disability_percentage,
//         dependent_of: formData.dependent_of,
//         seeking_admission_under_quota: formData.seeking_admission_under_quota,
//         scholarship_or_fee_concession: formData.scholarship_or_fee_concession,
//         hostel_accommodation_required: formData.hostel_accommodation_required,
//         emergency_contact_name: formData.emergency_contact_name,
//         emergency_contact_relation: formData.emergency_contact_relation,
//         emergency_contact_mobile: formData.emergency_contact_mobile,
//       });

//       console.log('Family info result:', familyResult);

//       if (!familyResult.success) {
//         throw new Error(familyResult.error || 'Failed to save family info');
//       }

//       // Step 4: Save address info
//       console.log('Saving address info...');
//       const addressResult = await saveAddressInfo(currentAdmissionId, {
//         communication_address: formData.communication_address,
//         communication_city: formData.communication_city,
//         communication_state: formData.communication_state,
//         communication_district: formData.communication_district,
//         communication_pincode: formData.communication_pincode,
//         communication_country: formData.communication_country,
//         permanent_address: formData.permanent_address,
//         permanent_city: formData.permanent_city,
//         permanent_state: formData.permanent_state,
//         permanent_district: formData.permanent_district,
//         permanent_pincode: formData.permanent_pincode,
//         permanent_country: formData.permanent_country,
//       });

//       console.log('Address info result:', addressResult);

//       if (!addressResult.success) {
//         throw new Error(addressResult.error || 'Failed to save address info');
//       }

//       // Step 5: Save academic marks
//       if (formData.academicMarks && formData.academicMarks.length > 0) {
//         console.log('Saving academic marks...');
//         const academicResult = await saveAcademicMarks(currentAdmissionId, formData.academicMarks);
//         console.log('Academic marks result:', academicResult);
        
//         if (!academicResult.success) {
//           throw new Error(academicResult.error || 'Failed to save academic marks');
//         }
//       }

//       console.log('All data saved successfully!');
//       return { success: true, admissionId: currentAdmissionId };
//     } catch (error: any) {
//       console.error('Complete save error:', error);
//       toast.error(error.message || 'Failed to save form');
//       return { success: false, error: error.message };
//     } finally {
//       setIsLoading(false);
//     }
//   }, [saveBasicInfo, savePersonalInfo, saveFamilyInfo, saveAddressInfo, saveAcademicMarks, userEmail]);

//   return {
//     isLoading,
//     saveCompleteForm,
//     loadCompleteForm,
//     saveBasicInfo,
//     savePersonalInfo,
//     saveFamilyInfo,
//     saveAddressInfo,
//     saveAcademicMarks,
//   };
// };














import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { CompleteFormData, AcademicMark } from '@/types/admission';

export const useAdmissionForm = (userEmail: string | null) => {
  const [isLoading, setIsLoading] = useState(false);

  // Save to basic info table
  const saveBasicInfo = useCallback(async (data: any) => {
    if (!userEmail) return { success: false, error: 'No email' };

    try {
      const response = await fetch('/api/admission-form/basic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, data }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Basic info save error:', errorText);
        return { success: false, error: `HTTP ${response.status}: ${errorText}` };
      }

      const text = await response.text();
      if (!text) {
        console.error('Empty response from basic info API');
        return { success: false, error: 'Empty response from server' };
      }

      const result = JSON.parse(text);
      return { success: true, data: result.data, error: result.error };
    } catch (error: any) {
      console.error('Save basic info error:', error);
      return { success: false, error: error.message || 'Network error' };
    }
  }, [userEmail]);

  // Save to personal info table
  const savePersonalInfo = useCallback(async (admissionId: number, data: any) => {
    try {
      const response = await fetch('/api/admission-form/personal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admission_id: admissionId, data }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Personal info save error:', errorText);
        
        try {
          const errorJson = JSON.parse(errorText);
          return { success: false, error: errorJson.error || `HTTP ${response.status}` };
        } catch {
          return { success: false, error: errorText || `HTTP ${response.status}` };
        }
      }

      const text = await response.text();
      if (!text) {
        return { success: false, error: 'Empty response' };
      }

      const result = JSON.parse(text);
      return { success: true, error: result.error };
    } catch (error: any) {
      console.error('Save personal info error:', error);
      return { success: false, error: error.message || 'Network error' };
    }
  }, []);

  // Save to family info table
  const saveFamilyInfo = useCallback(async (admissionId: number, data: any) => {
    try {
      const response = await fetch('/api/admission-form/family', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admission_id: admissionId, data }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Family info save error:', errorText);
        
        try {
          const errorJson = JSON.parse(errorText);
          return { success: false, error: errorJson.error || `HTTP ${response.status}` };
        } catch {
          return { success: false, error: errorText || `HTTP ${response.status}` };
        }
      }

      const text = await response.text();
      if (!text) {
        return { success: false, error: 'Empty response' };
      }

      const result = JSON.parse(text);
      return { success: true, error: result.error };
    } catch (error: any) {
      console.error('Save family info error:', error);
      return { success: false, error: error.message || 'Network error' };
    }
  }, []);

  // Save to address info table
  const saveAddressInfo = useCallback(async (admissionId: number, data: any) => {
    try {
      const response = await fetch('/api/admission-form/address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admission_id: admissionId, data }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Address info save error:', errorText);
        
        try {
          const errorJson = JSON.parse(errorText);
          return { success: false, error: errorJson.error || `HTTP ${response.status}` };
        } catch {
          return { success: false, error: errorText || `HTTP ${response.status}` };
        }
      }

      const text = await response.text();
      if (!text) {
        return { success: false, error: 'Empty response' };
      }

      const result = JSON.parse(text);
      return { success: true, error: result.error };
    } catch (error: any) {
      console.error('Save address info error:', error);
      return { success: false, error: error.message || 'Network error' };
    }
  }, []);

  // Save academic marks
  const saveAcademicMarks = useCallback(async (admissionId: number, marks: AcademicMark[]) => {
    try {
      const response = await fetch('/api/admission-form/academic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admission_form_id: admissionId, marks }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Academic marks save error:', errorText);
        
        try {
          const errorJson = JSON.parse(errorText);
          return { success: false, error: errorJson.error || `HTTP ${response.status}` };
        } catch {
          return { success: false, error: errorText || `HTTP ${response.status}` };
        }
      }

      const text = await response.text();
      if (!text) {
        return { success: false, error: 'Empty response' };
      }

      const result = JSON.parse(text);
      return { success: true, error: result.error };
    } catch (error: any) {
      console.error('Save academic marks error:', error);
      return { success: false, error: error.message || 'Network error' };
    }
  }, []);

  // Load complete form data
  const loadCompleteForm = useCallback(async (): Promise<CompleteFormData | null> => {
    if (!userEmail) return null;

    setIsLoading(true);
    try {
      console.log('Loading form data for:', userEmail);
      
      const response = await fetch(`/api/admission-form/complete?email=${encodeURIComponent(userEmail)}`);
      
      console.log('Load response status:', response.status);
      
      if (response.status === 404) {
        console.log('No existing form found - starting fresh');
        return null;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Load form error response:', errorText);
        return null;
      }

      const text = await response.text();
      console.log('Load response text length:', text.length);
      
      if (!text) {
        console.error('Empty response when loading form');
        return null;
      }

      const result = JSON.parse(text);
      console.log('Parsed result:', { hasData: !!result.data, keys: result.data ? Object.keys(result.data).length : 0 });
      
      if (result.data) {
        return result.data;
      }
      
      console.log('Result has no data property');
      return null;
    } catch (error: any) {
      console.error('Load form error:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [userEmail]);

  // Save complete form (all sections)
  const saveCompleteForm = useCallback(async (
    formData: CompleteFormData,
    admissionId?: number
  ) => {
    setIsLoading(true);
    
    try {
      console.log('Starting save with data:', { admissionId, hasEmail: !!userEmail });

      // Step 1: Save basic info
      const basicResult = await saveBasicInfo({
        program_level_id: formData.program_level_id,
        degree_id: formData.degree_id,
        course_id: formData.course_id,
        second_preference_degree_id: formData.second_preference_degree_id || formData.degree_id,  // NEW
        second_preference_course_id: formData.second_preference_course_id,
        third_preference_degree_id: formData.third_preference_degree_id || formData.degree_id,    // NEW
        third_preference_course_id: formData.third_preference_course_id,
        exam_center_id: formData.exam_center_id,
        form_status: formData.form_status,
      });

      console.log('Basic info result:', basicResult);

      if (!basicResult.success) {
        throw new Error(basicResult.error || 'Failed to save basic info');
      }

      let currentAdmissionId = basicResult.data?.id || admissionId;
      
      console.log('Admission IDs:', {
        fromBasicResult: basicResult.data?.id,
        passedAdmissionId: admissionId,
        usingId: currentAdmissionId
      });

      if (!currentAdmissionId) {
        throw new Error('No admission ID available after saving basic info');
      }

      // Step 2: Save personal info
      console.log('Saving personal info for admission ID:', currentAdmissionId);
      const personalResult = await savePersonalInfo(currentAdmissionId, {
        full_name: formData.full_name,
        gender: formData.gender,
        dob: formData.dob,
        mobile: formData.mobile,
        email: formData.email,
        aadhaar: formData.aadhaar,
        nationality: formData.nationality,
        religion: formData.religion,
        category: formData.category,
        seat_reservation_quota: formData.seat_reservation_quota,
        caste: formData.caste,
        mother_tongue: formData.mother_tongue,
        nativity: formData.nativity,
        blood_group: formData.blood_group,
      });

      console.log('Personal info result:', personalResult);

      if (!personalResult.success) {
        throw new Error(personalResult.error || 'Failed to save personal info');
      }

      // Step 3: Save family info
      console.log('Saving family info...');
      const familyResult = await saveFamilyInfo(currentAdmissionId, {
        father_name: formData.father_name,
        father_mobile: formData.father_mobile,
        father_education: formData.father_education,
        father_occupation: formData.father_occupation,
        mother_name: formData.mother_name,
        mother_mobile: formData.mother_mobile,
        mother_education: formData.mother_education,
        mother_occupation: formData.mother_occupation,
        annual_family_income: formData.annual_family_income,
        is_disabled: formData.is_disabled,
        disability_type: formData.disability_type,
        disability_percentage: formData.disability_percentage,
        dependent_of: formData.dependent_of,
        seeking_admission_under_quota: formData.seeking_admission_under_quota,
        scholarship_or_fee_concession: formData.scholarship_or_fee_concession,
        hostel_accommodation_required: formData.hostel_accommodation_required,
        emergency_contact_name: formData.emergency_contact_name,
        emergency_contact_relation: formData.emergency_contact_relation,
        emergency_contact_mobile: formData.emergency_contact_mobile,
      });

      console.log('Family info result:', familyResult);

      if (!familyResult.success) {
        throw new Error(familyResult.error || 'Failed to save family info');
      }

      // Step 4: Save address info
      console.log('Saving address info...');
      const addressResult = await saveAddressInfo(currentAdmissionId, {
        communication_address: formData.communication_address,
        communication_city: formData.communication_city,
        communication_state: formData.communication_state,
        communication_district: formData.communication_district,
        communication_pincode: formData.communication_pincode,
        communication_country: formData.communication_country,
        permanent_address: formData.permanent_address,
        permanent_city: formData.permanent_city,
        permanent_state: formData.permanent_state,
        permanent_district: formData.permanent_district,
        permanent_pincode: formData.permanent_pincode,
        permanent_country: formData.permanent_country,
      });

      console.log('Address info result:', addressResult);

      if (!addressResult.success) {
        throw new Error(addressResult.error || 'Failed to save address info');
      }

      // Step 5: Save academic marks
      if (formData.academicMarks && formData.academicMarks.length > 0) {
        console.log('Saving academic marks...');
        const academicResult = await saveAcademicMarks(currentAdmissionId, formData.academicMarks);
        console.log('Academic marks result:', academicResult);
        
        if (!academicResult.success) {
          throw new Error(academicResult.error || 'Failed to save academic marks');
        }
      }

      console.log('All data saved successfully!');
      return { success: true, admissionId: currentAdmissionId };
    } catch (error: any) {
      console.error('Complete save error:', error);
      toast.error(error.message || 'Failed to save form');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [saveBasicInfo, savePersonalInfo, saveFamilyInfo, saveAddressInfo, saveAcademicMarks, userEmail]);

  return {
    isLoading,
    saveCompleteForm,
    loadCompleteForm,
    saveBasicInfo,
    savePersonalInfo,
    saveFamilyInfo,
    saveAddressInfo,
    saveAcademicMarks,
  };
};
