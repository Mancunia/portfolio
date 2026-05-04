"use client";

interface EditableProps {
  value: string;
  onChange: (v: string) => void;
  editing: boolean;
  multiline?: boolean;
  className?: string;
  placeholder?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

export function Editable({
  value,
  onChange,
  editing,
  multiline,
  className,
  placeholder,
  as: Tag = "span",
}: EditableProps) {
  if (!editing) {
    return (
      <Tag className={className}>
        {value || <span className="editable-empty">{placeholder}</span>}
      </Tag>
    );
  }
  if (multiline) {
    return (
      <textarea
        className={`editable editable--multiline ${className ?? ""}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
      />
    );
  }
  return (
    <input
      className={`editable ${className ?? ""}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}
