export const validateRegistration = (formData, role) => {
  const errors = {};

  if (!formData.name?.trim()) {
    errors.name = 'Name is required';
  }

  if (!formData.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Invalid email format';
  }

  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (role === 'patient') {
    if (!formData.mobile) {
      errors.mobile = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      errors.mobile = 'Invalid Indian mobile number';
    }

    if (!formData.age) {
      errors.age = 'Age is required';
    } else if (formData.age < 0 || formData.age > 150) {
      errors.age = 'Invalid age';
    }
  }

  if (role === 'doctor') {
    if (!formData.specialization) {
      errors.specialization = 'Specialization is required';
    }

    if (!formData.qualifications) {
      errors.qualifications = 'Qualifications are required';
    }
  }

  if (role === 'hospital') {
    if (!formData.address) {
      errors.address = 'Address is required';
    }

    if (!formData.registrationNo) {
      errors.registrationNo = 'Registration number is required';
    }
  }

  return errors;
};

export const validateLogin = (identifier, password, role) => {
  const errors = {};

  if (!identifier) {
    errors.identifier = role === 'patient' ? 'Mobile or Email is required' : 'Email is required';
  }

  if (!password) {
    errors.password = 'Password is required';
  }

  return errors;
};

export const validatePatientForm = (formData) => {
  const errors = {};

  if (!formData.name?.trim()) {
    errors.name = 'Name is required';
  }

  if (!formData.mobile) {
    errors.mobile = 'Mobile number is required';
  } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
    errors.mobile = 'Invalid Indian mobile number';
  }

  if (!formData.age) {
    errors.age = 'Age is required';
  } else if (formData.age < 0 || formData.age > 150) {
    errors.age = 'Invalid age';
  }

  if (!formData.bloodGroup) {
    errors.bloodGroup = 'Blood group is required';
  }

  return errors;
};

export const validatePrescription = (prescription) => {
  const errors = {};

  if (!prescription.diagnosis?.trim()) {
    errors.diagnosis = 'Diagnosis is required';
  }

  if (prescription.medicines?.length > 0) {
    prescription.medicines.forEach((med, index) => {
      if (!med.name?.trim()) {
        errors[`medicine_${index}`] = 'Medicine name is required';
      }
    });
  }

  return errors;
};