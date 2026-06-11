


// 🔐 Helper: get token from cookie
function getCookie(name: string) {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }

  return null;
}

export async function request(endpoint: string, options: RequestInit = {}) {
  try {
    const defaultHeaders: any = {};

    // 🔐 Token from COOKIE (NOT localStorage)
    const token = getCookie("adminToken");

    if (token) {
      defaultHeaders["Authorization"] = token;
    }

    // 📦 Content type (skip for FormData)
    if (!(options.body instanceof FormData)) {
      defaultHeaders["Content-Type"] = "application/x-www-form-urlencoded";
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
      {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      }
    );

    const data = await response.json();

    // ❗ API error handling
    if (!response.ok || data.status !== 200) {
      throw data;
    }

    return data;
  } catch (error: any) {
    if (error?.name !== "AbortError" && error !== "Component unmounted") {
      console.error("API Error:", error);
    }
    throw error;
  }
}

export const clinicService = {
    getAll: (params: { page_no: number; limit: number; search?: string }, signal?: AbortSignal) => {
        const body = new URLSearchParams({
            page_no: params.page_no.toString(),
            limit: params.limit.toString(),
            search: params.search || '',
        }).toString();
        return request('/clinic/list', {
            method: 'POST',
            body: body,
            
        });
    },
    getById: (id: string, signal?: AbortSignal) => {
        return request(`/clinic/detail/${id}`, { signal });
    },
    add: (formData: any, signal?: AbortSignal) => {
        const isFormData = formData instanceof FormData;
        const body = isFormData ? formData : new URLSearchParams(formData).toString();
        return request('/clinic/add', {
            method: 'POST',
            body: body,
            signal
        });
    },
    update: (id: string, formData: any, signal?: AbortSignal) => {
        const isFormData = formData instanceof FormData;
        const body = isFormData ? formData : new URLSearchParams(formData).toString();
        return request(`/clinic/edit/${id}`, {
            method: 'POST',
            body: body,
            signal
        });
    },

    // Clinic ke assigned doctors fetch karo
getDoctors: (clinicId: string, signal?: AbortSignal) => {
    return request(`/clinic/doctors/${clinicId}`, { signal });
},

// Doctors assign karo clinic me
addDoctors: (body: string, signal?: AbortSignal) => {
    return request('/clinic/add-doctor', {
        method: 'POST',
        body,
        signal,
    });
},
};


export const geoService = {
    getStates: (signal?: AbortSignal) => {
        return request('/state', { signal });
    },
    getCities: (stateId: string | number, signal?: AbortSignal) => {
        return request(`/city/${stateId}`, { signal });
    },
    getClinicsByLocation: (state: string, city: string, signal?: AbortSignal) => {
        return request(`/clinics-by-location/${encodeURIComponent(state)}/${encodeURIComponent(city)}`, { signal });
    },
    getDoctorsByClinic: (clinicId: string | number, signal?: AbortSignal) => {
        return request(`/doctors-by-clinic/${clinicId}`, { signal });
    },
};

export const patientService = {
   
    getAll: (
  params: { page_no?: number; limit?: number; search?: string },
  signal?: AbortSignal
) => {
  const formData = new FormData();
  formData.append("page_no", String(params?.page_no || 1));
  formData.append("limit", String(params?.limit || 10));
  formData.append("search", params?.search || "");

  return request('/patient/list', {
    method: 'POST',
    body: formData,
    signal,
  });
},
    add: (formData: any, signal?: AbortSignal) => {
        const params = new URLSearchParams(formData).toString();
        return request('/patient/add', {
            method: 'POST',
            body: params,
            signal
        });
    },
    // getById: (id: string, signal?: AbortSignal) => request(`/patient/${id}`, { signal }),
    getById: (id: string, signal?: AbortSignal) =>
    request(`/patient/detail/${id}`, { signal }),
    update: (id: string, formData: any, signal?: AbortSignal) => {
        const params = new URLSearchParams(formData).toString();
        return request(`/patient/update/${id}`, {
            method: 'PUT',
            body: params,
            signal
        });
    },
    delete: (id: string, signal?: AbortSignal) => request(`/patient/delete/${id}`, {
        method: 'DELETE',
        signal
    }),
    sendOtp: (phone: string, signal?: AbortSignal) => {
        const body = new URLSearchParams({ phone }).toString();
        return request('/patient/otp/send', {
            method: 'POST',
            body,
            signal
        });
    },
    verifyOtp: (phone: string, otp: string, signal?: AbortSignal) => {
        const body = new URLSearchParams({ phone, otp }).toString();
        return request('/patient/otp/verify', {
            method: 'POST',
            body,
            signal
        });
    },
};

