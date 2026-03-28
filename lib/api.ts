export async function request(endpoint: string, options: RequestInit = {}) {
    try {
        const defaultHeaders: any = {};
        if (!(options.body instanceof FormData)) {
            defaultHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        });

        const data = await response.json();

        // Handle AbortError specifically if needed, but fetch usually throws it automatically
        if (data.status !== 200) {
            throw data;
        }

        return data;
    } catch (error: any) {
        if (error.name === 'AbortError') {
            console.log('Request aborted:', endpoint);
            throw error;
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
            signal
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
};

export const geoService = {
    getStates: (signal?: AbortSignal) => {
        return request('/state', { signal });
    },
    getCities: (stateId: string | number, signal?: AbortSignal) => {
        return request(`/city/${stateId}`, { signal });
    },
};

export const patientService = {
    getAll: (signal?: AbortSignal) => request('/patient/list', { signal }),
    add: (formData: any, signal?: AbortSignal) => {
        const params = new URLSearchParams(formData).toString();
        return request('/patient/add', {
            method: 'POST',
            body: params,
            signal
        });
    },
    getById: (id: string, signal?: AbortSignal) => request(`/patient/${id}`, { signal }),
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
};

export const doctorService = {
    // getAll: (signal?: AbortSignal) => request('/doctor/list', { signal }),
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
    // getById: (id: string, signal?: AbortSignal) => request(`/doctor/${id}`, { signal }),
    getById: (id: string, signal?: AbortSignal) => request(`/doctor/detail/${id}`, { signal }),
    // update: (id: string, formData: any, signal?: AbortSignal) => {
    //     const params = new URLSearchParams(formData).toString();
    //     return request(`/doctor/update/${id}`, {
    //         method: 'PUT',
    //         body: params,
    //         signal
    //     });
    // }, 

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
};