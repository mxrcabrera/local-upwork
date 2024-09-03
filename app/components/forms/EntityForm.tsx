import React from 'react';
import { useForm, Controller, FieldValues, DefaultValues } from 'react-hook-form';
import { DialogContent, DialogActions, Button, TextField, Select, MenuItem, InputLabel, FormControl, FormHelperText } from '@mui/material';

type EntityFormProps<T extends FieldValues> = {
  defaultValues: DefaultValues<T>;
  onSubmit: (data: T) => void;
  onCancel: () => void;
  fields: Array<{ name: keyof T; label: string; type: 'text' | 'select'; options?: Array<{ value: any; label: string }> }>;
};

const EntityForm = <T extends FieldValues>({ defaultValues, onSubmit, onCancel, fields }: EntityFormProps<T>) => {
  const { control, handleSubmit, formState: { errors } } = useForm<T>({ defaultValues });

  // Helper function to get error message as a string
  const getErrorMessage = (error: any): string => {
    if (error) {
      return typeof error.message === 'string' ? error.message : 'Error';
    }
    return '';
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4">
      <DialogContent>
        {fields.map((field) => (
          <Controller
            key={String(field.name)}
            name={field.name as any}
            control={control}
            render={({ field: controllerField }) => {
              if (field.type === 'text') {
                return (
                  <TextField
                    {...controllerField}
                    label={field.label}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    error={!!errors[field.name]}
                    helperText={getErrorMessage(errors[field.name])}
                  />
                );
              } else if (field.type === 'select' && field.options) {
                return (
                  <FormControl fullWidth margin="normal" variant="outlined" error={!!errors[field.name]}>
                    <InputLabel shrink>{field.label}</InputLabel>
                    <Select
                      {...controllerField}
                      label={field.label}
                      displayEmpty
                      renderValue={(selected) => {
                        if (selected === '') {
                          return <em style={{ color: '#9e9e9e' }}>Seleccione...</em>;
                        }
                        return field.options?.find(option => option.value === selected)?.label;
                      }}
                    >
                      <MenuItem value="">
                        <em>Seleccione...</em>
                      </MenuItem>
                      {field.options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors[field.name] && <FormHelperText>{getErrorMessage(errors[field.name])}</FormHelperText>}
                  </FormControl>
                );
              }
              return <div />; // Devuelve un elemento vacío en lugar de null
            }}
          />
        ))}
        <DialogActions className='mt-8'>
          <Button type="submit" className="w-60 bg-gradient-to-r from-purple-400 to-green-300 hover:from-purple-500 hover:to-green-400 text-violet-950 font-semibold py-2 px-4 rounded shadow">
            Guardar
          </Button>
          <Button onClick={onCancel} className="w-60 bg-gradient-to-r from-purple-400 to-green-300 hover:from-purple-500 hover:to-green-400 text-violet-950 font-semibold py-2 px-4 rounded shadow">
            Cancelar
          </Button>
        </DialogActions>
      </DialogContent>
    </form>
  );
};

export default EntityForm;