import { useState, useRef, useEffect, forwardRef } from 'react'

const FloatingLabelInput = forwardRef(({ 
  label, 
  value, 
  onChange, 
  type = 'text', 
  required = false, 
  disabled = false,
  className = '',
  placeholder = '',
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(false)
  const internalRef = useRef(null)
  const inputRef = ref || internalRef

  useEffect(() => {
    setHasValue(value !== '' && value !== null && value !== undefined)
  }, [value])

  const isFloating = hasValue

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
        className={`w-full px-4 border border-gray-300 rounded-lg focus:border-[#8746FA] focus:ring-2 focus:ring-[#8746FA]/30 transition-all ${
          isFloating ? 'pt-6 pb-2' : 'py-3'
        } ${
          disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'
        } ${type === 'date' ? 'text-gray-900' : ''}`}
        placeholder=""
        {...props}
      />
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
    </div>
  )
})

FloatingLabelInput.displayName = 'FloatingLabelInput'

export default FloatingLabelInput

