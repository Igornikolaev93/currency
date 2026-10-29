import {
  useState,
  useEffect,
  ChangeEvent,
  DragEvent,
  ReactNode,
  CSSProperties,
} from 'react';
import { Sidebar } from '../components/Sidebar';

/* ============================================================
   Типы и константы
   ============================================================ */
type Priority = 'Low' | 'Medium' | 'High';
type Status = 'To Do' | 'In Progress' | 'Done';
type Mode = 'form' | 'preview' | 'edit';

interface Tag {
  label: string;
  color: string;
  background: string;
}

interface ImageFile {
  url: string;
  name: string;
}

interface FormState {
  title: string;
  description: string;
  priority: Priority | '';
  status: Status | '';
  assignee: string;
  deadline: string;
  tags: Tag[];
  images: ImageFile[];
}

type Errors = Partial<Record<keyof FormState, string>>;

const PRIORITIES: Priority[] = ['Low', 'Medium', 'High'];
const STATUSES: Status[] = ['To Do', 'In Progress', 'Done'];
const ASSIGNEES = ['Alex Johnson', 'Мария Петрова', 'Алексей Смирнов'];

const TAG_PALETTE = [
  { background: '#EEE4FF', color: '#814EE0' },
  { background: '#E7EEFF', color: '#2563EB' },
  { background: '#FFE7E7', color: '#EA3A3A' },
];

const EMPTY: FormState = {
  title: '',
  description: '',
  priority: '',
  status: '',
  assignee: '',
  deadline: '',
  tags: [],
  images: [],
};

const PRIORITY_STYLE: Record<Priority, { background: string; color: string; icon: string }> = {
  Low:    { background: '#E0F8E6', color: '#22B14C', icon: '🟢' },
  Medium: { background: '#FFF0E0', color: '#E98D20', icon: '🟡' },
  High:   { background: '#FFF0E0', color: '#E98D20', icon: '🔥' },
};

const STATUS_STYLE: Record<Status, { background: string; color: string }> = {
  'To Do':       { background: '#F0F1F6', color: '#8E93A1' },
  'In Progress': { background: '#E7EEFF', color: '#2563EB' },
  'Done':        { background: '#E0F8E6', color: '#22B14C' },
};

/* ============================================================
   Форматирование для alert
   ============================================================ */
function formatForAlert(data: FormState): string {
  const deadline = data.deadline
    ? new Date(data.deadline).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '—';

  return [
    '📋 Card Data',
    '─────────────────',
    `Title:       ${data.title || '—'}`,
    `Description: ${data.description || '—'}`,
    `Priority:    ${data.priority || '—'}`,
    `Status:      ${data.status || '—'}`,
    `Assignee:    ${data.assignee || '—'}`,
    `Deadline:    ${deadline}`,
    `Tags:        ${data.tags.length ? data.tags.map((t) => t.label).join(', ') : '—'}`,
    `Images:      ${data.images.length ? data.images.map((i) => i.name).join(', ') : '—'}`,
  ].join('\n');
}

/* ============================================================
   Главный компонент
   ============================================================ */
export function KanbanPage() {
  const [mode, setMode] = useState<Mode>('form');
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saved, setSaved] = useState<FormState>(EMPTY);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [dragging, setDragging] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const e: Errors = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.priority) e.priority = 'Please select a priority';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = () => {
    if (!validate()) return;
    alert(`✅ Creating new card...\n\n${formatForAlert(form)}`);
    setSaved(form);
    setMode('preview');
    setToastVisible(true);
  };

  const handleSave = () => {
    if (!validate()) return;
    alert(`💾 Saving changes...\n\n${formatForAlert(form)}`);
    setSaved(form);
    setMode('preview');
    setToastVisible(true);
  };

  const handleEdit = () => {
    setForm(saved);
    setMode('edit');
  };

  const handleCancel = () => {
    if (mode === 'edit') {
      setForm(saved);
      setMode('preview');
    } else {
      setForm(EMPTY);
      setErrors({});
    }
  };

  useEffect(() => {
    if (!toastVisible) return;
    const t = setTimeout(() => setToastVisible(false), 2500);
    return () => clearTimeout(t);
  }, [toastVisible]);

  const addTag = () => {
    const t = tagInput.trim();
    if (!t || form.tags.some((x) => x.label === t)) {
      setTagInput('');
      return;
    }
    const palette = TAG_PALETTE[form.tags.length % TAG_PALETTE.length];
    update('tags', [...form.tags, { label: t, ...palette }]);
    setTagInput('');
  };

  const removeTag = (label: string) => {
    update('tags', form.tags.filter((t) => t.label !== label));
  };

  const handleImageFiles = (files: FileList | null) => {
    if (!files) return;
    const next = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .map((f) => ({ url: URL.createObjectURL(f), name: f.name }));
    update('images', [...form.images, ...next]);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    handleImageFiles(e.dataTransfer.files);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#EFEFF4' }}>
      <Sidebar activeItem="cards" />
      <main
        style={{
          flex: 1,
          minWidth: 0,
          padding: '28px 36px',
          background: '#F9F9FD',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          fontFamily: 'Inter, sans-serif',
          overflow: 'visible',
        }}
      >
        {mode === 'preview' ? (
          <PreviewView
            data={saved}
            toastVisible={toastVisible}
            onBack={() => setMode('form')}
            onEdit={handleEdit}
          />
        ) : (
          <FormView
            mode={mode}
            form={form}
            errors={errors}
            tagInput={tagInput}
            dragging={dragging}
            onUpdate={update}
            onTagInputChange={setTagInput}
            onAddTag={addTag}
            onRemoveTag={removeTag}
            onImageFiles={handleImageFiles}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onCancel={handleCancel}
            onSubmit={mode === 'edit' ? handleSave : handleCreate}
          />
        )}
      </main>
    </div>
  );
}

