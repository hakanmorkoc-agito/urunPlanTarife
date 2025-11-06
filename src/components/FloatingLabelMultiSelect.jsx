import { useState, useEffect, useRef, forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'

const FloatingLabelMultiSelect = forwardRef(({
  label,
  value = [],
  onChange,
  options = [],
  required = false,
  disabled = false,
  className = '',
  getSelectedText,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)
  const internalRef = useRef(null)
  const selectRef = ref || internalRef

  useEffect(() => {
    setHasValue(value && value.length > 0)
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
        setIsFocused(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isOpen])

  const isFloating = hasValue || isOpen

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
      setIsFocused(!isOpen)
    }
  }

  const handleOptionClick = (optionValue) => {
    if (onChange) {
      const currentValues = value || []
      if (currentValues.includes(optionValue)) {
        onChange(currentValues.filter(v => v !== optionValue))
      } else {
        onChange([...currentValues, optionValue])
      }
    }
  }

  const displayText = getSelectedText 
    ? getSelectedText(value || [], options)
    : value && value.length > 0
      ? value.join(', ')
      : ''

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        ref={selectRef}
        onClick={handleToggle}
        disabled={disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          // Blur'u geciktir ki dropdown tıklamaları çalışsın
          setTimeout(() => {
            if (!isOpen) {
              setIsFocused(false)
            }
          }, 200)
        }}
        className={`w-full px-4 border border-gray-300 rounded-lg text-left flex items-center justify-between focus:border-[#8746FA] focus:ring-2 focus:ring-[#8746FA]/30 transition-all ${
          isFloating ? 'pt-6 pb-2' : 'py-3'
        } ${
          disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'
        }`}
        {...props}
      >
        <span className={hasValue ? 'text-gray-700' : 'text-transparent'}>
          {displayText || ' '}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
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

      {isOpen && !disabled && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option) => {
            const optionValue = typeof option === 'string' ? option : option.value
            const optionLabel = typeof option === 'string' ? option : option.label
            const isSelected = value && value.includes(optionValue)
            
            return (
              <label
                key={optionValue}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault()
                  handleOptionClick(optionValue)
                }}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleOptionClick(optionValue)}
                  className="w-4 h-4 text-[#8746FA] border-gray-300 rounded focus:ring-[#8746FA]"
                />
                <span className="text-sm text-gray-700">{optionLabel}</span>
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
})

FloatingLabelMultiSelect.displayName = 'FloatingLabelMultiSelect'

export default FloatingLabelMultiSelect

