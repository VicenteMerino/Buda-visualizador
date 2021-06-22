import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const Dropdown = ({ filter, options, onChange }) => {
  const classes = useStyles();
  const [option, setOption] = useState('');
  const handleChange = (e) => {
    setOption(e.target.value);
    onChange(e);
  };

  return (
    <FormControl className={classes.formControl}>
      <Select
        value={option}
        onChange={handleChange}
        displayEmpty
        className={classes.selectEmpty}
        inputProps={{ 'aria-label': 'Without label' }}
      >
        <MenuItem value="" disabled>
          {filter}
        </MenuItem>
        {options.map(({ value, id }) => (
          <MenuItem value={value} key={id}>
            {value}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{filter}</FormHelperText>
    </FormControl>
  );
};

Dropdown.propTypes = {
  filter: PropTypes.string,
  options: PropTypes.array,
  onChange: PropTypes.func,
};

export default Dropdown;