function FormView({
  mode,
  form,
  errors,
  tagInput,
  dragging,
  onUpdate,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
  onImageFiles,
  onDragOver,
  onDragLeave,
  onDrop,
  onCancel,
  onSubmit,
}: {
  mode: 'form' | 'edit';
  form: FormState;
  errors: Errors;
  tagInput: string;
  dragging: boolean;
  onUpdate: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  onTagInputChange: (v: string) => void;
  onAddTag: () => void;
  onRemoveTag: (label: string) => void;
  onImageFiles: (files: FileList | null) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  onCancel: () => void;
  onSubmit: () => void;
}) {
  const submitLabel = mode === 'edit' ? 'Save Card' : 'Create Card';

  return (
    <>
      <h1 style={{ color: '#18184C', fontSize: 26, fontWeight: 700, margin: 0 }}>
        Create New Card
      </h1>

      <div className="kanban-form"
        style={{
          background: 'white',
          boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.04)',
          borderRadius: 20,
          padding: 28,
          display: 'flex',
          gap: 28,
          alignItems: 'flex-start',
        }}
      >
        {/* Левая колонка */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Field label="Title *" required error={errors.title}>
            <input
              value={form.title}
              onChange={(e) => onUpdate('title', e.target.value)}
              placeholder="Enter card title"
              style={inputStyle(!!errors.title)}
            />
          </Field>

          <Field label="Description *" required error={errors.description}>
            <textarea
              value={form.description}
              onChange={(e) => onUpdate('description', e.target.value)}
              placeholder="Enter detailed description..."
              style={{
                ...inputStyle(!!errors.description),
                height: 110,
                paddingTop: 12,
                paddingBottom: 12,
                resize: 'vertical',
              }}
            />
          </Field>

          <Field label="Priority *" required error={errors.priority}>
            <select
              value={form.priority}
              onChange={(e) => onUpdate('priority', e.target.value as Priority)}
              style={inputStyle(!!errors.priority)}
            >
              <option value="">Select priority</option>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </Field>

          <Field label="Status">
            <select
              value={form.status}
              onChange={(e) => onUpdate('status', e.target.value as Status)}
              style={inputStyle(false)}
            >
              <option value="">Select status</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>
        </div>

        {/* Правая колонка */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Field label="Assignee">
            <select
              value={form.assignee}
              onChange={(e) => onUpdate('assignee', e.target.value)}
              style={inputStyle(false)}
            >
              <option value="">Select assignee</option>
              {ASSIGNEES.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </Field>

          <Field label="Deadline">
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => onUpdate('deadline', e.target.value)}
              style={inputStyle(false)}
            />
          </Field>

          <Field label="Tags">
            <div style={tagsBoxStyle}>
              {form.tags.map((t) => (
                <span key={t.label} style={tagChipStyle(t.background, t.color)}>
                  {t.label}
                  <button onClick={() => onRemoveTag(t.label)} style={tagRemoveStyle(t.color)}>×</button>
                </span>
              ))}
              <input
                value={tagInput}
                onChange={(e) => onTagInputChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    onAddTag();
                  }
                }}
                onBlur={onAddTag}
                placeholder={form.tags.length ? '' : 'Add tags...'}
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  flex: 1,
                  minWidth: 80,
                  fontSize: 14,
                  fontFamily: 'Inter, sans-serif',
                  color: '#18184C',
                }}
              />
            </div>
          </Field>

          <Field label={`Images${form.images.length ? ` (${form.images.length})` : ''}`}>
            {form.images.length === 0 ? (
              <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => document.getElementById('image-input')?.click()}
                style={{
                  height: 120,
                  borderRadius: 14,
                  outline: `2px ${dragging ? '#2563EB' : '#E6E7ED'} solid`,
                  outlineOffset: -2,
                  background: dragging ? '#E7EEFF' : 'transparent',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: 28 }}>☁️</div>
                <div style={{ color: '#8E93A1', fontSize: 13 }}>Drag & drop images here</div>
                <div style={{ color: '#2563EB', fontSize: 13, fontWeight: 600 }}>or click to browse</div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {form.images.map((img, i) => {
                  const fallback = ['#CFD8E7', '#D8CFE7', '#CFE7D8'][i % 3];
                  return (
                    <div
                      key={img.name}
                      style={{
                        flex: '1 1 0',
                        minWidth: 100,
                        padding: '4px 4px 6px',
                        background: '#F2F3F9',
                        borderRadius: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                        position: 'relative',
                      }}
                    >
                      <div
                        style={{
                          height: 64,
                          borderRadius: 8,
                          background: img.url
                            ? `url(${img.url}) center/cover`
                            : fallback,
                          position: 'relative',
                        }}
                      >
                        <button
                          onClick={() =>
                            onUpdate('images', form.images.filter((x) => x.name !== img.name))
                          }
                          style={{
                            position: 'absolute',
                            top: 6,
                            right: 6,
                            background: 'transparent',
                            border: 'none',
                            color: '#EA3A3A',
                            fontSize: 14,
                            fontWeight: 700,
                            cursor: 'pointer',
                            lineHeight: 1,
                          }}
                        >
                          ×
                        </button>
                      </div>
                      <div
                        style={{
                          color: '#8E93A1',
                          fontSize: 10,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {img.name}
                      </div>
                    </div>
                  );
                })}
                <button
                  onClick={() => document.getElementById('image-input')?.click()}
                  style={{
                    flex: '0 0 64px',
                    height: 84,
                    borderRadius: 10,
                    border: '2px dashed #E6E7ED',
                    background: 'transparent',
                    color: '#8E93A1',
                    fontSize: 22,
                    cursor: 'pointer',
                  }}
                >
                  +
                </button>
              </div>
            )}
            <input
              id="image-input"
              type="file"
              accept="image/*"
              multiple
              onChange={(e: ChangeEvent<HTMLInputElement>) => onImageFiles(e.target.files)}
              style={{ display: 'none' }}
            />
          </Field>
        </div>
      </div>

      <div className="kanban-buttons" style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        <button onClick={onCancel} style={cancelBtnStyle}>Cancel</button>
        <button onClick={onSubmit} style={primaryBtnStyle}>{submitLabel}</button>
      </div>
    </>
  );
}

