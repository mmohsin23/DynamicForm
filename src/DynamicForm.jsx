import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';

const fieldTypes = [
    { value: 'text', label: 'Text Field' },
    { value: 'dropdown', label: 'Dropdown' },
    { value: 'radio', label: 'Radio Button' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'file', label: 'File Upload' },
    { value: 'date', label: 'Date Picker' },
    { value: 'phone', label: 'Phone Number' },
];

const DynamicFormBuilder = () => {
    const [fields, setFields] = useState([]);
    const [selectedType, setSelectedType] = useState(null);

    const validationSchema = yup.object().shape(
        fields.reduce((schema, field) => {
            if (field.required) {
                schema[field.name] = yup.string().required(`${field.label} is required`);
            }
            return schema;
        }, {})
    );

    const { control, handleSubmit } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = (data) => {
        console.log('Form Data:', data);
    };

    const addField = (type) => {
        if (!type) return;
        const name = `field_${fields.length}`;
        setFields([...fields, { type, name, label: type.label, required: false }]);
    };

    const renderField = (field, index) => {
        switch (field.type.value) {
            case 'text':
                return (
                    <div key={index} className="mb-3">
                        <label>{field.label}</label>
                        <Controller
                            name={field.name}
                            control={control}
                            defaultValue=""
                            render={({ field }) => <input {...field} className="form-control" />}
                        />
                    </div>
                );
            case 'dropdown':
                return (
                    <div key={index} className="mb-3">
                        <label>{field.label}</label>
                        <Controller
                            name={field.name}
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={[
                                        { value: 'option1', label: 'Option 1' },
                                        { value: 'option2', label: 'Option 2' },
                                    ]}
                                    isClearable
                                />
                            )}
                        />
                    </div>
                );
            case 'date':
                return (
                    <div key={index} className="mb-3">
                        <label>{field.label}</label>
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
                    </div>
                );
            case 'checkbox':
                return (
                    <div key={index} className="mb-3">
                        <label>
                            <Controller
                                name={field.name}
                                control={control}
                                render={({ field }) => <input {...field} type="checkbox" />}
                            />
                            {field.label}
                        </label>
                    </div>
                );
            case 'radio':
                return (
                    <div key={index} className="mb-3">
                        <label>{field.label}</label>
                        <Controller
                            name={field.name}
                            control={control}
                            render={({ field }) => (
                                <div>
                                    <input {...field} type="radio" value="Yes" /> Yes
                                    <input {...field} type="radio" value="No" /> No
                                </div>
                            )}
                        />
                    </div>
                );
            case 'file':
                return (
                    <div key={index} className="mb-3">
                        <label>{field.label}</label>
                        <Controller
                            name={field.name}
                            control={control}
                            render={({ field: { onChange } }) => (
                                <input
                                    type="file"
                                    className="form-control"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        onChange(file);
                                    }}
                                />
                            )}
                        />
                    </div>
                );
            case 'phone':
                return (
                    <div key={index} className="mb-3">
                        <label>{field.label}</label>
                        <Controller
                            name={field.name}
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <input
                                    {...field}
                                    type="tel"
                                    className="form-control"
                                    placeholder="e.g., +1 123-456-7890"
                                />
                            )}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="container mt-4">
            <h2>Dynamic Form Builder</h2>
            <div className="mb-3">
                <label>Add Field</label>
                <Select
                    options={fieldTypes}
                    value={selectedType}
                    onChange={(type) => {
                        setSelectedType(type);
                        addField(type);
                    }}
                    isClearable
                />
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                {fields.map((field, index) => renderField(field, index))}
                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default DynamicFormBuilder;
