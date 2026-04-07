import * as yup from 'yup'

export const signupSchema = yup.object().shape({
  email: yup
    .string()
    .email('Enter valid email')
    .required('Email Address is Required'),
  referralCode: yup.string(),
  passcode: yup
    .string()
    .required('Passcode is required')
    .matches(/^\d{4}$/, 'Passcode must be exactly 6 digits'),
  fullname: yup
    .string()
    .required('Full name is required')
    .test(
      'at-least-two-names',
      'Must contain at least two names',
      value => value.trim().split(/\s+/).length >= 2 // 2nd check: at least two names, handles multiple spaces
    )
    .test(
      'min-three-chars-per-name',
      'Each name must be at least three characters long',
      value =>
        value
          .trim()
          .split(/\s+/)
          .every(name => name.length >= 3) // 3rd check: each name at least 3 characters
    ),

  phone: yup
    .string()
    .matches(/^[0-9]{10,11}$/, 'Phone number must be 10-11 digits')
    .required('Phone number is required')
})

export const setPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, ({min}) => `Password must be at least ${min} characters`)
    .required('Password is required'),
  confirm_password: yup
    .string()
    .test('passwords-match', 'Passwords must match', function (value) {
      return this.parent.password === value
    })
})

export const loginSchema = yup.object().shape({
  email: yup.string().email('Enter valid email').required('Email is Required'),
  password: yup.string().required('Password is required')
})
