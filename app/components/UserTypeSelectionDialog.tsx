"use client";

import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, RadioGroup, FormControlLabel, Radio } from '@mui/material';

interface UserTypeSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (userType: string) => Promise<void>;
}

const UserTypeSelectionDialog: React.FC<UserTypeSelectionDialogProps> = ({ open, onClose, onSelect }) => {
  const [selectedType, setSelectedType] = useState<'client' | 'professional'>('client');

  const handleSelect = async () => {
    await onSelect(selectedType);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Selecciona tu tipo de cuenta</DialogTitle>
      <DialogContent>
        <RadioGroup value={selectedType} onChange={(e) => setSelectedType(e.target.value as 'client' | 'professional')}>
          <FormControlLabel value="client" control={<Radio />} label="Cliente" />
          <FormControlLabel value="professional" control={<Radio />} label="Profesional" />
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSelect} color="primary">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserTypeSelectionDialog;