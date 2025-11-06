import { useState, useEffect } from 'react'

const FloatingLabelSelect = ({ 
  label, 
  value, 
  onChange, 
  required = false, 
  disabled = false,
  className = '',
  children,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(false)

  useEffect(() => {
    setHasValue(value !== '' && value !== null && value !== undefined)
  }, [value])

  const isFloating = hasValue

  return (
    <div className={`relative ${className}`}>
      <select
        value={value || ''}
        onChange={(e) => {
          if (onChange) {
            onChange(e)
          }
          setHasValue(e.target.value !== '')
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        className={`w-full px-4 border border-gray-300 rounded-lg focus:border-[#8746FA] focus:ring-2 focus:ring-[#8746FA]/30 transition-all appearance-none ${
          isFloating ? 'pt-6 pb-2' : 'py-3'
        } ${
          disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'
        }`}
        {...props}
      >
        <option value="" disabled hidden></option>
        {children}
      </select>
      <label
        className={`absolute transition-all duration-200 pointer-events-none ${
          isFloating
            ? `left-3 -top-2.5 text-xs text-[#8746FA] font-medium px-1.5 ${disabled ? 'bg-gray-100' : 'bg-white'}`
            : 'left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500'
        } ${disabled ? 'text-gray-400' : ''}`}
        style={isFloating ? {} : { zIndex: 0 }}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {!disabled && (
        <div className="absolute right-3 pointer-events-none" style={{ top: isFloating ? '18px' : '50%', transform: isFloating ? 'none' : 'translateY(-50%)' }}>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      )}
    </div>
  )
}

export default FloatingLabelSelect

