import * as React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import {
  AppBar,
  Checkbox,
  Dialog,
  DialogContent,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Slide,
  TextField,
  Toolbar,
  Typography
} from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DialogUserForm = ({
  open,
  onClose,
  formValues,
  saving,
  formErrors,
  inputChange,
  onSave,
  isUpdate,
}) => (
  <Dialog
    fullScreen
    open={open}
    onClose={onClose}
    TransitionComponent={Transition}
  >
    <AppBar sx={{ position: 'relative' }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
          {isUpdate ? 'Update user' : 'Add new user'}
        </Typography>
        <LoadingButton
          loading={saving}
          autoFocus
          color="inherit"
          onClick={onSave}
          startIcon={<SaveIcon />}
        >
          save
        </LoadingButton>
      </Toolbar>
    </AppBar>
    <DialogContent>
      <FormControlLabel
        control={
          <Checkbox
            id='active'
            checked={formValues['active']}
            onChange={(e) => inputChange(e, 'active')}
          />
        }
        label="Is Active"
      />
      <TextField
        required
        autoFocus
        error={!!formErrors['username']}
        helperText={formErrors['username']}
        margin="normal"
        id="username"
        label="Username"
        type="text"
        fullWidth
        variant="outlined"
        onChange={inputChange}
        value={formValues['username']}
      />
      <TextField
        required
        error={!!formErrors['firstName']}
        helperText={formErrors['firstName']}
        margin="normal"
        id="firstName"
        label="First Name"
        type="text"
        fullWidth
        variant="outlined"
        onChange={inputChange}
        value={formValues['firstName']}
      />
      <TextField
        required
        error={!!formErrors['lastName']}
        helperText={formErrors['lastName']}
        margin="normal"
        id="lastName"
        label="Last Name"
        type="text"
        fullWidth
        variant="outlined"
        onChange={inputChange}
        value={formValues['lastName']}
      />
      <TextField
        required
        error={!!formErrors['password']}
        helperText={formErrors['password']}
        margin="normal"
        id="password"
        label="Password"
        type="text"
        fullWidth
        variant="outlined"
        onChange={inputChange}
      />
      <FormControl
        required
        fullWidth
        margin="normal"
        variant="outlined"
      >
        <InputLabel id="roleLabel">Role</InputLabel>
        <Select
          id="role"
          labelId="roleLabel"
          label="Role"
          onChange={(e) => inputChange(e, 'role')}
          value={formValues['role']}
        >
          <MenuItem value={'Viewer'}>Viewer</MenuItem>
          <MenuItem value={'Editor'}>Editor</MenuItem>
          <MenuItem value={'Owner'}>Owner</MenuItem>
        </Select>
      </FormControl>
    </DialogContent>
  </Dialog>
);

export default DialogUserForm;
