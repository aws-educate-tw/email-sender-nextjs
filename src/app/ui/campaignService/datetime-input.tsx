"use client";

import { forwardRef, useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import { X } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";

const datePickerStyles = `
  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker__input-container {
    width: 100%;
  }

  .react-datepicker {
    font-family: inherit;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .react-datepicker__header {
    background-color: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    padding-top: 0.5rem;
  }

  .react-datepicker__current-month {
    font-weight: 600;
    color: #1f2937;
  }

  .react-datepicker__day-name {
    color: #6b7280;
    font-weight: 500;
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background-color: #192f47;
    color: white;
  }

  .react-datepicker__day:not(.react-datepicker__day--disabled):not(
      .react-datepicker__day--selected
    ):hover {
    background-color: #dbeafe;
  }

  .react-datepicker__time-container {
    border-left: 1px solid #e5e7eb;
  }

  .react-datepicker__time-list-item--selected {
    background-color: #192f47 !important;
    color: white !important;
  }

  .react-datepicker__time-list-item:hover {
    background-color: #dbeafe !important;
  }
`;

interface DateTimeInputProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  placeholderText?: string;
  className?: string;
}

const CustomInput = forwardRef<HTMLInputElement, any>(
  ({ value, onClick, placeholder, minDate, maxDate, onClose, onDateChange }, ref) => {
    const [error, setError] = useState("");
    const [localValue, setLocalValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
      if (!isTyping) {
        if (value) {
          setLocalValue(value);
        } else {
          setLocalValue("");
        }
      }
    }, [value, isTyping]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsTyping(true);
      const inputValue = e.target.value;
      const digits = inputValue.replace(/\D/g, "");
      let formatted = "";

      if (digits.length === 0) {
        setLocalValue("");
        setError("");
        onDateChange(null);
        return;
      }

      if (digits.length > 0) {
        formatted += digits.substring(0, 4);
        if (digits.length >= 5) {
          formatted += "/" + digits.substring(4, 6);
        }
        if (digits.length >= 7) {
          formatted += "/" + digits.substring(6, 8);
        }
        if (digits.length >= 9) {
          formatted += " " + digits.substring(8, 10);
        }
        if (digits.length >= 11) {
          formatted += ":" + digits.substring(10, 12);
        }
      }

      setLocalValue(formatted);
      setError("");

      if (digits.length === 12 && formatted.length === 16) {
        const match = formatted.match(/^(\d{4})\/(\d{2})\/(\d{2}) (\d{2}):(\d{2})$/);
        if (match) {
          const [, year, month, day, hour, minute] = match;
          const y = parseInt(year);
          const m = parseInt(month);
          const d = parseInt(day);
          const h = parseInt(hour);
          const min = parseInt(minute);

          if (y < new Date().getFullYear() || y > 2100) {
            setError("Year should be between current year and 2100");
          } else if (m < 1 || m > 12) {
            setError("Month should be between 01-12");
          } else if (h > 23) {
            setError("Hour should be between 00-23");
          } else if (min > 59) {
            setError("Minute should be between 00-59");
          } else {
            const date = new Date(y, m - 1, d, h, min);
            if (date.getMonth() !== m - 1 || date.getDate() !== d) {
              const daysInMonth = new Date(y, m, 0).getDate();
              setError(`Day should be between 01-${daysInMonth} for month ${m}`);
            } else if (minDate && date < minDate) {
              const now = new Date();
              now.setSeconds(0, 0);
              const minDateCopy = new Date(minDate);
              minDateCopy.setSeconds(0, 0);
              const isMinDateNow = Math.abs(minDateCopy.getTime() - now.getTime()) < 60000;
              setError(
                isMinDateNow
                  ? "Cannot select past dates"
                  : "End time cannot be earlier than start time"
              );
            } else if (maxDate && date > maxDate) {
              const campaignStart =
                minDate && Math.abs(maxDate.getTime() - minDate.getTime()) > 86400000;
              setError(
                campaignStart
                  ? "Deadline cannot be later than campaign start time"
                  : "Date exceeds allowed range"
              );
            } else {
              setIsTyping(false);
              onDateChange(date);
            }
          }
        }
      }
    };

    const handleBlur = () => {
      setIsTyping(false);
      if (localValue && localValue.length > 0 && localValue.length < 16 && !error) {
        setError("Format should be YYYY/MM/DD HH:mm");
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        const target = e.target as HTMLInputElement;
        target.blur();
        setTimeout(() => {
          onClose?.();
        }, 0);
      }
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      setLocalValue("");
      onDateChange(null);
      setError("");
      setIsTyping(false);
    };

    return (
      <div>
        <div className="relative">
          <input
            ref={ref}
            value={localValue || value}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onClick={onClick}
            placeholder={placeholder}
            className={`w-full px-3 py-2 pr-8 border rounded-md focus:outline-none focus:ring-2 ${
              error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {(localValue || value) && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>
        {error && <div className="text-red-600 text-xs mt-1">{error}</div>}
      </div>
    );
  }
);

CustomInput.displayName = "CustomInput";

export default function DateTimeInput({
  selected,
  onChange,
  minDate,
  maxDate,
  placeholderText = "Type or select: YYYY/MM/DD HH:mm",
  className,
}: DateTimeInputProps) {
  const datePickerRef = useRef<DatePicker>(null);
  const previousSelectedRef = useRef<Date | null>(null);

  const handleClose = () => {
    setTimeout(() => {
      datePickerRef.current?.setOpen(false);
    }, 0);
  };

  const handleDateChange = (date: Date | null) => {
    const prevDate = previousSelectedRef.current;
    previousSelectedRef.current = date;
    onChange(date);

    if (date && prevDate) {
      const dateChanged = date.toDateString() !== prevDate.toDateString();
      const timeChanged =
        date.getHours() !== prevDate.getHours() || date.getMinutes() !== prevDate.getMinutes();

      if (dateChanged && !timeChanged) {
        return;
      }

      if (timeChanged) {
        setTimeout(() => {
          datePickerRef.current?.setOpen(false);
        }, 100);
      }
    }
  };

  return (
    <>
      <style>{datePickerStyles}</style>
      <DatePicker
        ref={datePickerRef}
        selected={selected}
        onChange={handleDateChange}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat="yyyy/MM/dd HH:mm"
        placeholderText={placeholderText}
        minDate={minDate}
        maxDate={maxDate}
        customInput={
          <CustomInput
            minDate={minDate}
            maxDate={maxDate}
            onClose={handleClose}
            onDateChange={onChange}
          />
        }
        className={className}
        timeCaption="Time"
        onClickOutside={handleClose}
      />
    </>
  );
}
