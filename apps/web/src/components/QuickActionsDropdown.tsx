import React from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  SelectChangeEvent,
  Box
} from '@mui/material';

interface QuickActionsDropdownProps {
  onActionSelect: (action: string) => void;
  disabled?: boolean;
}

const QuickActionsDropdown: React.FC<QuickActionsDropdownProps> = ({ 
  onActionSelect, 
  disabled = false 
}) => {
  const [selectedAction, setSelectedAction] = React.useState('');

  const quickActions = [
    { value: 'show-events', label: "Show today's events" },
    { value: 'meeting-prep', label: "I would help with meeting prep" },
    { value: 'detect-conflicts', label: "Detect conflicts" },
  ];

  const handleChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    
    const action = quickActions.find(a => a.value === value);
    if (action) {
      onActionSelect(action.label);
    }
    
    // Reset selection after a small delay to allow the click to complete
    setTimeout(() => {
      setSelectedAction('');
    }, 50);
  };

  return (
    <Box>
      <FormControl 
        size="small" 
        sx={{ 
          minWidth: 200,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          }
        }}
      >
        <InputLabel id="quick-actions-label" shrink>Quick Action</InputLabel>
        <Select
          labelId="quick-actions-label"
          id="quick-actions-select"
          value={selectedAction}
          label="Quick Action"
          onChange={handleChange}
          disabled={disabled}
          displayEmpty
        >
          <MenuItem value="" disabled>
            <em>Choose an action...</em>
          </MenuItem>
          {quickActions.map((action) => (
            <MenuItem key={action.value} value={action.value}>
              {action.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default QuickActionsDropdown;