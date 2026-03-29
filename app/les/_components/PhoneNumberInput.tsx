'use client'

import React from 'react'

/**
 * Custom input component for react-phone-number-input.
 * Intercepts keydown events at the DOM level to strictly enforce a
 * maximum of 10 digits typed by the user (country code not counted).
 * Pass this as inputComponent={LimitedPhoneInput} to <PhoneInput>.
 */
const LimitedPhoneInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  (props, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const isDigit = /^[0-9]$/.test(e.key)
      if (isDigit) {
        const currentValue = (e.target as HTMLInputElement).value
        const currentDigits = currentValue.replace(/\D/g, '').length
        if (currentDigits >= 10) {
          e.preventDefault()
          return
        }
      }
      // Call original onKeyDown if provided
      if (props.onKeyDown) props.onKeyDown(e)
    }

    return <input {...props} ref={ref} onKeyDown={handleKeyDown} />
  }
)

LimitedPhoneInput.displayName = 'LimitedPhoneInput'

export default LimitedPhoneInput
