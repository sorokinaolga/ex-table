import { useEffect, useRef, useState } from 'react';
import './EditableTitle.css';

interface EditableTitleProps {
  value: string;
  onChange: (next: string) => void;
  maxLength?: number;
  placeholder?: string;
}

export function EditableTitle({ value, onChange, maxLength = 80, placeholder = 'Без названия' }: EditableTitleProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const startEditing = () => {
    setDraft(value);
    setEditing(true);
  };

  const commit = () => {
    const next = draft.trim();
    if (next === '' || next === value) {
      setEditing(false);
      setDraft(value);
      return;
    }
    onChange(next);
    setEditing(false);
  };

  const cancel = () => {
    setDraft(value);
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        className="editable-title__input"
        value={draft}
        maxLength={maxLength}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            commit();
          } else if (e.key === 'Escape') {
            e.preventDefault();
            cancel();
          }
        }}
      />
    );
  }

  return (
    <button type="button" className="editable-title__button" onClick={startEditing} title="Нажмите, чтобы изменить название">
      {value.trim() === '' ? <span className="editable-title__placeholder">{placeholder}</span> : value}
    </button>
  );
}
