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
    <DialogContent sx={{paddingLeft: 8, paddingRight: 8}}>
      <TextField
        required
        autoFocus
        error={!!formErrors['code']}
        helperText={formErrors['code']}
        margin="normal"
        id="code"
        label="Product Code"
        type="text"
        fullWidth
        variant="outlined"
        onChange={inputChange}
        value={formValues.code}
      />
      <TextField
        required
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
        error={!!formErrors['srp1']}
        helperText={formErrors['srp1']}
        margin="normal"
        id="srp1"
        label="SRP1"
        type="number"
        fullWidth
        variant="outlined"
        onChange={inputChange}
        value={formValues.srp1}
      />
      <TextField
        required
        error={!!formErrors['srp2']}
        helperText={formErrors['srp2']}
        margin="normal"
        id="srp2"
        label="SRP2"
        type="number"
        fullWidth
        variant="outlined"
        onChange={inputChange}
        value={formValues.srp2}
      />
      <TextField
        required
        error={!!formErrors['wholesalePrice']}
        helperText={formErrors['wholesalePrice']}
        margin="normal"
        id="wholesalePrice"
        label="Wholesale Price"
        type="number"
        fullWidth
        variant="outlined"
        onChange={inputChange}
        value={formValues.wholesalePrice}
      />
      <TextField
        required
        error={!!formErrors['distributorPrice']}
        helperText={formErrors['distributorPrice']}
        margin="normal"
        id="distributorPrice"
        label="Distributor Price"
        type="number"
        fullWidth
        variant="outlined"
        onChange={inputChange}
        value={formValues.distributorPrice}
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
