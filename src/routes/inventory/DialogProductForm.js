import * as React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import {
  AppBar,
  Dialog,
  DialogContent,
  IconButton,
  Slide,
  TextField,
  Toolbar,
  Typography
} from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DialogProductForm = ({
  open,
  onClose,
  formValues,
  saving,
  formErrors,
  inputChange,
  saveProduct,
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
          {isUpdate ? 'Update product' : 'Add new product'}
        </Typography>
        <LoadingButton
          loading={saving}
          autoFocus
          color="inherit"
          onClick={saveProduct}
          startIcon={<SaveIcon />}
        >
          save
        </LoadingButton>
      </Toolbar>
    </AppBar>
    <DialogContent>
      <TextField
        required
        autoFocus
        error={!!formErrors['name']}
        helperText={formErrors['name']}
        margin="normal"
        id="name"
        label="Name"
        type="text"
        fullWidth
        variant="outlined"
        onChange={inputChange}
        value={formValues.name}
      />
      <TextField
        required
        error={!!formErrors['pricePerUnit']}
        helperText={formErrors['pricePerUnit']}
        margin="normal"
        id="pricePerUnit"
        label="Price per unit"
        type="number"
        fullWidth
        variant="outlined"
        onChange={inputChange}
        value={formValues.pricePerUnit}
      />
      <TextField
        required
        error={!!formErrors['quantity']}
        helperText={formErrors['quantity']}
        margin="normal"
        id="quantity"
        label="Quantity"
        type="number"
        fullWidth
        variant="outlined"
        onChange={inputChange}
        value={formValues.quantity}
      />
      <TextField
        required
        error={!!formErrors['unit']}
        helperText={formErrors['unit']}
        margin="normal"
        id="unit"
        label="Unit"
        type="text"
        fullWidth
        variant="outlined"
        onChange={inputChange}
        value={formValues.unit}
      />
    </DialogContent>
  </Dialog>
);

export default DialogProductForm;
