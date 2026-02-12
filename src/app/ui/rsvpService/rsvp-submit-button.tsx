"use client";

interface RsvpSubmitButtonProps {
  isEditing: boolean;
  isSubmitting: boolean;
  disabled: boolean;
  onClick: () => void;
}

export default function RsvpSubmitButton({ isEditing, isSubmitting, disabled, onClick }: RsvpSubmitButtonProps) {
  const buttonText = isSubmitting ? '處理中...' : isEditing ? '確認送出' : '修改回覆';
  
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isSubmitting}
      className={`mt-8 px-12 py-3 rounded-full font-medium transition-colors ${
        disabled || isSubmitting
          ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
          : 'bg-[#2c3e50] text-white hover:bg-[#1a2f4a]'
      }`}
    >
      {buttonText}
    </button>
  );
}