export const doctorService = {
   
    getAll: (params?: { page_no?: number; limit?: number; search?: string }, signal?: AbortSignal) => {
    const body = new URLSearchParams({
        page_no: String(params?.page_no || 1),
        limit: String(params?.limit || 10),
        search: params?.search || '',
    }).toString();
    return request('/doctor/list', {
        method: 'POST',
        body,
        signal,
    });
},
    add: (formData: any, signal?: AbortSignal) => {
        const params = new URLSearchParams(formData).toString();
        return request('/doctor/add', {
            method: 'POST',
            body: params,
            signal
        });
    },
   
    getById: (id: string, signal?: AbortSignal) => request(`/doctor/detail/${id}`, { signal }),
   

    update: (id: string, formData: any, signal?: AbortSignal) => {
    const isFormData = formData instanceof FormData;
    const body = isFormData ? formData : new URLSearchParams(formData).toString();
    return request(`/doctor/edit/${id}`, {
        method: 'POST',
        body,
        signal
    });
},
    delete: (id: string, signal?: AbortSignal) => request(`/doctor/delete/${id}`, {
        method: 'DELETE',
        signal
    }),
    getSlots: (doctorId: string, clinicId: string, date?: string, signal?: AbortSignal) => {
        let url = `/doctor/getDoctorSlots?doctor_id=${doctorId}&clinic_id=${clinicId}`;
        if (date) url += `&date=${date}`;
        return request(url, { signal });
    },
    addSlot: (formData: any, signal?: AbortSignal) => {
        const body = new URLSearchParams(formData).toString();
        return request('/doctor/addDoctorSlot', {
            method: 'POST',
            body,
            signal
        });
    },
    editSlot: (formData: any, signal?: AbortSignal) => {
        const body = new URLSearchParams(formData).toString();
        return request('/doctor/editDoctorSlot', {
            method: 'POST',
            body,
            signal
        });
    },
    deleteSlot: (slotId: string, signal?: AbortSignal) => {
        const body = new URLSearchParams({ slot_id: slotId }).toString();
        return request('/doctor/deleteDoctorSlot', {
            method: 'POST',
            body,
            signal
        });
    },
};

export const billingService = {
    getAll: (signal?: AbortSignal) => request('/billing/list', { signal }),
    add: (formData: any, signal?: AbortSignal) => {
        const params = new URLSearchParams(formData).toString();
        return request('/billing/add', {
            method: 'POST',
            body: params,
            signal
        });
    },
    getById: (id: string, signal?: AbortSignal) => request(`/billing/${id}`, { signal }),
    update: (id: string, formData: any, signal?: AbortSignal) => {
        const params = new URLSearchParams(formData).toString();
        return request(`/billing/update/${id}`, {
            method: 'PUT',
            body: params,
            signal
        });
    },
    delete: (id: string, signal?: AbortSignal) => request(`/billing/delete/${id}`, {
        method: 'DELETE',
        signal
    }),
};

export const appointmentService = {
    getAll: (signal?: AbortSignal) => request('/appointment/list', { signal }),
    add: (formData: any, signal?: AbortSignal) => {
        const params = new URLSearchParams(formData).toString();
        return request('/appointment/add', {
            method: 'POST',
            body: params,
            signal
        });
    },
    getById: (id: string, signal?: AbortSignal) => request(`/appointment/${id}`, { signal }),
    update: (id: string, formData: any, signal?: AbortSignal) => {
        const params = new URLSearchParams(formData).toString();
        return request(`/appointment/update/${id}`, {
            method: 'PUT',
            body: params,
            signal
        });
    },
    delete: (id: string, signal?: AbortSignal) => request(`/appointment/delete/${id}`, {
        method: 'DELETE',
        signal
    }),
    updateStatus: (id: string, status: string, signal?: AbortSignal) => {
        const params = new URLSearchParams({ status }).toString();
        return request(`/appointment/status/${id}`, {
            method: 'PUT',
            body: params,
            signal
        });
    },
    getByDoctor: (doctorId: string, signal?: AbortSignal) => request(`/appointment/doctor/${doctorId}`, { signal }),
    getByPatient: (patientId: string, signal?: AbortSignal) => request(`/appointment/patient/${patientId}`, { signal }),
    getTodays: (signal?: AbortSignal) => {
        const today = new Date().toISOString().split('T')[0];
        return request(`/appointment/list?date=${today}`, { signal });
    },

    book: (formData: any, signal?: AbortSignal) => {
    const body = new URLSearchParams(formData).toString();
    return request('/appointment/book', {
        method: 'POST',
        body,
        signal
    });
},
    getByPhone: (phone: string, signal?: AbortSignal) => {
        const body = new URLSearchParams({ phone }).toString();
        return request('/patient/appointments', {
            method: 'POST',
            body,
            signal
        });
    },
    cancelAppointment: (appointment_id: string, signal?: AbortSignal) => {
        const body = new URLSearchParams({ appointment_id }).toString();
        return request('/appointment/cancel', {
            method: 'POST',
            body,
            signal
        });
    },
    rescheduleAppointment: (id: string, date: string, time: string, slotId: string, signal?: AbortSignal) => {
        const body = new URLSearchParams({ appointment_id: id, date, time, slot_id: slotId }).toString();
        return request('/appointment/reschedule', {
            method: 'POST',
            body,
            signal
        });
    },
    verifyRazorpayPayment: (payload: any, signal?: AbortSignal) => {
        const body = new URLSearchParams(payload).toString();
        return request('/appointment/verify-payment', {
            method: 'POST',
            body,
            signal
        });
    },
    updatePaymentStatus: (appointment_id: string, payment_status: string, signal?: AbortSignal) => {
        const params = new URLSearchParams({ payment_status }).toString();
        return request(`/appointment/payment-status/${appointment_id}`, {
            method: 'PUT',
            body: params,
            signal
        });
    },
};

// ✅ ADD THIS AT END OF FILE

export const authService = {
  adminLogin: (formData: FormData) => {
    return request('/admin/login', {
      method: 'POST',
      body: formData,
    });
  },
};

export const settingsService = {
  getSettings: (signal?: AbortSignal) => {
    return request('/settings', { signal });
  },
  updateSettings: (data: any, signal?: AbortSignal) => {
    return request('/settings/update', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
      signal,
    });
  },
};