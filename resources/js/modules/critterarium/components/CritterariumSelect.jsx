import { useEffect, useId, useRef, useState } from "react";

export default function CritterariumSelect({ label, value, options, onChange, disabled = false, className = "" }) {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState("below");
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const menuId = useId();
  const labelId = useId();
  const selected = options.find((option) => option.value === value) || options[0];

  useEffect(() => {
    if (!open) return undefined;
    const dismiss = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);

  function focusOption(index) {
    requestAnimationFrame(() => rootRef.current?.querySelectorAll('[role="option"]')[index]?.focus());
  }

  function showMenu() {
    const rect = rootRef.current?.getBoundingClientRect();
    const scrollBounds = rootRef.current?.closest(".catalog-create-body")?.getBoundingClientRect();
    if (rect) {
      const below = (scrollBounds?.bottom ?? window.innerHeight) - rect.bottom;
      const above = rect.top - (scrollBounds?.top ?? 0);
      setPlacement(below < options.length * 41 + 22 && above > below ? "above" : "below");
    }
    setOpen(true);
  }

  function onKeyDown(event) {
    if (disabled) return;
    const index = options.findIndex((option) => option.value === value);
    if (event.key === "Escape" && open) {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) showMenu();
      const current = Number(event.target.dataset.optionIndex ?? index);
      focusOption((current + (event.key === "ArrowDown" ? 1 : options.length - 1)) % options.length);
    } else if (open && (event.key === "Home" || event.key === "End")) {
      event.preventDefault();
      focusOption(event.key === "Home" ? 0 : options.length - 1);
    }
  }

  return (
    <div ref={rootRef} className={`critterarium-select ${className}`} data-open={open} data-placement={placement} onKeyDown={onKeyDown}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
      {label ? <span id={labelId} className="critterarium-select-label">{label}</span> : null}
      <button ref={triggerRef} type="button" className="critterarium-select-trigger" disabled={disabled}
        aria-label={label ? `${label}: ${selected?.label}` : selected?.label}
        aria-haspopup="listbox" aria-controls={menuId} aria-expanded={open}
        onClick={() => open ? setOpen(false) : showMenu()}>
        <span>{selected?.label}</span><span className="critterarium-select-chevron" aria-hidden="true" />
      </button>
      {open ? <div id={menuId} className="critterarium-select-menu" role="listbox" aria-labelledby={label ? labelId : undefined}>
        {options.map((option, index) => <button key={option.value} type="button" role="option"
          data-option-index={index} aria-selected={option.value === value} className="critterarium-select-option"
          onClick={() => { onChange(option.value); setOpen(false); triggerRef.current?.focus(); }}>
          {option.label}
        </button>)}
      </div> : null}
    </div>
  );
}
