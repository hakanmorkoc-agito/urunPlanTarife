import { useState, useRef, useEffect } from 'react'

const FloatingLabelInput = ({ 
  label, 
  value, 
  onChange, 
  type = 'text', 
  required = false, 
  disabled = false,
  className = '',
  placeholder = '',
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    setHasValue(value !== '' && value !== null && value !== undefined)
  }, [value])

  const isFloating = isFocused || hasValue

  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        type={type}
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
        className={`w-full px-4 pt-6 pb-2 border border-gray-300 rounded-lg focus:border-[#8746FA] focus:ring-2 focus:ring-[#8746FA]/30 transition-all ${
          disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'
        } ${isFloating ? '' : 'placeholder:text-transparent'}`}
        placeholder={isFloating ? placeholder : label}
        {...props}
      />
      <label
        className={`absolute left-4 transition-all duration-200 pointer-events-none ${
          isFloating
            ? 'top-2 text-xs text-[#8746FA] font-medium'
            : 'top-1/2 -translate-y-1/2 text-sm text-gray-500'
        } ${disabled ? 'text-gray-400' : ''}`}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    </div>
  )
}

export default FloatingLabelInput

