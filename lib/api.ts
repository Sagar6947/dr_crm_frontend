export async function request(endpoint: string, options: RequestInit = {}) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                ...options.headers,
            },
        });

        const data = await response.json();

        if (data.status !== 200) {
            throw data;
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export const clinicService = {
    add: (formData: any) => {
        const params = new URLSearchParams(formData).toString();
        return request('/clinic/add', {
            method: 'POST',
            body: params,
        });
    },
};

export const geoService = {
    getStates: () => {
        return request('/state');
    },
    getCities: (stateId: string | number) => {
        return request(`/city/${stateId}`);
    },
};


export const patientService = {
    // Sabhi patients ki list
    getAll: () => request('/patient/list'),

    // Naya patient add karo
    add: (formData: any) => {
        const params = new URLSearchParams(formData).toString();
        return request('/patient/add', {
            method: 'POST',
            body: params,
        });
    },

    // ID se ek patient ka detail
    getById: (id: string) => request(`/patient/${id}`),

    // Patient update karo
    update: (id: string, formData: any) => {
        const params = new URLSearchParams(formData).toString();
        return request(`/patient/update/${id}`, {
            method: 'PUT',
            body: params,
        });
    },

    // Patient delete karo
    delete: (id: string) => request(`/patient/delete/${id}`, {
        method: 'DELETE',
    }),
}; 



export const doctorService = {
    // Sabhi doctors ki list
    getAll: () => request('/doctor/list'),

    // Naya doctor add karo
    add: (formData: any) => {
        const params = new URLSearchParams(formData).toString();
        return request('/doctor/add', {
            method: 'POST',
            body: params,
        });
    },

    // ID se ek doctor ka detail
    getById: (id: string) => request(`/doctor/${id}`),

    // Doctor update karo
    update: (id: string, formData: any) => {
        const params = new URLSearchParams(formData).toString();
        return request(`/doctor/update/${id}`, {
            method: 'PUT',
            body: params,
        });
    },

    // Doctor delete karo
    delete: (id: string) => request(`/doctor/delete/${id}`, {
        method: 'DELETE',
    }),
}; 


export const billingService = {
    // Sabhi bills ki list
    getAll: () => request('/billing/list'),

    // Naya bill create karo
    add: (formData: any) => {
        const params = new URLSearchParams(formData).toString();
        return request('/billing/add', {
            method: 'POST',
            body: params,
        });
    },

    // ID se ek bill ka detail
    getById: (id: string) => request(`/billing/${id}`),

    // Bill update karo
    update: (id: string, formData: any) => {
        const params = new URLSearchParams(formData).toString();
        return request(`/billing/update/${id}`, {
            method: 'PUT',
            body: params,
        });
    },

    // Bill delete karo
    delete: (id: string) => request(`/billing/delete/${id}`, {
        method: 'DELETE',
    }),
};



export const appointmentService = {
    // Sabhi appointments ki list
    getAll: () => request('/appointment/list'),

    // Naya appointment add karo
    add: (formData: any) => {
        const params = new URLSearchParams(formData).toString();
        return request('/appointment/add', {
            method: 'POST',
            body: params,
        });
    },

    // ID se ek appointment ka detail
    getById: (id: string) => request(`/appointment/${id}`),

    // Appointment update karo
    update: (id: string, formData: any) => {
        const params = new URLSearchParams(formData).toString();
        return request(`/appointment/update/${id}`, {
            method: 'PUT',
            body: params,
        });
    },

    // Appointment delete karo
    delete: (id: string) => request(`/appointment/delete/${id}`, {
        method: 'DELETE',
    }),

    // Status update karo (confirm, cancel, complete)
    updateStatus: (id: string, status: string) => {
        const params = new URLSearchParams({ status }).toString();
        return request(`/appointment/status/${id}`, {
            method: 'PUT',
            body: params,
        });
    },

    // Doctor ke appointments
    getByDoctor: (doctorId: string) => request(`/appointment/doctor/${doctorId}`),

    // Patient ke appointments
    getByPatient: (patientId: string) => request(`/appointment/patient/${patientId}`),

    // Aaj ke appointments
    getTodays: () => {
        const today = new Date().toISOString().split('T')[0];
        return request(`/appointment/list?date=${today}`);
    },
};