import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const fieldTypes = [
    { value: 'text', label: 'Text Field' },
    { value: 'dropdown', label: 'Dropdown' },
    { value: 'radio', label: 'Radio Button' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'file', label: 'File Upload' },
    { value: 'date', label: 'Date Picker' },
    { value: 'phone', label: 'Phone Number' },
    { value: 'section', label: 'Section' },
];

const DynamicFormBuilder = () => {
    const [fields, setFields] = useState([]);
    const [submittedData, setSubmittedData] = useState(null);

    const { control, handleSubmit } = useForm();

    const generateFieldName = (type, sectionIndex, fieldIndex) =>
        `section_${sectionIndex}_field_${type.label}_${fieldIndex}`;

    const addField = (type, targetFields, sectionIndex) => {
        const fieldIndex = targetFields.length;
        const name = generateFieldName(type, sectionIndex, fieldIndex);
        const newField = {
            type,
            id: `${sectionIndex}-${fieldIndex}-${Date.now()}`,
            name,
            label: `${type.label} (${fieldIndex + 1})`,
            required: false,
        };
        if (type.value === 'section') {
            newField.fields = [];
        }
        targetFields.push(newField);
        setFields([...fields]);
    };

    const removeField = (id, targetFields) => {
        const index = targetFields.findIndex((field) => field.id === id);
        if (index !== -1) {
            targetFields.splice(index, 1);
            setFields([...fields]);
        }
    };

    const renderFields = (targetFields, sectionIndex) => {
        return targetFields.map((field, fieldIndex) => (
            <div key={field.id} className="mb-3 border p-3">
                <label>
                    {field.label}
                    <span
                        onClick={() => removeField(field.id, targetFields)}
                        style={{ cursor: 'pointer', color: 'red', marginLeft: '10px' }}
                    >
                        ✕
                    </span>
                </label>
                {field.type.value === 'text' && (
                    <Controller
                        name={field.name}
                        control={control}
                        defaultValue=""
                        render={({ field }) => <input {...field} className="form-control" />}
                    />
                )}
                {field.type.value === 'dropdown' && (
                    <Controller
                        name={field.name}
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={[
                                    { value: 'Choice 1', label: 'Choice 1' },
                                    { value: 'Choice 2', label: 'Choice 2' },
                                ]}
                                onChange={(selected) => field.onChange(selected?.value)}
                                isClearable
                            />
                        )}
                    />
                )}
                {field.type.value === 'date' && (
                    <Controller
                        name={field.name}
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                {...field}
                                className="form-control"
                                selected={field.value || null}
                            />
                        )}
                    />
                )}
                {field.type.value === 'section' && (
                    <>
                        <button
                            className="btn btn-sm btn-secondary mb-2"
                            onClick={(e) => {
                                e.preventDefault();
                                addField(fieldTypes[0], field.fields, fieldIndex);
                            }}
                        >
                            Add Nested Field
                        </button>
                        <div className="nested-section">
                            {renderFields(field.fields, fieldIndex)}
                        </div>
                    </>
                )}
            </div>
        ));
    };

    const displayData = (data, depth = 0) => {
        return Object.entries(data).map(([key, value]) => {
            const isObject = typeof value === 'object' && value !== null;
            return (
                <div key={key} style={{ marginLeft: depth * 20 }}>
                    <strong>{key}:</strong> {isObject ? displayData(value, depth + 1) : value}
                </div>
            );
        });
    };

    const onSubmit = (data) => {
        setSubmittedData(data);
    };

    return (
        <div className="container mt-4">
            <h2>Dynamic Form Builder</h2>
            <div className="mb-3">
                <label>Add Field</label>
                <Select
                    options={fieldTypes}
                    onChange={(type) => addField(type, fields, 0)}
                    isClearable
                />
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                {renderFields(fields, 0)}
                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </form>
            {submittedData && (
                <div className="mt-4">
                    <h3>Submitted Data:</h3>
                    <div>{displayData(submittedData)}</div>
                </div>
            )}
        </div>
    );
};

export default DynamicFormBuilder;