/* ============================================================
   Preview (3.4)
   ============================================================ */
function PreviewView({
  data,
  toastVisible,
  onBack,
  onEdit,
}: {
  data: FormState;
  toastVisible: boolean;
  onBack: () => void;
  onEdit: () => void;
}) {
  const formattedDeadline = data.deadline
    ? new Date(data.deadline).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '—';

  const status = data.status || 'To Do';
  const priority = data.priority || 'Low';
  const statusStyle = STATUS_STYLE[status as Status];
  const priorityStyle = PRIORITY_STYLE[priority as Priority];

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ color: '#18184C', fontSize: 26, fontWeight: 700 }}>Card Preview</div>
        <div style={{ flex: 1 }} />
        <div
          style={{
            padding: '7px 14px',
            background: '#E0F8E6',
            borderRadius: 10,
            color: '#22B14C',
            fontSize: 13,
            fontWeight: 600,
            opacity: toastVisible ? 1 : 0,
            transform: toastVisible ? 'translateY(0)' : 'translateY(-4px)',
            transition: 'opacity 0.25s ease, transform 0.25s ease',
            pointerEvents: 'none',
          }}
        >
          ✓ Card Created
        </div>
      </div>

      <div
        style={{
          background: 'white',
          boxShadow: '0px 6px 24px rgba(0, 0, 0, 0.06), 0px 2px 6px rgba(0, 0, 0, 0.02)',
          borderRadius: 20,
          padding: '28px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          <span
            style={{
              padding: '5px 10px',
              borderRadius: 8,
              background: statusStyle.background,
              color: statusStyle.color,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {status}
          </span>
          <span
            style={{
              padding: '5px 10px',
              borderRadius: 8,
              background: priorityStyle.background,
              color: priorityStyle.color,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {priorityStyle.icon} {priority}
          </span>
        </div>

        <div style={{ color: '#18184C', fontSize: 22, fontWeight: 700 }}>
          {data.title || 'Untitled'}
        </div>

        {data.description && (
          <div style={{ color: '#8E93A1', fontSize: 15, lineHeight: '22px' }}>
            {data.description}
          </div>
        )}

        <div style={{ height: 1, background: '#E6E7ED' }} />

        <div style={{ display: 'flex', gap: 40 }}>
          <div>
            <div style={{ color: '#8E93A1', fontSize: 11, fontWeight: 600, letterSpacing: '0.55px', marginBottom: 4 }}>
              ASSIGNEE
            </div>
            <div style={{ color: '#18184C', fontSize: 15, fontWeight: 600 }}>
              {data.assignee || '—'}
            </div>
          </div>
          <div>
            <div style={{ color: '#8E93A1', fontSize: 11, fontWeight: 600, letterSpacing: '0.55px', marginBottom: 4 }}>
              DEADLINE
            </div>
            <div style={{ color: '#18184C', fontSize: 15, fontWeight: 600 }}>
              {formattedDeadline}
            </div>
          </div>
        </div>

        {data.tags.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {data.tags.map((t) => (
              <span key={t.label} style={tagChipStyle(t.background, t.color)}>{t.label}</span>
            ))}
          </div>
        )}

        {data.images.length > 0 && (
          <div style={{ display: 'flex', gap: 10 }}>
            {data.images.map((img, i) => {
              const fallback = ['#CFD8E7', '#D8CFE7', '#CFE7D8'][i % 3];
              return (
                <div
                  key={img.name}
                  title={img.name}
                  style={{
                    width: 90,
                    height: 60,
                    borderRadius: 10,
                    background: img.url
                      ? `url(${img.url}) center/cover`
                      : fallback,
                  }}
                />
              );
            })}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={onBack} style={cancelBtnStyle}>← Back to Form</button>
        <button onClick={onEdit} style={primaryBtnStyle}>Edit Card</button>
      </div>
    </>
  );
}

/* ============================================================
   Общие элементы
   ============================================================ */
function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  const hasError = Boolean(error);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div
        style={{
          color: hasError ? '#EA3A3A' : '#18184C',
          fontSize: 13,
          fontWeight: 500,
          transition: 'color 0.15s ease',
        }}
      >
        {label}
        {required && !label.includes('*') ? ' *' : ''}
      </div>
      {children}
      {error && (
        <div style={{ color: '#EA3A3A', fontSize: 12, fontWeight: 500 }}>{error}</div>
      )}
    </div>
  );
}

const inputStyle = (hasError: boolean): CSSProperties => ({
  width: '100%',
  padding: '14px 16px',
  background: hasError ? '#FFF2F2' : '#F2F3F9',
  borderRadius: 14,
  border: 'none',
  outline: hasError ? '1.5px solid #EA3A3A' : 'none',
  outlineOffset: hasError ? -1.5 : undefined,
  color: '#18184C',
  fontSize: 14,
  fontFamily: 'Inter, sans-serif',
  boxSizing: 'border-box',
  transition: 'background 0.15s ease, outline-color 0.15s ease',
});

const tagsBoxStyle: CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  background: '#F2F3F9',
  borderRadius: 14,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 8,
  boxSizing: 'border-box',
  minHeight: 48,
};

const tagChipStyle = (background: string, color: string): CSSProperties => ({
  padding: '5px 10px',
  borderRadius: 8,
  background,
  color,
  fontSize: 12,
  fontWeight: 600,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
});

const tagRemoveStyle = (color: string): CSSProperties => ({
  border: 'none',
  background: 'transparent',
  color,
  fontSize: 14,
  lineHeight: 1,
  cursor: 'pointer',
  padding: 0,
});

const cancelBtnStyle: CSSProperties = {
  padding: '13px 28px',
  borderRadius: 14,
  outline: '1.5px solid #E6E7ED',
  outlineOffset: -1.5,
  background: 'transparent',
  border: 'none',
  color: '#8E93A1',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'Inter, sans-serif',
};

const primaryBtnStyle: CSSProperties = {
  padding: '13px 28px',
  borderRadius: 14,
  background: '#18184C',
  boxShadow: '0px 4px 12px rgba(23.97, 23.97, 75.99, 0.20)',
  border: 'none',
  color: 'white',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'Inter, sans-serif',
};