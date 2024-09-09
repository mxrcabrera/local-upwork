import React, { useState } from 'react';
import { TextField, Button, Grid, IconButton, MenuItem, Select, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

type Field = {
  name: string;
  label: string;
  type: string;
  options?: { value: string; label: string }[];
  component?: JSX.Element; // Permitir componentes personalizados
};

type EntityFormProps = {
  defaultValues: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  fields: Field[];
};

const EntityForm: React.FC<EntityFormProps> = ({ defaultValues, onSubmit, onCancel, fields }) => {
  const [formValues, setFormValues] = useState(defaultValues);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues: any) => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<any>) => {
    const { name, value } = e.target;
    setFormValues((prevValues: any) => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleArrayChange = (name: string, index: number, value: string) => {
    setFormValues((prevValues: any) => {
      const updatedArray = [...prevValues[name]];
      updatedArray[index] = value;
      return { ...prevValues, [name]: updatedArray };
    });
  };

  const handleArrayAdd = (name: string, index: number) => {
    setFormValues((prevValues: any) => {
      const updatedArray = [...prevValues[name]];
      updatedArray.splice(index + 1, 0, '');
      return { ...prevValues, [name]: updatedArray };
    });
  };

  const handleArrayRemove = (name: string, index: number) => {
    setFormValues((prevValues: any) => {
      const updatedArray = prevValues[name].filter((_: any, i: number) => i !== index);
      return { ...prevValues, [name]: updatedArray };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Grid container spacing={2}>
        {fields.map((field) => (
          <Grid item xs={12} key={field.name}>
            {field.component ? (
              field.component
            ) : Array.isArray(defaultValues[field.name]) ? (
              <>
                {formValues[field.name].map((item: string, index: number) => (
                  <div key={index} className="flex items-center mb-2">
                    <TextField
                      name={`${field.name}[${index}]`}
                      label={`${field.label} ${index + 1}`}
                      value={item}
                      onChange={(e) => handleArrayChange(field.name, index, e.target.value)}
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      className="flex-grow"
                    />
                    <IconButton
                      onClick={() => handleArrayRemove(field.name, index)}
                      color="error"
                    >
                      <Remove />
                    </IconButton>
                    <IconButton
                      onClick={() => handleArrayAdd(field.name, index)}
                      color="primary"
                    >
                      <Add />
                    </IconButton>
                  </div>
                ))}
                <Button
                  onClick={() => handleArrayAdd(field.name, formValues[field.name].length - 1)}
                  variant="outlined"
                  color="primary"
                  className="mt-2"
                >
                  Agregar {field.label}
                </Button>
              </>
            ) : field.options ? (
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>{field.label}</InputLabel>
                <Select
                  name={field.name}
                  value={formValues[field.name] || ''}
                  onChange={handleSelectChange}
                  label={field.label}
                >
                  {field.options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <TextField
                name={field.name}
                label={field.label}
                value={formValues[field.name]}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                margin="normal"
                className="flex-grow"
              />
            )}
          </Grid>
        ))}
      </Grid>
      <div className="flex justify-end mt-4 space-x-2">
        <Button className="w-80 bg-gradient-to-r from-purple-400 to-green-300 hover:from-purple-500 hover:to-green-400 text-violet-950 font-semibold py-2 px-4 rounded shadow" type="submit">
          Guardar
        </Button>
        <Button className="w-80 bg-gradient-to-r from-purple-400 to-green-300 hover:from-purple-500 hover:to-green-400 text-violet-950 font-semibold py-2 px-4 rounded shadow" type="button" onClick={onCancel} >
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default EntityForm;