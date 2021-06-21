import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

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
  const [option, setOption] = useState({name: "", value: ""});
  const handleChange = (e) => {
    setOption(prevState => ({ ...prevState, value: e.target.value.value, name: e.target.value.name}))
    console.log(option);
    onChange(e);
  };

  return (
    <FormControl className={classes.formControl}>
      <Select
        value={{name: option.name, value: option.value}}
        onChange={handleChange}
        displayEmpty
        className={classes.selectEmpty}
        inputProps={{ "aria-label": "Without label" }}
      >
        <MenuItem value={{name: "", value: ""}} disabled>
          {filter}
        </MenuItem>
        {options.map(({ value, name, id }) => (
          <MenuItem value={{name: name, value: value}} key={id}>
            {name}
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
  onChange: PropTypes.func
};

export default Dropdown;
