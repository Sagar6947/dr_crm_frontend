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
    // all patients list
    getAll: () => request('/patient/list'),

    // add patient
    add: (formData: any) => {
        const params = new URLSearchParams(formData).toString();
        return request('/patient/add', {
            method: 'POST',
            body: params,
        });
    },

    // get patient by ID
    getById: (id: string) => request(`/patient/${id}`),

    // update patient
    update: (id: string, formData: any) => {
        const params = new URLSearchParams(formData).toString();
        return request(`/patient/update/${id}`, {
            method: 'PUT',
            body: params,
        });
    },

    // delete patient
    delete: (id: string) => request(`/patient/delete/${id}`, {
        method: 'DELETE',
    }),
}; 



export const doctorService = {
    // all doctors list
    getAll: () => request('/doctor/list'),

    // add doctor
    add: (formData: any) => {
        const params = new URLSearchParams(formData).toString();
        return request('/doctor/add', {
            method: 'POST',
            body: params,
        });
    },

    // get doctor by ID
    getById: (id: string) => request(`/doctor/${id}`),

    // update doctor
    update: (id: string, formData: any) => {
        const params = new URLSearchParams(formData).toString();
        return request(`/doctor/update/${id}`, {
            method: 'PUT',
            body: params,
        });
    },

    // delete doctor
    delete: (id: string) => request(`/doctor/delete/${id}`, {
        method: 'DELETE',
    }),
}; 


export const billingService = {
    // all bills list
    getAll: () => request('/billing/list'),

    // add bill
    add: (formData: any) => {
        const params = new URLSearchParams(formData).toString();
        return request('/billing/add', {
            method: 'POST',
            body: params,
        });
    },

    // get bill by ID
    getById: (id: string) => request(`/billing/${id}`),

    // update bill
    update: (id: string, formData: any) => {
        const params = new URLSearchParams(formData).toString();
        return request(`/billing/update/${id}`, {
            method: 'PUT',
            body: params,
        });
    },

    // delete bill
    delete: (id: string) => request(`/billing/delete/${id}`, {
        method: 'DELETE',
    }),
};



export const appointmentService = {
    // all appointments list
    getAll: () => request('/appointment/list'),

    // add appointment
    add: (formData: any) => {
        const params = new URLSearchParams(formData).toString();
        return request('/appointment/add', {
            method: 'POST',
            body: params,
        });
    },

    // get appointment by ID
    getById: (id: string) => request(`/appointment/${id}`),

    // update appointment
    update: (id: string, formData: any) => {
        const params = new URLSearchParams(formData).toString();
        return request(`/appointment/update/${id}`, {
            method: 'PUT',
            body: params,
        });
    },

    // delete appointment
    delete: (id: string) => request(`/appointment/delete/${id}`, {
        method: 'DELETE',
    }),

    // update appointment status
    updateStatus: (id: string, status: string) => {
        const params = new URLSearchParams({ status }).toString();
        return request(`/appointment/status/${id}`, {
            method: 'PUT',
            body: params,
        });
    },

    // doctor's appointments
    getByDoctor: (doctorId: string) => request(`/appointment/doctor/${doctorId}`),

    // patient's appointments
    getByPatient: (patientId: string) => request(`/appointment/patient/${patientId}`),

    // today's appointments
    getTodays: () => {
        const today = new Date().toISOString().split('T')[0];
        return request(`/appointment/list?date=${today}`);
    },
};