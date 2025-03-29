import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface StatusDropdownProps {
  isOpen: boolean;
  anchorRef: React.RefObject<HTMLElement>; // trigger ref
  options: string[];
  selectedStatus: string | null;
  onSelect: (option: string) => void;
  onClose: () => void;
}

export const StatusDropdown = ({
  isOpen,
  anchorRef,
  options,
  selectedStatus,
  onSelect,
  onClose,
}: StatusDropdownProps) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // update dropdown position
  const updatePosition = () => {
    if (anchorRef.current) {
      const anchorRect = anchorRef.current.getBoundingClientRect();
      setPosition({
        top: anchorRect.bottom + window.scrollY + 4,
        left: anchorRect.left + window.scrollX,
      });
    }
  };

  // Initialize position when open dropdown
  useEffect(() => {
    if (isOpen && anchorRef.current) {
      updatePosition();
    }
  }, [isOpen]);

  // listen for various events that might cause position changes
  useEffect(() => {
    if (isOpen) {
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true); // add true to capture all scroll events

      // find all possible scroll containers and add listeners
      if (anchorRef.current) {
        // find all possible scrollable parent containers
        let parent = anchorRef.current.parentElement;
        const scrollContainers: HTMLElement[] = [];

        while (parent) {
          const style = window.getComputedStyle(parent);
          if (
            style.overflow === "auto" ||
            style.overflow === "scroll" ||
            style.overflowX === "auto" ||
            style.overflowX === "scroll" ||
            style.overflowY === "auto" ||
            style.overflowY === "scroll"
          ) {
            scrollContainers.push(parent);
          }
          parent = parent.parentElement;
        }

        // add scroll event listeners for each scroll container
        scrollContainers.forEach(container => {
          container.addEventListener("scroll", updatePosition);
        });

        // cleanup
        return () => {
          window.removeEventListener("resize", updatePosition);
          window.removeEventListener("scroll", updatePosition, true);
          scrollContainers.forEach(container => {
            container.removeEventListener("scroll", updatePosition);
          });
        };
      }
    }

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen]);

  if (!isOpen || !anchorRef.current) return null;

  return createPortal(
    <div
      className="absolute mt-1 bg-white border rounded shadow-lg w-32 z-[9999] status-dropdown-container"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      {options.map(option => (
        <button
          key={option}
          className={
            (selectedStatus === null ? "ALL" : selectedStatus) === option.toUpperCase()
              ? "block w-full text-left px-4 py-2 text-sm hover:bg-gray-200 bg-[#DDE0E5]"
              : "block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          }
          onClick={() => {
            onSelect(option);
            onClose();
          }}
        >
          {option}
        </button>
      ))}
    </div>,
    document.body
  );
};
